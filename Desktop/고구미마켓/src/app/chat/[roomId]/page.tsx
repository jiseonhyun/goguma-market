import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import ChatRoom from "./ChatRoom";

export default async function ChatRoomPage({
  params,
}: {
  params: Promise<{ roomId: string }>;
}) {
  const { roomId } = await params;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login?next=/chat");

  // 채팅방 + 상품 정보 조회
  const { data: room } = await supabase
    .from("chat_rooms")
    .select(`
      id,
      buyer_id,
      products (
        id,
        title,
        price,
        image_url,
        seller_name,
        status
      )
    `)
    .eq("id", roomId)
    .single();

  if (!room) notFound();

  // 권한 체크: 이 방의 구매자만 접근 가능
  if (room.buyer_id !== user.id) notFound();

  // 초기 메시지 로드
  const { data: initialMessages } = await supabase
    .from("messages")
    .select("id, sender_id, sender_name, content, created_at")
    .eq("room_id", roomId)
    .order("created_at", { ascending: true });

  const senderName =
    user.user_metadata?.full_name ||
    user.email?.split("@")[0] ||
    "나";

  return (
    <ChatRoom
      roomId={roomId}
      product={room.products as unknown as {
        id: string;
        title: string;
        price: number;
        image_url: string | null;
        seller_name: string;
        status: string;
      }}
      initialMessages={initialMessages ?? []}
      currentUserId={user.id}
      currentUserName={senderName}
    />
  );
}
