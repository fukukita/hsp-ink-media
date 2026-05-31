import { groq } from 'next-sanity'

// 記事一覧（一覧ページ用）
export const postsQuery = groq`
  *[_type == "post" && defined(slug.current)] | order(publishedAt desc) {
    _id,
    title,
    slug,
    excerpt,
    publishedAt,
    mainImage,
    category-> { title, slug },
    tags
  }
`

// カテゴリ別記事一覧
export const postsByCategoryQuery = groq`
  *[_type == "post" && category->slug.current == $categorySlug && defined(slug.current)] | order(publishedAt desc) {
    _id,
    title,
    slug,
    excerpt,
    publishedAt,
    mainImage,
    category-> { title, slug },
    tags
  }
`

// 記事詳細（単一記事）
export const postBySlugQuery = groq`
  *[_type == "post" && slug.current == $slug][0] {
    _id,
    title,
    slug,
    excerpt,
    body,
    publishedAt,
    mainImage,
    category-> { title, slug },
    tags,
    seoTitle,
    seoDescription,
    relatedPosts[]-> {
      _id,
      title,
      slug,
      excerpt,
      publishedAt,
      mainImage,
      category-> { title, slug }
    }
  }
`

// カテゴリ一覧
export const categoriesQuery = groq`
  *[_type == "category"] | order(title asc) {
    _id,
    title,
    slug,
    description
  }
`

// 人気記事（サイドバー・フッター用）
export const recentPostsQuery = groq`
  *[_type == "post" && defined(slug.current)] | order(publishedAt desc)[0...5] {
    _id,
    title,
    slug,
    publishedAt,
    mainImage
  }
`
