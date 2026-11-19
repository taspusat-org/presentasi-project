"use client";

import { useEffect, useRef, useState } from "react";

interface LiveThumbProps {
  src: string;
  title: string;
  accent: string;
}

const VIRTUAL_WIDTH = 1280;
const VIRTUAL_HEIGHT = 800;

export function LiveThumb({ src, title, accent }: LiveThumbProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0.32);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const updateScale = () => {
      const width = el.clientWidth;
      if (width > 0) {
        setScale(width / VIRTUAL_WIDTH);
      }
    };

    updateScale();
    const observer = new ResizeObserver(updateScale);
    observer.observe(el);

    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative aspect-[16/10] w-full overflow-hidden bg-zinc-100 dark:bg-zinc-900"
    >
      {/* Subtle ambient accent glow behind preview */}
      <div
        className="pointer-events-none absolute -inset-6 opacity-25 blur-2xl transition-opacity duration-500 group-hover:opacity-45"
        style={{
          background: `radial-gradient(circle at 50% 30%, ${accent}, transparent 70%)`,
        }}
      />

      {/* Loading skeleton */}
      {!loaded && (
        <div className="absolute inset-0 z-10 flex flex-col justify-between bg-zinc-100/90 p-5 dark:bg-zinc-900/90">
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-zinc-300 dark:bg-zinc-700" />
            <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-zinc-300 dark:bg-zinc-700" />
            <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-zinc-300 dark:bg-zinc-700" />
          </div>
          <div className="space-y-2.5">
            <div className="h-3 w-1/3 animate-pulse rounded-full bg-zinc-200 dark:bg-zinc-800" />
            <div className="h-5 w-3/4 animate-pulse rounded-lg bg-zinc-200 dark:bg-zinc-800" />
            <div className="h-3 w-1/2 animate-pulse rounded-full bg-zinc-200 dark:bg-zinc-800" />
          </div>
        </div>
      )}

      {/* Scaled live HTML preview */}
      <div
        className="pointer-events-none absolute left-0 top-0 origin-top-left transition-transform duration-500 ease-out group-hover:scale-[1.03]"
        style={{
          width: `${VIRTUAL_WIDTH}px`,
          height: `${VIRTUAL_HEIGHT}px`,
          transform: `scale(${scale})`,
        }}
      >
        <iframe
          src={src}
          title={`Pratinjau ${title}`}
          loading="lazy"
          tabIndex={-1}
          onLoad={() => setLoaded(true)}
          className={`h-full w-full border-0 bg-white transition-opacity duration-500 ${
            loaded ? "opacity-100" : "opacity-0"
          }`}
          sandbox="allow-scripts allow-same-origin"
        />
      </div>

      {/* Bottom fade & hover CTA overlay */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/55 via-black/5 to-transparent opacity-40 transition-opacity duration-300 group-hover:opacity-80" />
    </div>
  );
}
