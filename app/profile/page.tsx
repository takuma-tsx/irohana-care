"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { db } from "@/lib/firebase";
import { doc, setDoc } from "firebase/firestore";
import { useAuth } from "@/lib/auth";
import { User } from "firebase/auth"; // 追加

export default function ProfilePage() {
  const router = useRouter();
  const { user } = useAuth(); // 分割代入で明確に
  const [role, setRole] = useState<"listener" | "speaker" | "">("");
  const [nickname, setNickname] = useState("");
  const [message, setMessage] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
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

  useEffect(() => {
    if (user === undefined) return; // ローディング中
    if (user === null) {
      router.push("/signin");
    }
  }, [user, router]);

  const handleTagToggle = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag)
        ? prev.filter((t) => t !== tag)
        : prev.length < maxTagCount
          ? [...prev, tag]
          : prev,
    );
  };

  const handleSubmit = async () => {
    if (!user || !role) return;

    const firebaseUser = user as User; // 明示的に型付け

    const userData = {
      uid: firebaseUser.uid,
      role,
      nickname,
    };

    await setDoc(doc(db, "users", firebaseUser.uid), userData);

    if (role === "speaker") {
      const speakerData = {
        uid: firebaseUser.uid,
        nickname,
        message,
        tags: selectedTags,
      };
      await setDoc(doc(db, "speakers", firebaseUser.uid), speakerData);
    }

    router.push("/reserve");
  };

  if (user === undefined) {
    return <p>読み込み中...</p>;
  }

  return (
    <div className="max-w-xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">プロフィール登録</h1>

      <div className="mb-4">
        <label className="block font-semibold mb-1">あなたの役割を選択</label>
        <select
          value={role}
          onChange={(e) =>
            setRole(e.target.value as "listener" | "speaker" | "")
          }
          className="w-full border rounded px-3 py-2"
        >
          <option value="">選択してください</option>
          <option value="listener">聞き手（話を聴きたい）</option>
          <option value="speaker">語り手（体験談を届ける）</option>
        </select>
      </div>

      <div className="mb-4">
        <label className="block font-semibold mb-1">ハンドルネーム</label>
        <input
          type="text"
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
          className="w-full border rounded px-3 py-2"
        />
      </div>

      {role === "speaker" && (
        <>
          <div className="mb-4">
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

          <div className="mb-4">
            <label className="block font-semibold mb-1">
              話したいテーマ（最大5つまで）
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

      <button
        onClick={handleSubmit}
        className="mt-6 bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600"
      >
        登録してはじめる
      </button>
    </div>
  );
}
