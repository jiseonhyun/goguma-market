"use client";

import { useRef, useState } from "react";
import { createClient } from "@/lib/supabase/client";

interface Props {
  value: string[];
  onChange: (urls: string[]) => void;
  maxImages?: number;
}

export default function ImageUploader({ value, onChange, maxImages = 5 }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  const handleFiles = async (files: FileList) => {
    const remaining = maxImages - value.length;
    if (remaining <= 0) return;

    const selected = Array.from(files).slice(0, remaining);
    setUploading(true);

    const supabase = createClient();
    const newUrls: string[] = [];

    for (const file of selected) {
      const ext = file.name.split(".").pop() ?? "jpg";
      const path = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

      const { error } = await supabase.storage
        .from("product-images")
        .upload(path, file, { cacheControl: "3600" });

      if (!error) {
        const { data } = supabase.storage
          .from("product-images")
          .getPublicUrl(path);
        newUrls.push(data.publicUrl);
      }
    }

    setUploading(false);
    onChange([...value, ...newUrls]);
  };

  const handleRemove = (index: number) => {
    onChange(value.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-2">
      <div className="flex gap-2 flex-wrap">
        {/* 기존 이미지 미리보기 */}
        {value.map((url, i) => (
          <div
            key={url}
            className="relative w-24 h-24 rounded-xl overflow-hidden bg-muted flex-shrink-0"
          >
            <img src={url} alt={`이미지 ${i + 1}`} className="w-full h-full object-cover" />
            {i === 0 && (
              <span className="absolute bottom-0 inset-x-0 text-center text-[10px] bg-black/50 text-white py-0.5">
                대표
              </span>
            )}
            <button
              type="button"
              onClick={() => handleRemove(i)}
              className="absolute top-1 right-1 w-5 h-5 bg-black/60 text-white rounded-full flex items-center justify-center text-sm leading-none hover:bg-black/80"
            >
              ×
            </button>
          </div>
        ))}

        {/* 업로드 중 스피너 */}
        {uploading && (
          <div className="w-24 h-24 rounded-xl bg-muted flex items-center justify-center flex-shrink-0">
            <svg className="w-6 h-6 animate-spin text-primary" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
            </svg>
          </div>
        )}

        {/* 추가 버튼 */}
        {value.length < maxImages && !uploading && (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="w-24 h-24 rounded-xl border-2 border-dashed border-border flex flex-col items-center justify-center text-muted-foreground hover:border-primary hover:text-primary transition-colors"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            <span className="text-xs mt-1">{value.length}/{maxImages}</span>
          </button>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={(e) => e.target.files && handleFiles(e.target.files)}
      />

      {value.length > 0 && (
        <p className="text-xs text-muted-foreground">첫 번째 사진이 대표 이미지로 사용됩니다.</p>
      )}
    </div>
  );
}
