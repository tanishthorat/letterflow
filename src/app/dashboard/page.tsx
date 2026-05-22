"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { LayoutGrid, Palette, Zap } from "lucide-react";

export default function DashboardHome() {
  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="space-y-2">
        <h1 className="text-4xl font-bold tracking-tight">Welcome to Letterflow</h1>
        <p className="text-lg text-muted-foreground">
          Email template management built with modern design principles
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="space-y-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Templates
            </CardTitle>
            <div className="text-3xl font-bold">5</div>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="space-y-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Published
            </CardTitle>
            <div className="text-3xl font-bold">3</div>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="space-y-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Drafts
            </CardTitle>
            <div className="text-3xl font-bold">2</div>
          </CardHeader>
        </Card>
      </div>

      {/* Feature Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="hover:border-accent/50 transition-colors">
          <CardHeader>
            <LayoutGrid className="w-8 h-8 text-accent mb-2" />
            <CardTitle>Template Management</CardTitle>
            <CardDescription>
              Create, edit, and organize email templates
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/dashboard/templates">
              <Button variant="outline" className="w-full">
                Go to Templates
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="hover:border-accent/50 transition-colors">
          <CardHeader>
            <Palette className="w-8 h-8 text-accent mb-2" />
            <CardTitle>Design System</CardTitle>
            <CardDescription>
              View all UI components and design tokens
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/dashboard/components">
              <Button variant="outline" className="w-full">
                View Components
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="hover:border-accent/50 transition-colors">
          <CardHeader>
            <Zap className="w-8 h-8 text-accent mb-2" />
            <CardTitle>Getting Started</CardTitle>
            <CardDescription>
              Learn how to use Letterflow
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" className="w-full" disabled>
              Coming Soon
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Status */}
      <Card className="bg-accent/5 border-accent/30">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>UI Foundation Ready</CardTitle>
              <CardDescription className="mt-1">
                All components installed and configured with brand design tokens
              </CardDescription>
            </div>
            <Badge className="bg-accent text-accent-foreground">Live</Badge>
          </div>
        </CardHeader>
      </Card>
    </div>
  );
}
