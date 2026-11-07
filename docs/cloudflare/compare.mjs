// 2つの住所に同じURLを取りに行って、中身をくらべる。
// 使い方: node docs/cloudflare/compare.mjs <くらべる元> <くらべる先> [--pin ホスト名=IP]
//   例: node docs/cloudflare/compare.mjs https://hsp.ink https://hsp-ink.fukukita.workers.dev
//   手元の名前解決が古い答えを覚えているときは --pin hsp.ink=104.21.71.19 でIPを直接指定できる
// URLの一覧は、くらべる元のサイトマップから作る（＋固定で足すもの）。
import fs from "fs"
import https from "node:https"

const argv = process.argv.slice(2)
const PIN = {}
for (let i = 0; i < argv.length; i++) {
  if (argv[i] === "--pin") { const [h, ip] = argv[i + 1].split("="); PIN[h] = ip; argv.splice(i, 2); i-- }
}
const [A, B] = argv
if (!A || !B) { console.error("使い方: compare.mjs <元> <先> [--pin ホスト名=IP]"); process.exit(1) }

const EXTRA = ["/", "/posts", "/about", "/about/", "/tokushoho", "/privacy", "/studio",
  "/robots.txt", "/sitemap.xml", "/icon.svg", "/posts/zzz-nai-kiji"]

const pick = (html, re) => { const m = html.match(re); return m ? m[1].trim() : null }

// 名前解決を飛ばしてIPを直接使えるようにした取得。転送は追わない
function get(url) {
  return new Promise((resolve) => {
    const u = new URL(url)
    const opts = { method: "GET", headers: { "user-agent": "hsp-ink-migration-check" } }
    const ip = PIN[u.hostname]
    if (ip) opts.lookup = (host, o, cb) => (o && o.all ? cb(null, [{ address: ip, family: 4 }]) : cb(null, ip, 4))
    const req = https.request(u, opts, (res) => {
      const chunks = []
      res.on("data", (c) => chunks.push(c))
      res.on("end", () => resolve({ status: res.statusCode, headers: res.headers, body: Buffer.concat(chunks).toString("utf8") }))
    })
    req.on("error", (e) => resolve({ err: String(e) }))
    req.setTimeout(25000, () => req.destroy(new Error("timeout")))
    req.end()
  })
}

async function look(url) {
  const res = await get(url)
  if (res.err) return { err: res.err }
  const loc = res.headers["location"]
  const out = { status: res.status, loc: loc ? loc.replace(/^https?:\/\/[^/]+/, "") : null }
  const type = res.headers["content-type"] || ""
  if (!/text\/html/.test(type)) {
    const body = res.body
    out.len = body.length
    if (/sitemap\.xml$/.test(url)) out.locs = (body.match(/<loc>/g) || []).length
    if (/robots\.txt$/.test(url)) out.body = body.trim()
    return out
  }
  const html = res.body
  out.title = pick(html, /<title>([^<]*)<\/title>/)
  out.desc = pick(html, /<meta name="description" content="([^"]*)"/)
  out.canonical = pick(html, /<link rel="canonical" href="([^"]*)"/)
  out.ogImage = pick(html, /<meta property="og:image" content="([^"]*)"/)
  out.ogTitle = pick(html, /<meta property="og:title" content="([^"]*)"/)
  out.h1 = (pick(html, /<h1[^>]*>([\s\S]*?)<\/h1>/) || "").replace(/<[^>]*>/g, "").trim() || null
  out.jsonLd = (html.match(/application\/ld\+json/g) || []).length
  out.gtm = /GTM-[A-Z0-9]+/.test(html) ? (html.match(/GTM-[A-Z0-9]+/) || [])[0] : null
  const hrefs = [...html.matchAll(/href="(\/posts\/[a-z0-9-]+)"/g)].map((m) => m[1])
  out.cards = [...new Set(hrefs)]
  return out
}

const sitemap = (await get(A + "/sitemap.xml")).body
const fromMap = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)]
  .map((m) => m[1].replace(/^https?:\/\/[^/]+/, "") || "/")
const cats = fromMap.filter((p) => p.startsWith("/category/"))
const paths = [...new Set([...fromMap, ...EXTRA,
  ...cats.flatMap((c) => [`${c}?audience=hsp`, `${c}?audience=hss-hsp`])])]

console.log(`くらべる元 ${A}\nくらべる先 ${B}\nURL ${paths.length}件\n`)
const keys = ["status", "loc", "title", "desc", "canonical", "ogImage", "ogTitle", "h1", "jsonLd", "gtm", "locs", "body", "cards"]
let ng = 0, expected = 0
for (const p of paths) {
  const [a, b] = await Promise.all([look(A + p), look(B + p)])
  const diffs = []
  for (const k of keys) {
    const x = k === "cards" ? (a[k] || []).join(",") : a[k]
    const y = k === "cards" ? (b[k] || []).join(",") : b[k]
    if (x === undefined && y === undefined) continue
    if (String(x) !== String(y)) diffs.push(`${k}\n      元: ${x}\n      先: ${y}`)
  }
  if (a.err || b.err) diffs.push(`取得できず 元:${a.err || "-"} 先:${b.err || "-"}`)
  if (!diffs.length) { console.log(`OK   ${p}`); continue }
  // ?audience= の絞り込みは画面の側に移したので、記事の並びが違うのは想定どおり
  const onlyCards = p.includes("audience=") && diffs.every((d) => d.startsWith("cards"))
  if (onlyCards) { expected++; console.log(`想定 ${p}（記事の並びのみ。絞り込みを画面の側に移したため）`) }
  else { ng++; console.log(`違い ${p}`); diffs.forEach((d) => console.log("    - " + d)) }
}
console.log(`\n合計 ${paths.length}件／要確認 ${ng}件／想定どおりの違い ${expected}件`)
