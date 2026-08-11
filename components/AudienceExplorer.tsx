'use client'

import { useState } from 'react'
import PostCard from './PostCard'

type Audience = 'hsp' | 'hss-hsp' | 'both'

type Post = {
  _id: string
  title: string
  slug: { current: string }
  excerpt: string | null
  publishedAt: string | null
  mainImage: unknown
  audience?: Audience
  category: { title: string; slug: { current: string } } | null
}

type Category = {
  _id: string
  title: string
  slug: { current: string }
  description: string | null
}

const TABS: { value: Audience; label: string }[] = [
  { value: 'hss-hsp', label: 'HSS型HSP向け' },
  { value: 'hsp', label: 'HSP向け' },
]

export default function AudienceExplorer({
  posts,
  categories,
}: {
  posts: Post[]
  categories: Category[]
}) {
  const [audience, setAudience] = useState<Audience>('hss-hsp')

  const filteredPosts = posts
    .filter((p) => p.audience === audience || p.audience === 'both')
    .slice(0, 3)

  // 選択中の対象読者に記事が1本もないテーマは、探す一覧から外す
  const visibleCategories = categories.filter((cat) =>
    posts.some(
      (p) =>
        p.category?.slug.current === cat.slug.current &&
        (p.audience === audience || p.audience === 'both')
    )
  )

  return (
    <>
      {/* ===== 読者切り替えタブ ===== */}
      <section className="mb-14">
        <div
          role="tablist"
          aria-label="対象読者で切り替える"
          className="inline-flex p-1 rounded-full bg-gray-100"
        >
          {TABS.map((tab) => (
            <button
              key={tab.value}
              role="tab"
              type="button"
              aria-selected={audience === tab.value}
              onClick={() => setAudience(tab.value)}
              className={`px-5 py-2 rounded-full text-sm font-bold transition-colors ${
                audience === tab.value
                  ? 'bg-white text-brand-600 shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
        <p className="mt-3 text-xs text-gray-400">
          「刺激も求めるのに、繊細」という方はHSS型HSP向けをご覧ください。
        </p>
      </section>

      {/* ===== 新着記事 ===== */}
      <section className="mb-16">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-serif text-xl font-bold text-ink">新着記事</h2>
          <a
            href="/posts"
            className="text-sm text-brand-600 hover:text-brand-700 transition-colors font-medium"
          >
            すべて見る →
          </a>
        </div>
        {filteredPosts.length === 0 ? (
          <p className="text-gray-400 text-sm py-10 text-center rounded-2xl bg-gray-50">
            HSP向けの記事は近日公開予定です。もうしばらくお待ちください。
          </p>
        ) : (
          <div className="grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
            {filteredPosts.map((post) => (
              <PostCard key={post._id} post={post} />
            ))}
          </div>
        )}
      </section>

      {/* ===== テーマから探す ===== */}
      {visibleCategories.length > 0 && (
        <section>
          <h2 className="font-serif text-xl font-bold text-ink mb-6">テーマから探す</h2>
          <div className="flex flex-wrap gap-3">
            {visibleCategories.map((cat) => (
              <a
                key={cat._id}
                href={`/category/${cat.slug.current}?audience=${audience}`}
                className="px-5 py-2.5 rounded-full border border-gray-200 text-sm text-gray-600 bg-white hover:border-brand-400 hover:text-brand-600 transition-all"
              >
                {cat.title}
              </a>
            ))}
          </div>
        </section>
      )}
    </>
  )
}
