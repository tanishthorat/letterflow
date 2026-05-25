# 💌 Letterflow

**Letterflow** is a modern, drag-and-drop email template builder designed for non-technical users, marketers, and developers alike. 

It bridges the gap between complex HTML email coding and rigid visual builders by offering an intuitive editor backed by an AI assistant that understands the template schema natively. It allows users to quickly generate full layouts via prompts, refine individual content blocks, and send test emails—all while guaranteeing perfectly rendering, responsive code under the hood.

---

## ✨ Key Features

- **Schema-Aware AI Generation**: Generate full, visually editable email layouts from a simple text prompt.
- **AI Content Rewriting**: Select any text or button block and ask the AI to rewrite or optimize it instantly.
- **Drag-and-Drop Editor**: A seamless, intuitive canvas built on a strict hierarchical schema (`Stripes > Structures > Columns > Blocks`).
- **Responsive HTML Export**: Templates compile into robust, client-safe HTML using `react-email`.
- **Live Preview & Testing**: Instantly preview your designs and send test emails via Resend.
- **Tenant-Isolated Security**: Built-in authentication and Row Level Security (RLS) via Supabase.

---

## 🛠 Tech Stack

Letterflow is built with a modern, scalable stack designed for speed, flexibility, and developer experience.

- **Framework**: [Next.js 16 (App Router)](https://nextjs.org/) - For robust server-side rendering and seamless API routes.
- **UI & Styling**: [Tailwind CSS v4](https://tailwindcss.com/), [shadcn/ui](https://ui.shadcn.com/), and [Radix UI](https://www.radix-ui.com/) - Providing accessible primitives with a highly customizable, dark-first design system.
- **Database & Auth**: [Supabase (PostgreSQL)](https://supabase.com/) - For quick implementation of secure authentication, Row Level Security, and JSONB state storage.
- **State Management**: [Zustand](https://github.com/pmndrs/zustand) & [zundo](https://github.com/charkour/zundo) - Ideal for the editor's complex state (drag-and-drop, selected nodes) and undo/redo functionality without React context bloat.
- **Drag & Drop**: [@dnd-kit](https://dndkit.com/) - A lightweight, modular drag-and-drop toolkit.
- **Email Engine**: [react-email](https://react.email/) - For compiling the visual block schema into bulletproof HTML.
- **AI Integration**: [Groq API](https://groq.com/) (Llama 3 Models) - Delivering near-instantaneous inference speeds for real-time AI generation.
- **Email Delivery**: [Resend](https://resend.com/) - Modern developer-friendly API for sending test emails.

---

## 🏗 Architecture & System Design

### 1. The Editor Model
Instead of storing raw HTML, which is notoriously difficult to parse back into a visual editor, Letterflow stores data as a strictly typed JSON object (`TemplateDesign`). 

This schema relies on a structured hierarchy:
`Stripes (Bands) -> Structures (Wrappers) -> Columns -> Blocks (Text, Image, Button, Divider)`

By employing a **Block Registry Pattern**, the system dynamically maps logical block types to their specific React rendering components. This decoupled approach makes adding new block types in the future trivial.

### 2. AI Integration
Letterflow integrates AI structurally rather than just decoratively.
- **Whole-Template Generation (`llama-3.3-70b-versatile`)**: The AI is strictly prompted to output a JSON object that adheres exactly to our `TemplateDesign` schema. This means AI-generated emails immediately populate the drag-and-drop builder, granting the user full editing control.
- **Block Rewriting (`llama-3.1-8b-instant`)**: Fast, context-aware rewriting of individual text/button blocks directly within the editor.
- We utilize **Groq** to ensure generation happens in milliseconds, maintaining a snappy, responsive editor experience.

### 3. Data Flow & Security
- **Frontend State**: User interactions update the Zustand store. On save, this state is serialized as JSONB.
- **Backend**: Next.js Route Handlers (`/api/*`) securely authenticate requests via Supabase session tokens before performing DB operations or communicating with Groq/Resend.
- **Database Security**: Supabase Row Level Security (RLS) is strictly enforced at the PostgreSQL level, guaranteeing users can only interact with their own templates.

---

## 🚀 Getting Started

Follow these steps to run Letterflow locally.

### Prerequisites
- Node.js 18+
- [Yarn](https://yarnpkg.com/) (recommended)
- A Supabase Project
- A Groq API Key
- A Resend API Key

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-username/letterflow.git
   cd letterflow
   ```

2. **Install dependencies:**
   ```bash
   yarn install
   ```

3. **Set up Environment Variables:**
   Copy the example environment file:
   ```bash
   cp .env.local.example .env.local
   ```
   Fill in your `.env.local` with the necessary keys:
   - `NEXT_PUBLIC_SUPABASE_URL` & `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `GROQ_API_KEY`
   - `RESEND_API_KEY`

4. **Database Setup:**
   Run the Supabase migrations to create the required tables and RLS policies:
   ```bash
   npx supabase db push
   ```
   *(Or manually execute the SQL from `supabase/migrations/` in your Supabase SQL editor).*

### Running the App

1. **Start the development server:**
   ```bash
   yarn dev
   ```

2. **Open the App:**
   Navigate to [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📍 Key Routes to Explore

- **`/`**: Landing page with login/signup functionality.
- **`/dashboard`**: Your template library and overview.
- **`/dashboard/components`**: A showcase of the underlying UI design system and components.
- **`/editor/[id]`**: The main drag-and-drop template builder interface.

## 🎨 Theming
Letterflow launches in dark mode by default. The brand's primary accent is defined by CSS variables in `src/app/globals.css`. You can easily tweak the `--brand` variables to match your custom aesthetic.

---

**Happy Building! 🚀**
