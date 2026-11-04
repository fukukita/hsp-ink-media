# hsp.ink を Cloudflare の無料プランに移す（別チャットへの指示書）

作成：2026-11-04（ceodock のチャットから）。この指示書と同じフォルダに `freeze-fonts.mjs`（書体を固定する道具）がある。

---

## ふくきたさん向けのひと目まとめ

| | |
|---|---|
| やること | hsp.ink の公開先を Vercel（無料・商用不可）から Cloudflare（無料）に移す |
| 変わらないもの | 見た目、URL、ドメイン、記事、Studio（hsp.ink/studio）、GTM |
| 変わるもの | 記事を公開してから、サイトに出るまで約2分かかる（今はすぐ出る） |
| 費用 | 0円 |
| ふくきたさんの画面操作 | 6回（下の「ふくきたさんにお願いする操作」） |
| 切り替えの日 | 作業が終わるまでの30分ほど、記事の公開を止めていただく |

---

## 1. 最初に読むこと（別チャットへ）

- この指示書と `freeze-fonts.mjs` を、hsp-ink-media の `docs/cloudflare/` に写してから始める。作業の記録もそこに書く
- 背景：Vercel の無料プランは「個人の非商用利用のみ」。hsp.ink には特商法のページがあり、商用にあたる可能性が高い。有料（月20ドル）は「固定費を増やさない」方針で見送り。saikido.org（2026-11-03）と ceodock.jp（2026-11-03〜04）は、同じ形で移し終えている
- 手本は ceodock のリポジトリ（`C:\Users\fukuk\ceodock`）。`git -C C:\Users\fukuk\ceodock show <番号>` で中身を見られる
  - `9e78db6` 静的書き出しへの対応一式（next.config、Studio の分け方、_redirects、wrangler.jsonc）
  - `7bcf404` 公開してよい Sanity の値を `.env.production` で持つ
  - `793052f` 本番のドメインをつなぎ、試験用のURLを閉じる
  - `3e7e53f` 書体をリポジトリに固定する
- `AGENTS.md` のとおり、Next.js 16 の静的書き出し（output: "export"）の説明を `node_modules/next/dist/docs/` で読んでから書く

### ふくきたさんとのやり取りのきまり（ceodock のチャットで決まったこと）

- 返事は日本語で、中学生にわかる言葉で。git の用語（ブランチ、マージ、プッシュなど）は本文で使わない
- 確認を取るときは、何をどこにどう変えるかを、その場で全部並べてから聞く。「上の案」のように前を指すだけで聞かない（覚えていないことが多い）
- 結論はひと目でわかる形に。長い文章は読むのがつらい
- 報告の最後に「■ お願いしたいこと」を置く
- 画面の案内は、ふくきたさんのスクリーンショットに実際に出ている言葉で書く。「どこにありますか」と聞かれたら、画面の中の位置（何の下・何の上）で答える
- ログイン、GitHub などとの連携の許可、支払い、アカウント作成は、ふくきたさんが行う
- 有料プランを軽くすすめない。無料の上限は公式で確かめてから書く
- 次の3つは、ふくきたさんの「はい」をもらってから行う：本番の切り替え（Aレコードを消してからの公開）、古い Webhook の削除、Vercel の停止
- Deploy Hook の URL は秘密の鍵と同じ。返事・ファイル・コミットに書かない。今の Sanity の Webhook の URL にも秘密の値が入っている
- hsp.ink の「修正したらすぐ main に出す」きまりは、移行の作業には当てはめない。移行の変更は別の枝（`cloudflare-static`）で進め、main に入れるのは切り替えのとき

---

## 2. 今の hsp.ink（2026-11-04 に調べた）

| 項目 | 今 | 移したあと |
|---|---|---|
| 公開先 | Vercel（`hsp-ink-media.vercel.app` も同じサイト） | Cloudflare Workers の静的配信 |
| 記事の取り込み | `revalidate = 0`（/、/posts、/category/[slug]）で毎回 Sanity を読む | ビルドのときに読む |
| 作り直しの合図 | Sanity の Webhook「Vercel Revalidate」→ `/api/revalidate` | Sanity の Webhook → Cloudflare の Deploy Hook |
| Sanity の Webhook | 1本（無料プランは1プロジェクト2本まで） | 新しいのを足し、切り替え後に古いのを消す |
| 読者で絞る | `/category/[slug]?audience=hsp` をサーバーで読む | 画面の側（ブラウザ）で絞る |
| 書体 | next/font/google（Serif 400・500・700、Sans 300・400・500・700） | リポジトリに固定 |
| 画像 | next/image（Vercel が縮小） | 縮小なし（`unoptimized`） |
| 末尾の / | `/about/` → `/about` に308 | 307 になる（問題なし） |
| www | `www.hsp.ink` → `hsp.ink` に308（Vercel） | 当面このまま。あとで Cloudflare に移す |
| Sanity プロジェクト | `jgmm0gpv` / production | 変わらない |
| GTM | `GTM-MT8RR247`（本番のHTMLで確認） | 変わらない（下の注意を必ず見る） |
| サイトマップ | 37件 | 同じ件数になるはず |

