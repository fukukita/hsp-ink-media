// 記事の書き直しを Sanity の下書きに書き込む（公開はしない）。
// 使い方:
//   node --env-file=.env.local scripts/apply-rewrite.mjs check docs/audit-2026-09-20/rewrites/<slug>.md
//   node --env-file=.env.local scripts/apply-rewrite.mjs apply docs/audit-2026-09-20/rewrites/<slug>.md
//
// 原稿の形式（先頭に見出し情報、--- の下に本文）:
//   id: <公開ドキュメントのID>   slug: <slug>   baseRev: <書き出し時の _rev>
//   title / seoTitle / seoDescription / excerpt / audience / related: slug1, slug2
//   ---
//   ## 見出し2   ### 見出し3   - 箇条書き   ☑ チェック項目   > LINE: 誘導文
//   空行で区切った1行 = 1ブロック。リンクは [文字](URL)、太字は **文字**。
import fs from "fs"
import crypto from "crypto"
import { createClient } from "@sanity/client"

const [mode, file] = process.argv.slice(2)
if (!mode || !file) { console.error("使い方: apply-rewrite.mjs check|apply <file.md>"); process.exit(1) }
const key = () => crypto.randomBytes(6).toString("hex")

// ---------- 原稿の読み込み ----------
const src = fs.readFileSync(file, "utf8").replace(/\r\n/g, "\n")
const sep = src.indexOf("\n---\n")
if (sep < 0) { console.error("先頭の見出し情報のあとに --- の行が要ります"); process.exit(1) }
const front = {}
for (const line of src.slice(0, sep).split("\n")) {
  const m = line.match(/^(\w+):\s*(.*)$/)
  if (m) front[m[1]] = m[2].trim()
}
const bodyLines = src.slice(sep + 5).split("\n")

// ---------- インライン（リンク・太字） ----------
function inline(text) {
  const children = [], markDefs = []
  const re = /\[([^\]]+)\]\((https?:\/\/[^)]+)\)|\*\*([^*]+)\*\*/g
  let last = 0, m
  while ((m = re.exec(text))) {
    if (m.index > last) children.push({ _type: "span", _key: key(), text: text.slice(last, m.index), marks: [] })
    if (m[1]) { const k = key(); markDefs.push({ _key: k, _type: "link", href: m[2], blank: false }); children.push({ _type: "span", _key: key(), text: m[1], marks: [k] }) }
    else children.push({ _type: "span", _key: key(), text: m[3], marks: ["strong"] })
    last = re.lastIndex
  }
  if (last < text.length) children.push({ _type: "span", _key: key(), text: text.slice(last), marks: [] })
  if (!children.length) children.push({ _type: "span", _key: key(), text: "", marks: [] })
  return { children, markDefs }
}
const block = (text, style = "normal", extra = {}) => ({ _type: "block", _key: key(), style, ...inline(text), ...extra })

// ---------- 本文の変換 ----------
const body = []
let check = null
for (const raw of bodyLines) {
  const line = raw.trimEnd()
  if (!line.trim()) { check = null; continue }
  if (line.startsWith("☑ ")) { if (!check) { check = { _type: "checklist", _key: key(), items: [] }; body.push(check) } check.items.push(line.slice(2).trim()); continue }
  check = null
  if (line.startsWith("## ")) body.push(block(line.slice(3).trim(), "h2"))
  else if (line.startsWith("### ")) body.push(block(line.slice(4).trim(), "h3"))
  else if (line.startsWith("- ")) body.push(block(line.slice(2).trim(), "normal", { listItem: "bullet", level: 1 }))
  else if (line.startsWith("> LINE:")) body.push({ _type: "lineCallout", _key: key(), text: line.slice(7).trim() })
  else body.push(block(line.trim()))
}

