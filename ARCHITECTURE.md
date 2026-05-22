# Architecture: Radix UI + shadcn + Tailwind Stack

## Current Stack (Module 1)

```
┌─────────────────────────────────────────────────────────────┐
│                     Letterflow UI Layer                     │
│  ┌───────────────────────────────────────────────────────┐  │
│  │ Custom Components (Dashboard Shell, Sidebar, etc.)    │  │
│  └─────────────────────────┬─────────────────────────────┘  │
│                            │                                 │
│  ┌─────────────────────────▼─────────────────────────────┐  │
│  │          shadcn/ui Components (16 total)             │  │
│  │  Button, Input, Dialog, Tabs, Dropdown, etc.        │  │
│  └─────────────────────────┬─────────────────────────────┘  │
│                            │                                 │
│  ┌─────────────────────────▼─────────────────────────────┐  │
│  │      Radix UI Primitives (100% coverage)            │  │
│  │  ✓ Dialog.Root, Tabs.Root, DropdownMenu, etc.       │  │
│  │  ✓ Accessibility: ARIA, keyboard nav, focus mgmt    │  │
│  │  ✓ Floating positioning (Popover-based)             │  │
│  │  ✓ Automatic state management                       │  │
│  └─────────────────────────┬─────────────────────────────┘  │
│                            │                                 │
│  ┌─────────────────────────▼─────────────────────────────┐  │
│  │        Tailwind CSS + Design Tokens                  │  │
│  │  • Custom CSS variables for colors/spacing/radius    │  │
│  │  • Dark-first theme with light mode support          │  │
│  │  • Brand green (#33cc4a) as primary accent           │  │
│  │  • Class-variance-authority for component variants   │  │
│  └─────────────────────────┬─────────────────────────────┘  │
│                            │                                 │
│  ┌─────────────────────────▼─────────────────────────────┐  │
│  │         Browser / DOM Rendering                      │  │
│  └─────────────────────────────────────────────────────┘  │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

## Editor Layer (Module 2 - Planned)

```
┌──────────────────────────────────────────────────────────────┐
│                Template Editor UI Layer                      │
│  ┌────────────────────────────────────────────────────────┐  │
│  │  Custom Editor Components                             │  │
│  │  • EditorShell, Canvas, BlockRenderer                │  │
│  │  • FloatingInsertBar, BlockActionMenu               │  │
│  │  • InspectorPanel, StylePanel                        │  │
│  └────────────────────┬───────────────────────────────────┘  │
│                       │                                      │
│  ┌────────────────────▼───────────────────────────────────┐  │
│  │  Raw Radix Primitives (Editor Features)              │  │
│  │  • Popover (floating insertion bars)                 │  │
│  │  • ContextMenu (block action menus)                  │  │
│  │  • Accordion (inspector collapsible sections)        │  │
│  │  • ToggleGroup (segmented controls)                  │  │
│  │  • ResizeObserver (resizable panes)                  │  │
│  └────────────────────┬───────────────────────────────────┘  │
│                       │                                      │
│  ┌────────────────────▼───────────────────────────────────┐  │
│  │  @dnd-kit (Drag & Drop)                              │  │
│  │  • Sortable blocks                                   │  │
│  │  • Custom drag overlays                              │  │
│  │  • Touch support                                     │  │
│  └────────────────────┬───────────────────────────────────┘  │
│                       │                                      │
│  ┌────────────────────▼───────────────────────────────────┐  │
│  │  shadcn/ui Components (Shared Chrome)                │  │
│  │  • Dialog (settings), Sheet (side panels)            │  │
│  │  • Button, Input, Select (form controls)            │  │
│  └────────────────────┬───────────────────────────────────┘  │
│                       │                                      │
│  ┌────────────────────▼───────────────────────────────────┐  │
│  │  Tailwind CSS + Design Tokens (Shared)               │  │
│  │  • Same color/spacing/radius system                  │  │
│  │  • Dark mode consistency                             │  │
│  └────────────────────┬───────────────────────────────────┘  │
│                       │                                      │
│  ┌────────────────────▼───────────────────────────────────┐  │
│  │         Browser / DOM Rendering                      │  │
│  └────────────────────────────────────────────────────────┘  │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

## Component Dependency Map

