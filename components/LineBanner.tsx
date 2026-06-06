import Image from 'next/image'
import { LINE_URL } from '@/lib/site'

// リード文直後に置く、コンパクトなLINE誘導バナー。
// HSS型HSP向けのベネフィットを短く提示し、公式LINE登録へ橋渡しする。
export default function LineBanner() {
  return (
    <aside className="my-8 rounded-2xl border border-brand-200 bg-gradient-to-br from-brand-50 to-brand-100 p-5 sm:p-6">
      <div className="sm:flex sm:items-center sm:gap-6">

        {/* テキスト（左列・flex-1） */}
        <div className="flex-1 mb-5 sm:mb-0">
          <span className="inline-block bg-white/70 text-brand-700 text-xs font-bold px-3 py-1 rounded-full mb-3">
            HSS型HSP向け・無料
          </span>
          <p className="text-ink font-bold text-base sm:text-lg leading-snug mb-3">
            「飽き」「疲れ」「頭のゴチャゴチャ」を武器に変える
          </p>
          <ul className="space-y-1.5">
            {[
              '頭の「引き算」整理術',
              '飽きを才能に変えるヒント',
              '自分に合う働き方の見つけ方',
            ].map((b) => (
              <li key={b} className="flex items-start gap-2 text-sm text-gray-700 leading-snug">
                <span className="mt-[0.45em] h-1.5 w-1.5 rounded-full bg-brand-400 shrink-0" />
                <span>{b}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* イラスト＋ボタン（右列・shrink-0） */}
        <div className="sm:shrink-0 flex flex-col items-center gap-3">
          {/* モバイルでは非表示、PCのみ表示 */}
          <div className="hidden sm:block">
            <Image
              src="/images/Illustration-for-linepromotion-banner01.jpg"
              alt="スマホを見てほっとしている女性のイラスト"
              width={110}
              height={110}
              className="rounded-xl object-cover"
            />
          </div>
          {/* モバイルでは上に表示 */}
          <div className="block sm:hidden mb-1">
            <Image
              src="/images/Illustration-for-linepromotion-banner01.jpg"
              alt="スマホを見てほっとしている女性のイラスト"
              width={100}
              height={100}
              className="rounded-xl object-cover mx-auto"
            />
          </div>
          <div>
            <a
              href={LINE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 rounded-full shadow-sm whitespace-nowrap transition-colors text-sm"
            >
              LINEで無料で受け取る <span aria-hidden>→</span>
            </a>
            <p className="text-[11px] text-gray-500 text-center mt-2">
              登録無料・いつでも解除OK
            </p>
          </div>
        </div>

      </div>
    </aside>
  )
}
