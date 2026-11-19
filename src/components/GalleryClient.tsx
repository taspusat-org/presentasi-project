"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowUpRight,
  Check,
  Clock,
  ExternalLink,
  FileCode2,
  HardDrive,
  Layers,
  LayoutGrid,
  Link2,
  List,
  Moon,
  Presentation,
  Search,
  Sparkles,
  Sun,
  X,
} from "lucide-react";
import type { PresentationMeta } from "@/lib/presentations";
import { LiveThumb } from "./LiveThumb";

interface GalleryClientProps {
  presentations: PresentationMeta[];
}

export function GalleryClient({ presentations }: GalleryClientProps) {
  const [query, setQuery] = useState("");
  const [activeFormat, setActiveFormat] = useState<string>("Semua");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [copiedSlug, setCopiedSlug] = useState<string | null>(null);
  const [isDark, setIsDark] = useState(true);
  const searchRef = useRef<HTMLInputElement>(null);

  // Sync theme class with <html>
  useEffect(() => {
    const saved = window.localStorage.getItem("presentasi-theme");
    if (saved === "light") {
      document.documentElement.classList.remove("dark");
      setIsDark(false);
    } else {
      document.documentElement.classList.add("dark");
      setIsDark(true);
    }
  }, []);

  const toggleTheme = () => {
    const next = !isDark;
    setIsDark(next);
    document.documentElement.classList.toggle("dark", next);
    window.localStorage.setItem("presentasi-theme", next ? "dark" : "light");
  };

  // Press "/" to focus search
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (
        e.key === "/" &&
        document.activeElement?.tagName !== "INPUT" &&
        document.activeElement?.tagName !== "TEXTAREA"
      ) {
        e.preventDefault();
        searchRef.current?.focus();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  const formats = useMemo(() => {
    const unique = Array.from(new Set(presentations.map((p) => p.format)));
    return ["Semua", ...unique];
  }, [presentations]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return presentations.filter((item) => {
      const matchesFormat =
        activeFormat === "Semua" || item.format === activeFormat;
      if (!matchesFormat) return false;
      if (!q) return true;
      return (
        item.title.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q) ||
        item.fileName.toLowerCase().includes(q) ||
        item.tags.some((t) => t.toLowerCase().includes(q))
      );
    });
  }, [presentations, query, activeFormat]);

  const totalSlides = useMemo(
    () => presentations.reduce((acc, item) => acc + item.slideCount, 0),
    [presentations]
  );

  const handleCopyLink = async (e: React.MouseEvent, slug: string) => {
    e.preventDefault();
    e.stopPropagation();
    const url = `${window.location.origin}/presentasi/${slug}`;
    try {
      await navigator.clipboard.writeText(url);
      setCopiedSlug(slug);
      setTimeout(() => setCopiedSlug(null), 1800);
    } catch {
      // Fallback ignored
    }
  };

  return (
    <div className="relative min-h-screen overflow-x-clip bg-grid-pattern">
      {/* Ambient top spotlight glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-x-0 -top-40 z-0 mx-auto h-[420px] max-w-4xl rounded-full bg-gradient-to-r from-indigo-500/20 via-teal-400/15 to-violet-500/20 blur-3xl dark:from-indigo-500/20 dark:via-teal-400/10 dark:to-purple-500/20"
      />

      {/* Sticky Glass Header */}
      <header className="sticky top-0 z-30 border-b border-zinc-200/70 bg-white/75 backdrop-blur-xl dark:border-white/[0.08] dark:bg-[#09090b]/75">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3.5 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 via-violet-500 to-teal-400 text-white shadow-lg shadow-indigo-500/20 transition-transform duration-300 group-hover:scale-105">
              <Presentation className="h-4.5 w-4.5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold tracking-tight text-zinc-900 dark:text-white sm:text-base">
                  Presentasi Hub
                </span>
                <span className="hidden rounded-full border border-indigo-500/25 bg-indigo-500/10 px-2 py-0.5 font-mono text-[10px] font-semibold text-indigo-600 dark:text-indigo-300 sm:inline-block">
                  v1.0
                </span>
              </div>
              <p className="hidden text-xs text-zinc-500 dark:text-zinc-400 sm:block">
                HTML Deck &amp; Documentation Showcase
              </p>
            </div>
          </Link>

          {/* Search & Theme Controls */}
          <div className="flex items-center gap-2.5">
            <div className="relative hidden w-64 sm:block md:w-72">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
              <input
                ref={searchRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Cari presentasi..."
                className="w-full rounded-xl border border-zinc-200/90 bg-zinc-100/70 py-2 pl-9 pr-9 text-sm text-zinc-900 placeholder:text-zinc-400 transition focus:border-indigo-500/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 dark:border-white/10 dark:bg-white/[0.04] dark:text-zinc-100 dark:placeholder:text-zinc-500 dark:focus:border-indigo-400/50 dark:focus:bg-white/[0.07]"
              />
              {query ? (
                <button
                  type="button"
                  onClick={() => setQuery("")}
                  aria-label="Hapus pencarian"
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded-md p-0.5 text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              ) : (
                <kbd className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 rounded-md border border-zinc-300/80 bg-white px-1.5 py-0.5 font-mono text-[10px] text-zinc-400 dark:border-white/10 dark:bg-white/5">
                  /
                </kbd>
              )}
            </div>

            <button
              type="button"
              onClick={toggleTheme}
              aria-label="Ganti tema terang/gelap"
              className="flex h-9 w-9 items-center justify-center rounded-xl border border-zinc-200/90 bg-white text-zinc-600 transition hover:border-zinc-300 hover:text-zinc-900 dark:border-white/10 dark:bg-white/[0.04] dark:text-zinc-300 dark:hover:border-white/20 dark:hover:text-white"
            >
              {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>
          </div>
        </div>
      </header>

      <main className="relative z-10 mx-auto max-w-7xl px-4 pb-24 pt-10 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <section className="mb-10 flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
          <div className="max-w-2xl space-y-4">
            <div className="inline-flex items-center gap-2 rounded-full border border-zinc-200/90 bg-white/80 px-3 py-1 text-xs font-medium text-zinc-600 shadow-sm backdrop-blur-md dark:border-white/10 dark:bg-white/[0.05] dark:text-zinc-300">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
              </span>
              Auto-detected HTML Decks • Siap Deploy Vercel
            </div>

            <h1 className="text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-white sm:text-4xl lg:text-[2.75rem] lg:leading-[1.12]">
              Koleksi Presentasi &amp;{" "}
              <span className="bg-gradient-to-r from-indigo-500 via-violet-500 to-teal-400 bg-clip-text text-transparent">
                Alur Sistem
              </span>
            </h1>

            <p className="text-sm leading-relaxed text-zinc-600 dark:text-zinc-400 sm:text-base">
              Pilih kartu di bawah untuk membuka presentasi dalam mode interaktif layar penuh,
              meninjau diagram, atau mencetak langsung ke format PDF.
            </p>
          </div>

          {/* Bento Quick Stats */}
          <div className="grid grid-cols-3 gap-3 sm:w-auto">
            <div className="rounded-2xl border border-zinc-200/80 bg-white/80 px-4 py-3 backdrop-blur-md dark:border-white/[0.08] dark:bg-white/[0.03]">
              <div className="flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                <FileCode2 className="h-3.5 w-3.5 text-indigo-500" />
                Deck
              </div>
              <div className="mt-1 text-2xl font-bold tabular-nums text-zinc-900 dark:text-white">
                {presentations.length}
              </div>
            </div>
            <div className="rounded-2xl border border-zinc-200/80 bg-white/80 px-4 py-3 backdrop-blur-md dark:border-white/[0.08] dark:bg-white/[0.03]">
              <div className="flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                <Layers className="h-3.5 w-3.5 text-teal-500" />
                Slide
              </div>
              <div className="mt-1 text-2xl font-bold tabular-nums text-zinc-900 dark:text-white">
                {totalSlides}
              </div>
            </div>
            <div className="rounded-2xl border border-zinc-200/80 bg-white/80 px-4 py-3 backdrop-blur-md dark:border-white/[0.08] dark:bg-white/[0.03]">
              <div className="flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                <Sparkles className="h-3.5 w-3.5 text-amber-500" />
                Mode
              </div>
              <div className="mt-1 text-sm font-semibold leading-8 text-zinc-900 dark:text-white">
                Live HTML
              </div>
            </div>
          </div>
        </section>

        {/* Mobile Search Bar */}
        <div className="relative mb-5 sm:hidden">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Cari judul, file, atau tag..."
            className="w-full rounded-xl border border-zinc-200/90 bg-white py-2.5 pl-9 pr-9 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-indigo-500/50 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 dark:border-white/10 dark:bg-white/[0.04] dark:text-zinc-100"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Filter & Layout Toolbar */}
        <div className="mb-7 flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            {formats.map((format) => {
              const active = activeFormat === format;
              return (
                <button
                  key={format}
                  type="button"
                  onClick={() => setActiveFormat(format)}
                  className={`rounded-full px-3.5 py-1.5 text-xs font-semibold transition ${
                    active
                      ? "bg-zinc-900 text-white shadow-sm dark:bg-white dark:text-zinc-950"
                      : "border border-zinc-200/90 bg-white/70 text-zinc-600 hover:border-zinc-300 hover:text-zinc-900 dark:border-white/10 dark:bg-white/[0.04] dark:text-zinc-400 dark:hover:border-white/20 dark:hover:text-zinc-100"
                  }`}
                >
                  {format}
                </button>
              );
            })}
          </div>

          <div className="flex items-center gap-1 rounded-xl border border-zinc-200/90 bg-white/80 p-1 dark:border-white/10 dark:bg-white/[0.04]">
            <button
              type="button"
              onClick={() => setViewMode("grid")}
              aria-label="Tampilan grid kartu"
              className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium transition ${
                viewMode === "grid"
                  ? "bg-zinc-900 text-white dark:bg-white/15 dark:text-white"
                  : "text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white"
              }`}
            >
              <LayoutGrid className="h-3.5 w-3.5" />
              Grid
            </button>
            <button
              type="button"
              onClick={() => setViewMode("list")}
              aria-label="Tampilan daftar"
              className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium transition ${
                viewMode === "list"
                  ? "bg-zinc-900 text-white dark:bg-white/15 dark:text-white"
                  : "text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white"
              }`}
            >
              <List className="h-3.5 w-3.5" />
              List
            </button>
          </div>
        </div>

        {/* Cards Grid / List */}
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-zinc-300/90 bg-white/60 px-6 py-20 text-center dark:border-white/15 dark:bg-white/[0.02]">
            <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-zinc-100 text-zinc-500 dark:bg-white/5 dark:text-zinc-400">
              <Search className="h-5 w-5" />
            </div>
            <h2 className="text-base font-semibold text-zinc-900 dark:text-white">
              Presentasi tidak ditemukan
            </h2>
            <p className="mt-1 max-w-md text-sm text-zinc-500 dark:text-zinc-400">
              Tidak ada file HTML yang cocok dengan filter atau kata kunci{" "}
              <span className="font-mono text-zinc-700 dark:text-zinc-200">
                &ldquo;{query}&rdquo;
              </span>
              .
            </p>
            <button
              type="button"
              onClick={() => {
                setQuery("");
                setActiveFormat("Semua");
              }}
              className="mt-4 rounded-xl bg-zinc-900 px-4 py-2 text-xs font-semibold text-white transition hover:bg-zinc-800 dark:bg-white dark:text-zinc-950 dark:hover:bg-zinc-200"
            >
              Reset Filter
            </button>
          </div>
        ) : viewMode === "grid" ? (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3">
            {filtered.map((item) => (
              <article
                key={item.slug}
                className="group relative flex flex-col overflow-hidden rounded-3xl border border-zinc-200/90 bg-white/90 shadow-sm backdrop-blur-xl transition-all duration-300 hover:-translate-y-1.5 hover:border-zinc-300 hover:shadow-2xl hover:shadow-indigo-500/10 dark:border-white/[0.09] dark:bg-zinc-900/70 dark:hover:border-white/20 dark:hover:shadow-indigo-500/10"
              >
                {/* Clickable Preview Area */}
                <Link
                  href={`/presentasi/${item.slug}`}
                  className="relative block overflow-hidden border-b border-zinc-200/80 dark:border-white/[0.07]"
                >
                  <LiveThumb
                    src={item.publicUrl}
                    title={item.title}
                    accent={item.accent}
                  />

                  {/* Top floating pills */}
                  <div className="pointer-events-none absolute left-3.5 top-3.5 z-20 flex items-center gap-2">
                    <span
                      className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-zinc-950/75 px-2.5 py-1 text-[11px] font-semibold text-white backdrop-blur-md"
                    >
                      <span
                        className="h-1.5 w-1.5 rounded-full"
                        style={{ backgroundColor: item.accent }}
                      />
                      {item.format}
                    </span>
                    <span className="inline-flex items-center gap-1 rounded-full border border-white/15 bg-zinc-950/65 px-2.5 py-1 font-mono text-[11px] font-medium text-zinc-200 backdrop-blur-md">
                      {item.slideCount} slide
                    </span>
                  </div>

                  {/* Hover Center Pill */}
                  <div className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center opacity-0 transition-all duration-300 group-hover:opacity-100">
                    <span className="inline-flex translate-y-2 items-center gap-1.5 rounded-full bg-white/95 px-4 py-2 text-xs font-bold text-zinc-950 shadow-xl transition-transform duration-300 group-hover:translate-y-0">
                      Buka Presentasi
                      <ArrowUpRight className="h-3.5 w-3.5" />
                    </span>
                  </div>
                </Link>

                {/* Card Body */}
                <div className="flex flex-1 flex-col p-5">
                  <div className="flex items-start justify-between gap-3">
                    <Link
                      href={`/presentasi/${item.slug}`}
                      className="text-lg font-bold tracking-tight text-zinc-900 transition-colors group-hover:text-indigo-600 dark:text-white dark:group-hover:text-indigo-400"
                    >
                      {item.title}
                    </Link>
                  </div>

                  <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
                    {item.description}
                  </p>

                  {/* Smart Tags */}
                  {item.tags.length > 0 && (
                    <div className="mt-4 flex flex-wrap gap-1.5">
                      {item.tags.map((tag) => (
                        <span
                          key={tag}
                          className="rounded-lg border border-zinc-200/80 bg-zinc-100/80 px-2.5 py-0.5 text-[11px] font-medium text-zinc-600 dark:border-white/[0.08] dark:bg-white/[0.04] dark:text-zinc-300"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Footer Meta + Quick Actions */}
                  <div className="mt-auto flex items-center justify-between gap-3 border-t border-zinc-200/70 pt-4 text-xs text-zinc-500 dark:border-white/[0.07] dark:text-zinc-400 mt-5">
                    <div className="flex min-w-0 items-center gap-3">
                      <span className="inline-flex items-center gap-1 font-mono text-[11px]">
                        <HardDrive className="h-3.5 w-3.5 shrink-0 opacity-70" />
                        {item.sizeLabel}
                      </span>
                      <span className="inline-flex items-center gap-1 truncate text-[11px]">
                        <Clock className="h-3.5 w-3.5 shrink-0 opacity-70" />
                        {item.updatedLabel}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={(e) => handleCopyLink(e, item.slug)}
                        title="Salin tautan presentasi"
                        className="flex h-8 w-8 items-center justify-center rounded-xl border border-zinc-200/80 bg-zinc-50 text-zinc-600 transition hover:border-zinc-300 hover:bg-zinc-100 hover:text-zinc-900 dark:border-white/10 dark:bg-white/[0.04] dark:text-zinc-300 dark:hover:border-white/20 dark:hover:bg-white/10 dark:hover:text-white"
                      >
                        {copiedSlug === item.slug ? (
                          <Check className="h-3.5 w-3.5 text-emerald-500" />
                        ) : (
                          <Link2 className="h-3.5 w-3.5" />
                        )}
                      </button>

                      <a
                        href={item.publicUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        title="Buka file HTML langsung di tab baru"
                        className="flex h-8 w-8 items-center justify-center rounded-xl border border-zinc-200/80 bg-zinc-50 text-zinc-600 transition hover:border-zinc-300 hover:bg-zinc-100 hover:text-zinc-900 dark:border-white/10 dark:bg-white/[0.04] dark:text-zinc-300 dark:hover:border-white/20 dark:hover:bg-white/10 dark:hover:text-white"
                      >
                        <ExternalLink className="h-3.5 w-3.5" />
                      </a>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : (
          /* List View */
          <div className="space-y-3.5">
            {filtered.map((item) => (
              <article
                key={item.slug}
                className="group flex flex-col gap-4 overflow-hidden rounded-2xl border border-zinc-200/90 bg-white/90 p-4 shadow-sm backdrop-blur-xl transition-all hover:border-zinc-300 hover:shadow-lg dark:border-white/[0.09] dark:bg-zinc-900/70 dark:hover:border-white/20 sm:flex-row sm:items-center"
              >
                <Link
                  href={`/presentasi/${item.slug}`}
                  className="w-full shrink-0 overflow-hidden rounded-xl border border-zinc-200/80 dark:border-white/10 sm:w-52"
                >
                  <LiveThumb
                    src={item.publicUrl}
                    title={item.title}
                    accent={item.accent}
                  />
                </Link>

                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] font-semibold"
                      style={{
                        backgroundColor: item.accentSoft,
                        color: item.accent,
                      }}
                    >
                      {item.format}
                    </span>
                    <span className="font-mono text-[11px] text-zinc-500 dark:text-zinc-400">
                      {item.slideCount} slide • {item.sizeLabel} • {item.updatedLabel}
                    </span>
                  </div>

                  <Link
                    href={`/presentasi/${item.slug}`}
                    className="mt-1.5 block text-lg font-bold text-zinc-900 transition-colors group-hover:text-indigo-600 dark:text-white dark:group-hover:text-indigo-400"
                  >
                    {item.title}
                  </Link>

                  <p className="mt-1 line-clamp-2 text-sm text-zinc-600 dark:text-zinc-400">
                    {item.description}
                  </p>
                </div>

                <div className="flex shrink-0 items-center gap-2 sm:flex-col sm:items-end">
                  <Link
                    href={`/presentasi/${item.slug}`}
                    className="inline-flex items-center gap-1.5 rounded-xl bg-zinc-900 px-4 py-2 text-xs font-semibold text-white transition hover:bg-zinc-800 dark:bg-white dark:text-zinc-950 dark:hover:bg-zinc-200"
                  >
                    Buka
                    <ArrowUpRight className="h-3.5 w-3.5" />
                  </Link>
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={(e) => handleCopyLink(e, item.slug)}
                      title="Salin tautan"
                      className="flex h-8 w-8 items-center justify-center rounded-xl border border-zinc-200/80 text-zinc-600 transition hover:bg-zinc-100 dark:border-white/10 dark:text-zinc-300 dark:hover:bg-white/10"
                    >
                      {copiedSlug === item.slug ? (
                        <Check className="h-3.5 w-3.5 text-emerald-500" />
                      ) : (
                        <Link2 className="h-3.5 w-3.5" />
                      )}
                    </button>
                    <a
                      href={item.publicUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      title="Buka di tab baru"
                      className="flex h-8 w-8 items-center justify-center rounded-xl border border-zinc-200/80 text-zinc-600 transition hover:bg-zinc-100 dark:border-white/10 dark:text-zinc-300 dark:hover:bg-white/10"
                    >
                      <ExternalLink className="h-3.5 w-3.5" />
                    </a>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
