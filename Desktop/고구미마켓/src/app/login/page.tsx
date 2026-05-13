"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Input } from "@/components/ui/input";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get("next") ?? "/products";

  const [mode, setMode] = useState<"login" | "signup">(
    searchParams.get("mode") === "signup" ? "signup" : "login"
  );
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (!email.trim() || !password.trim()) {
      setError("이메일과 비밀번호를 입력해주세요.");
      return;
    }

    setLoading(true);
    const supabase = createClient();

    if (mode === "login") {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      setLoading(false);
      if (error) {
        setError("이메일 또는 비밀번호가 올바르지 않습니다.");
        return;
      }
      router.push(next);
      router.refresh();
    } else {
      const { error } = await supabase.auth.signUp({ email, password });
      setLoading(false);
      if (error) {
        setError(error.message.includes("already") ? "이미 사용 중인 이메일입니다." : "회원가입 중 오류가 발생했습니다.");
        return;
      }
      setMessage("확인 이메일을 보냈습니다. 이메일을 확인해주세요.");
    }
  };

  const handleGoogle = async () => {
    const supabase = createClient();
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${location.origin}/auth/callback?next=${next}`,
      },
    });
  };

  const handleKakao = async () => {
    const supabase = createClient();
    await supabase.auth.signInWithOAuth({
      provider: "kakao",
      options: {
        redirectTo: `${location.origin}/auth/callback?next=${next}`,
      },
    });
  };

  return (
    <div className="bg-background min-h-screen flex flex-col">
      {/* 헤더 */}
      <header className="max-w-2xl w-full mx-auto px-4 h-14 flex items-center">
        <a href="/products" className="text-lg font-bold text-primary">
          🍠 고구마마켓
        </a>
      </header>

      <main className="flex-1 flex items-start justify-center px-4 pt-12">
        <div className="w-full max-w-sm space-y-6">
          {/* 타이틀 */}
          <div className="space-y-1">
            <h1 className="text-2xl font-bold text-foreground">
              {mode === "login" ? "로그인" : "회원가입"}
            </h1>
            <p className="text-sm text-muted-foreground">
              {mode === "login"
                ? "고구마마켓에 오신 것을 환영해요."
                : "계정을 만들고 거래를 시작해보세요."}
            </p>
          </div>

          {/* 이메일/비밀번호 폼 */}
          <form onSubmit={handleEmailAuth} noValidate className="space-y-3">
            <Input
              type="email"
              placeholder="이메일"
              value={email}
              onChange={(e) => { setEmail(e.target.value); setError(""); }}
              autoComplete="email"
            />
            <Input
              type="password"
              placeholder="비밀번호 (6자 이상)"
              value={password}
              onChange={(e) => { setPassword(e.target.value); setError(""); }}
              autoComplete={mode === "login" ? "current-password" : "new-password"}
            />

            {error && <p className="text-sm text-destructive">{error}</p>}
            {message && <p className="text-sm text-green-600">{message}</p>}

            <Button type="submit" disabled={loading} className="w-full">
              {loading ? "처리 중…" : mode === "login" ? "로그인" : "회원가입"}
            </Button>
          </form>

          {/* 구분선 */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center">
              <span className="bg-background px-3 text-xs text-muted-foreground">또는</span>
            </div>
          </div>

          {/* 소셜 로그인 */}
          <div className="space-y-2">
            <button
              type="button"
              onClick={handleKakao}
              className="w-full h-10 flex items-center justify-center gap-2 rounded-md text-sm font-medium transition-colors"
              style={{ backgroundColor: "#FEE500", color: "#000000" }}
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 3C6.477 3 2 6.477 2 10.8c0 2.7 1.617 5.07 4.05 6.48L5.1 21l4.59-2.43C10.41 18.84 11.19 18.9 12 18.9c5.523 0 10-3.477 10-7.8C22 6.477 17.523 3 12 3z"/>
              </svg>
              카카오로 계속하기
            </button>

            <button
              type="button"
              onClick={handleGoogle}
              className={cn(
                buttonVariants({ variant: "outline" }),
                "w-full gap-2 justify-center"
              )}
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              구글로 계속하기
            </button>
          </div>

          {/* 모드 전환 */}
          <p className="text-center text-sm text-muted-foreground">
            {mode === "login" ? "아직 계정이 없으신가요?" : "이미 계정이 있으신가요?"}
            {" "}
            <button
              type="button"
              onClick={() => { setMode(mode === "login" ? "signup" : "login"); setError(""); setMessage(""); }}
              className="text-primary font-medium hover:underline"
            >
              {mode === "login" ? "회원가입" : "로그인"}
            </button>
          </p>
        </div>
      </main>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}
