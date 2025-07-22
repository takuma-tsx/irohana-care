'use client'

export default function Navbar() {
  return (
    <header className="border-b shadow-sm sticky top-0 bg-white z-10">
      <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
        <h1 className="text-xl font-bold">いろはな</h1>
        <nav className="space-x-4 text-sm">
          <span className="hover:underline cursor-pointer">話し相手を探す</span>
          <span className="hover:underline cursor-pointer">使い方</span>
          <span className="hover:underline cursor-pointer">レビュー</span>
          <span className="hover:underline cursor-pointer">ログイン</span>
          <span className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 cursor-pointer">
            無料登録
          </span>
        </nav>
      </div>
    </header>
  )
}
