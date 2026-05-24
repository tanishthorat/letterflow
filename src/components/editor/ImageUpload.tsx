"use client";

import React, { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Images, X, Loader2 } from "lucide-react";
import { ImageGallery } from "@/components/editor/ImageGallery";
import { ImageDropzone } from "@/components/editor/ImageDropzone";
import { toast } from "@/lib/toast";

interface ImageUploadProps {
  currentSrc?: string;
  onUploadSuccess: (url: string, fileName: string, width: number, height: number) => void;
  onRemove?: () => void;
}

const PLACEHOLDER_KEYWORDS = ["placehold.co", "placeholder"];

function isPlaceholder(src?: string) {
  return !src || PLACEHOLDER_KEYWORDS.some((k) => src.includes(k));
}

async function measureImage(url: string): Promise<{ width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve({ width: img.width, height: img.height });
    img.onerror = () => reject(new Error("Could not load image."));
    img.src = url;
  });
}

export function ImageUpload({ currentSrc, onUploadSuccess, onRemove }: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);

  const handleUpload = async (file: File) => {
    if (!file.type.startsWith("image/")) {
      toast.error("Invalid file", { description: "Please select an image file." });
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      toast.error("File too large", { description: "Image must be 2 MB or smaller." });
      return;
    }

    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/upload", { method: "POST", body: formData });
      const json = await res.json();

      if (!res.ok) throw new Error(json.error || "Upload failed.");

      // Measure dimensions from the original file (no extra network request)
      const objectUrl = URL.createObjectURL(file);
      const { width, height } = await measureImage(objectUrl);
      URL.revokeObjectURL(objectUrl);

      onUploadSuccess(json.publicUrl, json.fileName ?? file.name, width, height);
      toast.success("Image uploaded successfully");
    } catch (err: any) {
      console.error("[ImageUpload]", err);
      toast.error("Upload failed", { description: err.message || "An error occurred during upload." });
    } finally {
      setIsUploading(false);
    }
  };

  // Called when user picks from the gallery
  const handleGallerySelect = async (url: string, fileName: string) => {
    try {
      const { width, height } = await measureImage(url);
      onUploadSuccess(url, fileName, width, height);
    } catch {
      // If we can't measure (e.g. CORS), still pass 0×0 — block will show the image
      onUploadSuccess(url, fileName, 0, 0);
    }
  };

  const hasRealImage = !isPlaceholder(currentSrc);

  return (
    <div className="space-y-2">
      {hasRealImage ? (
        /* ── Thumbnail with hover overlay ── */
        <div className="relative group rounded-md overflow-hidden border border-input bg-muted/20">
          <img
            src={currentSrc}
            alt="Preview"
            className="w-full max-h-[120px] object-cover"
          />
          <div className="absolute inset-0 bg-black/55 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
            <ImageDropzone
              onFileSelect={handleUpload}
              isUploading={isUploading}
              layout="horizontal"
              className="absolute inset-0 opacity-0 cursor-pointer"
            />
            <Button
              size="sm"
              variant="secondary"
              className="pointer-events-none z-10"
              disabled={isUploading}
            >
              {isUploading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : "Replace"}
            </Button>
            {onRemove && (
              <Button
                size="sm"
                variant="destructive"
                onClick={(e) => { e.stopPropagation(); onRemove(); }}
                disabled={isUploading}
                className="z-10 relative"
              >
                <X className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>
      ) : (
        /* ── Upload drop zone ── */
        <ImageDropzone
          onFileSelect={handleUpload}
          isUploading={isUploading}
          layout="vertical"
        />
      )}

      {/* ── Gallery button ── */}
      <ImageGallery
        onSelect={handleGallerySelect}
        trigger={
          <Button
            type="button"
            variant="default"
            size="sm"
            className="w-full gap-1.5 h-8 text-xs"
          >
            <Images className="w-3.5 h-3.5" />
            Browse Gallery
          </Button>
        }
      />
    </div>
  );
}
