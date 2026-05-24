"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Images,
  Search,
  Loader2,
  AlertCircle,
  CheckCircle2,
  Upload,
  RefreshCw,
  LayoutGrid,
  List,
  Trash2,
} from "lucide-react";
import { toast } from "@/lib/toast";
import { ImageDropzone } from "@/components/editor/ImageDropzone";

interface GalleryImage {
  name: string;
  path: string;
  publicUrl: string;
  createdAt: string;
  size: number;
}

interface ImageGalleryProps {
  onSelect: (url: string, fileName: string) => void;
  trigger?: React.ReactNode;
}

function formatBytes(bytes: number) {
  if (!bytes) return "—";
  const k = 1024;
  const sizes = ["B", "KB", "MB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
}

const checkerStyle: React.CSSProperties = {
  backgroundImage:
    "linear-gradient(45deg,#3a3a3a 25%,transparent 25%)," +
    "linear-gradient(-45deg,#3a3a3a 25%,transparent 25%)," +
    "linear-gradient(45deg,transparent 75%,#3a3a3a 75%)," +
    "linear-gradient(-45deg,transparent 75%,#3a3a3a 75%)",
  backgroundSize: "12px 12px",
  backgroundPosition: "0 0,0 6px,6px -6px,-6px 0",
  backgroundColor: "#2a2a2a",
};

export function ImageGallery({ onSelect, trigger }: ImageGalleryProps) {
  const [open, setOpen] = useState(false);
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [isUploading, setIsUploading] = useState(false);
  const [deletingPath, setDeletingPath] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const hasFetched = useRef(false);

  const fetchImages = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/images");
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Failed to load images.");
      setImages(json.images ?? []);
      hasFetched.current = true;
    } catch (e: any) {
      setError(e.message);
      toast.error("Failed to load images", { description: e.message });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // Only fetch on open if we haven't fetched yet
    if (open && !hasFetched.current) {
      fetchImages();
    }
  }, [open, fetchImages]);

  const filtered = images.filter((img) =>
    img.name.toLowerCase().includes(query.toLowerCase())
  );

  const handleSelect = (img: GalleryImage) => {
    onSelect(img.publicUrl, img.name);
    setOpen(false);
  };

  const handleDelete = async (e: React.MouseEvent, img: GalleryImage) => {
    e.stopPropagation(); // prevent selection
    if (!confirm(`Delete "${img.name}" permanently?`)) return;

    setDeletingPath(img.path);
    try {
      const res = await fetch("/api/images", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ path: img.path }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Failed to delete image.");

      toast.success("Image deleted successfully");

      // Local state update (smoother UX, no extra fetch)
      setImages(prev => prev.filter(i => i.path !== img.path));
    } catch (e: any) {
      console.error("[ImageGallery delete]", e);
      toast.error("Failed to delete image", { description: e.message });
    } finally {
      setDeletingPath(null);
    }
  };

  const handleUpload = async (file: File) => {
    if (!file.type.startsWith("image/") || file.size > 2 * 1024 * 1024) {
      const msg = file.size > 2 * 1024 * 1024 ? "File must be ≤ 2 MB." : "Images only.";
      toast.error("Invalid file", { description: msg });
      return;
    }

    setIsUploading(true);
    setError(null);

    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Upload failed.");

      toast.success("Image uploaded successfully");

      // Local state update (smoother UX, no extra fetch)
      setImages(prev => [
        {
          name: json.fileName,
          path: json.path,
          publicUrl: json.publicUrl,
          createdAt: new Date().toISOString(),
          size: file.size
        },
        ...prev
      ]);
    } catch (e: any) {
      toast.error("Upload failed", { description: e.message });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        {trigger ?? (
          <Button type="button" variant="outline" size="sm" className="w-full gap-1.5 h-8 text-xs">
            <Images className="w-3.5 h-3.5" />
            Browse Gallery
          </Button>
        )}
      </PopoverTrigger>

      <PopoverContent
        side="top"
        align="center"
        sideOffset={8}
        className="w-[340px] p-0 rounded-xl shadow-xl border border-border/80 overflow-hidden"
      >
        {/* ── Header ── */}
        <div className="flex items-center justify-between px-3.5 py-2.5 border-b border-border/60 bg-muted/30">
          <span className="text-sm font-semibold">Image Gallery</span>
          <div className="flex items-center gap-1">
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              onClick={fetchImages}
              disabled={loading}
              title="Refresh"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
            </Button>
            <button
              type="button"
              onClick={() => setViewMode(v => v === "grid" ? "list" : "grid")}
              className="flex items-center gap-1 px-1.5 py-1 text-xs rounded border border-input bg-background hover:bg-muted transition-colors"
              title="Toggle view"
            >
              {viewMode === "grid" ? <LayoutGrid className="w-3.5 h-3.5" /> : <List className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>

        {/* ── Upload zone ── */}
        <div className="px-3.5 py-2.5 border-b border-border/60">
          <ImageDropzone
            onFileSelect={handleUpload}
            isUploading={isUploading}
            layout="horizontal"
          />
        </div>

        {/* ── Search ── */}
        <div className="px-3.5 pt-2.5 pb-2 border-b border-border/60">
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground pointer-events-none" />
            <Input
              placeholder="Search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="pl-8 h-8 text-xs"
            />
          </div>
        </div>

        {/* ── Gallery body ── */}
        <div className="h-[220px] overflow-y-auto px-3.5 py-2.5">
          {/* Loading */}
          {loading && (
            <div className="flex flex-col items-center justify-center h-full gap-2 text-muted-foreground">
              <Loader2 className="w-5 h-5 animate-spin" />
              <p className="text-xs">Loading…</p>
            </div>
          )}

          {/* Error */}
          {!loading && error && (
            <div className="flex flex-col items-center justify-center h-full gap-2 text-destructive">
              <AlertCircle className="w-5 h-5" />
              <p className="text-xs text-center">{error}</p>
              <Button size="sm" variant="outline" onClick={fetchImages} className="text-xs h-7 mt-1">
                Retry
              </Button>
            </div>
          )}

          {/* Empty state */}
          {!loading && !error && filtered.length === 0 && (
            <div className="flex flex-col items-center justify-center h-full gap-2 text-muted-foreground">
              <Images className="w-7 h-7 opacity-25" />
              <p className="text-xs text-center">
                {query ? `No images matching "${query}"` : "No uploads yet. Add an image above."}
              </p>
            </div>
          )}

          {/* Grid view */}
          {!loading && !error && filtered.length > 0 && viewMode === "grid" && (
            <div className="grid grid-cols-3 gap-2">
              {filtered.map((img) => (
                <div
                  key={img.path}
                  onClick={() => handleSelect(img)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => e.key === "Enter" && handleSelect(img)}
                  className={`cursor-pointer group relative aspect-square rounded-lg overflow-hidden border-2 border-transparent hover:border-primary/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring transition-all ${deletingPath === img.path ? "opacity-50 pointer-events-none" : ""}`}
                  style={checkerStyle}
                  title={img.name}
                >
                  <img
                    src={img.publicUrl}
                    alt={img.name}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                  {/* Select overlay */}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-1">
                    <CheckCircle2 className="w-5 h-5 text-white drop-shadow" />
                  </div>
                  {/* Delete button top right */}
                  <div className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon-sm"
                      className="w-6 h-6 rounded hover:bg-destructive/10 "
                      onClick={(e) => handleDelete(e, img)}
                    >
                      {deletingPath === img.path ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        <Trash2 className="w-3.5 h-3.5" />
                      )}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* List view */}
          {!loading && !error && filtered.length > 0 && viewMode === "list" && (
            <div className="space-y-1">
              {filtered.map((img) => (
                <div
                  key={img.path}
                  onClick={() => handleSelect(img)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => e.key === "Enter" && handleSelect(img)}
                  className={`cursor-pointer w-full flex items-center gap-2.5 px-2 py-1.5 rounded-lg hover:bg-muted/60 transition-colors text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring group ${deletingPath === img.path ? "opacity-50 pointer-events-none" : ""}`}
                >
                  <div
                    className="w-9 h-9 rounded-md overflow-hidden shrink-0 border border-border/50 relative"
                    style={checkerStyle}
                  >
                    <img
                      src={img.publicUrl}
                      alt={img.name}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium truncate">{img.name}</p>
                    <p className="text-[10px] text-muted-foreground">
                      {formatBytes(img.size)}
                      {img.createdAt && <> · {new Date(img.createdAt).toLocaleDateString()}</>}
                    </p>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-sm"
                    className="w-7 h-7 text-muted-foreground hover:text-destructive hover:bg-destructive/10 opacity-0 group-hover:opacity-100 transition-opacity z-10"
                    onClick={(e) => handleDelete(e, img)}
                  >
                    {deletingPath === img.path ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <Trash2 className="w-4 h-4" />
                    )}
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ── Footer count ── */}
        {!loading && !error && filtered.length > 0 && (
          <div className="px-3.5 py-1.5 border-t border-border/60 bg-muted/20">
            <p className="text-[10px] text-muted-foreground">
              {filtered.length} image{filtered.length !== 1 ? "s" : ""}
              {query && ` · "${query}"`}
            </p>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
}
