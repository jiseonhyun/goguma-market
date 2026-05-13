"use client";

import { useState, useEffect, useRef } from "react";
import { createClient } from "@/lib/supabase/client";

type Message = {
  id: string;
  sender_id: string;
  sender_name: string;
  content: string;
  created_at: string;
};

type Product = {
  id: string;
  title: string;
  price: number;
  image_url: string | null;
  seller_name: string;
  status: string;
};

const STATUS_COLOR: Record<string, string> = {
  판매중: "text-green-600",
  예약중: "text-yellow-600",
  판매완료: "text-gray-400",
};

export default function ChatRoom({
  roomId,
  product,
  initialMessages,
  currentUserId,
  currentUserName,
}: {
  roomId: string;
  product: Product;
  initialMessages: Message[];
  currentUserId: string;
  currentUserName: string;
}) {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // 새 메시지 오면 스크롤
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Supabase Realtime 구독
  useEffect(() => {
    const supabase = createClient();
    const channel = supabase
      .channel(`room:${roomId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: `room_id=eq.${roomId}`,
        },
        (payload) => {
          const msg = payload.new as Message;
          // 본인이 보낸 메시지는 낙관적 업데이트로 이미 있으므로 중복 방지
          setMessages((prev) => {
            if (prev.some((m) => m.id === msg.id)) return prev;
            return [...prev, msg];
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [roomId]);

  const sendMessage = async () => {
    const content = input.trim();
    if (!content || sending) return;

    setSending(true);
    setInput("");

    const supabase = createClient();
    const optimisticId = `opt-${Date.now()}`;

    // 낙관적 업데이트
    const optimistic: Message = {
      id: optimisticId,
      sender_id: currentUserId,
      sender_name: currentUserName,
      content,
      created_at: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, optimistic]);

    const { data, error } = await supabase
      .from("messages")
      .insert({
        room_id: roomId,
        sender_id: currentUserId,
        sender_name: currentUserName,
        content,
      })
      .select("id, sender_id, sender_name, content, created_at")
      .single();

    if (error) {
      // 실패 시 낙관적 메시지 제거
      setMessages((prev) => prev.filter((m) => m.id !== optimisticId));
      setInput(content);
    } else if (data) {
      // 낙관적 메시지를 실제 메시지로 교체
      setMessages((prev) =>
        prev.map((m) => (m.id === optimisticId ? data : m))
      );
    }

    setSending(false);
    inputRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const formatTime = (iso: string) => {
    const d = new Date(iso);
    return d.toLocaleTimeString("ko-KR", { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <div className="bg-background min-h-screen flex flex-col">
      {/* 헤더 */}
      <header className="bg-background border-b sticky top-0 z-10">
        <div className="max-w-2xl mx-auto px-4 h-14 flex items-center gap-3">
          <a
            href="/chat"
            className="p-1.5 rounded-full hover:bg-muted transition-colors"
            aria-label="뒤로가기"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </a>
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-sm truncate">{product.seller_name}</p>
          </div>
        </div>
      </header>

      {/* 상품 정보 카드 */}
      <div className="max-w-2xl mx-auto w-full px-4 py-3 border-b">
        <a href={`/products/${product.id}`} className="flex items-center gap-3 hover:opacity-80 transition-opacity">
          <div className="w-12 h-12 rounded-xl overflow-hidden bg-muted flex-shrink-0 flex items-center justify-center">
            {product.image_url ? (
              <img src={product.image_url} alt={product.title} className="w-full h-full object-cover" />
            ) : (
              <span className="text-xl">🍠</span>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs text-muted-foreground truncate">{product.title}</p>
            <p className="font-bold text-sm text-foreground">₩{product.price.toLocaleString()}</p>
          </div>
          <span className={`text-xs font-medium flex-shrink-0 ${STATUS_COLOR[product.status] ?? "text-muted-foreground"}`}>
            {product.status}
          </span>
        </a>
      </div>

      {/* 메시지 영역 */}
      <main className="flex-1 overflow-y-auto max-w-2xl mx-auto w-full px-4 py-4 space-y-3 pb-28">
        {messages.length === 0 && (
          <div className="text-center py-12">
            <p className="text-sm text-muted-foreground">
              {product.seller_name}님과 대화를 시작해보세요
            </p>
          </div>
        )}

        {messages.map((msg, idx) => {
          const isMine = msg.sender_id === currentUserId;
          const prevMsg = messages[idx - 1];
          const showName = !isMine && prevMsg?.sender_id !== msg.sender_id;

          return (
            <div key={msg.id} className={`flex flex-col ${isMine ? "items-end" : "items-start"}`}>
              {showName && (
                <p className="text-[11px] text-muted-foreground mb-1 px-1">{msg.sender_name}</p>
              )}
              <div className={`flex items-end gap-1.5 ${isMine ? "flex-row-reverse" : "flex-row"}`}>
                <div
                  className={`max-w-[70%] px-3.5 py-2 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap break-words ${
                    isMine
                      ? "bg-primary text-primary-foreground rounded-br-sm"
                      : "bg-muted text-foreground rounded-bl-sm"
                  }`}
                >
                  {msg.content}
                </div>
                <span className="text-[10px] text-muted-foreground flex-shrink-0">
                  {formatTime(msg.created_at)}
                </span>
              </div>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </main>

      {/* 입력창 */}
      <div className="fixed bottom-0 inset-x-0 bg-background border-t z-10">
        <div className="max-w-2xl mx-auto px-3 py-2.5 flex items-end gap-2">
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="메시지를 입력하세요"
            rows={1}
            className="flex-1 resize-none rounded-2xl bg-muted border-0 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 max-h-28 overflow-y-auto leading-relaxed"
            style={{ minHeight: "2.75rem" }}
          />
          <button
            onClick={sendMessage}
            disabled={!input.trim() || sending}
            className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center flex-shrink-0 disabled:opacity-40 transition-opacity hover:opacity-90"
          >
            <svg className="w-4 h-4 rotate-90" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 19V5m0 0l-7 7m7-7l7 7" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
