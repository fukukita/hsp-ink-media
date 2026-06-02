import { client } from '@/sanity/lib/client'
import { postBySlugQuery, recentPostsQuery } from '@/sanity/lib/queries'
import { PortableText } from 'next-sanity'
import Image from 'next/image'
import { urlForImage } from '@/sanity/lib/image'
import type { Metadata } from 'next'
import PostCard from '@/components/PostCard'
import LineCta from '@/components/LineCta'
import { notFound } from 'next/navigation'

type Props = { params: Promise<{ slug: string }> }

type Post = {
  _id: string
  title: string
  slug: { current: string }
  excerpt: string | null
  body: unknown[]
  publishedAt: string | null
  mainImage: unknown
  category: { title: string; slug: { current: string } } | null
  tags: string[] | null
  seoTitle: string | null
  seoDescription: string | null
  relatedPosts: {
    _id: string
    title: string
    slug: { current: string }
    excerpt: string | null
    publishedAt: string | null
    mainImage: unknown
    category: { title: string; slug: { current: string } } | null
  }[] | null
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const post = await client.fetch<Post>(postBySlugQuery, { slug })
  if (!post) return {}
  return {
    title: post.seoTitle || post.title,
    description: post.seoDescription || post.excerpt || '',
    openGraph: {
      title: post.seoTitle || post.title,
      description: post.seoDescription || post.excerpt || '',
      type: 'article',
    },
  }
}

// Portable Text コンポーネント定義
const components = {
  block: {
    h2: ({ children }: { children?: React.ReactNode }) => (
      <h2 className="text-2xl font-bold mt-10 mb-4 text-ink border-l-4 border-brand-400 pl-4">
        {children}
      </h2>
    ),
    h3: ({ children }: { children?: React.ReactNode }) => (
      <h3 className="text-xl font-bold mt-8 mb-3 text-gray-800">{children}</h3>
    ),
    h4: ({ children }: { children?: React.ReactNode }) => (
      <h4 className="text-lg font-semibold mt-6 mb-2 text-gray-800">{children}</h4>
    ),
    normal: ({ children }: { children?: React.ReactNode }) => (
      <p className="leading-8 text-gray-700 mb-5">{children}</p>
    ),
  },
  marks: {
    link: ({ children, value }: { children?: React.ReactNode; value?: { href: string; blank?: boolean } }) => (
      <a
        href={value?.href}
        target={value?.blank ? '_blank' : '_self'}
        rel={value?.blank ? 'noopener noreferrer' : undefined}
        className="text-brand-600 underline hover:text-brand-700"
      >
        {children}
      </a>
    ),
  },
}

export default async function PostPage({ params }: Props) {
  const { slug } = await params
  const [post, recentPosts] = await Promise.all([
    client.fetch<Post>(postBySlugQuery, { slug }),
    client.fetch<Post[]>(recentPostsQuery),
  ])

  if (!post) notFound()

  return (
    <article className="max-w-3xl mx-auto px-4 py-12">
      {/* パンくずリスト */}
      <nav className="text-sm text-gray-400 mb-6 flex gap-2">
        <a href="/" className="hover:text-brand-600">トップ</a>
        <span>›</span>
        {post.category && (
          <>
            <a href={`/category/${post.category.slug.current}`} className="hover:text-brand-600">
              {post.category.title}
            </a>
            <span>›</span>
          </>
        )}
        <span className="text-gray-600 line-clamp-1">{post.title}</span>
      </nav>

      {/* タグ・カテゴリ */}
      {post.category && (
        <a
          href={`/category/${post.category.slug.current}`}
          className="text-xs text-brand-600 font-medium bg-brand-50 px-3 py-1 rounded-full"
        >
          {post.category.title}
        </a>
      )}

      {/* タイトル */}
      <h1 className="text-3xl font-bold text-gray-900 mt-4 mb-3 leading-snug">
        {post.title}
      </h1>

      {/* 公開日 */}
      {post.publishedAt && (
        <p className="text-sm text-gray-400 mb-6">
          {new Date(post.publishedAt).toLocaleDateString('ja-JP', {
            year: 'numeric', month: 'long', day: 'numeric',
          })}
        </p>
      )}

      {/* アイキャッチ画像 */}
      {post.mainImage ? (
        <div className="relative aspect-[16/9] rounded-2xl overflow-hidden mb-8 bg-gradient-to-br from-brand-100 to-brand-300">
          <Image
            src={urlForImage(post.mainImage)!.width(1200).height(675).url()}
            alt={post.title}
            fill
            sizes="(max-width: 768px) 100vw, 768px"
            priority
            className="object-cover"
          />
        </div>
      ) : null}

      {/* リード文 */}
      {post.excerpt && (
        <p className="text-gray-600 bg-brand-50 border-l-4 border-brand-300 pl-4 py-3 mb-8 rounded-r-lg">
          {post.excerpt}
        </p>
      )}

      {/* 本文 */}
      <div className="prose-custom">
        {post.body && (
          // @ts-expect-error PortableText型の互換性
          <PortableText value={post.body} components={components} />
        )}
      </div>

      {/* LINE誘導CTA */}
      <LineCta />

      {/* 関連記事 */}
      {post.relatedPosts && post.relatedPosts.length > 0 && (
        <section className="mt-12">
          <h2 className="text-xl font-bold mb-4 text-gray-700">関連記事</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {post.relatedPosts.map((related) => (
              <PostCard key={related._id} post={related} />
            ))}
          </div>
        </section>
      )}

      {/* 新着記事 */}
      <section className="mt-12">
        <h2 className="text-xl font-bold mb-4 text-gray-700">新着記事</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {recentPosts
            .filter((p) => p._id !== post._id)
            .slice(0, 4)
            .map((p) => (
              <PostCard key={p._id} post={p} />
            ))}
        </div>
      </section>
    </article>
  )
}
