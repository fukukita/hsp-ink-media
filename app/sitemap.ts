import { client } from '@/sanity/lib/client'
import { postsQuery, categoriesQuery } from '@/sanity/lib/queries'
import type { MetadataRoute } from 'next'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://hsp.ink'

  const [posts, categories] = await Promise.all([
    client.fetch<{ slug: { current: string }; publishedAt: string | null }[]>(postsQuery),
    client.fetch<{ slug: { current: string } }[]>(categoriesQuery),
  ])

  const postUrls = posts.map((post) => ({
    url: `${siteUrl}/posts/${post.slug.current}`,
    lastModified: post.publishedAt ? new Date(post.publishedAt) : new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }))

  const categoryUrls = categories.map((cat) => ({
    url: `${siteUrl}/category/${cat.slug.current}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.6,
  }))

  return [
    {
      url: siteUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${siteUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    ...categoryUrls,
    ...postUrls,
  ]
}
