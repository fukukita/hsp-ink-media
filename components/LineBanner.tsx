import Image from 'next/image'
import { LINE_URL } from '@/lib/site'

// リード文直後に置く、コンパクトなLINE誘導バナー。
// PC: 左60%（バッジ・キャッチ・イラスト）／右40%（箇条書き・ボタン）
// モバイル: 1列縦積み
export default function LineBanner() {
  return (
    <aside className="my-8 rounded-2xl border border-brand-200 bg-gradient-to-br from-brand-50 to-brand-100 p-5 sm:p-6">
      <div className="sm:flex sm:gap-6 sm:items-start">

        {/* 左列：バッジ・キャッチ・イラスト（PC: 60%） */}
        <div className="sm:w-[60%] mb-5 sm:mb-0">
          <span className="inline-block bg-white/70 text-brand-700 text-xs font-bold px-3 py-1 rounded-full mb-3">
            HSS型HSP向け・無料
          </span>
          <p className="text-ink font-bold text-base sm:text-lg leading-snug mb-4">
            「飽き」「疲れ」「頭のゴチャゴチャ」を武器に変える
          </p>
          <Image
            src="/images/Illustration-for-linepromotion-banner01.jpg"
            alt="スマホを見てほっとしている女性のイラスト"
            width={130}
            height={130}
            className="rounded-xl object-cover"
          />
        </div>

        {/* 右列：箇条書き・ボタン（PC: 40%） */}
        <div className="sm:w-[40%] flex flex-col justify-center">
          <ul className="space-y-2.5 mb-5">
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
            className="inline-flex items-center justify-center gap-1.5 bg-green-500 hover:bg-green-600 text-white font-bold py-2.5 px-5 rounded-full shadow-sm transition-colors text-sm whitespace-nowrap self-start sm:self-auto"
          >
            LINEで無料で受け取る <span aria-hidden>→</span>
          </a>
          <p className="text-[11px] text-gray-500 mt-2">
            登録無料・いつでも解除OK
          </p>
        </div>

      </div>
    </aside>
  )
}
