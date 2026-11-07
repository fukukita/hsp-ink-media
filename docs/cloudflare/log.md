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

## 2026-11-05

### DNS の控えを作った（6章）

ふくきたさんから Xserver の「DNSレコード設定」の画面をいただき、実際の問い合わせと突き合わせて `dns-backup.md` に13行を控えた。
指示書の外からの調べでは7行だったが、**DKIM 関係の2行と、SPF の長い中身を見落としていた**。

### ふくきたさんに決めていただいたこと

- **手元の写真の小さい版を作る**：引っ越しが全部終わったあとに行う（`public/images/fukukita-for-profile-page02.jpg` 279KB、`fukukita01.jpg` 57KB）

### 404ページを日本語にした（移行とは別件・ふくきたさん承認済み）

`app/not-found.tsx` を追加。これまでは Next.js の初期値（英語の "This page could not be found."）だった。
記事一覧・トップ・テーマ6つへの入口を置き、`robots: { index: false }` をつけた。
書き出し方式ではこれが `out/404.html` になる。**main と cloudflare-static の両方に入れた**（片方だけだと照合でノイズになるため）。

### Cloudflare のビルドをつないだ（5章の3）→ 1回目のビルド成功

- つないだ直後はビルドが走らない。「次にコミットが来たら始める」という状態になる。**上の404ページを出したことで1回目が走った**
- 所要：約2〜3分
- Windows で作ったときに出ていた入れ子フォルダの問題は、Cloudflare のビルド（Linux）では出なかった

### 4章の照合（本番 hsp.ink ⇔ 試験URL）

道具：`compare.mjs`。URL 56件（サイトマップ37件＋トップ・記事一覧・about・about/・特商法・privacy・studio・robots.txt・sitemap.xml・icon.svg・ない記事・テーマ別の読者絞り込み12件）。
くらべた項目：返事の番号／転送先／title／description／og:title／h1／記事カードの数と並び／JSON-LD の数／GTM の ID／サイトマップの件数／robots.txt の中身。

| 結果 | 件数 |
|---|---|
| 完全に一致 | 47 |
| 想定どおりの違い | 7 |
| 要確認 | 2（どちらも問題なしと判断） |

**想定どおりの違い（7件）**
`/category/○○?audience=hsp` のみ。絞り込みを画面の側に移したので、配るHTMLには全記事が入る。
`?audience=hss-hsp` の5件は、絞る前と後がたまたま同じ並びになるため一致した。

**要確認だった2件**

1. `/about/` … 308 → 307。どちらも同じ意味の転送。指示書で「問題なし」とされていた点
2. ない記事のURL … 本番は404ページの中身を JavaScript で後から差し込むため、HTML に `<h1>` が無い。
   書き出し方式では `<h1>` が最初から HTML に入っている。**書き出し方式のほうが良い状態**。返事の番号はどちらも404

**ブラウザでの確認（文字だけでは見られない部分）**

- `/category/work?audience=hsp` →「このテーマの記事はまだありません。」（本番と同じ・0件）
- `/category/relationships?audience=hsp` → `hsp-shokuba-kizutsuku` の1本のみ（本番と同じ）
- タブ「HSS型HSP向け」を押す → `hss-hsp-ningenkankei` と `hss-hsp-soudan` の2本に切り替わる。URL も `?audience=hss-hsp` に変わる
- トップのヒーロー画像・書体（明朝/ゴシック）・配色は見た目どおり

**`/studio`**

ページ自体は開き、Studio の JavaScript も動く。そのうえで Sanity への問い合わせが CORS で止まる
（`origin 'https://hsp-ink.fukukita.workers.dev'` が許可一覧にないため）。**指示書どおり、Sanity の設定は足していない。**
Sanity の許可一覧を確認したところ `https://hsp.ink` と `https://www.hsp.ink` が入っている（2026-11-06 確認）ので、本番に切り替えれば動く。切り替えのあとに実機で確かめる。

### 次

- 6章：DNS を Cloudflare へ（ふくきたさんの操作）

## 2026-11-07

### Cloudflare にゾーンを作った（6章）

- Free プランで `hsp.ink` を「ドメインを接続」から追加
- 「Enable Bot Preference Sync」は**オフ**にした（オンだと Cloudflare が robots.txt の先頭に設定を書き足す。
  自分たちで管理しているファイルが配信時に書き換わると、あとで原因を追えなくなる）
