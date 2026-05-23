import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import LandingHeader from "@/components/landing/header";

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
            <div className="flex-1 w-full max-w-[560px] lg:max-w-none flex justify-center items-center z-10">
              <div
                className="w-full aspect-[0.8717/1] hover:scale-[1.02] hover:rotate-1 transition-all duration-700 ease-out cursor-pointer relative filter drop-shadow-md select-none"
                style={{ contentVisibility: "visible" }}
              >
                {/* SVG Illustration mapped to downloaded local images */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 1280 1450"
                  className="w-full h-full"
                >
                  <defs>
                    <clipPath id="__lottie_element_2">
                      <rect width="1280" height="1450" x="0" y="0"></rect>
                    </clipPath>
                  </defs>
                  <g clipPath="url(#__lottie_element_2)">
                    {/* img_24: Left block icons sidebar */}
                    <g transform="matrix(0.65, 0, 0, 0.65, 75.29, 194.04)">
                      <image width="195px" height="1845px" href="/images/landing/img_24.svg" />
                    </g>
                    {/* img_22: Main canvas backdrop */}
                    <g transform="matrix(0.65, 0, 0, 0.65, 271.78, 191.05)">
                      <image width="1426px" height="1767px" href="/images/landing/img_22.svg" />
                    </g>
                    {/* img_17: Editor Header */}
                    <g transform="matrix(0.65, 0, 0, 0.65, 331, 350)">
                      <image width="1239px" height="276px" href="/images/landing/img_17.svg" />
                    </g>
                    {/* img_16: Banner Block */}
                    <g transform="matrix(0.65, 0, 0, 0.65, 330, 298.61)">
                      <image width="1245px" height="354px" href="/images/landing/img_16.svg" />
                    </g>
                    {/* img_13: Paragraph block text */}
                    <g transform="matrix(0.65, 0, 0, 0.65, 331, 568)">
                      <image width="1239px" height="699px" href="/images/landing/img_13.svg" />
                    </g>
                    {/* img_12: Image Block placeholder */}
                    <g transform="matrix(0.65, 0, 0, 0.65, 331, 536.79)">
                      <image width="1245px" height="753px" href="/images/landing/img_12.svg" />
                    </g>
                    {/* img_10: Floating Add/Edit Node Icon 1 */}
                    <g transform="matrix(0.65, 0, 0, 0.65, 435.76, 771.55)">
                      <image width="57px" height="57px" href="/images/landing/img_10.svg" />
                    </g>
                    {/* img_9: Floating Add/Edit Node Icon 2 */}
                    <g transform="matrix(0.65, 0, 0, 0.65, 510.2, 468.06)">
                      <image width="57px" height="57px" href="/images/landing/img_9.svg" />
                    </g>
                    {/* img_7: Grid Item bottom right */}
                    <g transform="matrix(0.65, 0, 0, 0.65, 777.75, 1093.92)">
                      <image width="486px" height="96px" href="/images/landing/img_7.svg" />
                    </g>
                    {/* img_6: Grid Item bottom left */}
                    <g transform="matrix(0.65, 0, 0, 0.65, 354.02, 1093.8)">
                      <image width="483px" height="96px" href="/images/landing/img_6.svg" />
                    </g>
                    {/* img_5: Grid block bottom row */}
                    <g transform="matrix(0.65, 0, 0, 0.65, 331, 1038)">
                      <image width="1245px" height="228px" href="/images/landing/img_5.svg" />
                    </g>
                    {/* img_3: Editor central content layout block */}
                    <g transform="matrix(0.65, 0, 0, 0.65, 486.97, 647.03)">
                      <image width="831px" height="417px" href="/images/landing/img_3.svg" />
                    </g>
                    {/* img_2: Mouse pointer icon 2 */}
                    <g transform="matrix(0.65, 0, 0, 0.65, 315.99, 966.95)">
                      <image width="366px" height="224px" href="/images/landing/img_2.svg" />
                    </g>
                    {/* img_1: Mouse pointer icon 1 */}
                    <g transform="matrix(0.65, 0, 0, 0.65, 656.28, 411.18)">
                      <image width="366px" height="224px" href="/images/landing/img_1.svg" />
                    </g>
                    {/* img_0: "David" collaborator cursor avatar */}
                    <g transform="matrix(0.65, 0, 0, 0.65, 849.65, 854.37)">
                      <image width="366px" height="224px" href="/images/landing/img_0.svg" />
                    </g>
                  </g>
                </svg>
              </div>
            </div>

          </div>
        </div>
      </section>
    </div>
  );
}
