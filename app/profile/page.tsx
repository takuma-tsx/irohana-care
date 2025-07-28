"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { useAuth } from "@/contexts/AuthContext";
import { db } from "@/lib/firebase";

export default function ProfilePage() {
  const router = useRouter();
  const currentUser = useAuth();

  const [loading, setLoading] = useState(true);
  const [nickname, setNickname] = useState("");
  const [roles, setRoles] = useState<string[]>([]);
  const [message, setMessage] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

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

  const maxTagCount = 5;

  useEffect(() => {
    if (currentUser === undefined) return;

    if (!currentUser.user) {
      router.push("/login");
      return;
    }

    const uid = currentUser.user.uid;

    const fetchData = async () => {
      try {
        const userRef = doc(db, "users", uid);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
          const data = userSnap.data();
          setNickname(data.nickname || "");
          setRoles(data.roles || []);
        }

        if (roles.includes("speaker")) {
          const speakerRef = doc(db, "speakers", uid);
          const speakerSnap = await getDoc(speakerRef);
          if (speakerSnap.exists()) {
            const speakerData = speakerSnap.data();
            setMessage(speakerData.message || "");
            setSelectedTags(speakerData.tags || []);
          }
        }
      } catch (err) {
        console.error("プロフィール取得エラー", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [currentUser, roles, router]);

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

  const handleSubmit = async () => {
    if (!currentUser.user || roles.length === 0) return;

    const uid = currentUser.user.uid;

    const userData = {
      uid,
      nickname,
      roles,
    };
    await setDoc(doc(db, "users", uid), userData);

    if (roles.includes("speaker")) {
      const speakerData = {
        uid,
        nickname,
        message,
        tags: selectedTags,
      };
      await setDoc(doc(db, "speakers", uid), speakerData);
    }

    router.push("/mypage");
  };

  if (loading) return <p className="text-center mt-10">読み込み中...</p>;

  return (
    <div className="max-w-xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">プロフィールの確認・編集</h1>

      <div className="mb-4">
        <label className="block font-semibold mb-1">ハンドルネーム</label>
        <input
          type="text"
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
          className="w-full border rounded px-3 py-2"
        />
      </div>

      <div className="mb-4">
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
          <div className="mb-4">
            <label className="block font-semibold mb-1">
              体験談を届ける方は、ひとことメッセージを記入してください
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

      <button
        onClick={handleSubmit}
        className="mt-6 bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600"
      >
        保存する
      </button>
    </div>
  );
}
