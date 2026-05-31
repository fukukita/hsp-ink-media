// LINE誘導CTAコンポーネント
// saikido.org/tokutenへ誘導する共通バナー

const LINE_URL = 'https://saikido.org/tokuten'

export default function LineCta() {
  return (
    <section className="mt-16 bg-green-50 border border-green-200 rounded-2xl p-8 text-center">
      <p className="text-sm text-green-700 font-medium mb-2">＼ 無料プレゼント ／</p>
      <h2 className="text-xl font-bold text-gray-800 mb-3">
        HSS型HSPの強みを活かす<br />
        公式LINEに登録して特典を受け取る
      </h2>
      <p className="text-sm text-gray-600 mb-6 max-w-sm mx-auto">
        自分の気質を理解して、消耗しない生き方のヒントを
        LINEでお届けしています。登録は無料です。
      </p>
      <a
        href={LINE_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-block bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-8 rounded-full transition-colors text-sm"
      >
        LINE登録して特典を受け取る →
      </a>
    </section>
  )
}
