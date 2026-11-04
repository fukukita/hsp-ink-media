// next/font/google が書き出した @font-face と書体ファイルを、サイトの中に固定して置く。
// 使い方：サイトのフォルダで、next/font/google のまま一度 npm run build してから
//   node freeze-fonts.mjs <out/_next/static/css の中の、@font-face を含むCSS> <同じくもう1つ>
// 2026-11-04 ceodock.jp で使ったもの（3e7e53f）。Serif と Sans の2書体を前提にしている
import fs from "node:fs"
import path from "node:path"

const cssFiles = process.argv.slice(2)
const mediaDir = "out/_next/static/media"
const destDir = "public/fonts/noto"
fs.mkdirSync(destDir, { recursive: true })

const rename = new Map() // 元のファイル名 → 新しいファイル名
const blocks = []
const vars = []
for (const f of cssFiles) {
  const css = fs.readFileSync(f, "utf8")
  for (const m of css.matchAll(/@font-face\{[^}]*\}/g)) blocks.push(m[0])
  for (const m of css.matchAll(/__variable\{(--font-[a-z-]+:[^}]*)\}/g)) vars.push(m[1])
}

const out = blocks.map((b) =>
  b.replace(/url\(\.\.\/media\/([^)]+)\)/g, (_, name) => {
    if (!rename.has(name)) {
      const hash = name.match(/^[0-9a-f]{16}/)[0]
      rename.set(name, `${hash}.woff2`)
    }
    return `url(/fonts/noto/${rename.get(name)})`
  }),
)

const names = [...rename.values()]
if (new Set(names).size !== names.length) throw new Error("ファイル名が重なった")
for (const [from, to] of rename) fs.copyFileSync(path.join(mediaDir, from), path.join(destDir, to))

const header = `/*
 * 書体（Noto Serif JP、Noto Sans JP）の @font-face。
 * もとは next/font/google がビルドのたびに Google から約250ファイルを取ってきていたが、
 * Cloudflare のビルドでときどき取りこぼして失敗したので、2026-11 にその書き出し結果を固定した。
 * 書体ファイルは public/fonts/noto/ にある。中身は Google Fonts のものと同じ。
 * 太さを足すときは、next/font/google で一度ビルドし、同じ手順で作り直す。
 */
:root {
${vars.map((v) => `  ${v.replace(/:\s*/, ": ")};`).join("\n")}
}
`
fs.writeFileSync("app/fonts.css", header + out.join("\n") + "\n")
console.log(`@font-face ${blocks.length}件、ファイル ${rename.size}件、変数 ${vars.length}件`)
