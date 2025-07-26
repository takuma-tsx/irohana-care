"use client";

import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { collection, getDocs } from "firebase/firestore";

type Speaker = {
  uid: string;
  email?: string;
  theme?: string;
  availableDays?: string;
  availableTime?: string;
  message?: string;
};

export default function SearchPage() {
  const [speakers, setSpeakers] = useState<Speaker[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSpeakers = async () => {
      const snapshot = await getDocs(collection(db, "speakers"));
      const list = snapshot.docs.map((doc) => ({
        uid: doc.id,
        ...doc.data(),
      })) as Speaker[];
      setSpeakers(list);
      setLoading(false);
    };

    fetchSpeakers();
  }, []);

  if (loading) return <p className="p-6">読み込み中...</p>;

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">話し相手を探す</h1>
      <div className="grid md:grid-cols-2 gap-6">
        {speakers.map((sp) => (
          <div
            key={sp.uid}
            className="border rounded p-4 shadow hover:shadow-md transition"
          >
            <p className="text-lg font-semibold mb-1">
              {sp.theme ?? "テーマ未設定"}
            </p>
            <p className="text-sm text-gray-500 mb-2">
              対応日：{sp.availableDays ?? "未設定"}
            </p>
            <p className="text-sm text-gray-500 mb-2">
              時間帯：{sp.availableTime ?? "未設定"}
            </p>
            <p className="text-sm text-gray-700">
              {sp.message ?? "ひとことはまだありません"}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
