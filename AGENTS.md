<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# HSP Partner プロジェクト・ルール

- **記事制作の前に必ず `docs/KW-MAP.md` を読む。** 対策KWのカニバリ（重複）を避ける。
- **記事を作成・公開したら、必ず `docs/KW-MAP.md` にその記事の主KWを記録する。** これは必須。忘れない。
- コンテンツ戦略・トーンは `docs/STRATEGY.md` と `docs/BRAND.md` に従う。
- 記事の本文・画像は Sanity（CMS）に保存される。ローカルにMarkdownやHTMLの完成原稿は置かない。
- 公式LINE等の共通設定値は `lib/site.ts` で一元管理する。
