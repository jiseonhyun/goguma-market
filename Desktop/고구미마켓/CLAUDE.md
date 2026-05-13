# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

# 고구마마켓

중고 물품을 사고팔 수 있는 웹 서비스.

## 명령어

```bash
npm run dev      # 개발 서버 (http://localhost:3000)
npm run build    # 프로덕션 빌드
npm run lint     # ESLint 검사
```

## 기술 스택

- Next.js 16 (App Router, Turbopack)
- Supabase (데이터베이스, 인증) — `@supabase/ssr` 사용
- Tailwind CSS v4
- TypeScript

## MCP

Supabase MCP 연결됨 — DB 조작(테이블 생성, 데이터 삽입 등) 시 MCP 도구를 통해 직접 수행  
Supabase 프로젝트 ID: `mrcnbpmgzpevuddhthru` (리전: ap-northeast-2, 서울)

## 아키텍처

### Supabase 클라이언트 패턴
- `src/lib/supabase/client.ts` — 브라우저(Client Component)용
- `src/lib/supabase/server.ts` — 서버(Server Component, Route Handler)용
- 서버 컴포넌트에서는 항상 `await createClient()` 사용

### 인증 보호 (proxy)
- Next.js 16에서는 `middleware.ts` 대신 `src/proxy.ts` 사용
- 내보내는 함수명은 반드시 `proxy` (middleware 아님)
- 보호 경로: `/profile`, `/products/new`, `/chat` → 미인증 시 `/login` 리다이렉트

## 규칙

- 한국어 UI
- 가격은 원화(₩) — `₩10,000` 형태로 표시 (`price.toLocaleString()` 활용)
- 모바일 반응형 필수
- 색상 테마: 주황색 계열 (`orange-500` 기준)

## 주요 기능 (구현 예정 포함)

- 상품 목록 (메인 페이지) ✅
- 상품 등록/상세/수정/삭제
- 소셜 로그인 (카카오/구글)
- 채팅
- 결제 (토스페이먼츠)

## 데이터베이스

### products (생성 완료)
| 컬럼 | 타입 | 설명 |
|------|------|------|
| id | uuid | PK, `gen_random_uuid()` |
| title | text | 상품명, NOT NULL |
| description | text | 상품 설명 |
| price | integer | 가격 (원), NOT NULL |
| image_url | text | 이미지 URL |
| seller_name | text | 판매자 이름, NOT NULL |
| status | text | `판매중` / `예약중` / `판매완료`, 기본값 `판매중` |
| created_at | timestamptz | 등록일, `now()` |

### profiles (미생성)
| 컬럼 | 타입 | 설명 |
|------|------|------|
| id | uuid | auth.users 참조 (PK) |
| nickname | text | 닉네임 |
| avatar_url | text | 프로필 이미지 URL |
| location | text | 동네 |
| created_at | timestamptz | 생성일 |

### chat_rooms (미생성)
| 컬럼 | 타입 | 설명 |
|------|------|------|
| id | uuid | PK |
| product_id | uuid | products 참조 |
| buyer_id | uuid | profiles 참조 |
| seller_id | uuid | profiles 참조 |
| created_at | timestamptz | 생성일 |

### messages (미생성)
| 컬럼 | 타입 | 설명 |
|------|------|------|
| id | uuid | PK |
| room_id | uuid | chat_rooms 참조 |
| sender_id | uuid | profiles 참조 |
| content | text | 메시지 내용 |
| created_at | timestamptz | 생성일 |
