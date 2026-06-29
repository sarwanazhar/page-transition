"use client";
import React, { useRef } from "react";
import { useTransition } from "@/context/TransitionContext";

export default function HomePage() {
  const gridRef = useRef<HTMLDivElement>(null);
  const { setTransitionData } = useTransition();

  const handleImageProjectTransition = (
    e: React.MouseEvent<HTMLAnchorElement>,
    route: string,
  ) => {
    e.preventDefault();
    const anchor = e.currentTarget;
    const imgElement = anchor.querySelector("img");
    if (!imgElement) return;

    const bounds = anchor.getBoundingClientRect();

    setTransitionData({
      isActive: true,
      isReady: false,
      bounds,
      styles: null,
      sourceImage: imgElement,
      targetRoute: route,
    });
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col justify-center items-center px-12 py-20">
      <h1 className="text-xs uppercase tracking-widest text-zinc-500 mb-12">
        Selected Work
      </h1>
      <div
        ref={gridRef}
        className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl"
      >
        {/* Project Card 01 */}
        <a
          href="/project/podium-case"
          onClick={(e) =>
            handleImageProjectTransition(e, "/project/podium-case")
          }
          className="group block relative w-full h-80 bg-zinc-900 rounded-xl overflow-hidden transition-transform duration-300 hover:scale-[1.01]"
        >
          <img
            src="/image.jpg"
            alt="Podium Story Cover"
            className="w-full h-full object-cover"
          />
          <div className="card-details absolute bottom-6 left-6 z-10">
            <p className="text-xs uppercase tracking-widest text-zinc-400">
              Case Study 01
            </p>
            <h2 className="text-xl font-bold tracking-tight mt-1">
              Podium Storytelling
            </h2>
          </div>
        </a>

        {/* Project Card 02 */}
        <a
          href="/project/running-story"
          onClick={(e) =>
            handleImageProjectTransition(e, "/project/running-story")
          }
          className="group block relative w-full h-80 bg-zinc-900 rounded-xl overflow-hidden transition-transform duration-300 hover:scale-[1.01]"
        >
          <img
            src="/red.jpg"
            alt="Running Story Cover"
            className="w-full h-full object-cover"
          />
          <div className="card-details absolute bottom-6 left-6 z-10">
            <p className="text-xs uppercase tracking-widest text-zinc-400">
              Case Study 02
            </p>
            <h2 className="text-xl font-bold tracking-tight mt-1">
              Running Mechanics
            </h2>
          </div>
        </a>
      </div>
    </div>
  );
}
