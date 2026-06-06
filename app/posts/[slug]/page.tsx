import { client } from '@/sanity/lib/client'
import { postBySlugQuery, recentPostsQuery } from '@/sanity/lib/queries'
import { PortableText } from 'next-sanity'
import Image from 'next/image'
import { urlForImage } from '@/sanity/lib/image'
import { LINE_URL } from '@/lib/site'
import type { Metadata } from 'next'
import PostCard from '@/components/PostCard'
import LineCta from '@/components/LineCta'
import LineBanner from '@/components/LineBanner'
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
type Heading = { id: string; text: string }
const makeComponents = (headings: Heading[]) => ({
  block: {
    h2: ({ children, value }: { children?: React.ReactNode; value?: { _key?: string } }) => (
      <h2
        id={value?._key}
        className="scroll-mt-24 text-xl sm:text-2xl font-bold mt-12 mb-4 text-ink border-l-4 border-brand-400 pl-4 leading-snug"
      >
        {children}
      </h2>
    ),
    h3: ({ children }: { children?: React.ReactNode }) => (
      <h3 className="text-lg sm:text-xl font-bold mt-9 mb-3 text-ink">{children}</h3>
    ),
    h4: ({ children }: { children?: React.ReactNode }) => (
      <h4 className="text-base sm:text-lg font-semibold mt-6 mb-2 text-ink">{children}</h4>
    ),
    normal: ({ children }: { children?: React.ReactNode }) => (
      <p className="leading-[1.9] text-gray-700 mb-5">{children}</p>
    ),
  },
  list: {
    bullet: ({ children }: { children?: React.ReactNode }) => (
      <ul className="my-6 space-y-2.5">{children}</ul>
    ),
    number: ({ children }: { children?: React.ReactNode }) => (
      <ol className="my-6 space-y-2.5 list-decimal pl-6 marker:text-brand-500 marker:font-bold">
        {children}
      </ol>
    ),
  },
  listItem: {
    bullet: ({ children }: { children?: React.ReactNode }) => (
      <li className="flex gap-3 text-gray-700 leading-[1.8]">
        <span className="mt-[0.7em] h-1.5 w-1.5 rounded-full bg-brand-400 shrink-0" />
        <span>{children}</span>
      </li>
    ),
    number: ({ children }: { children?: React.ReactNode }) => (
      <li className="text-gray-700 leading-[1.8] pl-1">{children}</li>
    ),
  },
  types: {
    lineBanner: () => <LineBanner />,
    toc: () =>
      headings.length >= 2 ? (
        <nav
          aria-label="目次"
          className="my-8 rounded-2xl border border-brand-100 bg-brand-50/70 p-5 sm:p-6"
        >
          <p className="text-sm font-bold text-ink mb-3">目次</p>
          <ol className="space-y-2.5">
            {headings.map((h, i) => (
              <li key={h.id}>
                <a
                  href={`#${h.id}`}
                  className="group flex gap-2.5 text-sm text-gray-700 hover:text-brand-700 leading-snug"
                >
                  <span className="text-brand-400 font-bold shrink-0">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <span className="group-hover:underline">{h.text}</span>
                </a>
              </li>
            ))}
          </ol>
        </nav>
      ) : null,
    checklist: ({ value }: { value?: { items?: string[] } }) => (
      <div className="my-7 rounded-2xl border border-brand-100 bg-brand-50/60 p-5 sm:p-6">
        <ul className="space-y-3.5">
          {(value?.items || []).map((item, i) => (
            <li key={i} className="flex gap-3 items-start">
              <span className="mt-0.5 shrink-0 grid place-items-center h-5 w-5 rounded-md bg-brand-500 text-white text-[11px] font-bold">
                ✓
              </span>
              <span className="text-gray-700 leading-[1.7]">{item}</span>
            </li>
          ))}
        </ul>
      </div>
    ),
    lineCallout: ({ value }: { value?: { text?: string } }) => (
      <aside className="my-9 rounded-2xl bg-gradient-to-br from-brand-50 to-brand-100 border border-brand-200 p-6 sm:p-7 text-center">
        {value?.text && (
          <p className="text-sm sm:text-[0.95rem] text-gray-700 leading-relaxed mb-5 max-w-md mx-auto">
            {value.text}
          </p>
        )}
        <a
          href={LINE_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 bg-brand-500 hover:bg-brand-600 text-white font-bold text-sm py-3 px-7 rounded-full transition-colors shadow-sm"
        >
          公式LINEで受け取る <span aria-hidden>→</span>
        </a>
      </aside>
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
})

export default async function PostPage({ params }: Props) {
  const { slug } = await params
  const [post, recentPosts] = await Promise.all([
    client.fetch<Post>(postBySlugQuery, { slug }),
    client.fetch<Post[]>(recentPostsQuery),
  ])

  if (!post) notFound()

  // 本文のH2から目次を生成し、最初のH2の直前に目次を差し込む
  const blocks = (post.body ?? []) as Array<{
    _type?: string
    _key?: string
    style?: string
    children?: Array<{ text?: string }>
  }>
  const headings: Heading[] = blocks
    .filter((b) => b._type === 'block' && b.style === 'h2')
    .map((b) => ({
      id: b._key ?? '',
      text: (b.children ?? []).map((c) => c.text ?? '').join(''),
    }))
  const firstH2Index = blocks.findIndex(
    (b) => b._type === 'block' && b.style === 'h2'
  )
  // 最初のH2の直前に「LINE誘導バナー → 目次」の順で差し込む
  const inserts: Array<{ _type: string; _key: string }> = []
  if (firstH2Index >= 0) {
    inserts.push({ _type: 'lineBanner', _key: '__linebanner' })
    if (headings.length >= 2) {
      inserts.push({ _type: 'toc', _key: '__toc' })
    }
  }
  const bodyWithToc =
    firstH2Index >= 0
      ? [
          ...blocks.slice(0, firstH2Index),
          ...inserts,
          ...blocks.slice(firstH2Index),
        ]
      : blocks
  const components = makeComponents(headings)

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
          <PortableText value={bodyWithToc} components={components} />
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
