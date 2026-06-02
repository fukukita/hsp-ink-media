import { client } from '@/sanity/lib/client'
import { postsQuery, categoriesQuery } from '@/sanity/lib/queries'
import { urlForImage } from '@/sanity/lib/image'
import Image from 'next/image'
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

  const heroPost = posts[0] ?? null
  const restPosts = posts.slice(1)

  return (
    <div>
      {/* ===== ファーストビュー：画像の上にテキストをオーバーレイ ===== */}
      {heroPost ? (
        <section className="relative overflow-hidden min-h-[600px] h-[72vh] lg:h-[86vh] bg-gradient-to-br from-brand-100 to-brand-300">
          {/* 背景画像 */}
          {heroPost.mainImage ? (
            <Image
              src={urlForImage(heroPost.mainImage)!.width(1408).fit('clip').url()}
              alt={heroPost.title}
              fill
              sizes="100vw"
              priority
              quality={90}
              className="object-cover"
            />
          ) : null}

          {/* オーバーレイ：スマホは上から白くフェード、PCは左から白くフェード */}
          <div className="absolute inset-0 bg-gradient-to-b from-white/20 via-white/75 to-white/95 sm:bg-gradient-to-r sm:from-white/92 sm:via-white/70 sm:to-white/10" />

          {/* テキストコンテンツ */}
          <div className="relative z-10 flex items-center min-h-[600px] h-[72vh] lg:h-[86vh]">
            <div className="max-w-5xl w-full mx-auto px-6 pb-12 sm:pb-0 sm:py-16 overflow-hidden">
              <div className="max-w-[min(100%,32rem)]">
                <p className="text-xs font-medium tracking-[0.2em] text-brand-600 uppercase mb-5">
                  HSS型HSPに寄り添うメディア
                </p>
                <h1 className="font-serif font-bold text-ink mb-6 leading-snug" style={{ fontSize: 'clamp(1.25rem, 5.5vw, 3.2rem)' }}>
                  <a
                    href={`/posts/${heroPost.slug.current}`}
                    className="hover:text-brand-700 transition-colors"
                  >
                    {heroPost.title}
                  </a>
                </h1>
                {heroPost.excerpt && (
                  <p className="text-gray-600 leading-relaxed mb-8 max-w-sm">
                    {heroPost.excerpt}
                  </p>
                )}
                <a
                  href={`/posts/${heroPost.slug.current}`}
                  className="inline-flex items-center gap-2 text-sm font-bold text-ink border-b-2 border-brand-400 pb-1 hover:border-brand-600 transition-colors"
                >
                  記事を読む <span aria-hidden>→</span>
                </a>
              </div>
            </div>
          </div>
        </section>
      ) : (
        <section className="bg-brand-50 py-24 text-center px-6">
          <h1 className="font-serif text-3xl font-bold text-ink">HSP Partner</h1>
          <p className="text-gray-500 mt-4">記事を準備中です。</p>
        </section>
      )}

      <div className="max-w-5xl mx-auto px-6 py-16">

        {/* ===== テーマから探す ===== */}
        {categories.length > 0 && (
          <section className="mb-16">
            <h2 className="font-serif text-xl font-bold text-ink mb-6">テーマから探す</h2>
            <div className="flex flex-wrap gap-3">
              {categories.map((cat) => (
                <a
                  key={cat._id}
                  href={`/category/${cat.slug.current}`}
                  className="px-5 py-2.5 rounded-full border border-gray-200 text-sm text-gray-600 bg-white hover:border-brand-400 hover:text-brand-600 transition-all"
                >
                  {cat.title}
                </a>
              ))}
            </div>
          </section>
        )}

        {/* ===== 新着記事 ===== */}
        {restPosts.length > 0 && (
          <section>
            <h2 className="font-serif text-xl font-bold text-ink mb-6">新着記事</h2>
            <div className="grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
              {restPosts.map((post) => (
                <PostCard key={post._id} post={post} />
              ))}
            </div>
          </section>
        )}

        <LineCta />
      </div>
    </div>
  )
}
