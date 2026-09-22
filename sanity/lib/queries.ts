import { groq } from 'next-sanity'

// 一覧の並び順。更新した記事が上に来るようにするため、
// 更新日が入っていればそれを、無ければ公開日を使って新しい順に並べる。
const listOrder = 'order(coalesce(updatedAt, publishedAt) desc)'

// 一覧のカードに出す項目
const listFields = `
    _id,
    title,
    slug,
    excerpt,
    publishedAt,
    updatedAt,
    mainImage,
    audience,
    category-> { title, slug },
    tags
`

// 記事一覧（一覧ページ用）
export const postsQuery = groq`
  *[_type == "post" && defined(slug.current)] | ${listOrder} {${listFields}}
`

// カテゴリ別記事一覧
export const postsByCategoryQuery = groq`
  *[_type == "post" && category->slug.current == $categorySlug && defined(slug.current)] | ${listOrder} {${listFields}}
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
    updatedAt,
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
      updatedAt,
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

// 新着記事（記事下・サイドバー用）
export const recentPostsQuery = groq`
  *[_type == "post" && defined(slug.current)] | ${listOrder}[0...5] {
    _id,
    title,
    slug,
    publishedAt,
    updatedAt,
    mainImage
  }
`
