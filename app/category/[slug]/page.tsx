import { client } from '@/sanity/lib/client'
import { postsByCategoryQuery, categoriesQuery } from '@/sanity/lib/queries'
import PostCard from '@/components/PostCard'
import LineCta from '@/components/LineCta'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

type Props = { params: Promise<{ slug: string }> }

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
  category: { title: string; slug: { current: string } } | null
  tags: string[] | null
}

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

export default async function CategoryPage({ params }: Props) {
  const { slug } = await params
  const [posts, categories] = await Promise.all([
    client.fetch<Post[]>(postsByCategoryQuery, { categorySlug: slug }),
    client.fetch<Category[]>(categoriesQuery),
  ])
  const category = categories.find((c) => c.slug.current === slug)
  if (!category) notFound()

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      {/* パンくずリスト */}
      <nav className="text-sm text-gray-400 mb-6 flex gap-2">
        <a href="/" className="hover:text-indigo-600">トップ</a>
        <span>›</span>
        <span>{category.title}</span>
      </nav>

      <h1 className="text-2xl font-bold text-gray-800 mb-2">{category.title}</h1>
      {category.description && (
        <p className="text-gray-500 mb-8">{category.description}</p>
      )}

      {/* カテゴリナビ */}
      <div className="flex flex-wrap gap-2 mb-8">
        {categories.map((cat) => (
          <a
            key={cat._id}
            href={`/category/${cat.slug.current}`}
            className={`px-4 py-1.5 rounded-full text-sm transition-colors ${
              cat.slug.current === slug
                ? 'bg-indigo-600 text-white'
                : 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100'
            }`}
          >
            {cat.title}
          </a>
        ))}
      </div>

      {/* 記事一覧 */}
      {posts.length === 0 ? (
        <p className="text-gray-400">この カテゴリの記事はまだありません。</p>
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
