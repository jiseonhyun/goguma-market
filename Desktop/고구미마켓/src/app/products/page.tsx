import { createClient } from "@/lib/supabase/server";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import BottomNav from "@/components/BottomNav";
import ProductList from "./ProductList";

export default async function ProductsPage() {
  const supabase = await createClient();
  const { data: products, error } = await supabase
    .from("products")
    .select("id, title, price, image_url, seller_name, location, status, category, like_count, chat_count, created_at")
    .order("created_at", { ascending: false });

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
          <a
            href="/products/new"
            className={cn(buttonVariants({ variant: "ghost", size: "sm" }))}
          >
            글쓰기
          </a>
        </div>
      </header>

      <ProductList products={products ?? []} />

      {/* 플로팅 글쓰기 버튼 */}
      <a
        href="/products/new"
        className={cn(
          buttonVariants({ variant: "default" }),
          "fixed bottom-20 right-1/2 translate-x-1/2 rounded-full shadow-lg px-5 z-10 gap-1.5"
        )}
      >
        <span className="text-base leading-none font-bold">+</span> 글쓰기
      </a>

      <BottomNav />
    </div>
  );
}
