type Post = {
  _id: string
  title: string
  slug: { current: string }
  excerpt: string | null
  publishedAt: string | null
  category: { title: string; slug: { current: string } } | null
}

export default function PostCard({ post }: { post: Post }) {
  return (
    <a
      href={`/posts/${post.slug.current}`}
      className="block border border-gray-100 rounded-xl p-5 hover:shadow-md transition-shadow"
    >
      {post.category && (
        <span className="text-xs text-indigo-600 font-medium bg-indigo-50 px-2 py-0.5 rounded-full">
          {post.category.title}
        </span>
      )}
      <h3 className="mt-2 font-bold text-gray-800 leading-snug line-clamp-2">
        {post.title}
      </h3>
      {post.excerpt && (
        <p className="mt-2 text-sm text-gray-500 line-clamp-3">{post.excerpt}</p>
      )}
      {post.publishedAt && (
        <p className="mt-3 text-xs text-gray-400">
          {new Date(post.publishedAt).toLocaleDateString('ja-JP')}
        </p>
      )}
    </a>
  )
}
