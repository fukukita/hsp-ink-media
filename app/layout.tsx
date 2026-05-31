import type { Metadata } from 'next'
import { Noto_Serif_JP, Noto_Sans_JP } from 'next/font/google'
import './globals.css'

const notoSerifJP = Noto_Serif_JP({
  variable: '--font-serif-jp',
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  display: 'swap',
})

const notoSansJP = Noto_Sans_JP({
  variable: '--font-sans-jp',
  subsets: ['latin'],
  weight: ['300', '400', '500', '700'],
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    default: 'hsp.ink｜HSS型HSPの生き方メディア',
    template: '%s | hsp.ink',
  },
  description:
    'HSS型HSPの気質を活かして、自分らしく生きるためのヒントをお届けするメディアです。',
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || 'https://hsp.ink'
  ),
  openGraph: {
    siteName: 'hsp.ink',
    locale: 'ja_JP',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html
      lang="ja"
      className={`${notoSerifJP.variable} ${notoSansJP.variable}`}
    >
      <body className="min-h-screen flex flex-col bg-white text-gray-800 antialiased">
        <header className="border-b border-gray-100">
          <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
            <a href="/" className="text-xl font-bold text-indigo-700">
              hsp.ink
            </a>
            <nav className="flex gap-4 text-sm text-gray-600 flex-wrap">
              <a href="/category/hss-hsp" className="hover:text-indigo-700 transition-colors">HSS型HSPとは</a>
              <a href="/category/work" className="hover:text-indigo-700 transition-colors">仕事・キャリア</a>
              <a href="/category/relationships" className="hover:text-indigo-700 transition-colors">人間関係</a>
              <a href="/category/habits" className="hover:text-indigo-700 transition-colors">消耗しない習慣</a>
              <a href="/category/strengths" className="hover:text-indigo-700 transition-colors">強みを活かす</a>
            </nav>
          </div>
        </header>
        <main className="flex-1">{children}</main>
        <footer className="border-t border-gray-100 py-8 mt-16">
          <div className="max-w-4xl mx-auto px-4 text-center text-sm text-gray-400">
            <p>© 2026 hsp.ink All rights reserved.</p>
          </div>
        </footer>
      </body>
    </html>
  )
}
