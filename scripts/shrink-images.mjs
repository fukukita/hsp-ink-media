// public/images の写真を、実際に表示する大きさに合わせて webp にする。
// 使い方: node scripts/shrink-images.mjs
//
// 2026-11 に Cloudflare へ移って、画像の自動変換（next/image の最適化）をやめた。
// そのため、置いてあるファイルの大きさがそのまま読者に届く。
// 表示する箱の2倍（高精細画面のぶん）を目安に作り直している。
import sharp from "sharp"
import fs from "node:fs"

const kb = (f) => (fs.statSync(f).size / 1024).toFixed(0) + "KB"

const jobs = [
  // 運営者プロフィールページの大きな写真（fukukita-for-profile-page02.jpg）は、ここで扱わない。
  // 桜と草木が画面いっぱいの写真で、圧縮しにくい。webp にすると 273KB → 318KB と逆に大きくなり、
  // 画質を落としても 213KB どまりだった（2026-11-08 実測）。jpg のままが一番小さい。
  // 著者アイコン。表示は最大128px角（object-cover）なので、その2倍を正方形で切り出す
  { src: "fukukita01.jpg", out: "fukukita01.webp", w: 256, h: 256, crop: true, q: 82 },
  // 記事中のLINE案内の絵。表示は最大176px角なので、その2倍
  { src: "Illustration-for-linepromotion-banner01.jpg", out: "Illustration-for-linepromotion-banner01.webp", w: 352, h: 352, crop: true, q: 82 },
]

const dir = "public/images/"
for (const j of jobs) {
  const src = dir + j.src, out = dir + j.out
  let img = sharp(src)
  img = j.crop
    ? img.resize(j.w, j.h, { fit: "cover", position: "centre" }) // 画面での object-cover と同じ中央切り抜き
    : img.resize(j.w, j.h, { fit: "inside" })
  await img.webp({ quality: j.q }).toFile(out)
  const m = await sharp(out).metadata()
  console.log(`${j.src} ${kb(src)}  →  ${j.out} ${kb(out)}  (${m.width}x${m.height})`)
}
