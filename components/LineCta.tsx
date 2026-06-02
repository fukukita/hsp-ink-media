import { LINE_URL } from '@/lib/site'

export default function LineCta() {
  return (
    <section className="mt-16 rounded-2xl overflow-hidden bg-gradient-to-br from-brand-500 to-brand-700">
      <div className="px-8 py-10 sm:px-12 sm:py-12 lg:flex lg:items-center lg:gap-12">

        {/* テキスト */}
        <div className="flex-1 mb-8 lg:mb-0">
          <span className="inline-block bg-white/20 text-white text-sm font-bold px-4 py-1.5 rounded-full mb-5 tracking-wide">
            🎁 無料プレゼント
          </span>
          <h2 className="text-white text-2xl sm:text-3xl font-bold leading-snug mb-4">
            気質を活かすヒントを<br className="sm:hidden" />LINEで受け取る
          </h2>
          <p className="text-white/80 text-sm leading-relaxed">
            飽きてしまう、疲れやすい、動けない。<br />
            HSS型HSPの「なぜ」が腑に落ちると、<br />
            自分への見方が少し変わります。
          </p>
        </div>

        {/* ボタン */}
        <div className="lg:shrink-0">
          <a
            href={LINE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="cta-btn relative inline-flex items-center justify-center gap-2 bg-white text-brand-600 font-bold py-4 px-10 rounded-full text-base shadow-lg overflow-hidden"
          >
            {/* シマーアニメーション */}
            <span className="cta-btn-shimmer" aria-hidden="true" />
            LINE登録して特典を受け取る
          </a>
          <p className="text-white/60 text-xs text-center mt-3 lg:text-left">
            登録無料・いつでも解除できます
          </p>
        </div>

      </div>
    </section>
  )
}
