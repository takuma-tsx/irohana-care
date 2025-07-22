'use client'

import Link from 'next/link'

export default function Navbar() {
  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 py-3 flex justify-between items-center">
        <Link href="/" className="text-xl font-bold text-blue-600">
          いろはな
        </Link>

        <nav className="hidden md:flex space-x-6 text-sm">
          <Link href="/search" className="text-gray-600 hover:text-blue-600">
            話し相手を探す
          </Link>
          <Link href="/howto" className="text-gray-600 hover:text-blue-600">
            使い方
          </Link>
          <Link href="/reviews" className="text-gray-600 hover:text-blue-600">
            レビュー
          </Link>
        </nav>

        <div className="flex space-x-4">
          <Link href="/login" className="text-sm text-gray-600 hover:text-blue-600">
            ログイン
          </Link>
          <Link
            href="/signup"
            className="text-sm bg-blue-600 text-white px-4 py-1.5 rounded hover:bg-blue-700"
          >
            無料登録
          </Link>
        </div>
      </div>
    </header>
  )
}
