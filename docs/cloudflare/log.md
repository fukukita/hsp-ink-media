# hsp.ink の Cloudflare 移行｜作業の記録

指示書：`hsp-ink-cloudflare-2026-11-04.md`

## 2026-11-04

### 3章（コードの変更）を入れた — 枝 `cloudflare-static`

| # | 変更 | 置き場所 |
|---|---|---|
| 1 | 静的書き出し（`output: "export"`）、画像の自動変換をやめる | `next.config.ts` |
| 2 | `revalidate = 0` を外す（3か所） | `app/page.tsx`、`app/posts/page.tsx`、`app/category/[slug]/page.tsx` |
| 3 | `/api/revalidate` を消す | （削除） |
| 4 | 全記事・全カテゴリのURLを先に決める | `app/posts/[slug]/page.tsx`、`app/category/[slug]/page.tsx`、`sanity/lib/queries.ts` |
| 5 | `?audience=` の絞り込みをブラウザ側へ | `components/CategoryAudienceView.tsx`（新規） |
| 6 | robots・サイトマップを build のとき1回だけ作る | `app/robots.ts`、`app/sitemap.ts` |
| 7 | 編集画面を2つに分け、奥のURLを1枚に回す | `app/studio/[[...tool]]/Studio.tsx`（新規）、同 `page.tsx`、`public/_redirects`（新規） |
| 8 | 書体をリポジトリに固定（248ファイル・13MB） | `app/fonts.css`（新規）、`public/fonts/noto/`（新規）、`app/layout.tsx` |
| 9 | 公開してよい値をビルド用の設定に置く | `.env.production`（新規）、`.gitignore` |
| 10 | 古い記事データを使い回さないようにする、wrangler を足す | `package.json` |
| 11 | Cloudflare の配信設定 | `wrangler.jsonc`（新規） |
| 12 | ヒーロー画像を Sanity 側で 1408px に書き出す | `lib/site.ts` |
| 13 | 手元で配信を確かめる設定（8789番） | `.claude/launch.json` |

#### 判断したこと

- **ヒーロー画像の幅**：指示書は `?w=1600&auto=format` だったが、元の画像の幅が 1408px なので 1600 だと引き伸ばしになる。`?w=1408&auto=format` にした。実測で 69KB（jpg）→ 13KB（webp）。1600 だと 16KB
- **`quality={90}`**：画像の自動変換をやめると効かないので、`app/page.tsx` から外した
- **`_headers`**：hsp.ink には `/dl/` のような置き場がないので作っていない
- **手元の画像**：`public/images/fukukita-for-profile-page02.jpg` が 279KB、`fukukita01.jpg` が 57KB。画像の自動変換をやめたぶん、そのままの大きさで配られる（指示書の対象外。切り替えのあとに小さい版を作るか相談する）

#### 確かめたこと

- `npm run build`：44ページ（記事27・カテゴリ6・その他）。型・lint の指摘は移行の前と同じ数（21件。もともと `<a>` を使っている箇所の指摘）
- サイトマップ 37件（本番と同じ）
- GTM の ID（GTM-MT8RR247）が書き出した HTML に入っている
- 書体：先読みしていた3ファイルが、変える前と同じ形で `<link rel="preload" as="font">` に出ている。書き出した HTML の差は「書体のURL」「スタイルシートが3→2」「next/font が出していた `next-size-adjust`」「html の class」だけ
- Windows で作った `out/` は、指示書のとおり記事ページの下に `__next.posts/$d$slug/__PAGE__.txt` が入れ子のフォルダで出る。Cloudflare のビルド（Linux）では出ない

### Worker を作った（5章の2）

- 手元から1回だけ書き出し → `hsp-ink`（513ファイル）
- 試験URL：`https://hsp-ink.fukukita.workers.dev`
- 下見の結果（手元のビルドなので、本番との照合は Cloudflare のビルドのあとに行う）

| URL | 返事 |
|---|---|
| `/`、`/posts`、`/about`、`/tokushoho`、`/privacy` | 200 |
| `/studio`、`/studio/structure` | 200 |
| `/robots.txt`、`/sitemap.xml`、`/icon.svg` | 200 |
| `/posts/hss-hsp-towa`、`/category/work`、`/category/work?audience=hsp` | 200 |
| `/about/` | 307 →`/about`（本番は308。指示書どおり問題なし） |
| ない記事のURL | 404 |

- 本番と title をくらべた6ページ（`/`、`/posts`、`/about`、記事2本、`/category/work`）はすべて一致

### 次

- ふくきたさんに Worker と GitHub をつないでいただく（5章の3）
- Cloudflare のビルドが通ったら、4章の照合（37件＋その他）を行う
