"use client";

import { useAuth } from "@/contexts/AuthContext";
import { db } from "@/lib/firebase";
import { doc, setDoc } from "firebase/firestore";
import { useState } from "react";

export default function RegisterSpeakerPage() {
  const { user } = useAuth();

  const [theme, setTheme] = useState("");
  const [availableDays, setAvailableDays] = useState("");
  const [availableTime, setAvailableTime] = useState("");
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    const ref = doc(db, "speakers", user.uid);
    await setDoc(ref, {
      uid: user.uid,
      email: user.email,
      theme,
      availableDays,
      availableTime,
      message,
    });
    setSubmitted(true);
  };

  if (!user) return <p>ログインが必要です</p>;
  if (submitted)
    return <p className="p-6 text-green-600">登録が完了しました！</p>;

  return (
    <div className="max-w-xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">語り手として登録する</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            話せるテーマ（例：介護経験、仕事との両立など）
          </label>
          <input
            type="text"
            value={theme}
            onChange={(e) => setTheme(e.target.value)}
            className="mt-1 block w-full border rounded px-3 py-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            対応可能な曜日（例：土日・水）
          </label>
          <input
            type="text"
            value={availableDays}
            onChange={(e) => setAvailableDays(e.target.value)}
            className="mt-1 block w-full border rounded px-3 py-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            対応可能な時間帯（例：午前中、19時以降など）
          </label>
          <input
            type="text"
            value={availableTime}
            onChange={(e) => setAvailableTime(e.target.value)}
            className="mt-1 block w-full border rounded px-3 py-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            ひとこと自己紹介
          </label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="mt-1 block w-full border rounded px-3 py-2"
            rows={3}
          />
        </div>

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          登録する
        </button>
      </form>
    </div>
  );
}
