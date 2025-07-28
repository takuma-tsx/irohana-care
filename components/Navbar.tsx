"use client";

import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";

export default function Navbar() {
  const { user } = useAuth();

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("ログアウトに失敗しました", error);
    }
  };

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* 左：ロゴ */}
        <Link href="/" className="text-xl font-bold text-orange-600">
          いろはな
        </Link>

        {/* 右：ナビメニュー＋ログインなど */}
        <div className="flex items-center space-x-6 text-sm">
          {/* ナビメニュー（常時表示） */}
          <nav className="flex space-x-4">
            <Link
              href="/search"
              className="text-gray-600 hover:text-blue-600 whitespace-nowrap"
            >
              話し相手を探す
            </Link>
            <Link
              href="/howto"
              className="text-gray-600 hover:text-blue-600 whitespace-nowrap"
            >
              使い方
            </Link>
            <Link
              href="/reviews"
              className="text-gray-600 hover:text-blue-600 whitespace-nowrap"
            >
              レビュー
            </Link>
          </nav>

          {/* 認証状態による表示切替 */}
          {user === undefined ? null : user ? (
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
              <Link
                href="/mypage"
                className="text-blue-600 hover:underline whitespace-nowrap"
              >
                予約履歴
              </Link>
              <button
                onClick={handleLogout}
                className="text-gray-600 hover:text-red-600 whitespace-nowrap"
              >
                ログアウト
              </button>
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
                className="bg-orange-500 text-white px-4 py-1.5 rounded hover:bg-orange-400 whitespace-nowrap"
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
