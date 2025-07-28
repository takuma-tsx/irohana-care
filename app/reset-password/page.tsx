"use client";

import { useState } from "react";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "@/lib/firebase";

export default function ResetPasswordPage() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");
    setError("");
    try {
      await sendPasswordResetEmail(auth, email);
      setMessage(
        "パスワード再設定用のメールを送信しました。メールをご確認ください。",
      );
    } catch (err) {
      console.error(err);
      setError("送信に失敗しました。メールアドレスをご確認ください。");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-16 p-6">
      <h2 className="text-2xl font-bold mb-4">パスワード再設定</h2>
      <p className="text-sm text-gray-600 mb-6">
        ご登録済みのメールアドレスを入力してください。パスワード再設定用リンクをお送りします。
      </p>

      <form onSubmit={handleReset} className="space-y-4">
        <input
          type="email"
          placeholder="メールアドレス"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border rounded px-3 py-2"
        />

        {message && <p className="text-green-600 text-sm">{message}</p>}
        {error && <p className="text-red-500 text-sm">{error}</p>}

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          送信する
        </button>
      </form>

      <p className="text-sm text-center mt-6">
        <a href="/login" className="text-blue-600 hover:underline">
          ログイン画面に戻る
        </a>
      </p>
    </div>
  );
}
