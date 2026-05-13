import { redirect } from "next/navigation";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface SuccessPageProps {
  searchParams: Promise<{
    paymentKey?: string;
    orderId?: string;
    amount?: string;
  }>;
}

async function confirmPayment(paymentKey: string, orderId: string, amount: number) {
  const secretKey = process.env.TOSS_SECRET_KEY ?? "test_gsk_docs_OapjeXZnBX48W7bJnGPV2MQL8Zyl";
  const encoded = Buffer.from(`${secretKey}:`).toString("base64");

  const res = await fetch("https://api.tosspayments.com/v1/payments/confirm", {
    method: "POST",
    headers: {
      Authorization: `Basic ${encoded}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ paymentKey, orderId, amount }),
    cache: "no-store",
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message ?? "결제 승인 실패");
  }

  return res.json();
}

export default async function PaymentSuccessPage({ searchParams }: SuccessPageProps) {
  const { paymentKey, orderId, amount } = await searchParams;

  if (!paymentKey || !orderId || !amount) redirect("/");

  let payment: { orderName: string; method: string; totalAmount: number } | null = null;
  let errorMessage: string | null = null;

  try {
    payment = await confirmPayment(paymentKey, orderId, Number(amount));
  } catch (err) {
    errorMessage = err instanceof Error ? err.message : "결제 승인 중 오류가 발생했습니다.";
  }

  if (errorMessage) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-4 text-center gap-4">
        <div className="text-5xl">⚠️</div>
        <h1 className="text-xl font-bold text-foreground">결제 승인 실패</h1>
        <p className="text-sm text-muted-foreground">{errorMessage}</p>
        <Link href="/" className={cn(buttonVariants({ variant: "default" }), "rounded-xl")}>
          홈으로
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 text-center gap-6">
      <div className="text-6xl">🎉</div>
      <div className="space-y-1">
        <h1 className="text-2xl font-bold text-foreground">결제 완료!</h1>
        <p className="text-sm text-muted-foreground">결제가 정상적으로 처리되었습니다.</p>
      </div>

      <div className="w-full max-w-sm rounded-2xl border p-5 space-y-3 text-left">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">주문명</span>
          <span className="font-medium text-foreground">{payment?.orderName}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">결제 수단</span>
          <span className="font-medium text-foreground">{payment?.method}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">결제 금액</span>
          <span className="font-bold text-orange-500">
            ₩{payment?.totalAmount?.toLocaleString()}
          </span>
        </div>
        <div className="flex justify-between text-xs text-muted-foreground pt-1 border-t">
          <span>주문번호</span>
          <span className="font-mono truncate max-w-[180px]">{orderId}</span>
        </div>
      </div>

      <div className="flex gap-3">
        <Link href="/products" className={cn(buttonVariants({ variant: "outline" }), "rounded-xl")}>
          쇼핑 계속하기
        </Link>
        <Link href="/" className={cn(buttonVariants({ variant: "default" }), "rounded-xl")}>
          홈으로
        </Link>
      </div>
    </div>
  );
}
