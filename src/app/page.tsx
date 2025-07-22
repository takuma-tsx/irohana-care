// src/app/page.tsx
'use client'

import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay } from 'swiper/modules'
import 'swiper/css'

export default function HomePage() {
  return (
    <>
      {/* キービジュアル */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">オンラインでふたりをマッチング！</h2>
          <p className="text-gray-600 mb-6">
            介護や看取りの体験を、<br />
            聴いてほしい人・聴きたい人がつながるオンラインの居場所です。
          </p>
          <div className="flex justify-center gap-6 mb-6">
            <span className="bg-blue-100 text-blue-800 px-4 py-2 rounded">語り手</span>
            <span className="bg-green-100 text-green-800 px-4 py-2 rounded">聞き手</span>
          </div>
          <button className="bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-700">
            会員登録（無料）
          </button>
        </div>
      </section>

      {/* セクション：ケアラーの悩み */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h3 className="text-2xl font-bold mb-6">ケアラーがよく抱える悩み</h3>
          <p className="text-gray-600 mb-4">
            「誰にも話せない」「孤独を感じる」「理解されない」<br />
            そんな想いを抱えていませんか？
          </p>
        </div>
      </section>

      {/* セクション：いろはなが選ばれている理由（6つ） */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <h3 className="text-2xl font-bold mb-8">いろはなが選ばれている６つの理由</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left text-gray-700">
            {[
              ['共感的に「聴く」人と出会える', 'あなたの経験や思いを、共感の気持ちで受け止めてくれる相手が見つかります。'],
              ['匿名でも安心して話せる', 'ニックネームでの参加OK。顔出し不要で、気軽にお話しいただけます。'],
              ['介護・看取りの経験者が多い', '語り手の多くが実体験を持っており、実感をともなった会話ができます。'],
              ['初心者でも使いやすい設計', 'シンプルなUIで、登録から予約までスムーズに進められます。'],
              ['利用は1回からでもOK', '気が向いたときだけ話すことも可能。定期的な利用も歓迎です。'],
              ['管理体制も安心', 'レビューや通報機能でトラブルを未然に防止。安全にご利用いただけます。'],
            ].map(([title, desc], i) => (
              <div key={i} className="bg-white p-6 rounded shadow">
                <h4 className="font-bold mb-2">✅ {title}</h4>
                <p>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* セクション：人気の語り手 */}
      <section className="py-16 bg-white">
        <div className="max-w-5xl mx-auto px-4">
          <h3 className="text-2xl font-bold text-center mb-8">人気の語り手</h3>
          <Swiper
            spaceBetween={20}
            slidesPerView={1}
            breakpoints={{
              640: { slidesPerView: 2 },
              1024: { slidesPerView: 3 },
            }}
            loop={true}
            autoplay={{ delay: 1500 }}
            modules={[Autoplay]}
          >
            {[
              ['みきさん（50代）', '母の在宅看取り経験を共有しています。'],
              ['なおさん（40代）', '介護施設での体験談が中心です。'],
              ['あやさん（30代）', '介護うつを乗り越えた経験があります。'],
              ['たかしさん（60代）', '父の認知症介護の知見を話しています。'],
              ['さとこさん（50代）', '義母の看取りを通して感じたことを語ります。'],
              ['まことさん（40代）', 'ヘルパー経験者として助言しています。'],
              ['えりさん（30代）', '若年性介護の話を聞いてもらいたい方に。'],
              ['こうじさん（70代）', '看取り直後の気持ちをシェアしています。'],
            ].map(([name, desc], i) => (
              <SwiperSlide key={i}>
                <div className="h-full min-h-[130px] flex flex-col justify-between border rounded p-4 shadow-sm">
                  <h4 className="font-semibold text-lg mb-2">{name}</h4>
                  <p className="text-gray-600 flex-grow">{desc}</p>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </section>

      {/* セクション：他社との違い */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h3 className="text-2xl font-bold mb-6">他社サービスとの違い</h3>
          <p className="text-gray-600">
            一般的なカウンセリングサービスやSNSでは難しい、<br />
            「介護・看取りに特化した安心空間」を提供しています。
          </p>
        </div>
      </section>

      {/* 最後のCTA */}
      <section className="py-16 bg-white text-center">
        <h3 className="text-2xl font-bold mb-4">まずは無料登録からはじめよう</h3>
        <div className="flex justify-center gap-6">
          <button className="bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-700">
            今すぐはじめる
          </button>
          <button className="bg-gray-100 text-gray-800 px-6 py-3 rounded hover:bg-gray-200">
            いろはなで語りたい方はこちら
          </button>
        </div>
      </section>
    </>
  )
}
