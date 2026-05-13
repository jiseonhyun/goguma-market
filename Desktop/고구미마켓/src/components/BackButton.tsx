"use client";

import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface BackButtonProps {
  label?: string;
  className?: string;
}

export default function BackButton({ label = "뒤로가기", className }: BackButtonProps) {
  return (
    <button
      onClick={() => window.history.back()}
      className={cn(buttonVariants({ variant: "outline" }), "rounded-xl", className)}
    >
      {label}
    </button>
  );
}
