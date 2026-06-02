import { revalidatePath } from 'next/cache'
import { type NextRequest, NextResponse } from 'next/server'

// Sanityからのwebhookを受け取り、関連ページのキャッシュを破棄する
export async function POST(req: NextRequest) {
  const secret = req.nextUrl.searchParams.get('secret')

  // シークレットキーの確認
  if (secret !== process.env.SANITY_REVALIDATE_SECRET) {
    return NextResponse.json({ message: 'Invalid secret' }, { status: 401 })
  }

  try {
    // 全ページを再生成対象にする
    revalidatePath('/', 'layout')

    return NextResponse.json({ revalidated: true, now: Date.now() })
  } catch (err) {
    return NextResponse.json(
      { message: 'Error revalidating', err },
      { status: 500 }
    )
  }
}
