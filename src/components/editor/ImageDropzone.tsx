"use client";

import React, { useState, useRef } from "react";
import { Loader2, Upload } from "lucide-react";
import { cn } from "@/lib/utils";

interface ImageDropzoneProps {
  onFileSelect: (file: File) => void;
  isUploading: boolean;
  layout?: "horizontal" | "vertical";
  className?: string;
}

export function ImageDropzone({
  onFileSelect,
  isUploading,
  layout = "vertical",
  className,
}: ImageDropzoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const file = e.dataTransfer.files?.[0];
    if (file) {
      onFileSelect(file);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onFileSelect(file);
    }
    // reset so the same file can be selected again
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/gif,image/webp,image/avif"
        className="hidden"
        onChange={handleChange}
      />
      <button
        type="button"
        onClick={() => fileInputRef.current?.click()}
        disabled={isUploading}
        onDragOver={handleDragOver}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={cn(
          "w-full rounded-lg border-2 border-dashed transition-all group disabled:opacity-50",
          isDragging
            ? "border-primary bg-primary/10"
            : "border-border hover:border-primary/50 bg-muted/20 hover:bg-muted/40",
          layout === "vertical"
            ? "flex flex-col items-center justify-center h-24 gap-1.5 cursor-pointer text-center"
            : "flex items-center gap-2.5 px-3 py-2.5 text-left cursor-pointer",
          className
        )}
      >
        {layout === "vertical" ? (
          <>
            {isUploading ? (
              <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
            ) : (
              <Upload className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
            )}
            <div className="flex flex-col items-center">
              <span className="text-xs font-medium leading-tight">
                {isUploading ? "Uploading…" : isDragging ? "Drop image here" : "Click or drag image to upload"}
              </span>
              <span className="text-[10px] text-muted-foreground/80 mt-0.5">
                JPEG, PNG, GIF, WEBP · max 2 MB
              </span>
            </div>
          </>
        ) : (
          <>
            {isUploading ? (
              <Loader2 className="w-4 h-4 animate-spin text-muted-foreground shrink-0" />
            ) : (
              <Upload className="w-4 h-4 text-primary shrink-0 group-hover:scale-110 transition-transform" />
            )}
            <div>
              <p className="text-xs font-medium leading-tight">
                {isUploading ? (
                  "Uploading…"
                ) : isDragging ? (
                  "Drop image here"
                ) : (
                  <>
                    Drag-n-drop your image or{" "}
                    <span className="text-primary underline underline-offset-2">browse your files</span>
                  </>
                )}
              </p>
              <p className="text-[10px] text-muted-foreground mt-0.5">
                PNG, JPG, GIF, WEBP · Max size: 2 MB
              </p>
            </div>
          </>
        )}
      </button>
    </>
  );
}
