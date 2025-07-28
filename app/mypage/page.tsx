"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  getDoc,
  deleteDoc,
} from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "@/lib/firebase";

interface Reservation {
  id: string;
  date: string;
  time: string;
  speakerId: string;
  speakerName?: string;
}

export default function MyPage() {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        router.replace("/login");
        return;
      }

      try {
        const q = query(
          collection(db, "reservations"),
          where("userId", "==", user.uid),
        );
        const querySnapshot = await getDocs(q);

        const data: Reservation[] = [];

        for (const docSnap of querySnapshot.docs) {
          const d = docSnap.data();
          let speakerName = "";

          if (d.speakerId) {
            const speakerDoc = await getDoc(doc(db, "speakers", d.speakerId));
            speakerName = speakerDoc.exists() ? speakerDoc.data().name : "不明";
          }

          data.push({
            id: docSnap.id,
            date: d.date,
            time: d.time,
            speakerId: d.speakerId,
            speakerName,
          });
        }

        setReservations(data);
      } catch (e) {
        console.error("予約取得エラー", e);
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, [router]);

  const handleCancel = async (id: string) => {
    if (!confirm("本当にキャンセルしますか？")) return;
    try {
      await deleteDoc(doc(db, "reservations", id));
      setReservations((prev) => prev.filter((r) => r.id !== id));
    } catch (err) {
      alert("キャンセルに失敗しました");
      console.error(err);
    }
  };

  const handleEdit = (r: Reservation) => {
    router.push(`/reserve/${r.speakerId}?edit=${r.id}`);
  };

  if (loading) return <p className="text-center mt-10">読み込み中...</p>;

  return (
    <div className="max-w-xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold mb-6">マイページ（予約履歴）</h1>

      {reservations.length === 0 ? (
        <p>予約履歴が見つかりませんでした。</p>
      ) : (
        <ul className="space-y-4">
          {reservations.map((rsv) => (
            <li key={rsv.id} className="border rounded p-4 shadow-sm bg-white">
              <p className="mb-1">
                <strong>日付：</strong>
                {rsv.date}
              </p>
              <p className="mb-1">
                <strong>時間：</strong>
                {rsv.time}
              </p>
              <p className="mb-3">
                <strong>語り手：</strong>
                {rsv.speakerName}
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => handleEdit(rsv)}
                  className="bg-yellow-500 text-white px-4 py-1 rounded hover:bg-yellow-600"
                >
                  変更
                </button>
                <button
                  onClick={() => handleCancel(rsv.id)}
                  className="bg-red-500 text-white px-4 py-1 rounded hover:bg-red-600"
                >
                  キャンセル
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
