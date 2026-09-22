#!/bin/sh
# 書き出した本文に、日本語にない漢字（簡体字・繁体字）が混ざっていないか確かめる。
# 使い方: sh scripts/check-japanese.sh docs/audit-2026-09-20/rewrites/<slug>.draft.json
f="$1"
node -e '
const fs=require("fs");const d=JSON.parse(fs.readFileSync(process.argv[1],"utf8"));
const t=(d.body||[]).map(b=>b._type==="block"?b.children.map(c=>c.text).join(""):(b.items?b.items.join("\n"):b.text||"")).join("\n");
fs.writeFileSync(process.argv[1]+".txt", [d.title,d.seoTitle,d.seoDescription,d.excerpt,t].join("\n"));
' "$f"
iconv -c -f UTF-8 -t CP932 "$f.txt" | iconv -f CP932 -t UTF-8 > "$f.rt"
if diff -q "$f.txt" "$f.rt" > /dev/null; then echo "文字の確認: 日本語にない漢字なし"; else echo "要確認 日本語にない漢字あり:"; diff "$f.txt" "$f.rt" | head -20; fi
rm -f "$f.txt" "$f.rt"
