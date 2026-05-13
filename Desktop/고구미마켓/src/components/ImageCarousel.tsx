"use client";

import { useState } from "react";

interface Props {
  images: string[];
  alt: string;
}

export default function ImageCarousel({ images, alt }: Props) {
  const [index, setIndex] = useState(0);

  if (images.length === 0) {
    return (
      <div className="w-full aspect-square bg-muted flex items-center justify-center">
        <span className="text-7xl">🍠</span>
      </div>
    );
  }

  if (images.length === 1) {
    return (
      <div className="w-full aspect-square bg-muted overflow-hidden">
        <img src={images[0]} alt={alt} className="w-full h-full object-cover" />
      </div>
    );
  }

  const prev = () => setIndex((i) => (i - 1 + images.length) % images.length);
  const next = () => setIndex((i) => (i + 1) % images.length);

  return (
    <div className="relative w-full aspect-square bg-muted overflow-hidden group">
      {/* 슬라이드 */}
      <div
        className="flex h-full transition-transform duration-300 ease-in-out"
        style={{ transform: `translateX(-${index * 100}%)` }}
      >
        {images.map((url, i) => (
          <img
            key={i}
            src={url}
            alt={`${alt} ${i + 1}`}
            className="w-full h-full object-cover flex-shrink-0"
          />
        ))}
      </div>

      {/* 이전 화살표 */}
      <button
        onClick={prev}
        className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/40 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/60 active:scale-95"
        aria-label="이전 이미지"
      >
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      {/* 다음 화살표 */}
      <button
        onClick={next}
        className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/40 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/60 active:scale-95"
        aria-label="다음 이미지"
      >
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>
      </button>

      {/* 닷 인디케이터 */}
      <div className="absolute bottom-3 inset-x-0 flex justify-center gap-1.5">
        {images.map((_, i) => (
          <button
            key={i}
            onClick={() => setIndex(i)}
            className={`w-1.5 h-1.5 rounded-full transition-all ${
              i === index ? "bg-white w-4" : "bg-white/60"
            }`}
            aria-label={`${i + 1}번째 이미지`}
          />
        ))}
      </div>

      {/* 카운터 */}
      <div className="absolute top-3 right-3 px-2 py-0.5 rounded-full bg-black/40 text-white text-xs">
        {index + 1} / {images.length}
      </div>
    </div>
  );
}
