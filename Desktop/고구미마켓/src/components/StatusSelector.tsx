"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

const STATUSES = ["판매중", "예약중", "판매완료"] as const;

const COLOR: Record<string, string> = {
  판매중: "text-green-700 bg-green-100",
  예약중: "text-yellow-700 bg-yellow-100",
  판매완료: "text-gray-500 bg-gray-100",
};

export default function StatusSelector({
  productId,
  initialStatus,
}: {
  productId: string;
  initialStatus: string;
}) {
  const [status, setStatus] = useState(initialStatus);
  const [loading, setLoading] = useState(false);

  const handleChange = async (next: string) => {
    if (next === status) return;
    setLoading(true);
    const supabase = createClient();
    const { error } = await supabase
      .from("products")
      .update({ status: next })
      .eq("id", productId);

    if (!error) setStatus(next);
    else alert("상태 변경 중 오류가 발생했습니다.");
    setLoading(false);
  };

  return (
    <div className="relative inline-block">
      <select
        value={status}
        onChange={(e) => handleChange(e.target.value)}
        disabled={loading}
        className={`appearance-none pl-3 pr-7 py-1 rounded-full text-xs font-medium border-0 cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary/40 disabled:opacity-60 ${COLOR[status] ?? "bg-muted text-muted-foreground"}`}
      >
        {STATUSES.map((s) => (
          <option key={s} value={s}>{s}</option>
        ))}
      </select>
      {/* 드롭다운 화살표 */}
      <svg
        className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 opacity-60"
        fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
      </svg>
    </div>
  );
}
