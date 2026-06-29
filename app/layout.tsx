import { ReactNode } from "react";
import { TransitionProvider } from "@/context/TransitionContext";
import SmoothScroll from "@/components/SmoothScroll";
import WebGLTransition from "@/components/WebGLTransition";
import "@/app/globals.css";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <TransitionProvider>
          <SmoothScroll>
            <WebGLTransition />
            <main className="relative z-10">
              {children}

              {/* Footer Section */}
              <footer className="w-full py-8 text-center text-zinc-400 text-sm bg-black border-t border-white/10 relative z-10">
                <p>
                  This website is by{" "}
                  <a href="https://github.com/sarwanazhar">
                    <span className="text-white font-medium tracking-wide">
                      sarwanazhar
                    </span>
                  </a>
                  . This is an example of page transition effect.
                </p>
              </footer>
            </main>
          </SmoothScroll>
        </TransitionProvider>
      </body>
    </html>
  );
}
