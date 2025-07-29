"use client";

import { useEffect, useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import {
  doc,
  getDoc,
  setDoc,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { auth, db } from "@/lib/firebase";

export default function ReservePage() {
  const [date, setDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [isDateSelected, setIsDateSelected] = useState(false);
  const [view, setView] = useState<"month" | "year" | "decade" | "century">(
    "month",
  );
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [checking, setChecking] = useState(false);
  const [error, setError] = useState("");

  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const editId = searchParams.get("edit");

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

  const handleOpenModal = async () => {
    if (!canReserve) return;

    setChecking(true);
    setError("");

    const targetDate = date!.toISOString().slice(0, 10);
    try {
      const q = query(
        collection(db, "reservations"),
        where("speakerId", "==", params.id),
        where("date", "==", targetDate),
        where("time", "==", selectedTime),
      );
      const snapshot = await getDocs(q);

      const isConflict = snapshot.docs.some((doc) => doc.id !== editId); // 自分以外

      if (isConflict) {
        setError(
          "この日時はすでに予約されています。別の時間を選んでください。",
        );
        return;
      }

      setShowModal(true);
    } catch (e) {
      setError("予約確認中にエラーが発生しました。");
      console.error(e);
    } finally {
      setChecking(false);
    }
  };

  const handleSubmit = async () => {
    if (!date || !selectedTime) return;

    const user = auth.currentUser;
    if (!user) {
      alert("ログインが必要です");
      router.push("/login");
      return;
    }

    const data = {
      userId: user.uid,
      speakerId: params.id,
      date: date.toISOString().slice(0, 10),
      time: selectedTime,
      updatedAt: new Date(),
    };

    try {
      if (editId) {
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

          {error && <p className="text-red-500 mb-4">{error}</p>}

          <button
            onClick={handleOpenModal}
            disabled={!canReserve || checking}
            className="mt-6 bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
          >
            {checking ? "確認中..." : editId ? "予約を変更する" : "予約する"}
          </button>
        </>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center transition-opacity duration-300">
          <div className="bg-white p-6 rounded shadow-md max-w-md w-full animate-fade-in">
            <h2 className="text-xl font-semibold mb-4">予約内容の確認</h2>
            <p className="mb-2">
              <strong>日付：</strong> {date?.toLocaleDateString()}
            </p>
            <p className="mb-4">
              <strong>時間：</strong> {selectedTime}
            </p>
            <div className="flex justify-center gap-6 mt-6">
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-700 hover:underline"
              >
                戻る
              </button>
              <button
                onClick={handleSubmit}
                className="bg-orange-600 text-white px-4 py-2 rounded hover:bg-orange-500"
              >
                予約確定
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
