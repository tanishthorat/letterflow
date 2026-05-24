"use client";

import { useState, useEffect } from "react";
import { useEditorStore } from "@/lib/editor/store";
import { useAuth } from "@/lib/auth";
import {
  Dialog, DialogContent, DialogDescription,
  DialogHeader, DialogTitle
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Sparkles, Send, Key, AlertCircle, CheckCircle2,
  HelpCircle, Clipboard, Check, Download, Loader2
} from "lucide-react";
import { extractPlaceholders, replacePlaceholders } from "@/lib/editor/placeholders";
import { generateEmailHtml } from "@/lib/email/generate";

interface ExportModalProps {
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

export function ExportModal({ isOpen, onClose, templateName }: ExportModalProps) {
  const { getDesign } = useEditorStore();
  const { user } = useAuth();

  // Dynamic Variable States
  const [placeholders, setPlaceholders] = useState<string[]>([]);
  const [variables, setVariables] = useState<Record<string, string>>({});

  // Export Actions States
  const [copied, setCopied] = useState(false);
  const [downloading, setDownloading] = useState(false);

  // Send Test States
  const [toEmail, setToEmail] = useState("");
  const [testSubject, setTestSubject] = useState("");
  const [fromEmail, setFromEmail] = useState("");
  const [customApiKey, setCustomApiKey] = useState("");
  const [isApiKeyExpanded, setIsApiKeyExpanded] = useState(false);
  const [sendingTest, setSendingTest] = useState(false);
  const [sendSuccess, setSendSuccess] = useState(false);
  const [sendError, setSendError] = useState<string | null>(null);

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

      // Reset success/error messages
      setSendSuccess(false);
      setSendError(null);
      setCopied(false);
    }
  }, [isOpen, getDesign, user, templateName]);

  // Generate the interpolated HTML code
  const getInterpolatedHtml = async (): Promise<string> => {
    const design = getDesign();
    const rawHtml = await generateEmailHtml(design);
    return replacePlaceholders(rawHtml, variables);
  };

  // Copy HTML to Clipboard
  const handleCopyHtml = async () => {
    try {
      const html = await getInterpolatedHtml();
      await navigator.clipboard.writeText(html);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy HTML", err);
    }
  };

  // Download HTML File
  const handleDownloadHtml = async () => {
    setDownloading(true);
    try {
      const html = await getInterpolatedHtml();
      const blob = new Blob([html], { type: "text/html" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${templateName ? templateName.toLowerCase().replace(/\s+/g, "-") : "email-template"}.html`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Failed to download HTML", err);
    } finally {
      setDownloading(false);
    }
  };

  // Send Test Email
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

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-2xl p-8 bg-card border-border/80 text-foreground select-none max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-foreground font-semibold">
            <Sparkles className="w-5 h-5 text-primary" />
            Export Email Template
          </DialogTitle>
          <DialogDescription className="text-muted-foreground text-xs">
            Configure dynamic placeholders and download, copy, or send a test email.
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-2">

          {/* Left Column: Variable Configuration ("Shell Options") */}
          <div className="space-y-4 pr-0 md:pr-4 md:border-r border-border/60">
            <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
              Placeholder variables (Shell Options)
            </h4>

            {placeholders.length === 0 ? (
              <div className="p-3.5 rounded-lg border border-primary/20 bg-primary/5 text-xs text-muted-foreground leading-relaxed">
                <span className="font-semibold text-foreground block mb-1">💡 Tips</span>
                Use variables like <code className="bg-muted px-1 py-0.5 rounded text-primary font-mono text-[11px] font-bold">{"{{first_name}}"}</code> in your template text to configure them here.
              </div>
            ) : (
              <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1">
                <p className="text-[11px] text-muted-foreground leading-normal">
                  Customize the values to inject in exported HTML and test emails.
                </p>
                {placeholders.map((key) => (
                  <div key={key} className="space-y-1">
                    <Label className="text-[11px] font-mono font-bold text-zinc-400">{key}</Label>
                    <Input
                      value={variables[key] || ""}
                      onChange={(e) => setVariables(prev => ({ ...prev, [key]: e.target.value }))}
                      placeholder={`e.g. ${getMockDefault(key)}`}
                      className="h-8.5 text-xs font-mono bg-muted/20 border-border/80"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Right Column: Actions & Test Send */}
          <div className="space-y-5">
            {/* Quick Export Actions */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Export Options
              </h4>
              <div className="flex gap-2">
                <Button
                  onClick={handleCopyHtml}
                  variant="outline"
                  className="flex-1 h-9 text-xs gap-1.5 border-border/80 cursor-pointer"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-green-500" /> : <Clipboard className="w-3.5 h-3.5" />}
                  {copied ? "Copied Code!" : "Copy HTML"}
                </Button>
                <Button
                  onClick={handleDownloadHtml}
                  variant="outline"
                  disabled={downloading}
                  className="flex-1 h-9 text-xs gap-1.5 border-border/80 cursor-pointer"
                >
                  {downloading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Download className="w-3.5 h-3.5" />}
                  Download File
                </Button>
              </div>
            </div>

            {/* Send Test form */}
            <div className="space-y-3.5 pt-2 border-t border-border/40">
              <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                Send Test Email
              </h4>

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

              {/* <div className="space-y-1.5">
                <Label className="text-[11px] font-semibold text-zinc-300">From Email (Optional)</Label>
                <Input
                  value={fromEmail}
                  onChange={(e) => setFromEmail(e.target.value)}
                  placeholder="e.g. Sender Name <sender@domain.com>"
                  className="h-8.5 text-xs border-border/80"
                />
                <p className="text-[9px] text-muted-foreground leading-normal">
                  Defaults to verified domain or <code className="bg-muted px-1 rounded">contact@tanishdev.me</code>.
                </p>
              </div> */}

              {/* Collapsible API Key Override */}
              {/* <div className="border border-border/60 rounded-md overflow-hidden bg-muted/5">
                <button
                  type="button"
                  onClick={() => setIsApiKeyExpanded(!isApiKeyExpanded)}
                  className="w-full flex items-center justify-between px-3 py-1.5 text-[11px] font-semibold text-muted-foreground hover:text-foreground hover:bg-muted/20 transition-colors cursor-pointer"
                >
                  <span className="flex items-center gap-1.5">
                    <Key className="w-3 h-3" />
                    Resend API Key Override
                  </span>
                  <span title="Uses server RESEND_API_KEY env key by default. Provide yours to override and send via your Resend account.">
                    <HelpCircle className="w-3 h-3 opacity-60" />
                  </span>
                </button>
                
                {isApiKeyExpanded && (
                  <div className="p-3 border-t border-border/60 space-y-1.5">
                    <Label className="text-[10px] text-zinc-400">Custom Resend API Key</Label>
                    <Input
                      type="password"
                      value={customApiKey}
                      onChange={(e) => {
                        setCustomApiKey(e.target.value);
                        localStorage.setItem("letterflow_resend_api_key", e.target.value);
                      }}
                      placeholder="re_..."
                      className="h-8 text-xs font-mono bg-muted/20 border-border/80"
                    />
                  </div>
                )}
              </div> */}

              {/* Send Status */}
              {sendSuccess && (
                <div className="flex gap-2 p-2.5 rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-[11px] items-start animate-in fade-in-0 duration-300">
                  <CheckCircle2 className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                  <span>Test email successfully dispatched!</span>
                </div>
              )}

              {sendError && (
                <div className="flex gap-2 p-2.5 rounded bg-destructive/10 border border-destructive/20 text-destructive text-[11px] items-start animate-in fade-in-0 duration-300">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                  <span className="break-all">{sendError}</span>
                </div>
              )}

              <Button
                type="button"
                onClick={handleSendTest}
                disabled={sendingTest || !toEmail}
                className="w-full h-8.5 text-xs gap-2 font-semibold cursor-pointer"
              >
                {sendingTest ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
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

      </DialogContent>
    </Dialog>
  );
}
