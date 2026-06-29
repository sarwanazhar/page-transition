"use client";
import Link from "next/link";
import gsap from "gsap";
import { useEffect, useRef } from "react";

export default function RunningStoryPage() {
  const overlayContentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (overlayContentRef.current) {
      gsap.fromTo(
        overlayContentRef.current,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.7, delay: 0.4, ease: "power3.out" },
      );
    }
  }, []);

  return (
    <div className="min-h-screen bg-black text-white">
      <section className="w-full h-screen relative flex flex-col justify-between p-12 overflow-hidden">
        <img
          src="/red.jpg"
          alt="Full screen background view"
          className="absolute inset-0 w-full h-full object-cover z-0"
        />

        <div className="flex justify-between items-center w-full relative z-10">
          <Link
            href="/"
            className="text-sm tracking-tight text-zinc-300 hover:text-white transition-colors"
          >
            ← Return to Grid
          </Link>
          <span className="text-xs uppercase tracking-widest text-zinc-300">
            Case Study 02
          </span>
        </div>

        <div
          ref={overlayContentRef}
          className="max-w-4xl my-auto relative z-10"
        >
          <h1 className="text-6xl md:text-8xl font-black tracking-tighter uppercase mb-4">
            Velocity Track
          </h1>
          <p className="text-zinc-200 text-lg max-w-lg font-normal leading-relaxed">
            The Three.js image texture scaled fluidly up to full-bleed
            dimensions before cleanly turning off visibility to showcase this
            underlying DOM layer.
          </p>
        </div>

        <div className="w-full border-t border-white/20 pt-6 relative z-10 flex justify-between text-xs tracking-wider text-zinc-300 uppercase">
          <div>Engine: WebGL / Next.js</div>
          <div>Year: 2026</div>
        </div>
      </section>
    </div>
  );
}
