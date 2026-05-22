"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AlertCircle, ChevronDown, HelpCircle } from "lucide-react";

export default function ComponentsShowcase() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <div className="space-y-12">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-4xl font-bold tracking-tight">Component Showcase</h1>
        <p className="text-lg text-muted-foreground">
          Visual reference for all UI components and design tokens. Dark-first design with brand green (#33cc4a) accents.
        </p>
      </div>

      <Separator className="my-8" />

      {/* Buttons Section */}
      <section className="space-y-4">
        <div className="space-y-2">
          <h2 className="text-2xl font-bold">Buttons</h2>
          <p className="text-muted-foreground">Primary, secondary, outline, and destructive variants</p>
        </div>
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-wrap gap-4">
              <Button>Primary</Button>
              <Button variant="secondary">Secondary</Button>
              <Button variant="outline">Outline</Button>
              <Button variant="destructive">Destructive</Button>
              <Button variant="ghost">Ghost</Button>
              <Button disabled>Disabled</Button>
              <Button size="sm">Small</Button>
              <Button size="lg">Large</Button>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Form Inputs */}
      <section className="space-y-4">
        <div className="space-y-2">
          <h2 className="text-2xl font-bold">Form Elements</h2>
          <p className="text-muted-foreground">Input, textarea, select, and labels</p>
        </div>
        <Card>
          <CardContent className="pt-6 space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                placeholder="you@example.com"
                type="email"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="message">Message</Label>
              <Textarea
                id="message"
                placeholder="Enter your message..."
                rows={4}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="select">Select Option</Label>
              <Select>
                <SelectTrigger id="select">
                  <SelectValue placeholder="Choose an option" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="option1">Option 1</SelectItem>
                  <SelectItem value="option2">Option 2</SelectItem>
                  <SelectItem value="option3">Option 3</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Badges & Status */}
      <section className="space-y-4">
        <div className="space-y-2">
          <h2 className="text-2xl font-bold">Badges & Status</h2>
          <p className="text-muted-foreground">Status indicators and badge variants</p>
        </div>
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-wrap gap-3">
              <Badge>Default</Badge>
              <Badge variant="secondary">Secondary</Badge>
              <Badge variant="destructive">Destructive</Badge>
              <Badge className="bg-accent">Brand Green</Badge>
              <Badge className="bg-blue-500">Blue</Badge>
              <Badge className="bg-purple-500">Purple</Badge>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Cards */}
      <section className="space-y-4">
        <div className="space-y-2">
          <h2 className="text-2xl font-bold">Cards</h2>
          <p className="text-muted-foreground">Card component with various content layouts</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <CardHeader>
              <CardTitle>Card Title</CardTitle>
              <CardDescription>Card description goes here</CardDescription>
            </CardHeader>
            <CardContent>
              Content area with proper spacing and typography.
            </CardContent>
          </Card>

          <Card className="border-accent/50 bg-accent/5">
            <CardHeader>
              <CardTitle className="text-accent">Featured Card</CardTitle>
              <CardDescription>Accent border variant</CardDescription>
            </CardHeader>
            <CardContent>
              Cards can be styled with accent colors for emphasis.
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Tabs */}
      <section className="space-y-4">
        <div className="space-y-2">
          <h2 className="text-2xl font-bold">Tabs</h2>
          <p className="text-muted-foreground">Tabbed content panels</p>
        </div>
        <Card>
          <CardContent className="pt-6">
            <Tabs defaultValue="tab1">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="tab1">Tab 1</TabsTrigger>
                <TabsTrigger value="tab2">Tab 2</TabsTrigger>
                <TabsTrigger value="tab3">Tab 3</TabsTrigger>
              </TabsList>
              <TabsContent value="tab1" className="mt-4">
                Content for tab 1
              </TabsContent>
              <TabsContent value="tab2" className="mt-4">
                Content for tab 2
              </TabsContent>
              <TabsContent value="tab3" className="mt-4">
                Content for tab 3
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </section>

      {/* Dialog */}
      <section className="space-y-4">
        <div className="space-y-2">
          <h2 className="text-2xl font-bold">Dialog</h2>
          <p className="text-muted-foreground">Modal dialog component</p>
        </div>
        <Card>
          <CardContent className="pt-6">
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button>Open Dialog</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Dialog Title</DialogTitle>
                  <DialogDescription>
                    This is a dialog component for modal interactions.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <Input placeholder="Enter something..." />
                  <div className="flex gap-2 justify-end">
                    <Button
                      variant="outline"
                      onClick={() => setIsDialogOpen(false)}
                    >
                      Cancel
                    </Button>
                    <Button onClick={() => setIsDialogOpen(false)}>
                      Confirm
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </CardContent>
        </Card>
      </section>

      {/* Dropdown Menu */}
      <section className="space-y-4">
        <div className="space-y-2">
          <h2 className="text-2xl font-bold">Dropdown Menu</h2>
          <p className="text-muted-foreground">Context menu component</p>
        </div>
        <Card>
          <CardContent className="pt-6">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">
                  Open Menu
                  <ChevronDown className="w-4 h-4 ml-2" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem>Profile</DropdownMenuItem>
                <DropdownMenuItem>Settings</DropdownMenuItem>
                <DropdownMenuItem>Help</DropdownMenuItem>
                <DropdownMenuItem className="text-destructive">
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </CardContent>
        </Card>
      </section>

      {/* Tooltip */}
      <section className="space-y-4">
        <div className="space-y-2">
          <h2 className="text-2xl font-bold">Tooltip</h2>
          <p className="text-muted-foreground">Informational tooltips</p>
        </div>
        <Card>
          <CardContent className="pt-6 flex gap-4">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" size="icon">
                  <HelpCircle className="w-4 h-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>This is a helpful tooltip</p>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" size="icon">
                  <AlertCircle className="w-4 h-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right">
                <p>Warning information here</p>
              </TooltipContent>
            </Tooltip>
          </CardContent>
        </Card>
      </section>

      {/* Skeleton */}
      <section className="space-y-4">
        <div className="space-y-2">
          <h2 className="text-2xl font-bold">Skeleton Loading</h2>
          <p className="text-muted-foreground">Loading state placeholders</p>
        </div>
        <Card>
          <CardContent className="pt-6 space-y-3">
            <Skeleton className="h-12 w-12 rounded-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-4/5" />
          </CardContent>
        </Card>
      </section>

      {/* Color Palette */}
      <section className="space-y-4">
        <div className="space-y-2">
          <h2 className="text-2xl font-bold">Design Tokens</h2>
          <p className="text-muted-foreground">Brand colors and semantic tokens</p>
        </div>
        <Card>
          <CardContent className="pt-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="space-y-2">
                <div className="h-20 rounded-lg bg-accent border-2 border-border" />
                <p className="text-sm font-medium">Brand Green</p>
                <p className="text-xs text-muted-foreground">#33cc4a</p>
              </div>
              <div className="space-y-2">
                <div className="h-20 rounded-lg bg-primary border-2 border-border" />
                <p className="text-sm font-medium">Primary</p>
              </div>
              <div className="space-y-2">
                <div className="h-20 rounded-lg bg-secondary border-2 border-border" />
                <p className="text-sm font-medium">Secondary</p>
              </div>
              <div className="space-y-2">
                <div className="h-20 rounded-lg bg-muted border-2 border-border" />
                <p className="text-sm font-medium">Muted</p>
              </div>
              <div className="space-y-2">
                <div className="h-20 rounded-lg bg-destructive border-2 border-border" />
                <p className="text-sm font-medium">Destructive</p>
              </div>
              <div className="space-y-2">
                <div className="h-20 rounded-lg bg-card border-2 border-border" />
                <p className="text-sm font-medium">Card</p>
              </div>
              <div className="space-y-2">
                <div className="h-20 rounded-lg bg-background border-2 border-border" />
                <p className="text-sm font-medium">Background</p>
              </div>
              <div className="space-y-2">
                <div className="h-20 rounded-lg border-2 border-border" style={{ background: "var(--surface-secondary)" }} />
                <p className="text-sm font-medium">Surface</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Spacing & Radius Reference */}
      <section className="space-y-4 mb-12">
        <div className="space-y-2">
          <h2 className="text-2xl font-bold">Layout & Spacing</h2>
          <p className="text-muted-foreground">Border radius and spacing scales</p>
        </div>
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-semibold mb-3">Border Radius</h3>
                <div className="flex flex-wrap gap-3">
                  <div className="w-16 h-16 bg-accent rounded-xs" title="xs" />
                  <div className="w-16 h-16 bg-accent rounded-sm" title="sm" />
                  <div className="w-16 h-16 bg-accent rounded-md" title="md" />
                  <div className="w-16 h-16 bg-accent rounded-lg" title="lg" />
                  <div className="w-16 h-16 bg-accent rounded-xl" title="xl" />
                  <div className="w-16 h-16 bg-accent rounded-2xl" title="2xl" />
                  <div className="w-16 h-16 bg-accent rounded-full" title="full" />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
