"use client";

import { useState, useEffect, useRef } from "react";
import { useEditorStore } from "@/lib/editor/store";
import { useAuth } from "@/lib/auth";
import { 
  X, Loader2, Monitor, Smartphone, Send, Key, 
  AlertCircle, CheckCircle2, HelpCircle, Sparkles 
} from "lucide-react";
import { PreviewDeviceWrapper } from "./preview-wrappers";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { extractPlaceholders } from "@/lib/editor/placeholders";
import { toast } from "@/lib/toast";
import { useDebounce } from "use-debounce";
import { ExportModal } from "./export-modal";

interface PreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  templateName?: string;
}

const getMockDefault = (key: string): string => {
  const k = key.toLowerCase();
  if (k.includes("name") && k.includes("first")) return "John";
  if (k.includes("name") && k.includes("last")) return "Doe";
  if (k.includes("name")) return "John Doe";
  if (k.includes("plan")) return "Pro Plan";
  if (k.includes("company") || k.includes("org")) return "Acme Corp";
  if (k.includes("email")) return "john.doe@example.com";
  if (k.includes("url") || k.includes("link")) return "https://letterflow.dev";
  if (k.includes("date")) return new Date().toLocaleDateString();
  return `[${key}]`;
};

export function PreviewModal({ isOpen, onClose, templateName }: PreviewModalProps) {
  const [html, setHtml] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [viewMode, setViewMode] = useState<"desktop" | "mobile">("desktop");
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const { getDesign } = useEditorStore();
  const { user } = useAuth();

  // Environment Check
  const isDev = process.env.NODE_ENV === "development";

  // Export Modal State
  const [isExportOpen, setIsExportOpen] = useState(false);

  // Dynamic Variable States
  const [placeholders, setPlaceholders] = useState<string[]>([]);
  const [variables, setVariables] = useState<Record<string, string>>({});
  const [debouncedVariables] = useDebounce(variables, 400);

  // Send Test States
  const [toEmail, setToEmail] = useState("");
  const [testSubject, setTestSubject] = useState("");
  const [fromEmail, setFromEmail] = useState("");
  const [customApiKey, setCustomApiKey] = useState("");
  const [isApiKeyExpanded, setIsApiKeyExpanded] = useState(false);
  const [sendingTest, setSendingTest] = useState(false);
  const [sendSuccess, setSendSuccess] = useState(false);
  const [sendError, setSendError] = useState<string | null>(null);

  const fileSizeKB = html ? new Blob([html]).size / 1024 : 0;

  // Initialize data on open
  useEffect(() => {
    if (isOpen) {
      const design = getDesign();
      const detected = extractPlaceholders(design);
      setPlaceholders(detected);
      
      // Seed default variables
      setVariables(prev => {
        const next: Record<string, string> = { ...prev };
        detected.forEach(key => {
          if (next[key] === undefined) {
            next[key] = getMockDefault(key);
          }
        });
        return next;
      });

      // Seed email defaults
      if (user?.email) {
        setToEmail(user.email);
      }
      setTestSubject(templateName ? `Test: ${templateName}` : "Test Email - Letterflow");

      // Load saved API key
      const savedKey = localStorage.getItem("letterflow_resend_api_key");
      if (savedKey) {
        setCustomApiKey(savedKey);
      }
    }
  }, [isOpen, getDesign, user, templateName]);

  // Fetch Preview HTML
  useEffect(() => {
    if (isOpen) {
      const fetchPreview = async () => {
        setLoading(true);
        try {
          const design = getDesign();
          const res = await fetch("/api/preview", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ design, variables: debouncedVariables }),
          });
          if (res.ok) {
            const htmlContent = await res.text();
            setHtml(htmlContent);
          } else {
            const errText = await res.text();
            console.error("Failed to generate preview:", errText);
            toast.error("Preview failed", { description: errText.slice(0, 120) });
          }
        } catch (error) {
          console.error("Preview generation failed", error);
          toast.error("Preview failed", {
            description: error instanceof Error ? error.message : "Could not render preview.",
          });
        } finally {
          setLoading(false);
        }
      };

      fetchPreview();
    }
  }, [isOpen, getDesign, debouncedVariables]);

  // Handle sending test email
  const handleSendTest = async () => {
    if (!toEmail) {
      setSendError("Recipient email address is required.");
      return;
    }
    if (!testSubject) {
      setSendError("Subject line is required.");
      return;
    }

    setSendingTest(true);
    setSendSuccess(false);
    setSendError(null);

    try {
      const design = getDesign();
      const res = await fetch("/api/send-test", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          to: toEmail,
          subject: testSubject,
          design,
          variables,
          apiKey: customApiKey || undefined,
          from: fromEmail || undefined,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setSendSuccess(true);
        // Clear success message after 5 seconds
        setTimeout(() => setSendSuccess(false), 5000);
      } else {
        setSendError(data.error || "Failed to send test email.");
      }
    } catch (error: any) {
      setSendError(error.message || "An unexpected error occurred.");
    } finally {
      setSendingTest(false);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 z-[100] flex flex-col bg-background/98 backdrop-blur-sm animate-in fade-in-0 duration-200">
        {/* Top Header */}
        <div className="h-14 border-b border-border bg-card flex items-center justify-between px-4 shrink-0">
          <div className="flex items-center gap-2">
            <h2 className="font-semibold text-foreground">Interactive Email Preview</h2>
            {loading && <Loader2 className="w-4 h-4 animate-spin text-primary ml-2" />}
          </div>
          
          {/* Device Switcher */}
          <div className="flex items-center bg-muted rounded-md p-1">
            <Button 
              variant="ghost" 
              size="sm" 
              className={cn("h-7 px-3 text-xs gap-2 rounded-sm cursor-pointer", viewMode === "desktop" ? "bg-background shadow-sm text-foreground" : "text-muted-foreground")}
              onClick={() => setViewMode("desktop")}
            >
              <Monitor className="w-4 h-4" />
              Desktop
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              className={cn("h-7 px-3 text-xs gap-2 rounded-sm cursor-pointer", viewMode === "mobile" ? "bg-background shadow-sm text-foreground" : "text-muted-foreground")}
              onClick={() => setViewMode("mobile")}
            >
              <Smartphone className="w-4 h-4" />
              Mobile
            </Button>
          </div>

          {/* Modal Controls */}
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              size="sm"
              className="h-8 text-xs cursor-pointer"
              onClick={() => setIsExportOpen(true)}
              disabled={loading}
            >
              Export HTML
            </Button>
            <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full text-muted-foreground hover:text-foreground cursor-pointer">
              <X className="w-5 h-5" />
            </Button>
          </div>
        </div>
        
        {/* Shell Layout */}
        <div className="flex-1 flex overflow-hidden">
          
          {/* Left Control Panel Sidebar - Dev mode only */}
          {isDev && (
            <div className="w-85 border-r border-border bg-card flex flex-col overflow-y-auto text-card-foreground select-none">
              
              {/* Section 1: Variables Configuration */}
              <div className="p-4 border-b border-border space-y-4">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-primary" />
                  <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Dynamic Placeholders</h3>
                </div>
                
                {placeholders.length === 0 ? (
                  <div className="p-3.5 rounded-lg border border-primary/20 bg-primary/5 text-xs text-muted-foreground leading-relaxed">
                    <span className="font-semibold text-foreground block mb-1">💡 Dynamic Variables Tip</span>
                    Use double curly braces like <code className="bg-muted px-1 py-0.5 rounded text-primary font-mono text-[11px] font-bold">{"{{variable_name}}"}</code> in your text blocks or button URLs to auto-detect variables here.
                  </div>
                ) : (
                  <div className="space-y-3.5">
                    <p className="text-xs text-muted-foreground">
                      Provide custom sample values to preview template interpolation.
                    </p>
                    {placeholders.map((key) => (
                      <div key={key} className="space-y-1.5">
                        <Label className="text-[11px] font-mono font-bold text-zinc-400">{key}</Label>
                        <Input
                          value={variables[key] || ""}
                          onChange={(e) => setVariables(prev => ({ ...prev, [key]: e.target.value }))}
                          placeholder={`e.g. ${getMockDefault(key)}`}
                          className="h-8.5 text-xs font-mono bg-muted/30 focus-visible:bg-background border-border/80"
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Section 2: Resend Testing Panel */}
              <div className="p-4 space-y-4">
                <div className="flex items-center gap-2">
                  <Send className="w-4 h-4 text-primary" />
                  <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Send Test Email</h3>
                </div>

                <div className="space-y-3.5">
                  <div className="space-y-1.5">
                    <Label className="text-[11px] font-semibold text-zinc-300">Recipient Email</Label>
                    <Input
                      type="email"
                      value={toEmail}
                      onChange={(e) => setToEmail(e.target.value)}
                      placeholder="name@domain.com"
                      className="h-8.5 text-xs border-border/80"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-[11px] font-semibold text-zinc-300">Subject Line</Label>
                    <Input
                      value={testSubject}
                      onChange={(e) => setTestSubject(e.target.value)}
                      placeholder="Email Subject Line"
                      className="h-8.5 text-xs border-border/80"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-[11px] font-semibold text-zinc-300">From Email (Optional)</Label>
                    <Input
                      value={fromEmail}
                      onChange={(e) => setFromEmail(e.target.value)}
                      placeholder="e.g. Sender Name <sender@domain.com>"
                      className="h-8.5 text-xs border-border/80"
                    />
                    <p className="text-[10px] text-muted-foreground leading-normal">
                      Defaults to Resend Sandbox <code className="bg-muted px-1 rounded">onboarding@resend.dev</code>. Custom domains require verified domains on your Resend account.
                    </p>
                  </div>

                  {/* Collapsible API Key Override */}
                  <div className="border border-border/80 rounded-md overflow-hidden bg-muted/10">
                    <button
                      type="button"
                      onClick={() => setIsApiKeyExpanded(!isApiKeyExpanded)}
                      className="w-full flex items-center justify-between px-3 py-2 text-xs font-semibold text-muted-foreground hover:text-foreground hover:bg-muted/30 transition-colors cursor-pointer"
                    >
                      <span className="flex items-center gap-1.5">
                        <Key className="w-3.5 h-3.5" />
                        Resend API Key Override
                      </span>
                      <span title="Uses server RESEND_API_KEY env key by default. Provide yours to override and send via your Resend account.">
                        <HelpCircle className="w-3.5 h-3.5 opacity-60" />
                      </span>
                    </button>
                    
                    {isApiKeyExpanded && (
                      <div className="p-3 border-t border-border/80 space-y-2">
                        <Label className="text-[10px] text-zinc-400">Custom Resend API Key</Label>
                        <Input
                          type="password"
                          value={customApiKey}
                          onChange={(e) => {
                            setCustomApiKey(e.target.value);
                            localStorage.setItem("letterflow_resend_api_key", e.target.value);
                          }}
                          placeholder="re_..."
                          className="h-8 text-xs font-mono bg-muted/40 border-border/80"
                        />
                        <p className="text-[9px] text-muted-foreground leading-normal">
                          Stored locally in your browser's localStorage for convenience.
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Status Display Area */}
                  {sendSuccess && (
                    <div className="flex gap-2 p-3 rounded-md bg-emerald-500/10 border border-emerald-500/30 text-emerald-500 text-xs items-start animate-in fade-in-0 duration-300">
                      <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
                      <span>Test email successfully dispatched via Resend!</span>
                    </div>
                  )}

                  {sendError && (
                    <div className="flex gap-2 p-3 rounded-md bg-destructive/10 border border-destructive/20 text-destructive text-xs items-start animate-in fade-in-0 duration-300">
                      <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                      <span className="break-all">{sendError}</span>
                    </div>
                  )}

                  {/* Trigger Button */}
                  <Button
                    type="button"
                    onClick={handleSendTest}
                    disabled={sendingTest || !toEmail}
                    className="w-full h-9 text-xs gap-2 font-semibold cursor-pointer"
                  >
                    {sendingTest ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send className="w-3.5 h-3.5" />
                        Send Test Email
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Right Iframe Visual Preview Panel */}
          <div className="flex-1 bg-zinc-950/95 dark:bg-muted/30 overflow-hidden flex justify-center items-start">
            <PreviewDeviceWrapper 
              viewMode={viewMode} 
              fileSizeKB={fileSizeKB}
              subject={testSubject}
              workspaceName={user?.user_metadata?.name ? `${user.user_metadata.name}'s workspace` : "Letterflow Workspace"}
            >
              <iframe 
                ref={iframeRef} 
                srcDoc={html || ""}
                className="w-full h-full border-none bg-white" 
                title="Email Preview"
              />
            </PreviewDeviceWrapper>
          </div>

        </div>
      </div>

      <ExportModal 
        isOpen={isExportOpen} 
        onClose={() => setIsExportOpen(false)} 
        templateName={templateName}
      />
    </>
  );
}
