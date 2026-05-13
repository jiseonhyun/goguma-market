import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import PaymentWidget from "@/components/PaymentWidget";
import { ANONYMOUS } from "@tosspayments/payment-widget-sdk";

interface CheckoutPageProps {
  searchParams: Promise<{ productId?: string }>;
}

export default async function CheckoutPage({ searchParams }: CheckoutPageProps) {
  const { productId } = await searchParams;
  if (!productId) notFound();

  const supabase = await createClient();

  const { data: product } = await supabase
    .from("products")
    .select("id, title, price, status")
    .eq("id", productId)
    .single();

  if (!product) notFound();
  if (product.status === "판매완료") redirect(`/products/${productId}`);

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // 로그인 사용자는 user.id, 비로그인은 ANONYMOUS
  const customerKey = user?.id ?? ANONYMOUS;

  return (
    <div className="bg-background min-h-screen pb-10">
      <header className="bg-background border-b sticky top-0 z-10">
        <div className="max-w-2xl mx-auto px-4 h-14 flex items-center gap-3">
          <a href={`/products/${product.id}`} aria-label="뒤로가기">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </a>
          <span className="font-semibold text-base">결제</span>
        </div>
      </header>

      <div className="max-w-2xl mx-auto px-4 py-6 space-y-6">
        {/* 상품 요약 */}
        <div className="rounded-2xl border p-4 space-y-1">
          <p className="text-xs text-muted-foreground">구매 상품</p>
          <p className="font-semibold text-foreground">{product.title}</p>
          <p className="text-lg font-bold text-orange-500">
            ₩{product.price.toLocaleString()}
          </p>
        </div>

        {/* 결제 위젯 */}
        <PaymentWidget
          productId={product.id}
          productTitle={product.title}
          price={product.price}
          customerKey={customerKey}
        />
      </div>
    </div>
  );
}
