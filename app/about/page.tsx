import type { Metadata } from 'next'
import Image from 'next/image'
import LineCta from '@/components/LineCta'

export const metadata: Metadata = {
  title: '運営者プロフィール',
  description:
    'HSP Partner運営者・ふくきた（才気道 家元）のプロフィール。HSS型HSP当事者として数々の失敗から自己理解を深めてきた歩みと、これまでのキャリア・実績を紹介します。',
  openGraph: {
    title: '運営者プロフィール | HSP Partner',
    description:
      'HSS型HSP当事者・ふくきたの歩み。矛盾した気質と失敗の連続から、自己理解を深めるまで。',
    type: 'profile',
  },
}

const h2 =
  'font-serif text-xl sm:text-2xl font-bold text-ink mt-12 mb-4 border-l-4 border-brand-400 pl-4 leading-snug'
const p = 'leading-[1.9] text-gray-700 mb-5'

export default function AboutPage() {
  return (
    <article className="pb-4">
      {/* ヒーロー写真（後ろ姿） */}
      <div className="relative w-full max-w-3xl mx-auto aspect-[4/3] sm:aspect-[16/10] sm:rounded-2xl overflow-hidden bg-brand-100 sm:mt-8">
        <Image
          src="/images/fukukita-for-profile-page02.jpg"
          alt="ふくきた｜才気道 家元"
          fill
          priority
          quality={90}
          sizes="(max-width: 768px) 100vw, 768px"
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent" />
      </div>

      <div className="max-w-3xl mx-auto px-5 sm:px-6 py-12">
        {/* パンくず */}
        <nav className="text-sm text-gray-400 mb-6 flex gap-2">
          <a href="/" className="hover:text-brand-600">トップ</a>
          <span>›</span>
          <span className="text-gray-600">運営者プロフィール</span>
        </nav>

        <p className="text-xs font-medium tracking-[0.2em] text-brand-600 uppercase mb-3">
          Profile
        </p>
        <h1 className="font-serif text-2xl sm:text-3xl font-bold text-ink mb-2 leading-snug">
          運営者プロフィール
        </h1>
        <p className="text-gray-500 mb-10">ふくきた｜才気道 家元</p>

        {/* ===== 本文 ===== */}
        <p className={p}>はじめまして。ふくきたと申します。</p>
        <p className={p}>
          数あるなかから、私の書いた記事をお読みいただきありがとうございます。
        </p>
        <p className={p}>突然ですが、私は典型的な社会不適合者です。</p>

        <ul className="my-6 space-y-2.5">
          {[
            '好奇心旺盛で興味のあることに衝動的に飛びついてしまう反面、飽き性で継続ができない',
            '縛られるのが大嫌いで自由を求める反面、プレッシャーに弱い',
            '刺激を求めて新しいことにチャレンジする反面、繊細で傷つきやすい',
            '周りからは社交的だと思われているが、実は人見知り',
            '友人と話すのが好きな反面、一人になるとどっと疲れてしまう',
          ].map((t) => (
            <li key={t} className="flex gap-3 text-gray-700 leading-[1.8]">
              <span className="mt-[0.7em] h-1.5 w-1.5 rounded-full bg-brand-400 shrink-0" />
              <span>{t}</span>
            </li>
          ))}
        </ul>

        <p className={p}>
          このように、矛盾した気質をいくつも抱えています。こうして書いていると「いや、これって詰んでるのでは…」と自分でも思います。
        </p>

        <h2 className={h2}>数えきれないほど、失敗してきました</h2>
        <p className={p}>実際、それなりに波乱万丈な人生を歩んできました。</p>

        <ul className="my-6 space-y-2.5">
          {[
            '20代のときにマルチ商法に取り組み、信用を失う',
            '会社勤めができずに短期離職を繰り返す',
            'ゴリゴリの営業会社に入社するも、半年も持たずにメンタルを病んで退職',
            '投資詐欺に遭い、数千万円の損失を出す',
            'フリーランス時代には250万円の借金を抱える',
            'オンラインサロンを立ち上げるも、4人しかお客様が集まらず',
            '前職ではチームメンバーと関係を築けず、一度チームが崩壊',
          ].map((t) => (
            <li key={t} className="flex gap-3 text-gray-700 leading-[1.8]">
              <span className="mt-[0.7em] h-1.5 w-1.5 rounded-full bg-brand-400 shrink-0" />
              <span>{t}</span>
            </li>
          ))}
        </ul>

        <p className={p}>
          本当に、たくさん失敗しています。今振り返っても、よく生きてこれたなと思います。
        </p>
        <p className={p}>
          客観的に見て、会社員として生きるには絶望的なタイプではないでしょうか。実際に、何度も絶望してきました。
        </p>

        <h2 className={h2}>それでも、今は</h2>
        <p className={p}>
          それでも今は、独自メソッド（才気道）の開発と普及に尽力し、それなりに楽しい毎日を送っています。
        </p>
        <p className={p}>
          ここに行き着くまでには、いくつもの壁がありました。なんなら、今でもたくさんあります。それでも、もがき苦しみながら少しずつ前進して、今のスタンスにたどり着きました。
        </p>

        <h2 className={h2}>なぜ、発信しているのか</h2>
        <p className={p}>
          私が情報発信を始めたのは、今まで経験したことが、一人でも多くの人の役に立つといいなと思ったからです。言ってしまうと、自己満です。
        </p>
        <p className={p}>でも、自己満でもいいじゃないか、と思っています。</p>
        <p className={p}>
          自分が満足できずして、幸せな人生を歩めるとは思えません。せめて、自分が自由に使える時間は、心の声に従って生きていけたらと思っています。
        </p>

        <h2 className={h2}>これまでのキャリア</h2>
        <p className={p}>
          私がどんな人間なのか、イマイチ伝わりにくいと思うので、大まかなキャリアと実績を記しておきます。
        </p>
        <ul className="my-6 space-y-2.5">
          {[
            'Webライター（SEOライター＆セールスライター）',
            'Webメディアディレクター',
            'ブログ・YouTubeでの情報発信',
            'SNS動画制作',
            'MLM（マルチレベルマーケティング）',
            '短期トレード',
            '仮想通貨投資',
          ].map((t) => (
            <li key={t} className="flex gap-3 text-gray-700 leading-[1.8]">
              <span className="mt-[0.7em] h-1.5 w-1.5 rounded-full bg-brand-400 shrink-0" />
              <span>{t}</span>
            </li>
          ))}
        </ul>

        <h2 className={h2}>主な実績</h2>
        <ul className="my-6 space-y-2.5">
          {[
            '通販会社でランディングページとメルマガの原稿執筆を担当。月間売上20〜30万円から、200〜300万円まで売上アップに貢献',
            'プロダクトローンチのセールスライターを担当。一回のプロモーションで3,000〜6,000万円の売上',
            '個人ブログを運営し、月間10万PV以上を達成',
            '月間30万PVを超えるブログのゴーストライターとして執筆',
            'Webメディアのディレクターとして、月間10〜30万PVの企業メディア立ち上げに複数回関与',
            '企業SNSの運用を担当し、フォロワーと再生数を右肩上がりで伸ばしている',
          ].map((t) => (
            <li key={t} className="flex gap-3 text-gray-700 leading-[1.8]">
              <span className="mt-[0.7em] h-1.5 w-1.5 rounded-full bg-brand-400 shrink-0" />
              <span>{t}</span>
            </li>
          ))}
        </ul>
        <p className={p}>
          トップレベルの方たちとは、比べるまでもない実績です。冒頭でお伝えしたとおり、人一倍たくさんの失敗を経験しています。
        </p>
        <p className={p}>
          しかし、失敗を繰り返したからこそ自己理解が深まり、結果として、望む方向へ進むことができました。
        </p>

        <h2 className={h2}>これからの想い</h2>
        <p className={p}>
          私はだいぶ変わった人間です。だからこそ、私と同じような悩みを抱えている人たちの役に立ちたい。
        </p>
        <p className={p}>
          今よりもっと「マイノリティな気質・才能が輝ける社会」になればいいなと思っています。
        </p>
        <p className={p}>
          私の発信を通じて、「生きづらい」と感じる人が減って、充実感のある日々を過ごせる。そんなお手伝いができれば嬉しいです。
        </p>
        <p className={p}>最後までお読みいただき、ありがとうございました。</p>
        <p className="font-bold text-ink mt-8">ふくきた｜才気道 家元</p>
      </div>

      {/* LINE誘導 */}
      <div className="max-w-5xl mx-auto px-6">
        <LineCta />
      </div>
    </article>
  )
}
