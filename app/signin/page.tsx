"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase";

export default function SignInPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleGoogleLogin = async () => {
    await signIn("google", { callbackUrl: "/profile" });
  };

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push("/profile");
    } catch {
      setError("メールアドレスまたはパスワードが正しくありません");
    }
  };

  return (
    <div className="flex flex-col items-center bg-gray-50 px-4 py-12 min-h-[calc(100vh-64px)]">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center text-orange-600">
          ようこそ、「いろはな」へ
        </h1>

        <p className="text-gray-600 text-center mb-4">
          あなたの声を、誰かが必要としています。
        </p>

        <button
          onClick={handleGoogleLogin}
          className="w-full bg-orange-500 hover:bg-orange-300 text-white py-2 px-4 rounded mb-4 transition-colors duration-200"
        >
          Googleでログイン
        </button>

        <div className="flex items-center my-6">
          <hr className="flex-grow border-t border-gray-300" />
          <span className="mx-4 text-gray-500 text-sm whitespace-nowrap">
            または、メールアドレスでログイン
          </span>
          <hr className="flex-grow border-t border-gray-300" />
        </div>

        <form onSubmit={handleEmailLogin} className="space-y-4">
          <input
            type="email"
            placeholder="メールアドレス"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border rounded px-3 py-2"
            required
          />
          <input
            type="password"
            placeholder="パスワード"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border rounded px-3 py-2"
            required
          />
          {error && <p className="text-sm text-red-500">{error}</p>}

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-500 text-white py-2 px-4 rounded transition-colors duration-200"
          >
            メールアドレスでログイン
          </button>
        </form>

        <div className="mt-4 text-center">
          <a
            href="/reset-password"
            className="text-sm text-blue-600 hover:underline"
          >
            パスワードを忘れた方はこちら
          </a>
        </div>

        <p className="text-sm text-center mt-4">
          アカウントをお持ちでない方は{" "}
          <a href="/signup" className="text-blue-600 hover:underline">
            新規登録はこちら
          </a>
        </p>

        <p className="text-xs text-gray-400 text-center mt-6">
          ログインすることで、利用規約とプライバシーポリシーに同意したことになります。
        </p>
      </div>
    </div>
  );
}
