"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import {
  collection,
  addDoc,
  getDoc,
  doc,
  updateDoc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";

interface ReservationData {
  date: string;
  time: string;
}

const TIME_OPTIONS = ["10:00", "11:00", "13:00", "14:00", "15:00", "16:00"];

export default function ReservePage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const speakerId = params.speakerId as string;
  const editId = searchParams.get("edit");

  const [user, setUser] = useState<any>(null);
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [speakerName, setSpeakerName] = useState("");

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      if (!u) {
        router.replace("/login");
      } else {
        setUser(u);
      }
    });
    return () => unsub();
  }, [router]);

  useEffect(() => {
    const fetchSpeaker = async () => {
      try {
        const docRef = doc(db, "speakers", speakerId);
        const snap = await getDoc(docRef);
        if (snap.exists()) {
          setSpeakerName(snap.data().name || "");
        }
      } catch (e) {
        console.error("話し手情報取得エラー", e);
      }
    };
    fetchSpeaker();
  }, [speakerId]);

  useEffect(() => {
    if (!editId) return;
    const fetchData = async () => {
      try {
        const snap = await getDoc(doc(db, "reservations", editId));
        if (snap.exists()) {
          const d = snap.data() as ReservationData;
          setDate(d.date);
          setTime(d.time);
        }
      } catch (e) {
        console.error("編集データ取得失敗", e);
      }
    };
    fetchData();
  }, [editId]);

  const handleSubmit = async () => {
    if (!date || !time) {
      setError("日付と時間を選択してください");
      return;
    }
    setError("");
    setShowModal(true);
  };

  const confirmReservation = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const q = query(
        collection(db, "reservations"),
        where("speakerId", "==", speakerId),
        where("date", "==", date),
        where("time", "==", time),
      );
      const querySnap = await getDocs(q);

      const duplicate = querySnap.docs.some((docSnap) => {
        return editId ? docSnap.id !== editId : true;
      });

      if (duplicate) {
        setError(
          "同じ日時に予約がすでに存在します。別の時間を選んでください。",
        );
        setShowModal(false);
        setLoading(false);
        return;
      }

      if (editId) {
        const ref = doc(db, "reservations", editId);
        await updateDoc(ref, { date, time });
      } else {
        await addDoc(collection(db, "reservations"), {
          userId: user.uid,
          speakerId,
          date,
          time,
        });
      }

      router.push("/mypage");
    } catch (e) {
      alert("予約に失敗しました");
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold mb-6">予約フォーム</h1>
      <p className="mb-4">語り手：{speakerName}</p>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-semibold mb-1">日付</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full border px-3 py-2 rounded"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold mb-1">時間</label>
          <div className="grid grid-cols-3 gap-3">
            {TIME_OPTIONS.map((t) => (
              <label
                key={t}
                className={`border rounded px-3 py-2 text-center cursor-pointer ${
                  time === t
                    ? "bg-blue-600 text-white"
                    : "bg-white hover:bg-gray-100"
                }`}
              >
                <input
                  type="radio"
                  name="time"
                  value={t}
                  checked={time === t}
                  onChange={() => setTime(t)}
                  className="hidden"
                />
                {t}
              </label>
            ))}
          </div>
        </div>

        {error && <p className="text-red-500">{error}</p>}

        <button
          onClick={handleSubmit}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-500"
        >
          確認画面へ
        </button>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-md w-full max-w-sm">
            <h2 className="text-lg font-semibold mb-4">予約内容の確認</h2>
            <p className="mb-2">
              <strong>語り手：</strong> {speakerName}
            </p>
            <p className="mb-2">
              <strong>日付：</strong> {date}
            </p>
            <p className="mb-4">
              <strong>時間：</strong> {time}
            </p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-600 hover:underline"
              >
                戻る
              </button>
              <button
                onClick={confirmReservation}
                disabled={loading}
                className="bg-orange-600 text-white px-4 py-2 rounded hover:bg-orange-500"
              >
                {loading ? "送信中…" : "予約確定"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
