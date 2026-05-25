import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import LandingHeader from "@/components/landing/header";
import Image from "next/image";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  // Retrieve the session server-side to prevent client-side loader screens and layout shifts
  let isLoggedIn = false;
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    isLoggedIn = !!user;
  } catch (error) {
    console.error("Error retrieving user session on server:", error);
  }

  return (
    <div className="w-full min-h-screen bg-white text-[#1F1F1F] font-sans antialiased selection:bg-[#5ECA4E]/30 relative overflow-x-hidden">
      {/* Navigation Header */}
      <LandingHeader initialIsLoggedIn={isLoggedIn} />

      {/* Main Landing Banner */}
      <section className="pb-16 pt-10 sm:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col lg:flex-row gap-12 items-center overflow-hidden relative">

            {/* Left Content Column */}
            <div className="flex-grow flex-shrink-0 flex-1 flex flex-col items-start text-left z-10 lg:pr-6">
              <div className="px-3 py-1 bg-[#F1F3F5] text-[#1F1F1F] text-xs font-semibold rounded-full mb-6 tracking-wide">
                ⚡ Simple, powerful responsive email management
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-[62px] font-extrabold text-[#111111] leading-[1.08] tracking-tight mb-6 font-sans">
                DRAG-N-DROP <br className="hidden lg:inline" />
                HTML EMAIL <br />
                TEMPLATE BUILDER
              </h1>
              <p className="text-gray-600 text-lg mb-8 max-w-xl leading-relaxed">
                Create stunning, responsive email templates in minutes.
              </p>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-8 w-full">
                {/* CTA Button Block */}
                <div className="flex flex-col gap-2 min-w-[200px]">
                  <Link
                    href={isLoggedIn ? "/dashboard/templates" : "/signup"}
                    className="px-8 py-4 bg-[#111111] text-white text-base font-bold rounded-full text-center hover:bg-gray-800 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 shadow-sm"
                  >
                    {isLoggedIn ? "Go to Dashboard" : "Get Started Free"}
                  </Link>
                  <p className="text-xs text-gray-500 font-medium text-center sm:text-left pl-2">
                    No credit card required
                  </p>
                </div>

                {/* Feature quick bullets */}
                <div className="flex flex-col gap-2.5 text-sm font-semibold text-gray-700 pl-2">
                  <div className="flex items-center gap-2">
                    <span className="text-[#33cc4a] font-bold">✓</span>
                    <span>Drag-and-Drop Canvas</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[#33cc4a] font-bold">✓</span>
                    <span>Clean HTML Export</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[#33cc4a] font-bold">✓</span>
                    <span>Responsive Previews</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Interactive/Mockup Column */}
            <div className="flex-1 w-full lg:max-w-none flex justify-center items-center z-10">
              <div
                className="w-full aspect-[0.8717/1] transition-all duration-700 ease-out cursor-pointer relative  select-none"
                style={{ contentVisibility: "visible" }}
              >
                <Image src="/images/landing/Letterflow-hero-image.webp" alt="hero" fill className="object-contain scale-125" />
              </div>
            </div>

          </div>
        </div>
      </section>
    </div>
  );
}
