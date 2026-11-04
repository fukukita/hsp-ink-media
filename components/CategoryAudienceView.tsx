'use client'

import { useSearchParams } from 'next/navigation'
import PostCard from './PostCard'

type Audience = 'hsp' | 'hss-hsp' | 'both'
type Filter = Audience | 'all'

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

type Category = {
  _id: string
  title: string
  slug: { current: string }
  description: string | null
}

type Props = {
  slug: string
  allPosts: Post[]
  categories: Category[]
}

const AUDIENCE_TABS: { value: Filter; label: string }[] = [
  { value: 'all', label: 'すべて' },
  { value: 'hss-hsp', label: 'HSS型HSP向け' },
  { value: 'hsp', label: 'HSP向け' },
]

// タブ・テーマの並び・記事一覧をまとめて描く。
// 「URLを読んで絞り込む側」と「読み込み中に出す側」で中身を使い回す
function View({ slug, allPosts, categories, audience }: Props & { audience: Filter }) {
  const posts =
    audience === 'all'
      ? allPosts
      : allPosts.filter((p) => p.audience === audience || p.audience === 'both')

  return (
    <>
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
    </>
  )
}

// 書き出し方式（output: "export"）では、?audience= の中身を build のときに知れない。
// そのため絞り込みはブラウザ側で行う。URL の形と見た目は今までと同じ
export default function CategoryAudienceView(props: Props) {
  const params = useSearchParams()
  const value = params.get('audience')
  const audience: Filter =
    value === 'hsp' || value === 'hss-hsp' ? value : 'all'
  return <View {...props} audience={audience} />
}

// URL を読む前に出しておく分。書き出した HTML には「すべて」の一覧が入る
export function CategoryAudienceFallback(props: Props) {
  return <View {...props} audience="all" />
}
