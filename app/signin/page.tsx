"use client";

import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function SignInPage() {
  const router = useRouter();

  const handleGoogleLogin = async () => {
    await signIn("google", { callbackUrl: "/profile" });
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

        <p className="text-xs text-gray-400 text-center mt-6">
          ログインすることで、利用規約とプライバシーポリシーに同意したことになります。
        </p>
      </div>
    </div>
  );
}
