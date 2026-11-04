import type { NextConfig } from "next";

// 全ページを build のときに HTML として書き出し（out/）、Cloudflare から配る。
// Vercel の無料プランは商用利用を認めていないため、2026-11 に移した。
//
// 書き出し方式では、ページを都度作り直す仕組み（revalidate）が使えない。
// Sanity で記事を公開すると Webhook が Cloudflare のビルドを呼び、サイト全体を作り直す。
// 前回のビルドで取った記事データ（.next/cache/fetch-cache）が残っていると
// 古い記事のまま書き出されるので、package.json の prebuild で毎回消している。
const nextConfig: NextConfig = {
  output: "export",
  images: {
    // 画像の自動変換はサーバーが要るため使わない。
    // 記事の画像は Sanity 側で幅と形式を指定している（sanity/lib/image.ts）
    unoptimized: true,
  },
};

export default nextConfig;
