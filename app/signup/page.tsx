"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { signIn } from "next-auth/react";
import { auth } from "@/lib/firebase";

export default function SignupPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [nickname, setNickname] = useState("");
  const [message, setMessage] = useState("");
  const [roles, setRoles] = useState<string[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [error, setError] = useState("");

  const maxTagCount = 5;

  const allTags = [
    "介護",
    "認知症",
    "看取り",
    "在宅介護",
    "施設介護",
    "仕事との両立",
    "家族との関係",
    "孤独感",
    "感情の整理",
    "思い出・記憶",
  ];

  const handleRoleChange = (role: string) => {
    setRoles((prev) =>
      prev.includes(role) ? prev.filter((r) => r !== role) : [...prev, role],
    );
  };

  const handleTagToggle = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag)
        ? prev.filter((t) => t !== tag)
        : prev.length < maxTagCount
          ? [...prev, tag]
          : prev,
    );
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      await createUserWithEmailAndPassword(auth, email, password);
      router.push("/profile");
    } catch {
      setError("アカウント作成に失敗しました");
    }
  };

  const handleGoogleSignup = async () => {
    await signIn("google", { callbackUrl: "/profile" });
  };

  return (
    <div className="max-w-xl mx-auto mt-12 p-6">
      <h2 className="text-2xl font-bold mb-6 text-center text-orange-600">
        無料登録
      </h2>

      <p className="text-gray-600 text-center mb-6">
        「いろはな」は、介護・看取りの経験を分かち合う場所です。
        <br />
        あなたの声が、誰かの支えになるかもしれません。
      </p>

      <button
        onClick={handleGoogleSignup}
        className="w-full bg-orange-500 hover:bg-orange-400 text-white py-2 px-4 rounded mb-6 transition-colors duration-200"
      >
        Googleで登録
      </button>

      <div className="flex items-center my-6">
        <hr className="flex-grow border-gray-300" />
        <span className="mx-4 text-gray-400 text-sm">または</span>
        <hr className="flex-grow border-gray-300" />
      </div>

      <form onSubmit={handleSignup} className="space-y-6">
        <input
          type="email"
          placeholder="メールアドレス"
          className="w-full p-2 border rounded"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="パスワード（6文字以上）"
          className="w-full p-2 border rounded"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <div>
          <label className="block font-semibold mb-1">ハンドルネーム</label>
          <input
            type="text"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            className="w-full border rounded px-3 py-2"
            required
          />
        </div>

        <div>
          <label className="block font-semibold mb-2">
            あなたの役割（複数選択可）
          </label>
          <div className="flex gap-4">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                value="listener"
                checked={roles.includes("listener")}
                onChange={() => handleRoleChange("listener")}
              />
              聞き手（誰かの話を聴きたい）
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                value="speaker"
                checked={roles.includes("speaker")}
                onChange={() => handleRoleChange("speaker")}
              />
              語り手（体験談を届けたい）
            </label>
          </div>
        </div>

        {roles.includes("speaker") && (
          <>
            <div>
              <p className="text-sm text-gray-600 mb-1">
                語り手として登録される方は、以下をご記入ください。
              </p>
              <label className="block font-semibold mb-1">
                ひとことメッセージ
              </label>
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full border rounded px-3 py-2"
              />
            </div>

            <div>
              <label className="block font-semibold mb-1">
                話せるテーマ（最大5つまで）
              </label>
              <div className="flex flex-wrap gap-2">
                {allTags.map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => handleTagToggle(tag)}
                    className={`px-3 py-1 rounded border ${
                      selectedTags.includes(tag)
                        ? "bg-green-500 text-white"
                        : "bg-gray-100"
                    }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          </>
        )}

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-500 text-white py-2 rounded transition-colors duration-200"
        >
          メールアドレスで登録
        </button>
      </form>

      <p className="text-sm text-center mt-6">
        すでにアカウントをお持ちの方は{" "}
        <a href="/login" className="text-blue-600 hover:underline">
          ログインページへ
        </a>
      </p>
    </div>
  );
}
