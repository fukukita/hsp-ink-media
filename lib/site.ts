// サイト共通の設定値

// 公式LINEの「友だち追加URL」をここに設定する。
// （LINE Official Account Manager →「友だち追加」→ URLで取得できる https://lin.ee/xxxx 形式）
//
// ▼▼▼ 公式LINEの友だち追加URL ▼▼▼
export const LINE_URL = 'https://lin.ee/n8WXyWE'
// ▲▲▲ 変更時はこの1行だけ書き換えれば全箇所に反映されます ▲▲▲

// ▼▼▼ トップページ固定ヒーローの設定（記事とは独立。変えたい時のみここを更新）▼▼▼
// ヒーロー背景画像（記事のアイキャッチとは別の専用画像）
// 末尾の ?w=1408&auto=format は Sanity 側での書き出し指定。
// 画像の自動変換をやめた（next.config.ts の unoptimized）ので、
// もとの画像のまま配ると 69KB の jpg になる。元の幅と同じ 1408 で webp にすると 13KB で足りる
export const HERO_IMAGE_URL =
  'https://cdn.sanity.io/images/jgmm0gpv/production/640995555b468d66848bed1c84b66fcb01736f0a-1408x768.jpg?w=1408&auto=format'

export const HERO_COPY = {
  eyebrow: 'HSS型HSPに寄り添うメディア',
  heading: 'アクセルとブレーキを\n同時に踏むあなたへ',
  body: '刺激を求めるのに、深く傷つく。\nそんな矛盾した気質と、一緒に向き合うメディアです。',
  cta: '記事を読む',
  ctaHref: '/posts',
}
// ▲▲▲ ここまで ▲▲▲
