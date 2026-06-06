import Image from 'next/image'
import { LINE_URL } from '@/lib/site'

// リード文直後に置く、LINE誘導バナー。
// PC : 左にイラスト（視線のアンカー）／右にテキストを上→下へ自然に配置
//      （バッジ → タイトル → 箇条書き → ボタン → 注記）
// SP : 1列縦積み（イラストを上・以降テキストを順に）
export default function LineBanner() {
  return (
    <aside className="my-8 rounded-2xl border border-brand-200 bg-gradient-to-br from-brand-50 to-brand-100 p-5 sm:p-7">
      <div className="flex flex-col items-center text-center sm:flex-row sm:items-center sm:text-left sm:gap-7">

        {/* イラスト（SP: 上・中央／PC: 左・大きめ） */}
        <Image
          src="/images/Illustration-for-linepromotion-banner01.jpg"
          alt="スマホを見てほっとしている女性のイラスト"
          width={180}
          height={180}
          className="rounded-2xl object-cover shrink-0 w-32 h-32 sm:w-44 sm:h-44 mb-5 sm:mb-0"
        />

        {/* テキスト（バッジ → タイトル → 箇条書き → ボタン → 注記） */}
        <div className="w-full">
          <span className="inline-block bg-white/70 text-brand-700 text-xs font-bold px-3 py-1 rounded-full mb-3">
            HSS型HSP向け・無料
          </span>
          <p className="text-ink font-bold text-base sm:text-lg leading-snug mb-4">
            「飽き」「疲れ」「頭のゴチャゴチャ」を武器に変える
          </p>

          <ul className="space-y-2 mb-5 inline-block text-left">
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

          <div>
            <a
              href={LINE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-7 rounded-full shadow-sm transition-colors whitespace-nowrap"
            >
              LINEで無料で受け取る <span aria-hidden>→</span>
            </a>
            <p className="text-[11px] text-gray-500 mt-2">
              登録無料・いつでも解除OK
            </p>
          </div>
        </div>

      </div>
    </aside>
  )
}
