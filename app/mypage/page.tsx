"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  collection,
  query,
  where,
  getDocs,
  Timestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/contexts/AuthContext";

type Reservation = {
  id: string;
  speakerId: string;
  datetime: Timestamp;
  status: string;
};

export default function MyPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user === undefined) return;
    if (!user) {
      router.push("/login");
      return;
    }

    const fetchReservations = async () => {
      try {
        const q = query(
          collection(db, "reservations"),
          where("userId", "==", user.uid),
        );
        const snapshot = await getDocs(q);
        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Reservation[];
        setReservations(data);
      } catch (err) {
        console.error("予約取得エラー:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchReservations();
  }, [user, router]);

  if (loading) return <p className="text-center mt-10">読み込み中...</p>;

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">予約履歴</h1>
      {reservations.length === 0 ? (
        <p>まだ予約はありません。</p>
      ) : (
        <ul className="space-y-4">
          {reservations.map((res) => {
            const date = res.datetime.toDate();
            const formatted = `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日 ${date
              .getHours()
              .toString()
              .padStart(
                2,
                "0",
              )}:${date.getMinutes().toString().padStart(2, "0")}`;

            return (
              <li key={res.id} className="border p-4 rounded shadow-sm">
                <p className="text-sm text-gray-500">{formatted}〜</p>
                <p className="font-semibold">スピーカーID: {res.speakerId}</p>
                <p className="text-sm text-gray-600">
                  ステータス: {res.status === "done" ? "完了" : "未完了"}
                </p>
                {res.status === "done" && (
                  <a
                    href={`/review/new?reservationId=${res.id}`}
                    className="text-blue-600 hover:underline text-sm"
                  >
                    レビューを書く
                  </a>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
