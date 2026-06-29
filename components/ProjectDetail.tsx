"use client";

import Link from "next/link";
import gsap from "gsap";
import { useEffect, useRef } from "react";
import { getProjectBySlug } from "@/app/project/data";

export default function ProjectDetail({ slug }: { slug: string }) {
  const project = getProjectBySlug(slug);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (contentRef.current) {
      gsap.fromTo(
        contentRef.current,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.7, delay: 0.4, ease: "power3.out" },
      );
    }
  }, [slug]);

  if (!project) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Project not found</h1>
          <Link href="/" className="text-zinc-400 hover:text-white">
            ← Back to Projects
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <section className="w-full h-screen relative flex flex-col justify-between p-12 overflow-hidden">
        <img
          src={project.image}
          alt="Full screen background view"
          decoding="sync"
          fetchPriority="high"
          className="absolute inset-0 w-full h-full object-cover z-0"
        />
        <div className="flex justify-between items-center w-full relative z-10">
          <Link
            href="/"
            className="text-sm tracking-tight text-zinc-300 hover:text-white transition-colors"
          >
            {project.backLabel}
          </Link>
          <span className="text-xs uppercase tracking-widest text-zinc-300">
            {project.caseLabel}
          </span>
        </div>
        <div ref={contentRef} className="max-w-4xl my-auto relative z-10">
          <h1 className="text-6xl md:text-8xl font-black tracking-tighter uppercase mb-4">
            {project.title}
          </h1>
          <p className="text-zinc-200 text-lg max-w-lg font-normal leading-relaxed">
            {project.description}
          </p>
        </div>
        <div className="w-full border-t border-white/20 pt-6 relative z-10 flex justify-between text-xs tracking-wider text-zinc-300 uppercase">
          {project.meta.map((item, idx) => (
            <div key={idx}>
              {item.label}: {item.value}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
