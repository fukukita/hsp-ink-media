import { Suspense } from 'react'
import { client } from '@/sanity/lib/client'
import {
  postsByCategoryQuery,
  categoriesQuery,
  categorySlugsQuery,
} from '@/sanity/lib/queries'
import CategoryAudienceView, {
  CategoryAudienceFallback,
} from '@/components/CategoryAudienceView'
import LineCta from '@/components/LineCta'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

type Audience = 'hsp' | 'hss-hsp' | 'both'

type Props = {
  params: Promise<{ slug: string }>
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
  updatedAt: string | null
  mainImage: unknown
  audience?: Audience
  category: { title: string; slug: { current: string } } | null
  tags: string[] | null
}

// 書き出し方式（output: "export"）では、どのカテゴリのページを作るかを先に決めておく
export async function generateStaticParams() {
  const slugs = await client.fetch<string[]>(categorySlugsQuery)
  return slugs.map((slug) => ({ slug }))
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

  const [allPosts, categories] = await Promise.all([
    client.fetch<Post[]>(postsByCategoryQuery, { categorySlug: slug }),
    client.fetch<Category[]>(categoriesQuery),
  ])
  const category = categories.find((c) => c.slug.current === slug)
  if (!category) notFound()

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

      {/* タブ・テーマの並び・記事一覧。?audience= の絞り込みはブラウザ側で行う */}
      <Suspense
        fallback={
          <CategoryAudienceFallback
            slug={slug}
            allPosts={allPosts}
            categories={categories}
          />
        }
      >
        <CategoryAudienceView
          slug={slug}
          allPosts={allPosts}
          categories={categories}
        />
      </Suspense>

      <LineCta />
    </div>
  )
}
