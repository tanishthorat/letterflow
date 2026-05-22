"use client";

import { useEffect, useState, useMemo } from "react";
import { useDebounce } from "use-debounce";
import Link from "next/link";
import { Plus, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { EmailTemplate } from "@/lib/db.types";

const DEMO_TEMPLATES: EmailTemplate[] = [
  {
    id: "1",
    user_id: "demo",
    name: "Welcome Email",
    subject: "Welcome to {{company_name}}!",
    body: "Hi {{first_name}}, thanks for joining us!",
    category: "welcome",
    status: "published",
    variables: { company_name: "string", first_name: "string" },
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "2",
    user_id: "demo",
    name: "Password Reset",
    subject: "Reset your password",
    body: "Click here to reset your password: {{reset_link}}",
    category: "transactional",
    status: "published",
    variables: { reset_link: "string" },
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "3",
    user_id: "demo",
    name: "Order Confirmation",
    subject: "Your order {{order_id}} is confirmed",
    body: "Thank you for your purchase. Total: {{total}}",
    category: "transactional",
    status: "published",
    variables: { order_id: "string", total: "string" },
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "4",
    user_id: "demo",
    name: "Marketing Campaign",
    subject: "{{campaign_name}} - Limited Time Offer",
    body: "Don't miss out! {{offer_description}}",
    category: "marketing",
    status: "draft",
    variables: { campaign_name: "string", offer_description: "string" },
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "5",
    user_id: "demo",
    name: "Notification Alert",
    subject: "Important: {{alert_type}}",
    body: "{{message}}",
    category: "notification",
    status: "published",
    variables: { alert_type: "string", message: "string" },
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

type Category = EmailTemplate["category"] | "all";

export default function TemplatesPage() {
  const [templates, setTemplates] = useState<EmailTemplate[]>(DEMO_TEMPLATES);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<Category>("all");
  const [debouncedSearch] = useDebounce(search, 300);

  const categories: Category[] = [
    "all",
    "welcome",
    "transactional",
    "marketing",
    "notification",
    "other",
  ];

  const filteredTemplates = useMemo(() => {
    return templates.filter((template) => {
      const matchesSearch =
        template.name.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        template.subject.toLowerCase().includes(debouncedSearch.toLowerCase());

      const matchesCategory =
        selectedCategory === "all" || template.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [templates, debouncedSearch, selectedCategory]);

  const statusBadgeColor = (status: EmailTemplate["status"]) => {
    switch (status) {
      case "published":
        return "bg-green-500/20 text-green-400";
      case "draft":
        return "bg-yellow-500/20 text-yellow-400";
      case "archived":
        return "bg-gray-500/20 text-gray-400";
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold tracking-tight">Email Templates</h1>
          <p className="text-lg text-muted-foreground">
            Manage your email templates
          </p>
        </div>
        <Button className="bg-accent text-accent-foreground hover:bg-accent/90">
          <Plus className="w-4 h-4 mr-2" />
          Create Template
        </Button>
      </div>

      {/* Filters */}
      <div className="space-y-4">
        {/* Search */}
        <div className="relative">
          <Search className="w-5 h-5 absolute left-3 top-3 text-muted-foreground" />
          <Input
            placeholder="Search templates by name or subject..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <Button
              key={cat}
              variant={selectedCategory === cat ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(cat)}
            >
              {cat.charAt(0).toUpperCase() + cat.slice(1)}
            </Button>
          ))}
        </div>
      </div>

      {/* Templates Grid */}
      {filteredTemplates.length === 0 ? (
        <Card>
          <CardContent className="pt-6 text-center">
            <p className="text-muted-foreground mb-4">No templates found</p>
            <Button className="bg-accent text-accent-foreground hover:bg-accent/90">
              Create your first template
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {filteredTemplates.map((template) => (
            <Card key={template.id} className="hover:border-accent/50 transition-colors cursor-pointer">
              <CardHeader>
                <div className="flex justify-between items-start gap-2 mb-2">
                  <CardTitle className="text-base">{template.name}</CardTitle>
                  <Badge className={statusBadgeColor(template.status)} variant="secondary">
                    {template.status}
                  </Badge>
                </div>
                <CardDescription className="line-clamp-2">
                  {template.subject}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between items-center text-xs text-muted-foreground">
                  <Badge variant="outline">
                    {template.category}
                  </Badge>
                  <span>{Object.keys(template.variables).length} vars</span>
                </div>
                <Button variant="outline" className="w-full">
                  Edit
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