- AI 関連（検索・トレーニング・エージェント）は**すべて「許可」のまま**。いまの hsp.ink は何もブロックしていないので、引っ越しで状態を変えない
- 自動読み取りは **7行**。控えの8行（NS 5行を除く）のうち **`_adsp._domainkey` TXT が漏れていた**ので手で足した
- A・CNAME の4行は「DNSのみ」（プロキシなし）にした
- 割り当てられたネームサーバー：`ariadne.ns.cloudflare.com` / `christian.ns.cloudflare.com`

### ネームサーバーを変える前の確かめ（Cloudflare の NS へ直接問い合わせ）

`Resolve-DnsName -Server ariadne.ns.cloudflare.com` で8行すべてを照合。

| 確かめたこと | 結果 |
|---|---|
| `hsp.ink` A | 76.76.21.21（Vercel の実IP。プロキシされていない）✅ |
| `www.hsp.ink` A | 76.76.21.21 ✅ |
| ワイルドカード（`zzz-test` / `studio`） | 183.90.240.74 ✅ |
| `link.hsp.ink` CNAME | cname.short.io ✅ |
| `hsp.ink` TXT（SPF） | 一致 ✅ |
| `hsp.ink` TXT（google-site-verification） | 一致 ✅ |
| `default._domainkey` TXT（DKIM） | **410文字まで完全一致**（Xserver 側と機械で比較）✅ |
| `_adsp._domainkey` TXT | `dkim=unknown` ✅ |
| MX | なし（いまと同じ）✅ |
| DNSSEC（親の DS） | なし ✅ |

**Xserver と Cloudflare が、いま同じ答えを返す状態。** 切り替えの途中でどちらに当たっても結果が変わらないので、ネームサーバーの変更そのものでは何も起きない。

### 次

- ふくきたさん：お名前.com でネームサーバーを2つに変更
- そのあと：ゾーンが「アクティブ」になったら、7章の本番の切り替え（ふくきたさんの「はい」が必要）

### ネームサーバーを Cloudflare に変更（完了）

お名前.com で `ariadne.ns.cloudflare.com` / `christian.ns.cloudflare.com` の2つに変更。
登記元（`a.nic.ink`）に直接問い合わせて切り替わりを確認した（普通に調べると、途中の機械が古い答えを覚えていて遅れて見える）。

切り替え後の確認：

| 確かめたこと | 結果 |
|---|---|
| 8.8.8.8 / 1.1.1.1 / 9.9.9.9 が見るネームサーバー | 3つとも Cloudflare ✅ |
| `hsp.ink` / `www` | 76.76.21.21（Vercel）✅ |
| `studio.hsp.ink`（ワイルドカード） | 183.90.240.74（Xserver）✅ |
| `link.hsp.ink` | cname.short.io → 200 ✅ |
| SPF・google-site-verification・DKIM・`_adsp` | すべて残っている ✅ |
| サイト（`/`・`/posts`・記事・`/studio`） | すべて200 ✅ |
| `www.hsp.ink` | 308 → `https://hsp.ink/` ✅ |
| 配信元 | `Server: Vercel`（まだ Vercel のまま。想定どおり）✅ |

**住所録の引っ越しだけが終わった状態。サイトの配信元はまだ Vercel。**

### 次：7章の本番の切り替え（ふくきたさんの「はい」が必要）

当日の手順（用意済み・まだ出していない変更）：

`wrangler.jsonc` に次を足す。
- `"routes": [{ "pattern": "hsp.ink", "custom_domain": true }]`
- `"workers_dev": false`

順番：
1. ふくきたさんが記事の公開を止める
2. ふくきたさんが Cloudflare の DNS で `hsp.ink` の A（76.76.21.21）を削除（残っているとドメインをつなげない）
3. すぐ上の変更を `cloudflare-static` に出す → Cloudflare のビルドで公開（約2分）
4. 直後の1分ほどは一部ページが522になることがある（ceodock で発生。待てば直る）
5. `Server: cloudflare` を確認し、全URLを `https://hsp-ink-media.vercel.app` と照合する
   **この照合は main に入れる前に行う**（main に入れると Vercel 側も書き出し版になり、くらべる相手がなくなる）

### 本番の切り替え（7章）完了

1. ふくきたさんが Cloudflare の DNS で `hsp.ink` の A（76.76.21.21）を削除
2. 用意しておいた `wrangler.jsonc` の変更（`routes` に hsp.ink、`workers_dev: false`）を `cloudflare-static` に出す
3. Cloudflare のビルドで公開

