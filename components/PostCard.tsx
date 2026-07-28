import Image from 'next/image'
import { urlForImage } from '@/sanity/lib/image'

type Post = {
  _id: string
  title: string
  slug: { current: string }
  excerpt: string | null
  publishedAt: string | null
  mainImage?: unknown
  category: { title: string; slug: { current: string } } | null
}

export default function PostCard({ post }: { post: Post }) {
  const imageUrl = post.mainImage
    ? urlForImage(post.mainImage)?.width(800).height(450).url()
    : null

  return (
    <a
      href={`/posts/${post.slug.current}`}
      className="group block rounded-2xl overflow-hidden border border-brand-100 bg-white hover:shadow-lg hover:border-brand-200 transition-all"
    >
      {/* アイキャッチ画像エリア（画像が無いときはブランドのグラデーション） */}
      <div className="relative aspect-[16/9] overflow-hidden bg-gradient-to-br from-brand-100 to-brand-300">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={post.title}
            fill
            sizes="(max-width: 640px) 100vw, 400px"
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          // 画像が無いときのプレースホルダー（寄り添う2つの円モチーフ）
          <div className="absolute inset-0 flex items-center justify-center">
            <svg width="56" height="56" viewBox="0 0 40 40" fill="none" className="opacity-60">
              <circle cx="16" cy="20" r="11" fill="#ffffff" fillOpacity="0.7" />
              <circle cx="24" cy="20" r="11" fill="#ffffff" fillOpacity="0.5" />
            </svg>
          </div>
        )}
      </div>

      <div className="p-5">
        {post.category && (
          <span className="text-xs text-brand-600 font-medium bg-brand-50 px-2 py-0.5 rounded-full">
            {post.category.title}
          </span>
        )}
        <h3 className="mt-2 font-bold text-ink leading-snug line-clamp-2 min-h-[2.75rem] group-hover:text-brand-600 transition-colors">
          {post.title}
        </h3>
        {post.publishedAt && (
          <p className="mt-3 text-xs text-gray-400">
            {new Date(post.publishedAt).toLocaleDateString('ja-JP')}
          </p>
        )}
      </div>
    </a>
  )
}
