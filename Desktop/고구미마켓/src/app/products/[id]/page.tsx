import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { cn, timeAgo } from "@/lib/utils";
import ImageCarousel from "@/components/ImageCarousel";
import DeleteButton from "@/components/DeleteButton";
import StatusSelector from "@/components/StatusSelector";

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: product } = await supabase
    .from("products")
    .select("*")
    .eq("id", id)
    .single();

  if (!product) notFound();

  // image_urls 배열 우선, 없으면 image_url 단일 이미지 폴백
  const images: string[] =
    product.image_urls?.length > 0
      ? product.image_urls
      : product.image_url
      ? [product.image_url]
      : [];

  return (
    <div className="bg-background min-h-screen pb-24">
      {/* 헤더 */}
      <header className="bg-background border-b sticky top-0 z-10">
        <div className="max-w-2xl mx-auto px-4 h-14 flex items-center gap-3">
          <a
            href="/products"
            className={cn(buttonVariants({ variant: "ghost", size: "icon-sm" }))}
            aria-label="뒤로가기"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </a>
          <span className="font-semibold text-base truncate flex-1">{product.title}</span>
          <a
            href={`/products/${product.id}/edit`}
            className={cn(buttonVariants({ variant: "ghost", size: "sm" }))}
          >
            수정
          </a>
          <DeleteButton productId={product.id} />
        </div>
      </header>

      <div className="max-w-2xl mx-auto">
        {/* 이미지 캐러셀 */}
        <ImageCarousel images={images} alt={product.title} />

        {/* 판매자 정보 */}
        <div className="flex items-center gap-3 px-4 py-4 border-b">
          <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center text-lg flex-shrink-0">
            👤
          </div>
          <div>
            <p className="font-medium text-sm text-foreground">{product.seller_name}</p>
            {product.location && (
              <p className="text-xs text-muted-foreground">{product.location}</p>
            )}
          </div>
        </div>

        {/* 상품 정보 */}
        <div className="px-4 py-5 border-b space-y-3">
          <div className="flex items-center gap-2 flex-wrap">
            <StatusSelector productId={product.id} initialStatus={product.status} />
            {product.category && (
              <span className="text-xs text-muted-foreground">{product.category}</span>
            )}
          </div>

          <h1 className="text-xl font-bold text-foreground">{product.title}</h1>

          <p className="text-xs text-muted-foreground">{timeAgo(product.created_at)}</p>

          {product.description && (
            <p className="text-sm text-foreground leading-relaxed whitespace-pre-line">
              {product.description}
            </p>
          )}

          {(product.chat_count > 0 || product.like_count > 0) && (
            <div className="flex items-center gap-3 pt-1 text-xs text-muted-foreground">
              {product.chat_count > 0 && <span>💬 채팅 {product.chat_count}</span>}
              {product.like_count > 0 && <span>♥ 관심 {product.like_count}</span>}
            </div>
          )}
        </div>
      </div>

      {/* 하단 액션 바 */}
      <div className="fixed bottom-0 inset-x-0 bg-background border-t z-10">
        <div className="max-w-2xl mx-auto px-4 h-16 flex items-center gap-4">
          <button className="flex flex-col items-center gap-0.5 text-muted-foreground hover:text-primary transition-colors">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
            </svg>
            <span className="text-[10px]">찜</span>
          </button>

          <div className="flex-1 flex items-center justify-between">
            <p className="font-bold text-lg text-foreground">
              ₩{product.price.toLocaleString()}
            </p>
            <div className="flex gap-2">
              <a
                href={`/chat?product=${product.id}`}
                className={cn(buttonVariants({ variant: "outline" }), "rounded-xl px-4")}
              >
                채팅하기
              </a>
              <a
                href={`/checkout?productId=${product.id}`}
                className={cn(buttonVariants({ variant: "default" }), "rounded-xl px-4")}
              >
                구매하기
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