---

## 3. コードの変更（`cloudflare-static` で）

1. `next.config.ts`：`output: "export"`、`images: { unoptimized: true }`
2. `revalidate = 0` を3か所から外す（app/page.tsx、app/posts/page.tsx、app/category/[slug]/page.tsx）
3. `app/api/revalidate/` を消す（静的書き出しでは動かない）
4. `app/posts/[slug]/page.tsx` と `app/category/[slug]/page.tsx` に `generateStaticParams` を足す（全記事・全カテゴリ）
5. `?audience=` の絞り込みを、画面の側に移す
   - サーバーでは全記事を出し、絞り込みは `'use client'` の部品で `useSearchParams()` を読んで行う。`<Suspense>` で包み、待つ間は「すべて」を出す（包まないとビルドが止まる）
   - タブの見た目と、カテゴリのリンクに `?audience=` を引き継ぐ動きも、今と同じにする
   - URL の形は変えない
6. `app/robots.ts`・`app/sitemap.ts`：`export const dynamic = "force-static"`
7. Studio：`app/studio/[[...tool]]/` を2つに分ける（ceodock の 9e78db6 と同じ）
   - `Studio.tsx`（`'use client'`、NextStudio）
   - `page.tsx`（サーバー側。`dynamic = "force-static"`、`generateStaticParams() { return [{ tool: [] }] }`）
   - `public/_redirects` に `/studio/* /studio 200`
8. 書体を固定する（ceodock の 3e7e53f と同じ）
   - next/font/google のままでは、ビルドのたびに Google から約250ファイルを取りに行き、Cloudflare のビルドが4回に1回ほど失敗した
   - 手順：今の書体のまま一度ビルド → `freeze-fonts.mjs` で `app/fonts.css` と `public/fonts/noto/` を作る → layout.tsx から next/font を外し `import "./fonts.css"` → next/font が先読みしていたファイル（変える前のビルドのHTMLにある `<link rel="preload" as="font">`）を、react-dom の `preload()` で同じように先読みする
   - hsp.ink の太さは、ceodock の固定した分の一部（ceodock には Serif 600 が多い）。使い回さず、hsp.ink で作り直す
9. 公開してよい値を `.env.production` に書いてコミットする（`.gitignore` に `!.env.production`）
   - `NEXT_PUBLIC_SANITY_PROJECT_ID`、`NEXT_PUBLIC_SANITY_DATASET`、`NEXT_PUBLIC_SANITY_API_VERSION`、`NEXT_PUBLIC_SITE_URL=https://hsp.ink`、`NEXT_PUBLIC_GTM_ID`
   - **`SANITY_API_TOKEN` と `SANITY_REVALIDATE_SECRET` は入れない**
   - **GTM の注意**：`GoogleTagManager.tsx` は ID がないと何も出さない。入れ忘れると、エラーも出ずに計測が止まる。試験URLのHTMLに `GTM-MT8RR247` があるかを必ず見る
10. `package.json`：`prebuild` で `.next/cache/fetch-cache` を消す（ceodock では、9月の古い記事データが残っていて、ビルドが使い回していた）。`wrangler` を devDependencies に足す
11. `wrangler.jsonc`（切り替えまでは `routes` を書かない）
    ```jsonc
    {
      "$schema": "node_modules/wrangler/config-schema.json",
      "name": "hsp-ink",
      "compatibility_date": "2026-10-01",
      "assets": { "directory": "./out", "html_handling": "auto-trailing-slash", "not_found_handling": "404-page" }
    }
    ```
12. 画像：Sanity の記事画像はもう幅つき（800×450、1200×675）なので、そのままでよい。トップのヒーロー画像（`lib/site.ts` の `HERO_IMAGE_URL`）だけ元の大きさの jpg なので、`?w=1600&auto=format` などを付けて今と同じくらいの重さにする
13. `.claude/launch.json` に `wrangler dev` の設定を足す（ceodock の `ceodock-cloudflare` と同じ形）

---

