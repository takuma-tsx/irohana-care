"use client";

import { useEffect, useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";

export default function ReservePage() {
  const [date, setDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [isDateSelected, setIsDateSelected] = useState(false);
  const [view, setView] = useState<"month" | "year" | "decade" | "century">(
    "month",
  );
  const [loading, setLoading] = useState(true);

  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();

  const editId = searchParams.get("edit"); // ← 変更対象ID（予約ID）

  const now = new Date();
  const todayJST = new Date(
    now.toLocaleString("ja-JP", { timeZone: "Asia/Tokyo" }),
  );
  todayJST.setHours(0, 0, 0, 0);

  const timeSlots = [
    "10:00",
    "11:00",
    "12:00",
    "13:00",
    "14:00",
    "15:00",
    "16:00",
    "17:00",
    "18:00",
    "19:00",
    "20:00",
    "21:00",
  ];

  const isDateValid =
    date instanceof Date &&
    !isNaN(date.getTime()) &&
    date.getTime() > todayJST.getTime() &&
    isDateSelected &&
    view === "month";

  const canReserve = isDateValid && selectedTime !== null;

  // 編集モードの初期データ読み込み
  useEffect(() => {
    const fetchEditData = async () => {
      if (!editId) {
        setLoading(false);
        return;
      }

      const docRef = doc(db, "reservations", editId);
      const snap = await getDoc(docRef);
      if (snap.exists()) {
        const d = snap.data();
        const [y, m, d2] = d.date.split("-").map(Number);
        const loadedDate = new Date(y, m - 1, d2);
        setDate(loadedDate);
        setSelectedTime(d.time);
        setIsDateSelected(true);
      }
      setLoading(false);
    };

    fetchEditData();
  }, [editId]);

  const handleSubmit = async () => {
    if (!canReserve) return;

    const user = auth.currentUser;
    if (!user) {
      alert("ログインが必要です");
      router.push("/login");
      return;
    }

    const data = {
      userId: user.uid,
      speakerId: params.id,
      date: date!.toISOString().slice(0, 10),
      time: selectedTime,
      updatedAt: new Date(),
    };

    try {
      if (editId) {
        // 上書き保存
        await setDoc(doc(db, "reservations", editId), data, { merge: true });
      } else {
        const newId = crypto.randomUUID();
        await setDoc(doc(db, "reservations", newId), {
          ...data,
          createdAt: new Date(),
        });
      }

      router.push(
        `/complete?date=${data.date}&time=${data.time}&speaker=${params.id}`,
      );
    } catch (e) {
      alert("予約に失敗しました");
      console.error(e);
    }
  };

  return (
    <div className="max-w-xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold mb-6">
        {editId ? "予約変更ページ" : "予約ページ"}
      </h1>
      <p className="mb-2 text-gray-600">語り手ID: {params?.id}</p>
      <p className="mb-4 text-sm text-red-500">
        ※当日のご予約は承っておりません。翌日以降の日付をお選びください。
      </p>

      {loading ? (
        <p>読み込み中...</p>
      ) : (
        <>
          <Calendar
            onClickDay={(value) => {
              const selected = new Date(value.toString());
              if (selected > todayJST && view === "month") {
                setDate(selected);
                setSelectedTime(null);
                setIsDateSelected(true);
              } else {
                setDate(null);
                setSelectedTime(null);
                setIsDateSelected(false);
              }
            }}
            onViewChange={({ view }) => setView(view)}
            onActiveStartDateChange={({ view }) => setView(view)}
            value={date}
            locale="ja-JP"
            minDate={todayJST}
            className="rounded border mb-6"
          />

          {isDateValid && (
            <>
              <h2 className="text-lg font-semibold mb-2">
                時間を選択してください
              </h2>
              <div className="flex flex-wrap gap-3 mb-6">
                {timeSlots.map((time) => (
                  <button
                    key={time}
                    onClick={() => setSelectedTime(time)}
                    className={`px-4 py-2 border rounded ${
                      selectedTime === time
                        ? "bg-blue-500 text-white"
                        : "bg-white text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    {time}
                  </button>
                ))}
              </div>
            </>
          )}

          {isDateValid && selectedTime && (
            <div className="mt-4 text-green-700 font-medium">
              選択された日時：{date.toLocaleDateString()} {selectedTime}
            </div>
          )}

          <button
            onClick={handleSubmit}
            disabled={!canReserve}
            className="mt-6 bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 disabled:opacity-40"
          >
            {editId ? "予約を変更する" : "予約する"}
          </button>
        </>
      )}
    </div>
  );
}
