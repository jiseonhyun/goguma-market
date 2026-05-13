import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import BackButton from "@/components/BackButton";

interface FailPageProps {
  searchParams: Promise<{
    code?: string;
    message?: string;
    orderId?: string;
  }>;
}

export default async function PaymentFailPage({ searchParams }: FailPageProps) {
  const { code, message, orderId } = await searchParams;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 text-center gap-6">
      <div className="text-6xl">😢</div>
      <div className="space-y-1">
        <h1 className="text-2xl font-bold text-foreground">결제 실패</h1>
        <p className="text-sm text-muted-foreground">
          {message ?? "결제 중 문제가 발생했습니다."}
        </p>
      </div>

      {(code || orderId) && (
        <div className="w-full max-w-sm rounded-2xl border p-5 space-y-3 text-left">
          {code && (
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">오류 코드</span>
              <span className="font-mono text-destructive">{code}</span>
            </div>
          )}
          {orderId && (
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>주문번호</span>
              <span className="font-mono truncate max-w-[180px]">{orderId}</span>
            </div>
          )}
        </div>
      )}

      <div className="flex gap-3">
        <BackButton label="다시 시도" />
        <Link href="/products" className={cn(buttonVariants({ variant: "default" }), "rounded-xl")}>
          쇼핑 계속하기
        </Link>
      </div>
    </div>
  );
}
