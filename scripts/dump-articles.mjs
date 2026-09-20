// 全記事をキー付きで書き出す（監査用）。
// 使い方: node --env-file=.env.local scripts/dump-articles.mjs > docs/audit-2026-09-20/all-posts-dump.txt
import { createClient } from "@sanity/client"
const c = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: "2026-05-31",
  token: process.env.SANITY_API_TOKEN,
  useCdn: false,
  perspective: "raw",
})
const docs = await c.fetch(`*[_type=="post"] | order(slug.current asc, _id asc){..., "categoryTitle": category->title, "related": relatedPosts[]->slug.current}`)
const out = []
const skip = new Set(["body","_id","_rev","_updatedAt","_createdAt","_type","title","seoTitle","slug","publishedAt","audience","category","categoryTitle","mainImage","related","relatedPosts"])
for (const d of docs) {
  let chars = 0
  for (const b of d.body || []) {
    if (b._type === "block") chars += (b.children || []).map((x) => x.text || "").join("").length
    else if (b.text) chars += b.text.length
    else if (b.items) chars += b.items.map((i) => (typeof i === "string" ? i : JSON.stringify(i))).join("").length
  }
  out.push(`\n===== ${d._id} ｜ ${d.slug?.current} ｜ ${d.title}`)
  out.push(`rev: ${d._rev}  updated: ${d._updatedAt}  publishedAt: ${d.publishedAt}  audience: ${d.audience}  category: ${d.categoryTitle}  chars: ${chars}`)
  out.push(`seoTitle: ${d.seoTitle || ""}`)
  const meta = Object.fromEntries(Object.entries(d).filter(([k, v]) => !skip.has(k) && typeof v !== "object"))
  out.push(`meta: ${JSON.stringify(meta)}  related: ${JSON.stringify(d.related || [])}`)
  for (const b of d.body || []) {
    if (b._type === "block") {
      const text = (b.children || []).map((x) => x.text).join("")
      const link = (b.markDefs || []).length ? " 🔗" + b.markDefs.map((m) => m.href || "").join(",") : ""
      const pre = b.style === "h2" ? "## " : b.style === "h3" ? "### " : b.listItem ? "• " : ""
      out.push(`${b._key}\t${pre}${text}${link}`)
    } else if (b.items) {
      b.items.forEach((i, n) => out.push(`${b._key}/${n}\t☑ ${typeof i === "string" ? i : JSON.stringify(i)}`))
    } else if (b.text) out.push(`${b._key}\t[${b._type}] ${b.text}`)
    else out.push(`${b._key}\t[${b._type}]`)
  }
}
console.log(out.join("\n"))
