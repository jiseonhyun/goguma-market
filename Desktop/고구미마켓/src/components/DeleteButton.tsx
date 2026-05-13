"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function DeleteButton({ productId }: { productId: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    if (!confirm("정말 삭제하시겠어요? 삭제된 상품은 복구할 수 없습니다.")) return;

    setLoading(true);
    const supabase = createClient();
    const { error } = await supabase.from("products").delete().eq("id", productId);

    if (error) {
      alert("삭제 중 오류가 발생했습니다. 다시 시도해주세요.");
      setLoading(false);
      return;
    }

    router.push("/products");
    router.refresh();
  };

  return (
    <button
      onClick={handleDelete}
      disabled={loading}
      className={cn(
        buttonVariants({ variant: "ghost", size: "sm" }),
        "text-destructive hover:text-destructive hover:bg-destructive/10 disabled:opacity-50"
      )}
    >
      {loading ? "삭제 중…" : "삭제"}
    </button>
  );
}
