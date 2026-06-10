import Image from 'next/image'

type Props = {
  publishedAt?: string | null
  updatedAt?: string | null
}

// 記事冒頭（タイトル直下）に置く著者バイライン。
// 本文で一人称の体験談が出ても「誰の話か」が最初に分かるようにし、
// E-E-A-T（経験・権威・信頼）を冒頭で補強する。詳細は記事末尾のAuthorBoxが担う。
export default function AuthorByline({ publishedAt, updatedAt }: Props) {
  const fmt = (d: string) =>
    new Date(d).toLocaleDateString('ja-JP', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  const showUpdated =
    !!updatedAt &&
    !!publishedAt &&
    new Date(updatedAt).toDateString() !== new Date(publishedAt).toDateString()

  return (
    <div className="flex items-center gap-3 mt-5 mb-8 pb-6 border-b border-gray-100">
      <Image
        src="/images/fukukita01.jpg"
        alt="ふくきた｜才気道 家元"
        width={48}
        height={48}
        className="rounded-full object-cover w-12 h-12 shrink-0"
      />
      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5">
          <a
            href="/about"
            className="font-bold text-ink text-sm hover:text-brand-600 transition-colors"
          >
            ふくきた
          </a>
          <span className="text-xs text-gray-500">HSS型HSP当事者｜才気道 家元</span>
        </div>
        <div className="flex flex-wrap gap-x-3 text-xs text-gray-400 mt-1">
          {publishedAt && <span>公開：{fmt(publishedAt)}</span>}
          {showUpdated && <span>更新：{fmt(updatedAt!)}</span>}
        </div>
      </div>
    </div>
  )
}