## 4. 公開前の確かめ

- 手元で `npm run build` → `wrangler dev` で見る
  - **Windows で作った `out/` は、ページ移動の下準備ファイル（`__next.〇〇.__PAGE__.txt`）が入れ子のフォルダになり、404 が出る。** Cloudflare のビルド（Linux）では出ない。手元で出るこの404は気にしない
  - だから、**本番にも試験URLにも、手元の `out/` を `wrangler deploy` で出さない**（最初に Worker を作るときの1回だけは可。すぐ Cloudflare のビルドで上書きする）
- 試験URL（`https://hsp-ink.fukukita.workers.dev`）を、Cloudflare のビルドで作ってから照合する
- 照合のしかた：サイトマップの37件＋ `/`、`/posts`、`/about`、`/about/`、`/tokushoho`、`/privacy`、`/studio`、`/robots.txt`、`/sitemap.xml`、`/icon.svg`、ない記事のURL、`/category/<各カテゴリ>?audience=hsp`・`?audience=hss-hsp` を、本番と試験URLの両方に取りに行く。くらべるもの：返事の番号と転送先、title、description、canonical、og:image、h1、記事カードの数と順番、JSON-LD の有無、GTM の ID
- 試験URLの `/studio` は、画面が開くところまで見ればよい。ログインやCORSの許可を求められても、Sanity の設定は足さない（Sanity の CORS には `https://hsp.ink` がもう入っている（2026-11-04 確認）ので、本番のドメインなら今の設定で動く。切り替えのあとに本番で確かめる）
- 違いは表にして、ふくきたさんに中身ごと見せる

---

## 5. 進める順番

| # | やること | だれが |
|---|---|---|
| 1 | 3章の変更を `cloudflare-static` に入れる | 別チャット |
| 2 | 手元で一度 `wrangler deploy`（Worker を作る） | 別チャット（wrangler はこのパソコンでログイン済み。`wrangler whoami` で確かめる） |
| 3 | Cloudflare の画面で、Worker「hsp-ink」→「Settings」→「Build」から GitHub につなぐ。リポジトリ `fukukita/hsp-ink-media`、本番の枝は当面 `cloudflare-static`、ビルドの命令 `npm run build`、公開の命令 `npx wrangler deploy`、**「プレビュービルドを有効化」のチェックは外す**（外さないと、記事の作業で main を更新するたびにビルドが走る） | ふくきたさん |
| 4 | Cloudflare のビルドが通ったら、試験URLで照合（4章） | 別チャット |
| 5 | DNS を Cloudflare へ（6章） | ふくきたさん＋別チャット |
| 6 | 本番の切り替え（7章） | ふくきたさんの「はい」のあと |
| 7 | 自動で作り直す仕組み（8章） | ふくきたさん＋別チャット |
| 8 | 数日後：www を Cloudflare に移し、Vercel を止める | あとで（ceodock・saikido と一緒に） |

---

## 6. DNS を Cloudflare へ

外から調べた hsp.ink の DNS（2026-11-04）：

| 名前 | 種類 | 値 | メモ |
|---|---|---|---|
| hsp.ink | A | 76.76.21.21 | Vercel。切り替えのときに消す |
| www | A | 76.76.21.21 | Vercel（hsp.ink へ転送）。当面そのまま |
| *（ワイルドカード） | A | 183.90.240.74 | Xserver。_dmarc、studio、files などもここに当たる |
| link | CNAME | cname.short.io | 短縮リンク |
| hsp.ink | TXT | google-site-verification=GU2h… | Search Console |
| hsp.ink | TXT | v=spf1 +a:sv2253.xserver.jp … | Xserver |
| hsp.ink | NS | ns1〜5.xserver.jp | |

MX はなし（メールは使っていない）。DKIM は外から見えず。DNSSEC（DS）はなし。

- **外からの調べだけで済ませない。** ceodock では、短縮リンクの行（link）を外からの調べで見落とした。Xserver のサーバーパネルの「DNSレコード設定」で hsp.ink の全行を見てもらい、`docs/cloudflare/dns-backup.md` に控える
- ドメインは **お名前.com** で取っている（DNSの中身は Xserver にある）。ネームサーバーの変更は、お名前.com Navi の「ネームサーバー設定」→「その他のサービス」で行う
- Cloudflare では、アカウントのホームから「ドメインを接続」（「登録」ではない）→ hsp.ink → **Free プラン**を選ぶ。ゾーンの中にいると左のメニューに Workers の欄が出ないことがある（ホームに戻る）
- 取り込まれた A と CNAME は、すべて「DNSのみ」（プロキシなし、雲が灰色）にする
- ネームサーバーを変える前に、Cloudflare が割り当てたネームサーバーに直接問い合わせて（`Resolve-DnsName -Server <割り当てのNS>`）、控えと全行が合うかを確かめる
- お名前.com で DNSSEC がオフかも確かめる

