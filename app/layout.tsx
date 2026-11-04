import type { Metadata } from 'next'
import { preload } from 'react-dom'
import Logo from '@/components/Logo'
import StickyLineFooter from '@/components/StickyLineFooter'
import { LINE_URL } from '@/lib/site'
import {
  GoogleTagManagerScript,
  GoogleTagManagerNoScript,
} from '@/components/GoogleTagManager'
// 書体は next/font/google の書き出し結果を固定して置いている（理由は fonts.css の冒頭）
import './fonts.css'
import './globals.css'

// next/font/google が先読みしていた3ファイル（Noto Serif JP と Noto Sans JP の英数字の部分）
const PRELOAD_FONTS = [
  '/fonts/noto/68d0ad77fd2c49e3.woff2',
  '/fonts/noto/ad9c66e761fed85a.woff2',
  '/fonts/noto/d8ea5540f28d37db.woff2',
]

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
  for (const href of PRELOAD_FONTS) {
    preload(href, { as: 'font', type: 'font/woff2', crossOrigin: '' })
  }

  return (
    <html lang="ja">
      <body className="min-h-screen flex flex-col bg-white text-gray-800 antialiased overflow-x-hidden pb-28 sm:pb-0">
        <GoogleTagManagerScript />
        <GoogleTagManagerNoScript />
        <header className="border-b border-gray-100 bg-white/90 backdrop-blur-md sticky top-0 z-20">
          <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between gap-6">
            <a href="/" aria-label="HSP Partner トップへ" className="shrink-0">
              <Logo />
            </a>
            <nav className="hidden lg:flex items-center gap-1 text-sm text-gray-600">
              <a href="/category/hss-hsp" className="px-3.5 py-2 rounded-lg hover:bg-brand-50 hover:text-brand-600 transition-colors">気質を知る</a>
              <a href="/category/work" className="px-3.5 py-2 rounded-lg hover:bg-brand-50 hover:text-brand-600 transition-colors">仕事・キャリア</a>
              <a href="/category/relationships" className="px-3.5 py-2 rounded-lg hover:bg-brand-50 hover:text-brand-600 transition-colors">人間関係</a>
              <a href="/category/habits" className="px-3.5 py-2 rounded-lg hover:bg-brand-50 hover:text-brand-600 transition-colors">消耗しない習慣</a>
              <a href="/category/strengths" className="px-3.5 py-2 rounded-lg hover:bg-brand-50 hover:text-brand-600 transition-colors">強みを活かす</a>
              <a href="/category/mind-care" className="px-3.5 py-2 rounded-lg hover:bg-brand-50 hover:text-brand-600 transition-colors">心の整え方</a>
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
            <a href="/category/hss-hsp" className="px-3 py-2 rounded-lg hover:bg-brand-50 hover:text-brand-600 transition-colors">気質を知る</a>
            <a href="/category/work" className="px-3 py-2 rounded-lg hover:bg-brand-50 hover:text-brand-600 transition-colors">仕事・キャリア</a>
            <a href="/category/relationships" className="px-3 py-2 rounded-lg hover:bg-brand-50 hover:text-brand-600 transition-colors">人間関係</a>
            <a href="/category/habits" className="px-3 py-2 rounded-lg hover:bg-brand-50 hover:text-brand-600 transition-colors">消耗しない習慣</a>
            <a href="/category/strengths" className="px-3 py-2 rounded-lg hover:bg-brand-50 hover:text-brand-600 transition-colors">強みを活かす</a>
            <a href="/category/mind-care" className="px-3 py-2 rounded-lg hover:bg-brand-50 hover:text-brand-600 transition-colors">心の整え方</a>
          </nav>
        </header>
        <main className="flex-1">{children}</main>
        <footer className="border-t border-gray-100 py-12 mt-16">
          <div className="max-w-5xl mx-auto px-6 text-center">
            <div className="flex justify-center mb-4">
              <Logo />
            </div>
            <nav className="flex flex-wrap justify-center gap-x-5 gap-y-2 text-sm text-gray-500">
              <a href="/about" className="hover:text-brand-600 transition-colors">運営者プロフィール</a>
              <a href="/posts" className="hover:text-brand-600 transition-colors">記事一覧</a>
              <a href="/tokushoho" className="hover:text-brand-600 transition-colors">特定商取引法に基づく表記</a>
              <a href="/privacy" className="hover:text-brand-600 transition-colors">プライバシーポリシー</a>
            </nav>
            <p className="text-xs text-gray-400 mt-3">© 2026 HSP Partner All rights reserved.</p>
          </div>
        </footer>
        <StickyLineFooter />
      </body>
    </html>
  )
}
