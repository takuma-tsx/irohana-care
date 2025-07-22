export default function SignupPage() {
  return (
    <div className="max-w-md mx-auto px-4 py-12">
      <h1 className="text-2xl font-bold mb-6 text-center">新規登録</h1>
      <form className="space-y-4">
        <input
          type="text"
          placeholder="ニックネーム"
          className="w-full border px-4 py-2 rounded"
        />
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
          登録する
        </button>
      </form>
    </div>
  )
}
