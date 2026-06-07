import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'プライバシーポリシー',
  description: 'HSP Partner（ふくきた）のプライバシーポリシーです。',
  robots: { index: false },
}

const h2 = 'font-serif text-lg sm:text-xl font-bold text-ink mt-10 mb-3 border-l-4 border-brand-400 pl-4 leading-snug'
const p = 'leading-[1.9] text-gray-700 mb-4'

export default function PrivacyPage() {
  return (
    <div className="max-w-3xl mx-auto px-5 sm:px-6 py-12">
      <nav className="text-sm text-gray-400 mb-6 flex gap-2">
        <a href="/" className="hover:text-brand-600">トップ</a>
        <span>›</span>
        <span className="text-gray-600">プライバシーポリシー</span>
      </nav>

      <h1 className="font-serif text-2xl sm:text-3xl font-bold text-ink mb-2 leading-snug">
        プライバシーポリシー
      </h1>
      <p className="text-gray-500 text-sm mb-10">制定日：2026年6月7日</p>

      <p className={p}>
        ふくきた（以下「当方」）は、HSP Partner（https://hsp.ink、以下「当サイト」）における個人情報の取り扱いについて、以下のとおりプライバシーポリシー（以下「本ポリシー」）を定めます。
      </p>

      <h2 className={h2}>1. 収集する情報</h2>
      <p className={p}>当サイトでは、以下の情報を収集することがあります。</p>
      <ul className="space-y-2 mb-5 pl-1">
        {[
          'お問い合わせ時にご入力いただいた氏名・メールアドレス・お問い合わせ内容',
          'サービスご利用時にご提供いただいた氏名・連絡先・決済に必要な情報',
          'アクセス解析ツールを通じて収集されるIPアドレス・閲覧ページ・利用端末等の情報',
        ].map((t) => (
          <li key={t} className="flex gap-3 text-gray-700 leading-[1.8] text-sm">
            <span className="mt-[0.7em] h-1.5 w-1.5 rounded-full bg-brand-400 shrink-0" />
            <span>{t}</span>
          </li>
        ))}
      </ul>

      <h2 className={h2}>2. 個人情報の利用目的</h2>
      <p className={p}>収集した個人情報は、以下の目的のみに使用します。</p>
      <ul className="space-y-2 mb-5 pl-1">
        {[
          'お問い合わせへの回答・連絡',
          'サービスのご提供および決済処理',
          '当サイト・サービスの改善・運営',
        ].map((t) => (
          <li key={t} className="flex gap-3 text-gray-700 leading-[1.8] text-sm">
            <span className="mt-[0.7em] h-1.5 w-1.5 rounded-full bg-brand-400 shrink-0" />
            <span>{t}</span>
          </li>
        ))}
      </ul>

      <h2 className={h2}>3. 個人情報の第三者提供</h2>
      <p className={p}>
        当方は、以下の場合を除き、収集した個人情報を第三者に提供しません。
      </p>
      <ul className="space-y-2 mb-5 pl-1">
        {[
          'ご本人の同意がある場合',
          '法令に基づき開示が必要な場合',
          'サービス提供に必要な業務委託先に開示する場合（秘密保持義務を課したうえで）',
        ].map((t) => (
          <li key={t} className="flex gap-3 text-gray-700 leading-[1.8] text-sm">
            <span className="mt-[0.7em] h-1.5 w-1.5 rounded-full bg-brand-400 shrink-0" />
            <span>{t}</span>
          </li>
        ))}
      </ul>

      <h2 className={h2}>4. アクセス解析ツールについて</h2>
      <p className={p}>
        当サイトでは、Googleが提供するアクセス解析ツール「Googleアナリティクス」を使用しています。Googleアナリティクスは、Cookieを使用してデータを収集します。収集されたデータは匿名で処理され、個人を特定するものではありません。
      </p>
      <p className={p}>
        Cookieの使用を無効化したい場合は、お使いのブラウザの設定からCookieを無効にするか、
        <a
          href="https://tools.google.com/dlpage/gaoptout"
          target="_blank"
          rel="noopener noreferrer"
          className="text-brand-600 underline hover:text-brand-700"
        >
          Googleアナリティクス オプトアウトアドオン
        </a>
        をご利用ください。
      </p>
      <p className={p}>
        Googleのデータ収集・処理に関する詳細は、
        <a
          href="https://policies.google.com/privacy"
          target="_blank"
          rel="noopener noreferrer"
          className="text-brand-600 underline hover:text-brand-700"
        >
          Googleプライバシーポリシー
        </a>
        をご確認ください。
      </p>

      <h2 className={h2}>5. 免責事項</h2>
      <p className={p}>
        当サイトのコンテンツは情報提供を目的としており、特定の結果を保証するものではありません。当サイトのご利用により生じた損害について、当方は責任を負いかねます。
      </p>
      <p className={p}>
        また、当サイトに掲載されているリンク先の外部サービス・ウェブサイトのプライバシー取り扱いについて、当方は責任を負いません。
      </p>

      <h2 className={h2}>6. お問い合わせ</h2>
      <p className={p}>
        本ポリシーに関するお問い合わせは、下記までご連絡ください。
      </p>
      <p className="text-sm text-gray-700 leading-relaxed bg-gray-50 rounded-xl p-4">
        屋号：ふくきた<br />
        メールアドレス：fukukita.dev［at］gmail.com<br />
        <span className="text-xs text-gray-500">※迷惑メール防止のため［at］と表記しています。送信時は［at］を @ に置き換えてください。</span>
      </p>

      <h2 className={h2}>7. 本ポリシーの改定</h2>
      <p className={p}>
        当方は、必要に応じて本ポリシーを改定することがあります。改定後のポリシーは、当ページへの掲載をもって効力を生じるものとします。
      </p>
    </div>
  )
}
