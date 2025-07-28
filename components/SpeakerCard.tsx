import Link from "next/link";

type SpeakerCardProps = {
  id: string;
  name: string;
  bio: string;
};

export default function SpeakerCard({ id, name, bio }: SpeakerCardProps) {
  return (
    <div className="border p-4 rounded shadow-sm">
      <h2 className="text-lg font-bold">{name}</h2>
      <p className="text-gray-600 mb-4">{bio}</p>
      <Link
        href={`/reserve/${id}`}
        className="inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        予約へ進む
      </Link>
    </div>
  );
}
