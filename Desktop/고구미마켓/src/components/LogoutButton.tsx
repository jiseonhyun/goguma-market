"use client";

import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function LogoutButton() {
  const router = useRouter();

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/products");
    router.refresh();
  };

  return (
    <button
      onClick={handleLogout}
      className={cn(buttonVariants({ variant: "ghost", size: "sm" }), "text-muted-foreground")}
    >
      로그아웃
    </button>
  );
}
