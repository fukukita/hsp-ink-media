import Studio from './Studio'

// 書き出し方式（output: "export"）では /studio の1枚だけを作る。
// 奥のURL（/studio/intent/... など）は public/_redirects で同じページに回す。
// generateStaticParams は 'use client' のファイルに置けないので、編集画面は Studio.tsx に分けた
export const dynamic = 'force-static'

export function generateStaticParams() {
  return [{ tool: [] }]
}

export default function StudioPage() {
  return <Studio />
}
