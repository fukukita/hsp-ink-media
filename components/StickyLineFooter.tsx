'use client'

import { usePathname } from 'next/navigation'
import { LINE_URL } from '@/lib/site'

// スマホのみ画面下に固定表示する、公式LINE登録の追従バー。
// PC（sm以上）では非表示。管理画面（Sanity Studio）でも非表示にする。
export default function StickyLineFooter() {
  const pathname = usePathname()
  if (pathname?.startsWith('/studio')) return null

  return (
    <div className="sm:hidden fixed inset-x-0 bottom-0 z-40 border-t border-brand-100 bg-white/95 backdrop-blur px-4 pt-2.5 pb-[calc(env(safe-area-inset-bottom)+0.625rem)] shadow-[0_-4px_16px_rgba(32,64,95,0.08)]">
      <p className="text-center text-[11px] text-gray-500 mb-1.5">
        HSS型HSPの気質を活かすヒントを配信中
      </p>
      <a
        href={LINE_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-center gap-2 w-full bg-green-500 hover:bg-green-600 active:bg-green-600 text-white font-bold py-3 rounded-full shadow-sm transition-colors"
      >
        公式LINEに無料登録する
        <span aria-hidden>→</span>
      </a>
    </div>
  )
}
