import { Sidebar } from "@/components/dashboard/sidebar";
import { Header } from "@/components/dashboard/header";

export function DashboardShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative w-full">
      <Sidebar />
      <Header />
      <main className="ml-64 mt-16 min-h-screen bg-background">
        <div className="p-8">{children}</div>
      </main>
    </div>
  );
}
