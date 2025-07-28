import SpeakerCard from "@/components/SpeakerCard";

const speakers = [
  { id: "1", name: "花子", bio: "介護経験5年のケアラーです。" },
  { id: "2", name: "太郎", bio: "高齢者向け傾聴ボランティア経験あり。" },
];

export default function SpeakersPage() {
  return (
    <main className="p-6 grid gap-4 md:grid-cols-2">
      {speakers.map((s) => (
        <SpeakerCard key={s.id} id={s.id} name={s.name} bio={s.bio} />
      ))}
    </main>
  );
}
