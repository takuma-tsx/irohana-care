"use client";

import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";

export default function Navbar() {
  const { user } = useAuth();

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* 左：ロゴ */}
        <Link href="/" className="text-xl font-bold text-blue-600">
          いろはな
        </Link>

        {/* 中央：メニュー */}
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

        {/* 右：ログイン or ユーザー表示 */}
        <div className="flex items-center space-x-4 text-sm">
          {user ? (
            <>
              <span className="text-gray-600 whitespace-nowrap">
                こんにちは！
              </span>
              <Link
                href="/profile"
                className="text-blue-600 hover:underline whitespace-nowrap"
              >
                プロフィール
              </Link>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="text-gray-600 hover:text-blue-600 whitespace-nowrap"
              >
                ログイン
              </Link>
              <Link
                href="/signup"
                className="bg-blue-600 text-white px-4 py-1.5 rounded hover:bg-blue-700 whitespace-nowrap"
              >
                無料登録
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
