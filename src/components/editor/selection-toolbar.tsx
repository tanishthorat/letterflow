import React from "react";
import { Grip, Copy, Trash2, Sparkles, Loader2, Check, X } from "lucide-react";
import { NODE_COLORS } from "@/lib/editor/config";
import { cn } from "@/lib/utils";
import { DraggableAttributes } from "@dnd-kit/core";
import { SyntheticListenerMap } from "@dnd-kit/core/dist/hooks/utilities";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Textarea } from "@/components/ui/textarea";
import { useEditorStore } from "@/lib/editor/store";
import { toast } from "@/lib/toast";

export function SelectionToolbar({
  type,
  label,
  attributes,
  listeners,
  onDuplicate,
  onRemove,
  blockType,
  content,
  onRewrite
}: {
  type: keyof typeof NODE_COLORS;
  label?: string;
  attributes?: DraggableAttributes;
  listeners?: SyntheticListenerMap;
  onDuplicate?: () => void;
  onRemove: () => void;
  blockType?: string;
  content?: string;
  onRewrite?: (newContent: string) => void;
}) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [prompt, setPrompt] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);
  const [originalContent, setOriginalContent] = React.useState<string | null>(null);
  const [currentSuggestion, setCurrentSuggestion] = React.useState<string | null>(null);
  const [error, setError] = React.useState<string | null>(null);

  const metadata = useEditorStore((state) => state.metadata);

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (open) {
      setOriginalContent(content || null);
      setCurrentSuggestion(null);
      setPrompt("");
      setError(null);
    }
  };

  const handleRewrite = async (instruction: string) => {
    if (!content) return;
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/ai/rewrite", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt: instruction,
          content,
          blockType,
          context: {
            subject: metadata.subject,
            preheader: metadata.preheader,
          },
        }),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || `Error: ${res.status}`);
      }

      const data = await res.json();
      if (data.result) {
        if (originalContent === null) {
          setOriginalContent(content);
        }
        setCurrentSuggestion(data.result);
        onRewrite?.(data.result);
        toast.success("Content rewritten!");
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to rewrite content");
      toast.error("AI Rewrite failed", { description: err.message });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDiscard = () => {
    if (originalContent !== null && onRewrite) {
      onRewrite(originalContent);
    }
    setCurrentSuggestion(null);
    setPrompt("");
    setIsOpen(false);
  };

  const handleAccept = () => {
    setOriginalContent(null);
    setCurrentSuggestion(null);
    setPrompt("");
    setIsOpen(false);
  };

  const showAiRewrite = type === "block" && (blockType === "text" || blockType === "button");

  return (
    <div className={cn(
      "absolute -bottom-9 left-0 text-white rounded-full px-2 py-1 flex items-center gap-2 z-30 shadow-xl pointer-events-auto whitespace-nowrap",
      NODE_COLORS[type].bg
    )}>
      {label && <span className="text-xs font-semibold mr-1">{label}</span>}
      {attributes && listeners && (
        <div {...attributes} {...listeners} className="cursor-grab active:cursor-grabbing hover:bg-white/20 p-1 rounded-sm transition-colors flex items-center justify-center">
          <Grip className="w-4 h-4" />
        </div>
      )}
      
      {showAiRewrite && (
        <Popover open={isOpen} onOpenChange={handleOpenChange}>
          <PopoverTrigger asChild>
            <button 
              onClick={(e) => e.stopPropagation()} 
              className="hover:bg-white/20 p-1 rounded-sm transition-colors flex items-center justify-center text-white relative group"
              title="AI Rewrite"
            >
              <Sparkles className="w-4 h-4 text-purple-200 animate-pulse group-hover:text-white" />
            </button>
          </PopoverTrigger>
          <PopoverContent 
            className="w-80 bg-zinc-950/95 border border-zinc-800 text-zinc-100 shadow-2xl backdrop-blur-xl rounded-xl p-4 flex flex-col gap-3 z-50 pointer-events-auto"
            onClick={(e) => e.stopPropagation()}
            onKeyDown={(e) => e.stopPropagation()}
          >
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
                <div className="flex items-center gap-1.5 font-semibold text-sm text-purple-400">
                  <Sparkles className="w-4 h-4 text-purple-400 animate-pulse" />
                  <span>AI Rewrite Assistant</span>
                </div>
                {originalContent !== null && currentSuggestion && (
                  <button 
                    onClick={handleDiscard}
                    className="text-xs text-zinc-400 hover:text-zinc-200 flex items-center gap-0.5"
                  >
                    <X className="w-3.5 h-3.5" /> Revert
                  </button>
                )}
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-medium text-zinc-400">
                  Ask AI to rewrite or adjust tone
                </label>
                <div className="flex gap-2">
                  <Textarea
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="e.g. Make it sound more exciting, shorten it..."
                    className="bg-zinc-900 border-zinc-800 text-zinc-100 placeholder:text-zinc-500 text-xs focus-visible:ring-purple-500/20 focus-visible:border-purple-500 resize-none min-h-[50px] py-1.5"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        if (prompt.trim() && !isLoading) handleRewrite(prompt);
                      }
                    }}
                  />
                  <button
                    onClick={() => prompt.trim() && handleRewrite(prompt)}
                    disabled={isLoading || !prompt.trim()}
                    className="bg-purple-600 hover:bg-purple-500 disabled:bg-zinc-900 disabled:text-zinc-600 text-white rounded-lg px-3 flex items-center justify-center transition-all shadow-md active:scale-95 border border-purple-500/25"
                  >
                    {isLoading ? (
                      <Loader2 className="w-4 h-4 animate-spin text-purple-300" />
                    ) : (
                      <Sparkles className="w-4 h-4 text-purple-100" />
                    )}
                  </button>
                </div>
              </div>

              {/* Quick Actions Grid */}
              <div className="flex flex-col gap-1">
                <span className="text-[10px] font-semibold text-zinc-500 uppercase tracking-wider">
                  Quick Adjustments
                </span>
                <div className="grid grid-cols-2 gap-1.5">
                  {[
                    { label: "💼 Professional", prompt: "Make it more professional and business-like" },
                    { label: "👋 Friendly", prompt: "Make it casual, warm, and friendly" },
                    { label: "⚡ Shorter", prompt: "Make it shorter and more concise" },
                    { label: "📢 Catchy", prompt: "Make it catchy and attention-grabbing" },
                  ].map((preset) => (
                    <button
                      key={preset.label}
                      disabled={isLoading}
                      onClick={() => handleRewrite(preset.prompt)}
                      className="text-left text-xs bg-zinc-900/60 hover:bg-zinc-900 border border-zinc-800/80 hover:border-zinc-700 rounded-lg p-1.5 text-zinc-300 hover:text-white transition-all disabled:opacity-50"
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Suggestion Preview */}
              {currentSuggestion && (
                <div className="mt-1 flex flex-col gap-2 bg-purple-950/20 border border-purple-500/20 rounded-lg p-2.5">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-bold text-purple-400 uppercase tracking-wider flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-purple-400" /> Suggestion
                    </span>
                    <span className="text-[9px] text-zinc-500">
                      Applied preview
                    </span>
                  </div>
                  <p className="text-xs text-zinc-200 leading-relaxed italic">
                    &ldquo;{currentSuggestion}&rdquo;
                  </p>
                  <div className="flex gap-2 justify-end mt-1 border-t border-purple-500/10 pt-2">
                    <button
                      onClick={handleDiscard}
                      className="text-xs text-zinc-400 hover:text-zinc-200 px-2 py-1 rounded hover:bg-zinc-900 border border-transparent hover:border-zinc-800 transition-all font-medium"
                    >
                      Revert
                    </button>
                    <button
                      onClick={handleAccept}
                      className="text-xs bg-purple-600 hover:bg-purple-500 text-white font-medium px-2.5 py-1 rounded transition-all flex items-center gap-1 shadow-md shadow-purple-950 border border-purple-500/35"
                    >
                      <Check className="w-3 h-3" /> Keep It
                    </button>
                  </div>
                </div>
              )}

              {error && (
                <div className="text-xs text-red-400 bg-red-950/20 border border-red-500/20 rounded-lg p-2 mt-1">
                  {error}
                </div>
              )}
            </div>
          </PopoverContent>
        </Popover>
      )}

      {onDuplicate && (
        <button onClick={(e) => { e.stopPropagation(); onDuplicate(); }} className="hover:bg-white/20 p-1 rounded-sm transition-colors flex items-center justify-center">
          <Copy className="w-4 h-4" />
        </button>
      )}
      <button onClick={(e) => { e.stopPropagation(); onRemove(); }} className="hover:bg-white/20 p-1 rounded-sm transition-colors flex items-center justify-center text-white">
        <Trash2 className="w-4 h-4" />
      </button>
    </div>
  );
}

