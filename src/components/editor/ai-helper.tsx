import React from "react";
import { Sparkles, Loader2, Check, X, WandSparkles, Send, Briefcase, Smile, Scissors, Megaphone } from "lucide-react";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Textarea } from "@/components/ui/textarea";
import { useEditorStore } from "@/lib/editor/store";
import { toast } from "@/lib/toast";

interface AIHelperProps {
  content?: string;
  blockType?: string;
  onRewrite?: (newContent: string) => void;
}

export function AIHelper({ content, blockType, onRewrite }: AIHelperProps) {
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

  return (
    <Popover open={isOpen} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>
        <button
          onClick={(e) => e.stopPropagation()}
          className="hover:bg-white/20 p-1 rounded-sm transition-colors flex items-center justify-center text-white relative group"
          title="AI Rewrite"
        >
          <WandSparkles className="w-4 h-4 text-purple-200 animate-pulse group-hover:text-white" />
        </button>
      </PopoverTrigger>
      <PopoverContent
        className="w-80 bg-background/95 border border-border text-foreground shadow-2xl backdrop-blur-xl rounded-xl p-4 flex flex-col gap-3 z-50 pointer-events-auto"
        onClick={(e) => e.stopPropagation()}
        onKeyDown={(e) => e.stopPropagation()}
      >
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between border-b border-border pb-2">
            <div className="flex items-center gap-1.5 font-semibold text-sm text-purple-500">
              <WandSparkles className="w-4 h-4 text-purple-500 animate-pulse" />
              <span>AI Assistant</span>
            </div>
            {originalContent !== null && currentSuggestion && (
              <button
                onClick={handleDiscard}
                className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-0.5 transition-colors"
              >
                <X className="w-3.5 h-3.5" /> Revert
              </button>
            )}
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-medium text-muted-foreground">
              Ask AI to rewrite or adjust tone
            </label>
            <div className="flex gap-2">
              <Textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="e.g. Make it sound more exciting, shorten it..."
                className="bg-muted/50 border-border text-foreground placeholder:text-muted-foreground text-xs focus-visible:ring-purple-500/30 focus-visible:border-purple-500 resize-none min-h-[50px] max-h-[120px] overflow-y-auto py-1.5"
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
                className="bg-purple-600 hover:bg-purple-500 disabled:bg-muted disabled:text-muted-foreground text-white rounded-lg px-3 flex items-center justify-center transition-all shadow-md active:scale-95 border border-purple-500/25 shrink-0"
              >
                {isLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin text-purple-300" />
                ) : (
                  <Send className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>

          {/* Quick Actions Grid */}
          <div className="flex flex-col gap-1.5">
            <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
              Quick Adjustments
            </span>
            <div className="flex flex-wrap gap-1.5">
              {[
                { label: "Professional", icon: Briefcase, prompt: "Make it more professional and business-like" },
                { label: "Friendly", icon: Smile, prompt: "Make it casual, warm, and friendly" },
                { label: "Shorter", icon: Scissors, prompt: "Make it shorter and more concise" },
                { label: "Catchy", icon: Megaphone, prompt: "Make it catchy and attention-grabbing" },
              ].map((preset) => {
                const Icon = preset.icon;
                return (
                  <button
                    key={preset.label}
                    disabled={isLoading}
                    onClick={() => handleRewrite(preset.prompt)}
                    className="flex items-center gap-1.5 text-xs bg-secondary hover:bg-secondary/80 border border-transparent rounded-full px-2.5 py-1 text-secondary-foreground transition-all disabled:opacity-50"
                  >
                    <Icon className="w-3 h-3" />
                    {preset.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Suggestion Preview */}
          {currentSuggestion && (
            <div className="mt-1 flex flex-col gap-2 bg-purple-500/10 border border-purple-500/20 rounded-lg p-2.5">
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-bold text-purple-500 uppercase tracking-wider flex items-center gap-1">
                  <Sparkles className="w-3 h-3" /> Suggestion
                </span>
                <span className="text-[9px] text-muted-foreground">
                  Applied preview
                </span>
              </div>
              <p className="text-xs text-foreground leading-relaxed italic">
                &ldquo;{currentSuggestion}&rdquo;
              </p>
              <div className="flex gap-2 justify-end mt-1 border-t border-purple-500/10 pt-2">
                <button
                  onClick={handleDiscard}
                  className="text-xs text-muted-foreground hover:text-foreground px-2 py-1 rounded hover:bg-accent border border-transparent hover:border-border transition-all font-medium"
                >
                  Revert
                </button>
                <button
                  onClick={handleAccept}
                  className="text-xs bg-purple-600 hover:bg-purple-500 text-white font-medium px-2.5 py-1 rounded transition-all flex items-center gap-1 shadow-md border border-purple-500/35"
                >
                  <Check className="w-3 h-3" /> Keep It
                </button>
              </div>
            </div>
          )}

          {error && (
            <div className="text-xs text-destructive bg-destructive/10 border border-destructive/20 rounded-lg p-2 mt-1">
              {error}
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
