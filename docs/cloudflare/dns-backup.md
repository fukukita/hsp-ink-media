# hsp.ink のDNS 控え（2026-11-05）

Xserver のサーバーパネル「DNSレコード設定」の画面（ふくきたさん提供）と、
実際の問い合わせ（`Resolve-DnsName -Server 8.8.8.8`）の両方で突き合わせた。値は問い合わせの結果をそのまま写している。

ドメインの登録元は **お名前.com**。DNSの中身は **Xserver**（ns1〜5.xserver.jp）にある。

## 全13行

| # | 名前 | 種類 | 値 | TTL | Cloudflare へ移すとき |
|---|---|---|---|---|---|
| 1 | hsp.ink | A | 76.76.21.21 | 3600 | **切り替えの日に消す**（Vercel。消さないとドメインをつなげない） |
| 2 | www.hsp.ink | A | 76.76.21.21 | 3600 | 当面このまま（Vercel が hsp.ink へ転送している）。DNSのみ |
| 3 | *.hsp.ink | A | 183.90.240.74 | 3600 | そのまま。DNSのみ。**消すと studio.hsp.ink などが全部止まる** |
| 4 | hsp.ink | TXT | `v=spf1 +a:sv2253.xserver.jp +a:hsp.ink +mx include:spf.sender.xserver.jp ~all` | 3600 | そのまま |
| 5 | hsp.ink | TXT | `google-site-verification=GU2h_S4lWMo1TlXn2LJzE-8ICwMylnsiyt9bGne9EI4` | 3600 | そのまま。**消すと Search Console の所有確認が外れる** |
| 6 | default._domainkey.hsp.ink | TXT | 下記のDKIM（長い） | 3600 | そのまま。Xserver の「DKIM設定」が作った行なので、画面からは消せない |
| 7 | _adsp._domainkey.hsp.ink | TXT | `dkim=unknown` | 3600 | そのまま |
| 8 | link.hsp.ink | CNAME | cname.short.io | 3600 | そのまま。DNSのみ。**短縮リンク。外からの調べでは見落としやすい（ceodock で実際に見落とした）** |
| 9 | hsp.ink | NS | ns1.xserver.jp | 3600 | **移さない**（Cloudflare 自身のものに置き換わる） |
| 10 | 〃 | NS | ns2.xserver.jp | 3600 | 移さない |
| 11 | 〃 | NS | ns3.xserver.jp | 3600 | 移さない |
| 12 | 〃 | NS | ns4.xserver.jp | 3600 | 移さない |
| 13 | 〃 | NS | ns5.xserver.jp | 3600 | 移さない |

### 6行目のDKIM（1行。途中で改行しない）

```
v=DKIM1; k=rsa; p=MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEArRMBbPwgu7QHrxCOJ94CyUNQhghfsQg4FijUvhupMRcZk4r/XfXxd7avaaQfgvyATPe+w5FbBQgN/9W3fcAPPstdNCUOmGhZz4TFO0cFUfIFaMabAcdnmmMe1ADj8dtgsUtyeFMg4tRm1IgRYMS2u20hT7Z5EeuwQEOXRWa1FTrzBICEaGcTlXE9nlZ0eThPovVKGUqCNk+zwnLClmS0cH4ThEQEqxdW/4djjwqf1zlnOgp7LOdOnXEcrINgeEhNgz8SDE9LtwhWSPxDu8aYNSd9556EjQ0JRGQ/ae1s0PI658cWnFLLl5PmPkh1S7Wg5CHyw9tSZVrNHGBpGYjF0wIDAQAB
```

## 無いもの（確認済み）

- **MX なし**（メールの受け取りはしていない）
- **_dmarc の TXT なし**
- **DNSSEC（DS）なし**
- `_dmarc.hsp.ink` や `studio.hsp.ink` のような名前は、3行目のワイルドカードが受け止めている（`zzz-test.hsp.ink` を引くと 183.90.240.74 が返ることで確認）

## 指示書（6章）の外からの調べとの違い

指示書は外からの調べだけで7行としていたが、実際は13行あった。足りなかったのは次の3つ。

| 見落としていた行 | 何に使っているか |
|---|---|
| `default._domainkey.hsp.ink` TXT（DKIM） | Xserver から送るメールの署名 |
| `_adsp._domainkey.hsp.ink` TXT | 同上の付属設定 |
| SPF の中身が指示書より長い（`+a:hsp.ink +mx include:spf.sender.xserver.jp ~all` まで） | 同上 |

→ **外からの調べだけで済ませないという指示書の判断は正しかった。**

## 移したあとの確かめ方

ネームサーバーを変える前に、Cloudflare が割り当てたネームサーバーへ直接問い合わせて、上の13行（NS 5行を除く8行）が全部そろっているかを見る。

```
Resolve-DnsName -Name hsp.ink -Type TXT -Server <Cloudflare の割り当てNS>
```

取り込まれた A と CNAME は、すべて「**DNSのみ**」（プロキシなし／雲が灰色）にする。
