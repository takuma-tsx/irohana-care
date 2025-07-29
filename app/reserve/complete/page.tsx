"use client";

import { Suspense } from "react";
import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

// Suspenseにラップする内部コンポーネント
function ReserveCompleteInner() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const date = searchParams.get("date");
  const time = searchParams.get("time");
  const speakerId = searchParams.get("speaker");

  const [speakerName, setSpeakerName] = useState<string | null>(null);

  // ガード処理：dateが無ければ /reserve にリダイレクト
  useEffect(() => {
    if (!date) {
      router.replace("/reserve");
    }
  }, [date, router]);

  // Firestoreから話し手の名前を取得
  useEffect(() => {
    const fetchSpeakerName = async () => {
      if (!speakerId) return;
      const docRef = doc(db, "speakers", speakerId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        setSpeakerName(data.name ?? "名前未登録");
      } else {
        setSpeakerName("不明な語り手");
      }
    };

    fetchSpeakerName();
  }, [speakerId]);

  const formattedDate = date ? new Date(date).toLocaleDateString("ja-JP") : "";

  return (
    <div className="max-w-xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold mb-6 text-green-700">予約完了</h1>
      <p className="mb-4 text-gray-700">ご予約ありがとうございました。</p>

      <div className="mb-6 bg-gray-100 rounded p-4">
        <p className="mb-1">
          <span className="font-semibold">予約日：</span>
          {formattedDate}
        </p>
        <p className="mb-1">
          <span className="font-semibold">時間：</span>
          {time ?? "不明"}
        </p>
        <p>
          <span className="font-semibold">語り手：</span>
          {speakerName ?? "読み込み中..."}
        </p>
      </div>

      <button
        onClick={() =>
          router.push(
            `/mypage?date=${encodeURIComponent(date ?? "")}&time=${encodeURIComponent(time ?? "")}&speaker=${encodeURIComponent(speakerName ?? "")}`,
          )
        }
        className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600"
      >
        マイページへ戻る
      </button>
    </div>
  );
}

// 外側のコンポーネントでSuspenseラップ
export default function ReserveCompletePage() {
  return (
    <Suspense
      fallback={
        <div className="p-10 text-center text-gray-500">読み込み中...</div>
      }
    >
      <ReserveCompleteInner />
    </Suspense>
  );
}
