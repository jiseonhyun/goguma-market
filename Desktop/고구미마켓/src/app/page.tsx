export default function Home() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen gap-6">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-orange-500 mb-2">🍠 고구마마켓</h1>
        <p className="text-gray-600 text-lg">동네 이웃과 함께하는 중고거래</p>
      </div>
      <div className="flex gap-4">
        <a
          href="/products"
          className="px-6 py-3 bg-orange-500 text-white rounded-lg font-medium hover:bg-orange-600 transition-colors"
        >
          상품 둘러보기
        </a>
        <a
          href="/login"
          className="px-6 py-3 border border-orange-500 text-orange-500 rounded-lg font-medium hover:bg-orange-50 transition-colors"
        >
          로그인
        </a>
      </div>
    </main>
  );
}
