"use client";

import { useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { useParams } from "next/navigation";

// 日本時間の「今日」
const todayJST = new Date(
  new Date().toLocaleString("ja-JP", { timeZone: "Asia/Tokyo" }),
);
todayJST.setHours(0, 0, 0, 0);

// 翌日
const tomorrow = new Date(todayJST);
tomorrow.setDate(todayJST.getDate() + 1);

export default function ReservePage() {
  const [date, setDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [isDateSelected, setIsDateSelected] = useState(false);
  const params = useParams();

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

  return (
    <div className="max-w-xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold mb-6">予約ページ</h1>
      <p className="mb-4 text-gray-600">語り手ID: {params?.id}</p>

      <Calendar
        onChange={(value) => {
          setDate(value as Date);
          setIsDateSelected(true);
          setSelectedTime(null);
        }}
        onActiveStartDateChange={() => {
          // 月を移動したら選択リセット
          setIsDateSelected(false);
          setDate(null);
          setSelectedTime(null);
        }}
        value={date}
        locale="ja-JP"
        className="rounded border mb-6"
        minDate={tomorrow} // 今日以前を選べない
      />

      {isDateSelected && (
        <>
          <h2 className="text-lg font-semibold mb-2">時間を選択してください</h2>
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

      {date && selectedTime && (
        <div className="mt-4 text-green-700 font-medium">
          選択された日時：{date.toLocaleDateString("ja-JP")} {selectedTime}
        </div>
      )}
    </div>
  );
}
