import { notFound } from "next/navigation";

type Props = {
  params: { id: string };
};

export default function ReservePage({ params }: Props) {
  const { id } = params;

  if (!id) return notFound();

  return (
    <main className="max-w-2xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold mb-4">予約ページ</h1>
      <p className="text-gray-700">語り手ID: {id}</p>
      <p className="mt-4">※ このページは現在、仮の状態です。</p>
    </main>
  );
}
