// HSP Partner ロゴ
// シンボル：寄り添う2つの円（共感・つながり・パートナー）
// ワードマーク：HSP（濃紺＝才気道との血縁）＋ Partner（パステルブルー）

export default function Logo({ className = '' }: { className?: string }) {
  return (
    <span className={`inline-flex items-center gap-2 ${className}`}>
      <svg
        width="34"
        height="34"
        viewBox="0 0 40 40"
        fill="none"
        aria-hidden="true"
        className="shrink-0"
      >
        {/* 寄り添う2つの円：重なりが深い青になり「つながり」を表す */}
        <circle cx="16" cy="20" r="11" fill="#9ac8ef" fillOpacity="0.95" />
        <circle cx="24" cy="20" r="11" fill="#4f93d8" fillOpacity="0.85" />
      </svg>
      <span className="text-xl font-bold tracking-tight leading-none">
        <span className="text-ink">HSP</span>
        <span className="text-brand-500"> Partner</span>
      </span>
    </span>
  )
}
