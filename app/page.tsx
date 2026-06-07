import { client } from '@/sanity/lib/client'
import { postsQuery, categoriesQuery } from '@/sanity/lib/queries'
import Image from 'next/image'
import PostCard from '@/components/PostCard'
import LineCta from '@/components/LineCta'
import { HERO_IMAGE_URL, HERO_COPY } from '@/lib/site'

// Sanityで記事を公開するたびに最新データを反映させるため、常に動的レンダリングに設定
export const revalidate = 0

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
    <div>
      {/* ===== 固定ヒーロー（記事に依存しない・キャッチコピーは変わらない） ===== */}
      <section className="relative overflow-hidden h-[72vh] lg:h-[86vh] min-h-[520px] max-h-[700px] bg-brand-100">
        {/* フルブリード背景画像 */}
        <Image
          src={HERO_IMAGE_URL}
          alt="HSP Partner"
          fill
          priority
          quality={90}
          sizes="100vw"
          className="object-cover object-center"
        />

        {/* 左から右へのグラデーション（テキストを読みやすく） */}
        <div className="absolute inset-0 bg-gradient-to-r from-white/88 via-white/55 to-white/5" />
        {/* モバイル：上から下へ追加 */}
        <div className="absolute inset-0 bg-gradient-to-b from-white/30 via-transparent to-white/50 sm:hidden" />

        {/* 固定テキストコンテンツ */}
        <div className="relative z-10 flex items-center h-full">
          <div className="max-w-5xl mx-auto px-6 py-12 w-full">
            <div className="max-w-lg">
              <p className="text-xs font-medium tracking-[0.2em] text-brand-600 uppercase mb-5">
                {HERO_COPY.eyebrow}
              </p>
              <h1
                className="font-serif font-bold text-ink leading-[1.32] mb-5"
                style={{ fontSize: 'clamp(1.6rem, 4vw, 3.1rem)' }}
              >
                {HERO_COPY.heading.split('\n').map((line, i) => (
                  <span key={i} className="block whitespace-nowrap">
                    {line}
                  </span>
                ))}
              </h1>
              <p className="text-gray-600 leading-relaxed mb-8 text-sm sm:text-base max-w-xs">
                {HERO_COPY.body.split('\n').map((line, i) => (
                  <span key={i}>{line}{i === 0 && <br className="hidden sm:block" />}</span>
                ))}
              </p>
              <a
                href={HERO_COPY.ctaHref}
                className="inline-flex items-center gap-2 text-sm font-bold text-ink border-b-2 border-brand-400 pb-1 hover:border-brand-600 transition-colors"
              >
                {HERO_COPY.cta} <span aria-hidden>→</span>
              </a>
            </div>
          </div>
        </div>
      </section>

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

        {/* ===== 新着記事（最新3本） ===== */}
        {posts.length > 0 && (
          <section>
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-serif text-xl font-bold text-ink">新着記事</h2>
              <a
                href="/posts"
                className="text-sm text-brand-600 hover:text-brand-700 transition-colors font-medium"
              >
                すべて見る →
              </a>
            </div>
            <div className="grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
              {posts.slice(0, 3).map((post) => (
                <PostCard key={post._id} post={post} />
              ))}
            </div>
          </section>
        )}

        {/* ===== 運営者プロフィール ===== */}
        <section className="mt-16">
          <h2 className="font-serif text-xl font-bold text-ink mb-6">運営者について</h2>
          <div className="rounded-2xl border border-gray-200 bg-gray-50/70 p-6 sm:p-8">
            <div className="flex flex-col sm:flex-row sm:items-center gap-6">
              <Image
                src="/images/fukukita01.jpg"
                alt="ふくきた｜才気道 家元"
                width={120}
                height={120}
                className="rounded-2xl object-cover w-24 h-24 sm:w-32 sm:h-32 shrink-0"
              />
              <div className="flex-1">
                <p className="font-bold text-ink mb-2">ふくきた｜才気道 家元</p>
                <p className="text-sm text-gray-600 leading-relaxed mb-4">
                  HSS型HSP当事者。好奇心旺盛なのに繊細、社交的に見えて実は人見知り——いくつもの矛盾した気質を抱えて生きてきました。短期離職や営業職での挫折を重ねるなかで自己理解を深め、同じように「生きづらい」と感じる人へ、経験から得た気づきを届けています。
                </p>
                <a
                  href="/about"
                  className="inline-flex items-center gap-2 text-sm font-bold text-brand-600 hover:text-brand-700 border-b-2 border-brand-300 hover:border-brand-500 pb-0.5 transition-colors"
                >
                  プロフィールを見る <span aria-hidden>→</span>
                </a>
              </div>
            </div>
          </div>
        </section>

        <LineCta />
      </div>
    </div>
  )
}
