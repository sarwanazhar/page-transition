"use client";

import React, { useRef } from "react";
import { useTransition } from "@/context/TransitionContext";
import { projects } from "@/app/project/data";

export default function HomePage() {
  const gridRef = useRef<HTMLDivElement>(null);
  const { setTransitionData } = useTransition();

  const handleImageProjectTransition = (
    e: React.MouseEvent<HTMLAnchorElement>,
    route: string,
    effectType: number,
  ) => {
    e.preventDefault();
    const anchor = e.currentTarget;
    const imgElement = anchor.querySelector("img");
    if (!imgElement) return;
    const bounds = anchor.getBoundingClientRect();

    // Capture exact click position for vertex-wave effect origin
    const clickX = (e.clientX - bounds.left) / bounds.width;
    const clickY = (e.clientY - bounds.top) / bounds.height;

    setTransitionData({
      isActive: true,
      isReady: false,
      bounds,
      styles: null,
      sourceImage: imgElement,
      targetRoute: route,
      effectType,
      clickUv: { x: clickX, y: 1 - clickY }, // Flip Y for GL coordinates
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
        {projects.map((project) => (
          <a
            key={project.slug}
            href={`/project/${project.slug}`}
            onClick={(e) =>
              handleImageProjectTransition(
                e,
                `/project/${project.slug}`,
                project.effectType,
              )
            }
            className="group block relative w-full h-80 bg-zinc-900 rounded-xl overflow-hidden transition-transform duration-300 hover:scale-[1.01]"
          >
            <img
              src={project.image}
              alt={`${project.title} Cover`}
              className="w-full h-full object-cover"
            />
            <div className="card-details absolute bottom-6 left-6 z-10">
              <p className="text-xs uppercase tracking-widest text-zinc-400">
                {project.caseLabel}
              </p>
              <h2 className="text-xl font-bold tracking-tight mt-1">
                {project.title}
              </h2>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}
