import Image from 'next/image'
import { LINE_URL } from '@/lib/site'

// 記事下（LINE CTAの下）に置く著者ボックス。
// E-E-A-T（経験・権威・信頼）を補強し、プロフィールページと公式LINEへ橋渡しする。
export default function AuthorBox() {
  return (
    <section className="mt-12 rounded-2xl border border-gray-200 bg-gray-50/70 p-6 sm:p-7">
      <div className="flex flex-col sm:flex-row sm:items-start gap-5">
        {/* アバター（後ろ姿の写真。顔出しNGでも世界観を保てる） */}
        <Image
          src="/images/fukukita01.jpg"
          alt="ふくきた｜才気道 家元"
          width={96}
          height={96}
          className="rounded-2xl object-cover w-20 h-20 sm:w-24 sm:h-24 shrink-0"
        />

        <div className="flex-1">
          <p className="text-xs text-brand-600 font-bold mb-1">この記事を書いた人</p>
          <p className="font-bold text-ink mb-2">ふくきた｜才気道 家元</p>
          <p className="text-sm text-gray-600 leading-relaxed mb-4">
            HSS型HSP当事者。好奇心旺盛なのに繊細、社交的に見えて実は人見知り——いくつもの矛盾した気質を抱えて生きてきました。短期離職や営業職での挫折を重ねるなかで自己理解を深め、今は独自メソッド（才気道）の開発と普及に取り組んでいます。
          </p>
          <div className="flex flex-wrap gap-x-5 gap-y-2">
            <a
              href="/about"
              className="text-sm font-bold text-brand-600 hover:text-brand-700 border-b-2 border-brand-300 hover:border-brand-500 pb-0.5 transition-colors"
            >
              プロフィールを見る →
            </a>
            <a
              href={LINE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-bold text-green-600 hover:text-green-700 border-b-2 border-green-300 hover:border-green-500 pb-0.5 transition-colors"
            >
              公式LINEを受け取る →
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
