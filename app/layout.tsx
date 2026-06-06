import type { Metadata } from 'next'
import { Noto_Serif_JP, Noto_Sans_JP } from 'next/font/google'
import Logo from '@/components/Logo'
import StickyLineFooter from '@/components/StickyLineFooter'
import { LINE_URL } from '@/lib/site'
import {
  GoogleTagManagerScript,
  GoogleTagManagerNoScript,
} from '@/components/GoogleTagManager'
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
    default: 'HSP Partner｜HSS型HSPに寄り添うメディア',
    template: '%s | HSP Partner',
  },
  description:
    'HSS型HSPの気質を活かして、自分らしく生きるためのヒントをお届けするメディアです。',
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || 'https://hsp.ink'
  ),
  openGraph: {
    siteName: 'HSP Partner',
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
      <body className="min-h-screen flex flex-col bg-white text-gray-800 antialiased overflow-x-hidden pb-28 sm:pb-0">
        <GoogleTagManagerScript />
        <GoogleTagManagerNoScript />
        <header className="border-b border-gray-100 bg-white/90 backdrop-blur-md sticky top-0 z-20">
          <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between gap-6">
            <a href="/" aria-label="HSP Partner トップへ" className="shrink-0">
              <Logo />
            </a>
            <nav className="hidden lg:flex items-center gap-1 text-sm text-gray-600">
              <a href="/category/hss-hsp" className="px-3.5 py-2 rounded-lg hover:bg-brand-50 hover:text-brand-600 transition-colors">HSS型HSPとは</a>
              <a href="/category/work" className="px-3.5 py-2 rounded-lg hover:bg-brand-50 hover:text-brand-600 transition-colors">仕事・キャリア</a>
              <a href="/category/relationships" className="px-3.5 py-2 rounded-lg hover:bg-brand-50 hover:text-brand-600 transition-colors">人間関係</a>
              <a href="/category/habits" className="px-3.5 py-2 rounded-lg hover:bg-brand-50 hover:text-brand-600 transition-colors">消耗しない習慣</a>
              <a href="/category/strengths" className="px-3.5 py-2 rounded-lg hover:bg-brand-50 hover:text-brand-600 transition-colors">強みを活かす</a>
            </nav>
            <a
              href={LINE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="shrink-0 inline-flex items-center gap-1.5 text-sm font-bold bg-brand-500 hover:bg-brand-600 text-white px-5 py-2.5 rounded-full transition-colors"
            >
              LINE登録
            </a>
          </div>
          {/* タブレット・モバイル用カテゴリナビ */}
          <nav className="lg:hidden flex gap-1 overflow-x-auto px-4 pb-2 text-sm text-gray-600 whitespace-nowrap scrollbar-none">
            <a href="/category/hss-hsp" className="px-3 py-2 rounded-lg hover:bg-brand-50 hover:text-brand-600 transition-colors">HSS型HSPとは</a>
            <a href="/category/work" className="px-3 py-2 rounded-lg hover:bg-brand-50 hover:text-brand-600 transition-colors">仕事・キャリア</a>
            <a href="/category/relationships" className="px-3 py-2 rounded-lg hover:bg-brand-50 hover:text-brand-600 transition-colors">人間関係</a>
            <a href="/category/habits" className="px-3 py-2 rounded-lg hover:bg-brand-50 hover:text-brand-600 transition-colors">消耗しない習慣</a>
            <a href="/category/strengths" className="px-3 py-2 rounded-lg hover:bg-brand-50 hover:text-brand-600 transition-colors">強みを活かす</a>
          </nav>
        </header>
        <main className="flex-1">{children}</main>
        <footer className="border-t border-gray-100 py-12 mt-16">
          <div className="max-w-5xl mx-auto px-6 text-center">
            <div className="flex justify-center mb-4">
              <Logo />
            </div>
            <p className="text-xs text-gray-400 mt-3">© 2026 HSP Partner All rights reserved.</p>
          </div>
        </footer>
        <StickyLineFooter />
      </body>
    </html>
  )
}
