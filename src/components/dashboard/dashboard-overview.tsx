"use client";

import { useEffect, useState, useMemo, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  LayoutGrid,
  Sparkles,
  Clock,
  FileText,
  Send,
  ChevronRight,
  ArrowRight,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Plus,
  Zap,
  BarChart3,
  Mail,
  Edit3,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import { useTemplateStore } from "@/lib/stores/template";
import type { EmailTemplate } from "@/lib/db.types";

// ─── Helpers ────────────────────────────────────────────────────────────────

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const m = Math.floor(diff / 60000);
  const h = Math.floor(m / 60);
  const d = Math.floor(h / 24);
  if (d > 0) return `${d}d ago`;
  if (h > 0) return `${h}h ago`;
  if (m > 0) return `${m}m ago`;
  return "just now";
}

const CATEGORY_COLORS: Record<EmailTemplate["category"], string> = {
  transactional: "bg-blue-500",
  marketing: "bg-purple-500",
  support: "bg-orange-500",
  billing: "bg-yellow-500",
  system: "bg-gray-500",
  other: "bg-pink-500",
};

const STATUS_STYLES: Record<EmailTemplate["status"], string> = {
  published: "bg-green-500/15 text-green-400 border-green-500/30",
  draft: "bg-yellow-500/15 text-yellow-400 border-yellow-500/30",
  archived: "bg-gray-500/15 text-gray-400 border-gray-500/30",
};

// ─── Sub-components ──────────────────────────────────────────────────────────

function StatCard({
  label,
  value,
  icon: Icon,
  description,
  accent,
}: {
  label: string;
  value: number | string;
  icon: React.ElementType;
  description?: string;
  accent?: boolean;
}) {
  return (
    <Card
      className={`relative overflow-hidden transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg ${
        accent ? "border-accent/40 bg-accent/5" : ""
      }`}
    >
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            {label}
          </CardTitle>
          <div
            className={`p-2 rounded-lg ${
              accent
                ? "bg-accent/20 text-accent"
                : "bg-muted text-muted-foreground"
            }`}
          >
            <Icon className="w-4 h-4" />
          </div>
        </div>
        <div className={`text-3xl font-bold ${accent ? "text-accent" : ""}`}>
          {value}
        </div>
        {description && (
          <p className="text-xs text-muted-foreground mt-1">{description}</p>
        )}
      </CardHeader>
      {accent && (
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-8 -right-8 w-32 h-32 bg-accent/8 rounded-full blur-2xl" />
        </div>
      )}
    </Card>
  );
}

function RecentTemplateRow({ template }: { template: EmailTemplate }) {
  const router = useRouter();
  return (
    <div
      className="flex items-center justify-between py-3 px-4 rounded-lg hover:bg-muted/40 transition-colors cursor-pointer group"
      onClick={() => router.push(`/editor/${template.id}`)}
    >
      <div className="flex items-center gap-3 min-w-0">
        <div className="p-2 rounded-md bg-muted flex-shrink-0">
          <Mail className="w-3.5 h-3.5 text-muted-foreground" />
        </div>
        <div className="min-w-0">
          <p className="text-sm font-medium truncate">{template.name}</p>
          <p className="text-xs text-muted-foreground truncate">
            {template.subject || "No subject set"}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-3 flex-shrink-0 ml-3">
        <Badge
          variant="outline"
          className={`text-[10px] h-5 px-1.5 ${STATUS_STYLES[template.status]}`}
        >
          {template.status}
        </Badge>
        <span className="text-[11px] text-muted-foreground w-12 text-right">
          {timeAgo(template.updated_at)}
        </span>
        <ChevronRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>
    </div>
  );
}

// ─── AI Quick-Draft Component ────────────────────────────────────────────────

