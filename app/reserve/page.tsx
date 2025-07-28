// app/reserve/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";

type Speaker = {
  id: string;
  nickname: string;
  message: string;
  profile: string;
  tags: string[];
};

export default function ReservePage() {
  const [speakers, setSpeakers] = useState<Speaker[]>([]);
  const router = useRouter();

  useEffect(() => {
    const fetchSpeakers = async () => {
      const querySnapshot = await getDocs(collection(db, "speakers"));
      const fetchedSpeakers: Speaker[] = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as Omit<Speaker, "id">),
      }));
      setSpeakers(fetchedSpeakers);
    };

    fetchSpeakers();
  }, []);

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">語り手を選ぶ</h1>

      <div className="space-y-6">
        {speakers.map((speaker) => (
          <div
            key={speaker.id}
            className="border rounded-lg p-4 bg-white shadow-md"
          >
            <h2 className="text-xl font-semibold mb-1">{speaker.nickname}</h2>
            <p className="text-green-700 mb-2">「{speaker.message}」</p>
            <p className="text-gray-700 text-sm mb-2">{speaker.profile}</p>

            <div className="flex flex-wrap gap-2 mb-4">
              {speaker.tags.map((tag, index) => (
                <span
                  key={index}
                  className="bg-gray-200 text-gray-700 text-xs px-2 py-1 rounded"
                >
                  #{tag}
                </span>
              ))}
            </div>

            <button
              onClick={() => router.push(`/reserve/${speaker.id}`)}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              この人を予約する
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
