import type { Metadata } from 'next'

// URLが変わった記事や、打ち間違いでたどり着いた人に出すページ。
// 書き出し方式（output: "export"）では、これが out/404.html になる。
export const metadata: Metadata = {
  title: 'ページが見つかりません',
  robots: { index: false },
}

const CATEGORIES = [
  { slug: 'hss-hsp', title: '気質を知る' },
  { slug: 'work', title: '仕事・キャリア' },
  { slug: 'relationships', title: '人間関係' },
  { slug: 'habits', title: '消耗しない習慣' },
  { slug: 'strengths', title: '強みを活かす' },
  { slug: 'mind-care', title: '心の整え方' },
]

export default function NotFound() {
  return (
    <div className="max-w-3xl mx-auto px-5 sm:px-6 py-20 sm:py-28">
      <p className="text-sm font-bold tracking-[0.2em] text-brand-500 mb-4">404</p>

      <h1 className="font-serif text-2xl sm:text-3xl font-bold text-ink mb-5 leading-snug">
        お探しのページが見つかりませんでした
      </h1>

      <p className="leading-[1.9] text-gray-700 mb-10">
        ページが移動したか、URLが変わった可能性があります。
        お手数ですが、記事一覧かテーマからお探しください。
      </p>

      <div className="flex flex-wrap gap-3 mb-12">
        <a
          href="/posts"
          className="inline-flex items-center gap-2 text-sm font-bold bg-brand-500 hover:bg-brand-600 text-white px-6 py-3 rounded-full transition-colors"
        >
          記事一覧を見る <span aria-hidden>→</span>
        </a>
        <a
          href="/"
          className="inline-flex items-center gap-2 text-sm font-bold text-gray-600 border border-gray-200 hover:border-brand-400 hover:text-brand-600 px-6 py-3 rounded-full transition-colors"
        >
          トップへ戻る
        </a>
      </div>

      <h2 className="font-serif text-lg font-bold text-ink mb-4">テーマから探す</h2>
      <div className="flex flex-wrap gap-2.5">
        {CATEGORIES.map((cat) => (
          <a
            key={cat.slug}
            href={`/category/${cat.slug}`}
            className="px-4 py-2 rounded-full border border-gray-200 text-sm text-gray-600 bg-white hover:border-brand-400 hover:text-brand-600 transition-all"
          >
            {cat.title}
          </a>
        ))}
      </div>
    </div>
  )
}
