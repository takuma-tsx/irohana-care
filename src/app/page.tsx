export default function HomePage() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <section className="text-center mb-12">
        <h1 className="text-4xl font-bold text-800 mb-4">
          オンラインでふたりをマッチング！
        </h1>
        <p className="text-600 text-lg mb-6">
          介護や看取りの体験を、聴いてほしい人・聴きたい人がつながるオンラインの居場所です。
        </p>
        <div className="space-x-4">
          <button className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700">
            会員登録（無料）
          </button>
        </div>
      </section>

      <section className="mb-16">
        <h2 className="text-2xl font-bold mb-4">ケアラーがよく抱える悩み</h2>
        <p className="text-gray-600">※このセクションは後ほどコンテンツを追加</p>
      </section>

      <section className="mb-16">
        <h2 className="text-2xl font-bold mb-4">いろはなが選ばれている3つの理由</h2>
        <p className="text-gray-600">※このセクションは後ほどコンテンツを追加</p>
      </section>

      <section className="mb-16">
        <h2 className="text-2xl font-bold mb-4">人気の語り手</h2>
        <p className="text-gray-600">※このセクションは後ほどコンテンツを追加</p>
      </section>

      <section className="text-center mt-20">
        <h2 className="text-2xl font-bold mb-4">まずは無料登録からはじめよう</h2>
        <button className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700">
          今すぐはじめる
        </button>
        <p className="mt-2 text-sm text-blue-600">
          いろはなで語りたい方はこちら
        </p>
      </section>
    </div>
  )
}