function AIDraftPanel({ onDraftCreated }: { onDraftCreated: () => void }) {
  const router = useRouter();
  const [prompt, setPrompt] = useState("");
  const [state, setState] = useState<"idle" | "loading" | "success" | "error">(
    "idle"
  );
  const [message, setMessage] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const EXAMPLE_PROMPTS = [
    "Welcome email for new SaaS users, warm and helpful tone",
    "Password reset email, clear and secure",
    "Monthly billing reminder with invoice summary",
    "Re-engagement email for users inactive for 30 days",
    "Feature announcement for a new AI tool, excitement and FOMO",
  ];

  const handleGenerate = async () => {
    if (!prompt.trim() || state === "loading") return;
    setState("loading");
    setMessage("");

    try {
      const res = await fetch("/api/ai/template", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: prompt.trim() }),
      });
      const data = await res.json();

      if (!res.ok) {
        setState("error");
        setMessage(data.error || "Something went wrong.");
        return;
      }

      setState("success");
      setMessage(`"${data.templateName}" created!`);
      onDraftCreated();

      setTimeout(() => {
        router.push(`/editor/${data.templateId}`);
      }, 1200);
    } catch {
      setState("error");
      setMessage("Network error. Please try again.");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      handleGenerate();
    }
  };

  return (
    <Card className="border-accent/30 bg-gradient-to-br from-accent/5 via-card to-card relative overflow-hidden flex flex-col flex-1">
      {/* Ambient glow */}
      <div className="absolute -top-12 -right-12 w-48 h-48 bg-accent/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-accent/5 rounded-full blur-2xl pointer-events-none" />

      <CardHeader className="pb-4">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-accent/20">
            <Sparkles className="w-4 h-4 text-accent" />
          </div>
          <div>
            <CardTitle className="text-base">AI Layout Generator</CardTitle>
            <CardDescription className="text-xs mt-0.5">
              Describe your email in plain English — AI generates a full,
              editable layout in seconds.
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className="flex flex-col flex-1 gap-4 relative">
        <div className="relative flex-1 flex flex-col">
          <textarea
            ref={textareaRef}
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder='e.g. "A 2-column product launch email with a hero image and CTA"'
            className="flex-1 w-full bg-background border border-border rounded-lg px-3.5 py-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent/50 transition-all placeholder:text-muted-foreground/60"
          />
          <div className="absolute bottom-2.5 right-2.5 text-[10px] text-muted-foreground/50">
            ⌘ + Enter
          </div>
        </div>

        {/* Example prompts */}
        <div className="flex flex-wrap gap-1.5">
          {EXAMPLE_PROMPTS.map((ex) => (
            <button
              key={ex}
              onClick={() => {
                setPrompt(ex);
                textareaRef.current?.focus();
              }}
              className="text-[11px] px-2 py-1 rounded-full bg-muted hover:bg-muted/70 text-muted-foreground hover:text-foreground transition-colors border border-border/50"
            >
              {ex.length > 36 ? ex.slice(0, 36) + "…" : ex}
            </button>
          ))}
        </div>

        {/* Status feedback */}
        {state === "error" && (
          <div className="flex items-center gap-2 text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-lg px-3 py-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            {message}
          </div>
        )}
        {state === "success" && (
          <div className="flex items-center gap-2 text-sm text-green-400 bg-green-500/10 border border-green-500/20 rounded-lg px-3 py-2">
            <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
            {message} Opening editor…
          </div>
        )}

        <div className="flex items-center gap-3">
          <Button
            onClick={handleGenerate}
            disabled={!prompt.trim() || state === "loading" || state === "success"}
            className="bg-accent text-accent-foreground hover:bg-accent/90 gap-2 flex-1 sm:flex-none"
          >
            {state === "loading" ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Generating…
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                Generate Draft
              </>
            )}
          </Button>
          <span className="text-xs text-muted-foreground hidden sm:block">
            Powered by Groq
          </span>
        </div>
      </CardContent>
    </Card>
  );
}

// ─── Main Overview Component ─────────────────────────────────────────────────

