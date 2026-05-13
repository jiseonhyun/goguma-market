import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { timeAgo } from "@/lib/utils";
import BottomNav from "@/components/BottomNav";

export default async function ChatListPage({
  searchParams,
}: {
  searchParams: Promise<{ product?: string }>;
}) {
  const { product: productId } = await searchParams;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login?next=/chat");

  // ?product=<id> 로 진입 시 채팅방 생성 or 기존 방 찾기
  if (productId) {
    const { data: existing } = await supabase
      .from("chat_rooms")
      .select("id")
      .eq("product_id", productId)
      .eq("buyer_id", user.id)
      .single();

    if (existing) {
      redirect(`/chat/${existing.id}`);
    }

    const { data: created, error } = await supabase
      .from("chat_rooms")
      .insert({ product_id: productId, buyer_id: user.id })
      .select("id")
      .single();

    if (created) redirect(`/chat/${created.id}`);
    if (error) redirect("/chat");
  }

  // 내 채팅방 목록 (구매자 기준)
  const { data: rooms } = await supabase
    .from("chat_rooms")
    .select(`
      id,
      created_at,
      products (
        id,
        title,
        price,
        image_url,
        seller_name,
        status
      ),
      messages (
        content,
        sender_name,
        created_at
      )
    `)
    .eq("buyer_id", user.id)
    .order("created_at", { ascending: false });

  // 각 방의 마지막 메시지 추출
  type Room = {
    id: string;
    created_at: string;
    products: {
      id: string;
      title: string;
      price: number;
      image_url: string | null;
      seller_name: string;
      status: string;
    } | null;
    lastMsg: { content: string; sender_name: string; created_at: string } | null;
  };

  const processedRooms: Room[] = (rooms ?? []).map((room) => {
    const msgs = (room.messages as { content: string; sender_name: string; created_at: string }[]) ?? [];
    const sorted = [...msgs].sort(
      (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );
    return {
      id: room.id,
      created_at: room.created_at,
      products: room.products as unknown as Room["products"],
      lastMsg: sorted[0] ?? null,
    };
  });

  return (
    <div className="bg-background min-h-screen pb-20">
      <header className="bg-background border-b sticky top-0 z-10">
        <div className="max-w-2xl mx-auto px-4 h-14 flex items-center">
          <h1 className="font-bold text-lg">채팅</h1>
        </div>
      </header>

      <main className="max-w-2xl mx-auto">
        {processedRooms.length === 0 ? (
          <div className="text-center py-24">
            <p className="text-5xl mb-4">💬</p>
            <p className="text-base font-medium text-foreground">아직 채팅이 없어요</p>
            <p className="text-sm text-muted-foreground mt-1">관심 있는 상품에서 채팅을 시작해보세요!</p>
            <a
              href="/products"
              className="mt-6 inline-block text-sm text-primary font-medium hover:underline"
            >
              상품 보러가기 →
            </a>
          </div>
        ) : (
          <ul className="divide-y divide-border">
            {processedRooms.map((room) => {
              const product = room.products;
              if (!product) return null;
              return (
                <li key={room.id}>
                  <a
                    href={`/chat/${room.id}`}
                    className="flex gap-3 px-4 py-4 hover:bg-muted/40 transition-colors"
                  >
                    {/* 상품 썸네일 */}
                    <div className="w-12 h-12 rounded-xl overflow-hidden bg-muted flex-shrink-0 flex items-center justify-center">
                      {product.image_url ? (
                        <img src={product.image_url} alt={product.title} className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-xl">🍠</span>
                      )}
                    </div>

                    {/* 정보 */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <p className="font-medium text-sm text-foreground truncate">{product.seller_name}</p>
                        {room.lastMsg && (
                          <span className="text-[10px] text-muted-foreground flex-shrink-0">
                            {timeAgo(room.lastMsg.created_at)}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground truncate mt-0.5">
                        {room.lastMsg
                          ? `${room.lastMsg.sender_name === user.user_metadata?.full_name || room.lastMsg.sender_name === user.email?.split("@")[0] ? "나" : room.lastMsg.sender_name}: ${room.lastMsg.content}`
                          : "대화를 시작해보세요"}
                      </p>
                      <p className="text-[11px] text-muted-foreground/70 truncate mt-0.5">{product.title}</p>
                    </div>
                  </a>
                </li>
              );
            })}
          </ul>
        )}
      </main>

      <BottomNav />
    </div>
  );
}
