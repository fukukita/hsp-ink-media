import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '特定商取引法に基づく表記',
  description: 'HSP Partner（ふくきた）の特定商取引法に基づく表記ページです。',
  robots: { index: false },
}

const th = 'py-3 px-4 text-left text-sm font-bold text-gray-700 bg-gray-50 w-36 sm:w-48 shrink-0 border-b border-gray-200'
const td = 'py-3 px-4 text-sm text-gray-700 leading-relaxed border-b border-gray-200'

export default function TokushohoPage() {
  return (
    <div className="max-w-3xl mx-auto px-5 sm:px-6 py-12">
      <nav className="text-sm text-gray-400 mb-6 flex gap-2">
        <a href="/" className="hover:text-brand-600">トップ</a>
        <span>›</span>
        <span className="text-gray-600">特定商取引法に基づく表記</span>
      </nav>

      <h1 className="font-serif text-2xl sm:text-3xl font-bold text-ink mb-10 leading-snug">
        特定商取引法に基づく表記
      </h1>

      <div className="rounded-2xl border border-gray-200 overflow-hidden">
        <table className="w-full border-collapse">
          <tbody>
            <tr className="flex flex-col sm:flex-row">
              <th className={th} scope="row">販売業者</th>
              <td className={td}>ふくきた</td>
            </tr>
            <tr className="flex flex-col sm:flex-row">
              <th className={th} scope="row">責任者氏名</th>
              <td className={td}>ふくきた</td>
            </tr>
            <tr className="flex flex-col sm:flex-row">
              <th className={th} scope="row">所在地</th>
              <td className={td}>請求があった場合に遅滞なく開示します</td>
            </tr>
            <tr className="flex flex-col sm:flex-row">
              <th className={th} scope="row">電話番号</th>
              <td className={td}>請求があった場合に遅滞なく開示します</td>
            </tr>
            <tr className="flex flex-col sm:flex-row">
              <th className={th} scope="row">メールアドレス</th>
              <td className={td}>
                fukukita.dev［at］gmail.com
                <br />
                <span className="text-xs text-gray-500">※迷惑メール防止のため［at］と表記しています。送信時は［at］を @ に置き換えてください。</span>
              </td>
            </tr>
            <tr className="flex flex-col sm:flex-row">
              <th className={th} scope="row">販売価格</th>
              <td className={td}>個別セッション　20,000円（税込）/ 60分</td>
            </tr>
            <tr className="flex flex-col sm:flex-row">
              <th className={th} scope="row">支払方法</th>
              <td className={td}>クレジットカード・銀行振込</td>
            </tr>
            <tr className="flex flex-col sm:flex-row">
              <th className={th} scope="row">支払時期</th>
              <td className={td}>サービス提供前にお支払いください</td>
            </tr>
            <tr className="flex flex-col sm:flex-row">
              <th className={th} scope="row">サービス提供時期</th>
              <td className={td}>決済確認後、日程調整のうえ実施します</td>
            </tr>
            <tr className="flex flex-col sm:flex-row border-b-0">
              <th className={`${th} border-b-0`} scope="row">キャンセル・返金</th>
              <td className={`${td} border-b-0`}>
                サービスの性質上、決済完了後のキャンセル・返金は原則お受けできません。
                <br />
                ただし、当方都合によるキャンセルの場合は全額返金いたします。
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  )
}