// ---------- 検査 ----------
const textOf = (b) => b._type === "block" ? b.children.map((c) => c.text).join("") : b._type === "checklist" ? b.items.join("") : b.text || ""
const problems = []
let chars = 0
body.forEach((b, i) => {
  const t = textOf(b); chars += t.length
  if (b._type === "block" && !b.listItem && b.style === "normal" && t.length > 90) problems.push(`90字超（${t.length}字）: ${t.slice(0, 30)}…`)
  if (b._type === "checklist") b.items.forEach((it) => { if (it.length > 90) problems.push(`チェック項目が90字超: ${it.slice(0, 30)}…`) })
  if (b._type === "block" && /^h[2-4]$/.test(b.style) && /[、。]/.test(t)) problems.push(`見出しに句読点: ${t}`)
  if (/を、/.test(t)) problems.push(`「を、」: ${t.slice(0, 40)}…`)
  if (/[０-９]/.test(t)) problems.push(`全角数字: ${t.slice(0, 40)}…`)
  if (/診断|克服|治す|症状|クリニック|治療/.test(t) && !/医学的な診断/.test(t)) problems.push(`避ける語: ${t.slice(0, 40)}…`)
})
// h2直下（次のh3まで）の段落数と、h3配下の段落数
for (let i = 0; i < body.length; i++) {
  const b = body[i]
  if (b._type !== "block" || !/^h[23]$/.test(b.style)) continue
  let n = 0, j = i + 1, sawH3 = false
  for (; j < body.length; j++) {
    const c = body[j]
    if (c._type === "block" && /^h[23]$/.test(c.style)) { sawH3 = c.style === "h3"; break }
    if (c._type === "block" && !c.listItem && !/^\d+\. /.test(textOf(c))) n++ // 「1. 職種名：」の項目行は箇条書き扱い
  }
  const title = textOf(b)
  if (b.style === "h2" && sawH3 && (n < 2 || n > 3)) problems.push(`h2直下が${n}段落（2〜3が目安）: ${title}`)
  if (b.style === "h3" && (n < 3 || n > 7)) problems.push(`h3配下が${n}段落（3〜7が目安）: ${title}`)
}
const h2s = body.filter((b) => b._type === "block" && b.style === "h2").map(textOf)
console.log(`ブロック数 ${body.length}／本文 ${chars} 字／h2 ${h2s.length} 本`)
h2s.forEach((h) => console.log("  ## " + h))
if (problems.length) { console.log("\n要確認:"); problems.forEach((p) => console.log("  - " + p)) } else console.log("\n検査: 問題なし")

if (mode !== "apply") process.exit(0)
if (problems.length) { console.error("\n要確認が残っているので書き込みません"); process.exit(1) }

// ---------- 下書きへ書き込み ----------
const c = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID, dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: "2026-05-31", token: process.env.SANITY_API_TOKEN, useCdn: false, perspective: "raw",
})
if (!front.id) { console.error("id: が要ります"); process.exit(1) }
const pub = await c.getDocument(front.id)
if (!pub) { console.error("公開ドキュメントが見つかりません: " + front.id); process.exit(1) }
const draftId = "drafts." + front.id
const draft = await c.getDocument(draftId)
const now = Date.now()
for (const d of [pub, draft]) {
  if (d && now - Date.parse(d._updatedAt) < 60 * 60 * 1000) { console.error(`直近60分に編集があります（${d._id} ${d._updatedAt}）。止めます`); process.exit(1) }
}
if (front.baseRev && pub._rev !== front.baseRev) { console.error(`書き出し時の rev（${front.baseRev}）と今の rev（${pub._rev}）が違います。止めます`); process.exit(1) }

fs.mkdirSync("docs/audit-2026-09-20/snapshots", { recursive: true })
const stamp = new Date().toISOString().replace(/[:.]/g, "-")
fs.writeFileSync(`docs/audit-2026-09-20/snapshots/${front.slug || front.id}_${stamp}.json`, JSON.stringify({ published: pub, draft }, null, 2))

let relatedPosts
if (front.related) {
  const slugs = front.related.split(",").map((s) => s.trim()).filter(Boolean)
  const hits = await c.fetch(`*[_type=="post" && slug.current in $slugs && !(_id in path("drafts.**"))]{_id, "slug": slug.current}`, { slugs })
  relatedPosts = slugs.map((s) => hits.find((h) => h.slug === s)).filter(Boolean).map((h) => ({ _type: "reference", _key: key(), _ref: h._id }))
  if (relatedPosts.length !== slugs.length) console.warn("関連記事のうち見つからないものがあります:", slugs.filter((s) => !hits.find((h) => h.slug === s)))
}
const { _rev, _updatedAt, _createdAt, ...base } = pub
const next = { ...base, _id: draftId, body }
for (const f of ["title", "seoTitle", "seoDescription", "excerpt", "audience"]) if (front[f]) next[f] = front[f]
if (relatedPosts) next.relatedPosts = relatedPosts
const out = file.replace(/\.md$/, "") + ".draft.json"
fs.writeFileSync(out, JSON.stringify(next, null, 2))
console.log(`\n下書きのJSONを書き出しました: ${out}（${draftId}）`)
if (process.argv.includes("--write")) {
  const res = await c.createOrReplace(next)
  console.log(`下書きに書き込みました: ${res._id}（rev ${res._rev}）。公開はしていません。`)
} else {
  console.log("書き込みは `npx sanity documents create <上のJSON> --replace` か、--write を付けて実行する（トークンに書き込み権限が要る）")
}
