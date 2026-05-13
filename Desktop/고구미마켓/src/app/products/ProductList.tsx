"use client";

import { useState, useMemo } from "react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { timeAgo } from "@/lib/utils";

const CATEGORIES = ["전체", "디지털기기", "생활가전", "가구/인테리어", "의류/잡화", "스포츠/레저", "반려동물", "식물", "기타"];

type Product = {
  id: string;
  title: string;
  price: number;
  image_url: string | null;
  seller_name: string;
  location: string | null;
  status: string;
  category: string | null;
  like_count: number;
  chat_count: number;
  created_at: string;
};

export default function ProductList({ products }: { products: Product[] }) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("전체");

  const filtered = useMemo(() => {
    return products.filter((p) => {
      const matchQuery = p.title.toLowerCase().includes(query.toLowerCase());
      const matchCat = category === "전체" || p.category === category;
      return matchQuery && matchCat;
    });
  }, [products, query, category]);

  return (
    <>
      {/* 검색바 */}
      <div className="sticky top-14 z-10 bg-background border-b px-4 py-2.5">
        <div className="relative">
          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground"
            fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
          >
            <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
          </svg>
          <Input
            type="search"
            placeholder="어떤 물건을 찾고 있나요?"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-9 rounded-full bg-muted border-0 focus-visible:ring-primary/50"
          />
        </div>
      </div>

      {/* 카테고리 탭 */}
      <div className="sticky top-[6.25rem] z-10 bg-background border-b">
        <div className="flex overflow-x-auto scrollbar-hide px-3 py-2 gap-2">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`flex-shrink-0 px-3.5 py-1.5 rounded-full text-sm font-medium transition-colors ${
                category === cat
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* 상품 목록 */}
      <main className="max-w-2xl mx-auto bg-background pb-20">
        {filtered.length === 0 ? (
          <div className="text-center py-24">
            <p className="text-5xl mb-4">🍠</p>
            <p className="text-base font-medium text-foreground">
              {query || category !== "전체" ? "검색 결과가 없습니다." : "등록된 상품이 없습니다."}
            </p>
            {!query && category === "전체" && (
              <p className="text-sm text-muted-foreground mt-1">첫 번째 상품을 등록해보세요!</p>
            )}
          </div>
        ) : (
          <ul className="divide-y divide-border">
            {filtered.map((product) => (
              <li key={product.id}>
                <a
                  href={`/products/${product.id}`}
                  className="flex gap-4 px-4 py-4 hover:bg-muted/40 transition-colors"
                >
                  {/* 썸네일 */}
                  <div className="w-[5.5rem] h-[5.5rem] rounded-2xl overflow-hidden bg-muted flex-shrink-0 flex items-center justify-center">
                    {product.image_url ? (
                      <img
                        src={product.image_url}
                        alt={product.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-3xl">🍠</span>
                    )}
                  </div>

                  {/* 정보 */}
                  <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5">
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <p className="font-medium text-foreground line-clamp-2 leading-snug">
                          {product.title}
                        </p>
                        {product.status !== "판매중" && (
                          <Badge
                            variant={product.status === "예약중" ? "secondary" : "outline"}
                            className={`flex-shrink-0 text-xs mt-0.5 ${
                              product.status === "예약중"
                                ? "bg-yellow-100 text-yellow-700 hover:bg-yellow-100"
                                : "text-muted-foreground"
                            }`}
                          >
                            {product.status}
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        {product.location && `${product.location} · `}
                        {timeAgo(product.created_at)}
                      </p>
                    </div>

                    <div className="flex items-end justify-between mt-1.5">
                      <p className="font-bold text-foreground">₩{product.price.toLocaleString()}</p>
                      {(product.like_count > 0 || product.chat_count > 0) && (
                        <div className="flex items-center gap-2.5 text-xs text-muted-foreground">
                          {product.chat_count > 0 && <span>💬 {product.chat_count}</span>}
                          {product.like_count > 0 && <span>♥ {product.like_count}</span>}
                        </div>
                      )}
                    </div>
                  </div>
                </a>
              </li>
            ))}
          </ul>
        )}
      </main>
    </>
  );
}
