import { client } from '@/sanity/lib/client'
import { postsByCategoryQuery, categoriesQuery } from '@/sanity/lib/queries'
import PostCard from '@/components/PostCard'
import LineCta from '@/components/LineCta'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

export const revalidate = 0

type Audience = 'hsp' | 'hss-hsp' | 'both'

type Props = {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ audience?: string }>
}

type Category = {
  _id: string
  title: string
  slug: { current: string }
  description: string | null
}

type Post = {
  _id: string
  title: string
  slug: { current: string }
  excerpt: string | null
  publishedAt: string | null
  mainImage: unknown
  audience?: Audience
  category: { title: string; slug: { current: string } } | null
  tags: string[] | null
}

const AUDIENCE_TABS: { value: Audience | 'all'; label: string }[] = [
  { value: 'all', label: 'すべて' },
  { value: 'hss-hsp', label: 'HSS型HSP向け' },
  { value: 'hsp', label: 'HSP向け' },
]

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const categories = await client.fetch<Category[]>(categoriesQuery)
  const category = categories.find((c) => c.slug.current === slug)
  if (!category) return {}
  return {
    title: `${category.title}の記事一覧`,
    description: category.description || `${category.title}に関する記事一覧`,
  }
}

export default async function CategoryPage({ params, searchParams }: Props) {
  const { slug } = await params
  const { audience: audienceParam } = await searchParams
  const audience: Audience | 'all' =
    audienceParam === 'hsp' || audienceParam === 'hss-hsp' ? audienceParam : 'all'

  const [allPosts, categories] = await Promise.all([
    client.fetch<Post[]>(postsByCategoryQuery, { categorySlug: slug }),
    client.fetch<Category[]>(categoriesQuery),
  ])
  const category = categories.find((c) => c.slug.current === slug)
  if (!category) notFound()

  const posts =
    audience === 'all'
      ? allPosts
      : allPosts.filter((p) => p.audience === audience || p.audience === 'both')

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      {/* パンくずリスト */}
      <nav className="text-sm text-gray-400 mb-6 flex gap-2">
        <a href="/" className="hover:text-brand-600">トップ</a>
        <span>›</span>
        <span>{category.title}</span>
      </nav>

      <h1 className="text-2xl font-bold text-ink mb-2">{category.title}</h1>
      {category.description && (
        <p className="text-gray-500 mb-6">{category.description}</p>
      )}

      {/* 対象読者フィルター */}
      <div className="flex flex-wrap gap-2 mb-4">
        {AUDIENCE_TABS.map((tab) => (
          <a
            key={tab.value}
            href={
              tab.value === 'all'
                ? `/category/${slug}`
                : `/category/${slug}?audience=${tab.value}`
            }
            className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-colors ${
              audience === tab.value
                ? 'bg-ink text-white'
                : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
            }`}
          >
            {tab.label}
          </a>
        ))}
      </div>

      {/* カテゴリナビ */}
      <div className="flex flex-wrap gap-2 mb-8">
        {categories.map((cat) => (
          <a
            key={cat._id}
            href={
              audience === 'all'
                ? `/category/${cat.slug.current}`
                : `/category/${cat.slug.current}?audience=${audience}`
            }
            className={`px-4 py-1.5 rounded-full text-sm transition-colors ${
              cat.slug.current === slug
                ? 'bg-brand-500 text-white'
                : 'bg-brand-50 text-brand-700 hover:bg-brand-100'
            }`}
          >
            {cat.title}
          </a>
        ))}
      </div>

      {/* 記事一覧 */}
      {posts.length === 0 ? (
        <p className="text-gray-400">このテーマの記事はまだありません。</p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2">
          {posts.map((post) => (
            <PostCard key={post._id} post={post} />
          ))}
        </div>
      )}

      <LineCta />
    </div>
  )
}
