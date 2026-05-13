import { createClient } from "@/lib/supabase/server";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import BottomNav from "@/components/BottomNav";
import LogoutButton from "@/components/LogoutButton";
import ProductList from "./ProductList";

export default async function ProductsPage() {
  const supabase = await createClient();

  const [{ data: products, error }, { data: { user } }] = await Promise.all([
    supabase
      .from("products")
      .select("id, title, price, image_url, seller_name, location, status, category, like_count, chat_count, created_at")
      .order("created_at", { ascending: false }),
    supabase.auth.getUser(),
  ]);

  if (error) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-8">
        <p className="text-destructive">상품을 불러오지 못했습니다.</p>
      </div>
    );
  }

  return (
    <div className="bg-background min-h-screen">
      {/* 헤더 */}
      <header className="bg-background border-b sticky top-0 z-10">
        <div className="max-w-2xl mx-auto px-4 h-14 flex items-center justify-between">
          <h1 className="text-lg font-bold text-primary">🍠 고구마마켓</h1>

          <div className="flex items-center gap-1">
            {user ? (
              <>
                <a
                  href="/products/new"
                  className={cn(buttonVariants({ variant: "ghost", size: "sm" }))}
                >
                  상품 등록
                </a>
                <LogoutButton />
              </>
            ) : (
              <>
                <a
                  href="/login"
                  className={cn(buttonVariants({ variant: "ghost", size: "sm" }))}
                >
                  로그인
                </a>
                <a
                  href="/login?mode=signup"
                  className={cn(buttonVariants({ variant: "default", size: "sm" }))}
                >
                  회원가입
                </a>
              </>
            )}
          </div>
        </div>
      </header>

      <ProductList products={products ?? []} />

      {/* 플로팅 상품 등록 버튼 */}
      <a
        href="/products/new"
        aria-label="상품 등록"
        className={cn(
          buttonVariants({ variant: "default" }),
          "fixed bottom-20 right-5 w-14 h-14 rounded-full shadow-xl z-10 flex items-center justify-center p-0"
        )}
      >
        <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
        </svg>
      </a>

      <BottomNav />
    </div>
  );
}