```
Module 1: Product Chrome
├── DashboardShell
│   ├── Sidebar
│   │   └── Button (Radix)
│   ├── Header
│   │   └── DropdownMenu (Radix)
│   └── Content Area
├── Page Components
│   ├── Card (CSS wrapper on Radix)
│   ├── Button (Radix Slot)
│   ├── Badge (CSS wrapper)
│   └── Tabs (Radix)
└── Shared Components
    ├── Dialog (Radix)
    ├── Tooltip (Radix)
    ├── Select (Radix)
    ├── Input (Styled)
    └── Label (Radix)

Module 2: Editor (Planned)
├── EditorShell
│   ├── Canvas Area
│   │   ├── FloatingInsertBar (Radix Popover)
│   │   ├── SortableBlock (@dnd-kit)
│   │   │   └── BlockActionMenu (Radix ContextMenu)
│   │   └── Block Renderer
│   ├── InspectorPanel (Radix Accordion)
│   │   ├── StyleInspector
│   │   └── SettingsInspector
│   └── StylePanel (Radix Sheet)
│       ├── ColorPicker
│       ├── SpacingControl
│       └── VariablePicker (Radix Popover)
└── Shared
    ├── SegmentedControl (Radix ToggleGroup)
    └── All Module 1 components
```

## Data Flow

```
User Input
    │
    ├─→ Keyboard (Arrow keys, Tab, Escape)
    │   └─→ Radix handles: Navigation, focus trap, dismiss
    │
    ├─→ Mouse Click
    │   └─→ Radix handles: Click outside, focus management
    │
    └─→ Drag & Drop (@dnd-kit)
        └─→ Custom handlers + Radix positioning for menus

Editor State (Zustand)
    │
    ├─→ Block content
    ├─→ Selected block
    ├─→ Inspector open/closed
    ├─→ Style values
    └─→ Undo/redo (zundo)

Rendering
    │
    └─→ React renders component tree
        └─→ Radix handles accessibility/interactions
            └─→ Tailwind applies styles
                └─→ Design tokens provide values
                    └─→ Browser paints UI
```

## Technology Stack Summary

```
Frontend Framework:  Next.js 16 (App Router)
UI Components:       shadcn/ui (16 components)
Accessible Primitives: Radix UI
Styling:            Tailwind CSS v4
State Management:   Zustand (auth), Zustand (editor in Module 2)
Undo/Redo:          zundo
Drag & Drop:        @dnd-kit
Rich Text:          react-email (Module 3)
Email Service:      Resend (Module 3)
Icons:              lucide-react
Database:           Supabase
Analytics:          Vercel Analytics
```

## Accessibility Guarantees

✅ **Radix UI Provides:**
- ARIA labels and roles
- Keyboard navigation (Tab, Arrow keys, Escape, Enter)
- Focus management (trap, restoration)
- Screen reader support
- Click-outside handling
- Automatic fallback focus

✅ **shadcn/ui Adds:**
- Styled accessible components
- Proper contrast ratios
- Focus indicators
- Semantic HTML

✅ **Our Design System Maintains:**
- Color contrast (dark + light modes)
- Touch-friendly sizing (minimum 44px)
- Clear visual hierarchy

---

## Migration Path: Light Mode Support

Current: Dark mode via `dark` class on HTML

To enable light mode:
```tsx
// src/app/layout.tsx
// Remove 'dark' from className
<html className={`... dark`}> // ← Remove this
```

CSS Variables automatically switch:
```css
/* Light mode values from :root */
:root {
  --background: #ffffff;
  --foreground: #0f172a;
}

/* Dark mode values from .dark */
.dark {
  --background: #0f172a;
  --foreground: #f1f5f9;
}
```

---

## Performance Considerations

✅ **Radix Optimizations:**
- Minimal JavaScript overhead
- No re-renders on position changes
- Lazy floating positioning
- Efficient event delegation

✅ **shadcn Optimizations:**
- CSS-based styling (no CSS-in-JS)
- Tailwind purges unused styles
- Automatic code splitting

✅ **Our Optimizations:**
- Design tokens as CSS variables (no JS)
- Component lazy loading in dashboard
- Analytics for performance monitoring

---

## Future Extensibility

Ready to add:
- ✓ More Radix primitives (Popover, ContextMenu, etc.)
- ✓ More shadcn components (Checkbox, Radio, Switch, etc.)
- ✓ Custom components on Radix foundation
- ✓ Dark/light mode switcher
- ✓ Keyboard shortcuts system
- ✓ Theming system for customer branding
