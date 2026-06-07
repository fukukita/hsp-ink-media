import { client } from '@/sanity/lib/client'
import { postsQuery, categoriesQuery } from '@/sanity/lib/queries'
import PostCard from '@/components/PostCard'
import type { Metadata } from 'next'

export const revalidate = 0

export const metadata: Metadata = {
  title: '新着記事',
  description: 'HSS型HSPに寄り添うメディア「HSP Partner」の記事一覧。気質を活かして自分らしく生きるヒントを届けています。',
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

type Category = {
  _id: string
  title: string
  slug: { current: string }
  description: string | null
}

export default async function PostsPage() {
  const [posts, categories] = await Promise.all([
    client.fetch<Post[]>(postsQuery),
    client.fetch<Category[]>(categoriesQuery),
  ])

  return (
    <div className="max-w-5xl mx-auto px-6 py-12">
      {/* パンくず */}
      <nav className="text-sm text-gray-400 mb-8 flex gap-2">
        <a href="/" className="hover:text-brand-600 transition-colors">トップ</a>
        <span>›</span>
        <span>記事一覧</span>
      </nav>

      <h1 className="font-serif text-2xl sm:text-3xl font-bold text-ink mb-4">新着記事</h1>
      <p className="text-gray-500 text-sm mb-10">HSS型HSPの気質を活かして、自分らしく生きるヒントをお届けしています。</p>

      {/* カテゴリフィルター */}
      {categories.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-10">
          {categories.map((cat) => (
            <a
              key={cat._id}
              href={`/category/${cat.slug.current}`}
              className="px-4 py-1.5 rounded-full border border-gray-200 text-sm text-gray-600 hover:border-brand-400 hover:text-brand-600 transition-all"
            >
              {cat.title}
            </a>
          ))}
        </div>
      )}

      {/* 記事グリッド */}
      {posts.length === 0 ? (
        <p className="text-gray-400 py-16 text-center">記事を準備中です。</p>
      ) : (
        <div className="grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <PostCard key={post._id} post={post} />
          ))}
        </div>
      )}
    </div>
  )
}
