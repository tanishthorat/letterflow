"use client";

import React, { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Upload, X, Loader2, Image as ImageIcon } from "lucide-react";

interface ImageUploadProps {
  currentSrc?: string;
  onUploadSuccess: (url: string, fileName: string, width: number, height: number) => void;
  onRemove?: () => void;
}

const PLACEHOLDER_SRCS = ["placehold.co", "placeholder"];

function isPlaceholder(src?: string) {
  return !src || PLACEHOLDER_SRCS.some((p) => src.includes(p));
}

export function ImageUpload({ currentSrc, onUploadSuccess, onRemove }: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Client-side pre-validation
    if (!file.type.startsWith("image/")) {
      setError("Please select an image file.");
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      setError("Image must be 2 MB or smaller.");
      return;
    }

    setIsUploading(true);
    setError(null);

    try {
      // Send as multipart form data — server validates, uploads to Supabase, returns public URL
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const json = await res.json();

      if (!res.ok) {
        throw new Error(json.error || "Upload failed.");
      }

      const { publicUrl, fileName: serverFileName } = json;

      // Measure dimensions client-side from the original file (cheap, no extra request)
      const objectUrl = URL.createObjectURL(file);
      const img = new Image();

      await new Promise<void>((resolve, reject) => {
        img.onload = () => resolve();
        img.onerror = () => reject(new Error("Could not read image dimensions."));
        img.src = objectUrl;
      });

      onUploadSuccess(publicUrl, serverFileName ?? file.name, img.width, img.height);
      URL.revokeObjectURL(objectUrl);
    } catch (err: any) {
      console.error("[ImageUpload]", err);
      setError(err.message || "An error occurred during upload.");
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const hasRealImage = !isPlaceholder(currentSrc);

  return (
    <div className="space-y-2">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/jpeg,image/png,image/gif,image/webp,image/avif"
        className="hidden"
      />

      {hasRealImage ? (
        /* ── Thumbnail with hover overlay ── */
        <div className="relative group rounded-md overflow-hidden border border-input bg-muted/20">
          <img
            src={currentSrc}
            alt="Preview"
            className="w-full max-h-[120px] object-cover"
          />
          <div className="absolute inset-0 bg-black/55 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
            <Button
              size="sm"
              variant="secondary"
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
            >
              Replace
            </Button>
            {onRemove && (
              <Button
                size="sm"
                variant="destructive"
                onClick={onRemove}
                disabled={isUploading}
              >
                <X className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>
      ) : (
        /* ── Upload drop zone ── */
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploading}
          className="w-full h-24 rounded-md border-2 border-dashed border-input bg-muted/10 hover:bg-muted/30 transition-colors flex flex-col items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
        >
          {isUploading ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
              <span className="text-xs text-muted-foreground">Uploading…</span>
            </>
          ) : (
            <>
              <Upload className="h-5 w-5 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">Click to upload image</span>
              <span className="text-[10px] text-muted-foreground/60">JPEG, PNG, GIF, WEBP · max 2 MB</span>
            </>
          )}
        </button>
      )}

      {error && (
        <p className="text-xs text-destructive flex items-start gap-1">
          <span>⚠</span>
          <span>{error}</span>
        </p>
      )}
    </div>
  );
}
