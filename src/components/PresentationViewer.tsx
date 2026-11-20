"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import {
  ArrowLeft,
  Check,
  ChevronDown,
  ExternalLink,
  Eye,
  EyeOff,
  Link2,
  Maximize2,
  Minimize2,
  Printer,
} from "lucide-react";
import type { PresentationMeta } from "@/lib/presentations";

interface PresentationViewerProps {
  presentation: PresentationMeta;
  allPresentations: PresentationMeta[];
}

export function PresentationViewer({
  presentation,
  allPresentations,
}: PresentationViewerProps) {
  const router = useRouter();
  const wrapperRef = useRef<HTMLDivElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [hideBar, setHideBar] = useState(false);
  const [copied, setCopied] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onFullscreenChange = () => {
      setIsFullscreen(Boolean(document.fullscreenElement));
    };
    document.addEventListener("fullscreenchange", onFullscreenChange);
    return () =>
      document.removeEventListener("fullscreenchange", onFullscreenChange);
  }, []);

  const toggleFullscreen = async () => {
    try {
      if (!document.fullscreenElement && wrapperRef.current) {
        await wrapperRef.current.requestFullscreen();
      } else if (document.fullscreenElement) {
        await document.exitFullscreen();
      }
    } catch {
      // Ignore if browser blocks fullscreen
    }
  };

  const handlePrint = () => {
    try {
      iframeRef.current?.contentWindow?.focus();
      iframeRef.current?.contentWindow?.print();
    } catch {
      window.open(presentation.publicUrl, "_blank", "noopener,noreferrer");
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      // Ignore
    }
  };

  return (
    <div
      ref={wrapperRef}
      className="relative flex h-screen w-screen flex-col overflow-hidden bg-zinc-950"
    >
      {/* Top Floating / Docked Toolbar */}
      {!hideBar ? (
        <header className="z-30 flex h-14 shrink-0 items-center justify-between gap-3 border-b border-white/10 bg-zinc-950/95 px-3 text-zinc-100 backdrop-blur-xl sm:px-5">
          <div className="flex min-w-0 items-center gap-2.5">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs font-semibold text-zinc-200 transition hover:border-white/20 hover:bg-white/10 hover:text-white"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Galeri</span>
            </Link>

            <div className="h-5 w-px bg-white/10" />

            {/* Presentation Switcher */}
            <div className="relative min-w-0">
              <button
                type="button"
                onClick={() => setMenuOpen((prev) => !prev)}
                className="flex max-w-[200px] items-center gap-2 rounded-xl px-2.5 py-1.5 text-left transition hover:bg-white/[0.06] sm:max-w-sm"
              >
                <span
                  className="h-2 w-2 shrink-0 rounded-full"
                  style={{ backgroundColor: presentation.accent }}
                />
                <span className="truncate text-sm font-semibold text-white">
                  {presentation.title}
                </span>
                {allPresentations.length > 1 && (
                  <ChevronDown className="h-3.5 w-3.5 shrink-0 text-zinc-400" />
                )}
              </button>

              {menuOpen && allPresentations.length > 1 && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setMenuOpen(false)}
                  />
                  <div className="absolute left-0 top-full z-50 mt-2 w-72 overflow-hidden rounded-2xl border border-white/15 bg-zinc-900/95 p-1.5 shadow-2xl backdrop-blur-xl">
                    <div className="px-2.5 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-zinc-400">
                      Pindah Presentasi
                    </div>
                    {allPresentations.map((item) => {
                      const active = item.slug === presentation.slug;
                      return (
                        <button
                          key={item.slug}
                          type="button"
                          onClick={() => {
                            setMenuOpen(false);
                            if (!active) router.push(`/presentasi/${item.slug}`);
                          }}
                          className={`flex w-full items-center justify-between gap-2 rounded-xl px-2.5 py-2 text-left text-xs transition ${
                            active
                              ? "bg-white/10 font-semibold text-white"
                              : "text-zinc-300 hover:bg-white/[0.06] hover:text-white"
                          }`}
                        >
                          <span className="flex min-w-0 items-center gap-2">
                            <span
                              className="h-2 w-2 shrink-0 rounded-full"
                              style={{ backgroundColor: item.accent }}
                            />
                            <span className="truncate">{item.title}</span>
                          </span>
                          <span className="shrink-0 font-mono text-[10px] text-zinc-400">
                            {item.countLabel}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </>
              )}
            </div>

            <span className="hidden rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-0.5 font-mono text-[11px] text-zinc-400 md:inline-block">
              {presentation.countLabel} • {presentation.sizeLabel}
            </span>
          </div>

          {/* Right Action Controls */}
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={handlePrint}
              title="Cetak / Simpan PDF"
              className="inline-flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/[0.04] px-2.5 py-1.5 text-xs font-medium text-zinc-200 transition hover:border-white/20 hover:bg-white/10 hover:text-white"
            >
              <Printer className="h-3.5 w-3.5" />
              <span className="hidden md:inline">Cetak / PDF</span>
            </button>

            <button
              type="button"
              onClick={handleCopy}
              title="Salin tautan"
              className="flex h-8 w-8 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] text-zinc-300 transition hover:border-white/20 hover:bg-white/10 hover:text-white"
            >
              {copied ? (
                <Check className="h-3.5 w-3.5 text-emerald-400" />
              ) : (
                <Link2 className="h-3.5 w-3.5" />
              )}
            </button>

            <a
              href={presentation.publicUrl}
              target="_blank"
              rel="noopener noreferrer"
              title="Buka file HTML asli di tab baru"
              className="flex h-8 w-8 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] text-zinc-300 transition hover:border-white/20 hover:bg-white/10 hover:text-white"
            >
              <ExternalLink className="h-3.5 w-3.5" />
            </a>

            <button
              type="button"
              onClick={toggleFullscreen}
              title={isFullscreen ? "Keluar layar penuh" : "Layar penuh"}
              className="flex h-8 w-8 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] text-zinc-300 transition hover:border-white/20 hover:bg-white/10 hover:text-white"
            >
              {isFullscreen ? (
                <Minimize2 className="h-3.5 w-3.5" />
              ) : (
                <Maximize2 className="h-3.5 w-3.5" />
              )}
            </button>

            <button
              type="button"
              onClick={() => setHideBar(true)}
              title="Sembunyikan toolbar (mode fokus)"
              className="flex h-8 w-8 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] text-zinc-300 transition hover:border-white/20 hover:bg-white/10 hover:text-white"
            >
              <EyeOff className="h-3.5 w-3.5" />
            </button>
          </div>
        </header>
      ) : (
        <button
          type="button"
          onClick={() => setHideBar(false)}
          title="Tampilkan toolbar"
          className="fixed right-4 top-4 z-40 inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-zinc-950/80 px-3 py-1.5 text-xs font-medium text-zinc-200 shadow-lg backdrop-blur-md transition hover:bg-zinc-900 hover:text-white"
        >
          <Eye className="h-3.5 w-3.5" />
          Toolbar
        </button>
      )}

      {/* Full Viewport Interactive HTML Frame */}
      <div className="relative flex-1 bg-white">
        <iframe
          ref={iframeRef}
          src={presentation.publicUrl}
          title={presentation.title}
          className="h-full w-full border-0"
          allowFullScreen
        />
      </div>
    </div>
  );
}
