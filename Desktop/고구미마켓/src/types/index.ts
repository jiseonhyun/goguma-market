export type Category =
  | "전자기기"
  | "의류"
  | "가구/인테리어"
  | "도서"
  | "스포츠/레저"
  | "생활용품"
  | "기타";

export interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  category: Category;
  images: string[];
  seller_id: string;
  status: "판매중" | "예약중" | "판매완료";
  location: string;
  created_at: string;
  updated_at: string;
}

export interface Profile {
  id: string;
  nickname: string;
  avatar_url: string | null;
  location: string | null;
  created_at: string;
}

export interface ChatRoom {
  id: string;
  product_id: string;
  buyer_id: string;
  seller_id: string;
  created_at: string;
}

export interface Message {
  id: string;
  room_id: string;
  sender_id: string;
  content: string;
  created_at: string;
}