export function DashboardOverview() {
  const router = useRouter();
  const { templates, fetchTemplates, createTemplate, loading } =
    useTemplateStore();
  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    fetchTemplates();
  }, [fetchTemplates]);

  const stats = useMemo(() => {
    const total = templates.length;
    const published = templates.filter((t) => t.status === "published").length;
    const drafts = templates.filter((t) => t.status === "draft").length;
    const archived = templates.filter((t) => t.status === "archived").length;
    return { total, published, drafts, archived };
  }, [templates]);

  const recentTemplates = useMemo(
    () =>
      [...templates]
        .sort(
          (a, b) =>
            new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
        )
        .slice(0, 6),
    [templates]
  );

  const handleCreateBlank = async () => {
    setIsCreating(true);
    try {
      const template = await createTemplate({
        name: "Untitled Template",
        category: "other",
      });
      if (template) {
        router.push(`/editor/${template.id}`);
      }
    } finally {
      setIsCreating(false);
    }
  };

  const handleDraftCreated = () => {
    fetchTemplates();
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* ── Page Header ──────────────────────────────────────────── */}
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground text-sm">
            Your email template workspace — create, manage, and ship faster.
          </p>
        </div>

        {/* Quick Actions */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <Button
            variant="outline"
            size="sm"
            onClick={handleCreateBlank}
            disabled={isCreating}
            className="gap-1.5 h-9"
          >
            {isCreating ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Plus className="w-3.5 h-3.5" />
            )}
            New Template
          </Button>
          <Button
            size="sm"
            className="bg-accent text-accent-foreground hover:bg-accent/90 gap-1.5 h-9"
            asChild
          >
            <Link href="/dashboard/templates">
              <LayoutGrid className="w-3.5 h-3.5" />
              All Templates
            </Link>
          </Button>
        </div>
      </div>

      {/* ── Stats Row ────────────────────────────────────────────── */}
      {loading && templates.length === 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader className="pb-2">
                <div className="h-4 bg-muted rounded w-24" />
                <div className="h-8 bg-muted rounded w-12 mt-2" />
              </CardHeader>
            </Card>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard
            label="Total Templates"
            value={stats.total}
            icon={FileText}
            description={stats.total === 0 ? "Create your first one →" : undefined}
            accent={stats.total > 0}
          />
          <StatCard
            label="Published"
            value={stats.published}
            icon={Send}
            description={
              stats.total > 0
                ? `${Math.round((stats.published / stats.total) * 100)}% of total`
                : undefined
            }
          />
          <StatCard
            label="Drafts"
            value={stats.drafts}
            icon={Edit3}
            description={stats.drafts > 0 ? "In progress" : undefined}
          />
          <StatCard
            label="Archived"
            value={stats.archived}
            icon={BarChart3}
            description={stats.archived > 0 ? "Out of rotation" : "None archived"}
          />
        </div>
      )}

      {/* ── Main Two-Column Grid ──────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 items-stretch">
        {/* Left: AI Draft (col-span-3) */}
        <div className="lg:col-span-3 flex flex-col">
          <AIDraftPanel onDraftCreated={handleDraftCreated} />
        </div>

        {/* Right: Recent Activity (col-span-2) */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="h-fit">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-md bg-muted">
                    <Clock className="w-4 h-4 text-muted-foreground" />
                  </div>
                  <CardTitle className="text-base">Recent Activity</CardTitle>
                </div>
                <Link
                  href="/dashboard/templates"
                  className="text-xs text-accent hover:text-accent/80 flex items-center gap-0.5 transition-colors"
                >
                  View all
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
              <CardDescription className="text-xs">
                Recently created or edited templates
              </CardDescription>
            </CardHeader>
            <CardContent className="px-2 pb-2">
              {loading && templates.length === 0 ? (
                <div className="space-y-2 px-2">
                  {[...Array(4)].map((_, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-3 py-3 animate-pulse"
                    >
                      <div className="w-8 h-8 rounded-md bg-muted flex-shrink-0" />
                      <div className="flex-1 space-y-1.5">
                        <div className="h-3 bg-muted rounded w-3/4" />
                        <div className="h-2.5 bg-muted rounded w-1/2" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : recentTemplates.length === 0 ? (
                <div className="px-4 py-8 text-center">
                  <Zap className="w-8 h-8 text-muted-foreground/40 mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">
                    No templates yet.
                    <br />
                    Create one to see activity here.
                  </p>
                </div>
              ) : (
                <div>
                  {recentTemplates.map((template) => (
                    <RecentTemplateRow key={template.id} template={template} />
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Tips Card */}
          <Card className="bg-gradient-to-br from-muted/30 to-card border-border/50">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-md bg-accent/20">
                  <Zap className="w-4 h-4 text-accent" />
                </div>
                <CardTitle className="text-sm">Pro Tips</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {[
                {
                  text: "Use {{first_name}} placeholders for personalized emails",
                  icon: "💡",
                },
                {
                  text: "Send a test email before publishing to check rendering",
                  icon: "✉️",
                },
                {
                  text: "AI Draft works best with detailed, specific prompts",
                  icon: "✨",
                },
              ].map(({ text, icon }) => (
                <div key={text} className="flex items-start gap-2.5 text-xs">
                  <span className="flex-shrink-0 mt-0.5">{icon}</span>
                  <span className="text-muted-foreground">{text}</span>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
