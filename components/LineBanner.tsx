import Image from 'next/image'
import { LINE_URL } from '@/lib/site'

// リード文直後に置く、コンパクトなLINE誘導バナー。
// HSS型HSP向けのベネフィットを短く提示し、公式LINE登録へ橋渡しする。
export default function LineBanner() {
  return (
    <aside className="my-8 rounded-2xl border border-brand-200 bg-gradient-to-br from-brand-50 to-brand-100 p-5 sm:p-6">

      {/* バッジ＋見出し */}
      <span className="inline-block bg-white/70 text-brand-700 text-xs font-bold px-3 py-1 rounded-full mb-3">
        HSS型HSP向け・無料
      </span>
      <p className="text-ink font-bold text-base sm:text-lg leading-snug mb-4">
        「飽き」「疲れ」「頭のゴチャゴチャ」を武器に変える
      </p>

      {/* イラスト（左）＋ 箇条書き・ボタン（右） */}
      <div className="flex items-start gap-4">
        {/* 左：イラスト */}
        <Image
          src="/images/Illustration-for-linepromotion-banner01.jpg"
          alt="スマホを見てほっとしている女性のイラスト"
          width={110}
          height={110}
          className="rounded-xl object-cover shrink-0"
        />
        {/* 右：箇条書き＋ボタン */}
        <div className="flex-1">
          <ul className="space-y-2 mb-4">
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
          <a
            href={LINE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-5 rounded-full shadow-sm transition-colors text-sm w-full"
          >
            LINEで無料で受け取る <span aria-hidden>→</span>
          </a>
          <p className="text-[11px] text-gray-500 text-center mt-2">
            登録無料・いつでも解除OK
          </p>
        </div>
      </div>

    </aside>
  )
}
