import type { MetadataRoute } from 'next'

// 書き出し方式（output: "export"）では build のとき1回だけ作る
export const dynamic = 'force-static'

export default function robots(): MetadataRoute.Robots {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://hsp.ink'
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: '/studio/',
      },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
  }
}
