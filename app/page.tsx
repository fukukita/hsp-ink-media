import { client } from '@/sanity/lib/client'
import { postsQuery, categoriesQuery } from '@/sanity/lib/queries'
import PostCard from '@/components/PostCard'
import LineCta from '@/components/LineCta'

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

export default async function Home() {
  const [posts, categories] = await Promise.all([
    client.fetch<Post[]>(postsQuery),
    client.fetch<Category[]>(categoriesQuery),
  ])

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      {/* ヒーロー */}
      <section className="text-center mb-16">
        <h1 className="text-3xl font-bold text-indigo-800 mb-4">
          HSS型HSPの気質を活かして、<br className="hidden sm:block" />
          自分らしく生きる
        </h1>
        <p className="text-gray-600 leading-relaxed max-w-xl mx-auto">
          刺激を求めながらも深く疲れる。そんなHSS型HSPの生きづらさと強みを、
          具体的な視点でお届けするメディアです。
        </p>
      </section>

      {/* カテゴリナビ */}
      {categories.length > 0 && (
        <section className="mb-10">
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <a
                key={cat._id}
                href={`/category/${cat.slug.current}`}
                className="px-4 py-1.5 rounded-full bg-indigo-50 text-indigo-700 text-sm hover:bg-indigo-100 transition-colors"
              >
                {cat.title}
              </a>
            ))}
          </div>
        </section>
      )}

      {/* 記事一覧 */}
      <section>
        <h2 className="text-xl font-bold mb-6 text-gray-700">新着記事</h2>
        {posts.length === 0 ? (
          <p className="text-gray-400">記事を準備中です。</p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2">
            {posts.map((post) => (
              <PostCard key={post._id} post={post} />
            ))}
          </div>
        )}
      </section>

      {/* LINE誘導CTA */}
      <LineCta />
    </div>
  )
}