| 確かめたこと | 結果 |
|---|---|
| `hsp.ink` の問い合わせ結果 | 104.21.71.19 / 172.67.142.69（Cloudflare）✅ |
| 配信元 | `Server: cloudflare` ✅ |
| 2つのIPとも配れているか | 両方 200 ✅ |
| 証明書 | 正常（`ssl_verify_result: 0`）✅ |
| `www.hsp.ink` | 308 → `https://hsp.ink/`（まだ Vercel・想定どおり）✅ |
| 試験用の住所（workers.dev） | 404（閉じた）✅ |
| Sanity の CORS（編集画面） | `Origin: https://hsp.ink` に対して `Access-Control-Allow-Origin: https://hsp.ink` と `Allow-Credentials: true` を返す ✅ |

**522 は出なかった**（ceodock では出た）。

#### 照合（本番 `hsp.ink` ⇔ `hsp-ink-media.vercel.app`）

56URL。**完全一致 47／想定どおりの違い 7／要確認 2**。切り替え前と同じ結果。

- `/about/` … 308 → 307（指示書で「問題なし」とされていた点）
- ない記事のURL … 書き出し方式は `<h1>` が最初から HTML に入っている（本番は JavaScript で後から差し込んでいた）。書き出し方式のほうが良い状態

#### 手元の名前解決の注意（次回のために）

A レコードを消した直後に `hsp.ink` を引くと、Windows が「見つからない」という答えを**30分ほど覚えてしまう**。
切り替えが済んでも手元からだけ繋がらなくなるので、`compare.mjs` に `--pin hsp.ink=<IP>` を足して名前解決を飛ばせるようにした。
`ipconfig /flushdns` は管理者権限が要るため、この環境では使えない。

### 次

- `cloudflare-static` を main に入れる
- ふくきたさん：Cloudflare の「Build」で本番の枝を `main` に変更
- ふくきたさん：Deploy Hook を作り、Sanity に新しい Webhook を作る（8章）

### 自動で作り直す仕組み（8章）— 動作確認まで完了

- ふくきたさんが Cloudflare の「Build」で本番の枝を `main` に変更
- ふくきたさんが Deploy Hook（`sanity-publish` / `main`）を作成
- ふくきたさんが Sanity に Webhook `cloudflare-rebuild` を作成
  （Dataset: production／Trigger on: Create・Update・Delete／Filter: `_type in ["post", "category"]`／Drafts・Versions はオフ／POST）

#### 動作確認：記事を1本公開して、端から端まで通した

確認のためだけに再公開すると更新日が実態と合わなくなるので、**承認済みで未着手だった修正**を使った。

対象：[HSS型HSPが理解されない6つの苦悩](https://hsp.ink/posts/hss-hsp-rikai-sarenai)
「6%」を断定しない表現に直す指示（`hss-hsp-towa` には適用済み、この記事だけ残っていた）。3か所。

| | 直したあと | 文字数 |
|---|---|---|
| u02 | 人口の**約6%といわれる**少数派です | 48 |
| u09 | 人口の**約6%といわれています（諸説あり）**。… | 87 |
| u32 | **約6%といわれる**少数派で、… | 74 |

`updatedAt` は MCP からの公開では Studio の公開アクションが走らないため、手で当日（2026-11-07）を入れた。

| 時刻（UTC） | 出来事 |
|---|---|
| 12:52:59 | Sanity で公開 |
| 12:53:31 | Webhook `cloudflare-rebuild` → **success / 200** |
| 〜12:54:45 | サイトに反映（**公開から約105秒**） |

- 3か所すべて反映、古い表現は残っていない
- 記事の見出し下：「公開：2026年6月21日／更新：2026年11月7日」
- サイトマップの `lastmod` も `2026-11-07T12:52:59Z` に更新

#### 古い Webhook「Vercel Revalidate」

同じ公開で呼ばれ、**failure / 405** を返した。`/api/revalidate` はもう無く、静的配信は POST を受けないため。
害はないが、公開のたびに失敗が記録される。消してよいかをふくきたさんに確認する。

#### 別件の気づき（急ぎではない）

MCP から保存すると `audience` と `updatedAt` が「存在しないフィールド」と警告される。
Sanity に**登録されている設計図が古い**だけで、Studio とサイトが見ている `sanity/schemaTypes/post.ts` には両方ある。
表示にも保存にも影響しないが、紛らわしいので落ち着いたら登録し直す。

### 残り

- 古い Webhook「Vercel Revalidate」を消す（ふくきたさんの「はい」が必要）
- `www` を Cloudflare に移し、Vercel を止める（数日後・ふくきたさんの「はい」が必要）
- プロフィール写真の小さい版を作る（承認済み）
- Sanity の設計図を登録し直す
