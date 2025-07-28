// app/reserve/page.tsx
export default function ReserveTopPage() {
  return (
    <div className="max-w-xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold mb-6 text-green-700">
        予約ページへようこそ
      </h1>
      <p className="mb-4 text-gray-700">
        URLにIDを指定してアクセスしてください。
      </p>
      <p className="text-gray-500">例：/reserve/12345</p>
    </div>
  );
}
