import { revalidatePath } from 'next/cache'
import { type NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const secret = req.nextUrl.searchParams.get('secret')

  if (secret !== process.env.SANITY_REVALIDATE_SECRET) {
    return NextResponse.json({ message: 'Invalid secret' }, { status: 401 })
  }

  try {
    // 全ページのキャッシュを破棄して再生成を強制する
    revalidatePath('/', 'layout')   // 全ページ共通
    revalidatePath('/', 'page')     // トップページ
    revalidatePath('/posts', 'page') // 記事一覧

    return NextResponse.json({ revalidated: true, now: Date.now() })
  } catch (err) {
    return NextResponse.json(
      { message: 'Error revalidating', err },
      { status: 500 }
    )
  }
}
