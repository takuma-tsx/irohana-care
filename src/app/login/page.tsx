export default function LoginPage() {
  return (
    <div className="max-w-md mx-auto px-4 py-12">
      <h1 className="text-2xl font-bold mb-6 text-center">ログイン</h1>
      <form className="space-y-4">
        <input
          type="email"
          placeholder="メールアドレス"
          className="w-full border px-4 py-2 rounded"
        />
        <input
          type="password"
          placeholder="パスワード"
          className="w-full border px-4 py-2 rounded"
        />
        <button className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
          ログイン
        </button>
      </form>
    </div>
  )
}