---

## 7. 本番の切り替え（ふくきたさんの「はい」をもらってから）

前の条件：ゾーンが「アクティブ」、試験URLの照合が済んだ、ふくきたさんが記事の公開を止めている。

1. `wrangler.jsonc` に `"routes": [{ "pattern": "hsp.ink", "custom_domain": true }]` と `"workers_dev": false` を足した変更を、用意だけしておく（まだ出さない）。Aレコードが残っていると、ドメインをつなぐところで失敗する
2. ふくきたさんが、Cloudflare の DNS で hsp.ink の A（76.76.21.21）を消す
3. すぐに 1 の変更を `cloudflare-static` に出す → Cloudflare のビルドで公開（2分ほど）
4. つないだ直後の1分ほどは、一部のページが 522 になる（ceodock でも起きた。待てば直る）
5. `Server: cloudflare` を確かめ、全URLを `https://hsp-ink-media.vercel.app` と照合する
   - **この照合は、main に入れる前に行う。** main に入れると Vercel 側も書き出し版になり、くらべる相手がなくなる
6. PowerShell で切り替えを待つ小さな道具を作るときは、中身を英語だけで書く（PowerShell 5.1 は BOM なしのファイルを ANSI で読むので、日本語があると止まる）

---

## 8. 切り替えのあと

1. `cloudflare-static` に main の最新を取り込んでから、main に入れる（記事の作業で main は進んでいるはず）
2. ふくきたさんが、Cloudflare の「Build」で本番の枝を `main` に変える
3. ふくきたさんが、「Build」の Deploy Hooks で、`main` 向けの Deploy Hook を作る（名前は `sanity-publish` など）。URL は秘密
4. ふくきたさんが、sanity.io/manage → hsp.ink のプロジェクト → API → Webhooks で、新しい Webhook を作る
   - Name：`cloudflare-rebuild`
   - URL：3 の Deploy Hook
   - Dataset：`production`（URL の欄の下、「Trigger on」の上にある）
   - Trigger on：Create・Update・Delete
   - Filter：`_type in ["post", "category"]`
   - Drafts（下書き）は対象にしない。HTTP method は POST
5. 確かめ：Deploy Hook を一度呼んで公開まで通るか → 実際に記事を1本公開して `sanity hooks logs`（Sanity CLI）と Cloudflare の公開の一覧に出るか
6. ふくきたさんの「はい」のあと、古い Webhook「Vercel Revalidate」を消す
7. ふくきたさんに伝える：これからは、公開してからサイトに出るまで約2分かかる

---

## 9. 無料の範囲（2026-11 時点。数字は使う前に公式で確かめる）

- 静的なファイルの配信は無料で回数の上限なし
- Cloudflare のビルドは、アカウント全体で月3,000分、同時に1本、1回20分まで。**ceodock と分け合う。** 1回およそ1分半〜2分
- 1つの版に置けるファイルは2万個まで、1ファイル25MiBまで
- 記事をまとめて公開すると、1本ごとにビルドが走る。続けて何本も公開したときにどうなるか（並ぶか、まとまるか）を一度見て、記録しておく
- main に記事の作業の記録（docs/）を出すたびにビルドが走る。気になるなら、「Build」の設定に docs/ だけの変更ではビルドしない設定があるかを見る（なければそのまま。分数は足りる）

---

## 10. ふくきたさんにお願いする操作（まとめ）

1. Cloudflare：Worker「hsp-ink」を GitHub につなぐ（5章の3）
2. Xserver：hsp.ink の DNS の全行を見せる（6章）
3. Cloudflare：「ドメインを接続」で hsp.ink を足す。お名前.com：ネームサーバーを Cloudflare の2つに変える（6章）
4. 切り替えの日：記事の公開を止める → Cloudflare の DNS で hsp.ink の A を消す（7章）
5. Cloudflare：本番の枝を main に、Deploy Hook を作る。Sanity：新しい Webhook を作る（8章）
6. Sanity：古い Webhook を消す（8章の6）

あとで：www の転送を Cloudflare に移し、Vercel のプロジェクトを止める（ceodock・saikido と一緒に）。止めたら、Sanity の CORS から `https://hsp-ink-media.vercel.app` を外してよいかを聞く。
