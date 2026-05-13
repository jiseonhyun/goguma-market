"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Input } from "@/components/ui/input";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import ImageUploader from "./ImageUploader";

const CATEGORIES = [
  "디지털기기", "생활가전", "가구/인테리어", "의류/잡화",
  "스포츠/레저", "반려동물", "식물", "기타",
];

type Product = {
  id: string;
  title: string;
  price: number;
  description: string | null;
  image_url: string | null;
  image_urls: string[] | null;
  seller_name: string;
  location: string | null;
  category: string | null;
};

interface Props {
  initialData?: Product;
  productId?: string;
}

export default function ProductForm({ initialData, productId }: Props) {
  const router = useRouter();
  const isEdit = !!productId;

  const [form, setForm] = useState({
    title: initialData?.title ?? "",
    price: initialData?.price?.toString() ?? "",
    description: initialData?.description ?? "",
    seller_name: initialData?.seller_name ?? "",
    location: initialData?.location ?? "",
    category: initialData?.category ?? "",
  });

  const [imageUrls, setImageUrls] = useState<string[]>(() => {
    if (initialData?.image_urls?.length) return initialData.image_urls;
    if (initialData?.image_url) return [initialData.image_url];
    return [];
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!form.title.trim()) errs.title = "상품명을 입력해주세요.";
    if (!form.price) errs.price = "가격을 입력해주세요.";
    else if (Number(form.price) < 0) errs.price = "올바른 가격을 입력해주세요.";
    if (!form.seller_name.trim()) errs.seller_name = "판매자 이름을 입력해주세요.";
    return errs;
  };

  const handleChange = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => {
      const next = { ...prev };
      delete next[field];
      return next;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }

    setLoading(true);
    const supabase = createClient();

    const payload = {
      title: form.title.trim(),
      price: Number(form.price),
      description: form.description.trim() || null,
      seller_name: form.seller_name.trim(),
      location: form.location.trim() || null,
      category: form.category || null,
      image_url: imageUrls[0] ?? null,
      image_urls: imageUrls,
    };

    const { error } = isEdit
      ? await supabase.from("products").update(payload).eq("id", productId)
      : await supabase.from("products").insert(payload);

    setLoading(false);

    if (error) {
      setErrors({ submit: "저장 중 오류가 발생했습니다. 다시 시도해주세요." });
      return;
    }

    router.push(isEdit ? `/products/${productId}` : "/products");
    router.refresh();
  };

  const cancelHref = isEdit ? `/products/${productId}` : "/products";

  return (
    <div className="bg-background min-h-screen">
      <header className="bg-background border-b sticky top-0 z-10">
        <div className="max-w-2xl mx-auto px-4 h-14 flex items-center justify-between">
          <h1 className="text-base font-bold">{isEdit ? "상품 수정" : "내 물건 팔기"}</h1>
          <a
            href={cancelHref}
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            취소
          </a>
        </div>
      </header>

      <form onSubmit={handleSubmit} noValidate className="max-w-2xl mx-auto px-4 py-6 space-y-5">
        {/* 사진 */}
        <Field label="사진" hint="최대 5장">
          <ImageUploader value={imageUrls} onChange={setImageUrls} />
        </Field>

        {/* 상품명 */}
        <Field label="상품명" required error={errors.title}>
          <Input
            placeholder="상품명을 입력하세요"
            value={form.title}
            onChange={(e) => handleChange("title", e.target.value)}
            className={errors.title ? "border-destructive" : ""}
          />
        </Field>

        {/* 카테고리 */}
        <Field label="카테고리">
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => handleChange("category", form.category === cat ? "" : cat)}
                className={cn(
                  "px-3 py-1.5 rounded-full text-sm border transition-colors",
                  form.category === cat
                    ? "border-primary bg-primary/10 text-primary font-medium"
                    : "border-border text-muted-foreground hover:border-primary/50"
                )}
              >
                {cat}
              </button>
            ))}
          </div>
        </Field>

        {/* 가격 */}
        <Field label="가격" required error={errors.price}>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm select-none">
              ₩
            </span>
            <Input
              type="number"
              placeholder="0"
              min={0}
              value={form.price}
              onChange={(e) => handleChange("price", e.target.value)}
              className={cn("pl-7", errors.price ? "border-destructive" : "")}
            />
          </div>
        </Field>

        {/* 상품 설명 */}
        <Field label="상품 설명">
          <textarea
            placeholder="상품 상태, 사용 기간 등 자세한 설명을 입력해주세요."
            value={form.description}
            onChange={(e) => handleChange("description", e.target.value)}
            rows={5}
            className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/50 resize-none transition-shadow"
          />
        </Field>

        {/* 거래 희망 장소 */}
        <Field label="거래 희망 장소">
          <Input
            placeholder="예: 마포구 합정동"
            value={form.location}
            onChange={(e) => handleChange("location", e.target.value)}
          />
        </Field>

        {/* 판매자 이름 */}
        <Field label="판매자 이름" required error={errors.seller_name}>
          <Input
            placeholder="닉네임을 입력하세요"
            value={form.seller_name}
            onChange={(e) => handleChange("seller_name", e.target.value)}
            className={errors.seller_name ? "border-destructive" : ""}
          />
        </Field>

        {errors.submit && <p className="text-sm text-destructive">{errors.submit}</p>}

        <div className="flex gap-3 pt-2 pb-8">
          <a
            href={cancelHref}
            className={cn(buttonVariants({ variant: "outline" }), "flex-1 justify-center")}
          >
            취소
          </a>
          <Button type="submit" disabled={loading} className="flex-1">
            {loading ? "저장 중…" : isEdit ? "수정 완료" : "등록"}
          </Button>
        </div>
      </form>
    </div>
  );
}

function Field({
  label, required, hint, error, children,
}: {
  label: string;
  required?: boolean;
  hint?: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-center gap-1.5">
        <label className="text-sm font-medium text-foreground">{label}</label>
        {required && <span className="text-xs text-primary font-bold">*</span>}
        {hint && <span className="text-xs text-muted-foreground">{hint}</span>}
      </div>
      {children}
      {error && <p className="text-xs text-destructive mt-1">{error}</p>}
    </div>
  );
}
