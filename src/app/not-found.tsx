import Link from "next/link";
import { ArrowLeft, FileQuestion } from "lucide-react";

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-grid-pattern px-4 text-center">
      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border border-zinc-200 bg-white text-zinc-600 shadow-sm dark:border-white/10 dark:bg-white/5 dark:text-zinc-300">
        <FileQuestion className="h-6 w-6" />
      </div>
      <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-white">
        Presentasi tidak ditemukan
      </h1>
      <p className="mt-2 max-w-md text-sm text-zinc-500 dark:text-zinc-400">
        Halaman atau file HTML yang Anda cari tidak tersedia di folder presentasi.
      </p>
      <Link
        href="/"
        className="mt-6 inline-flex items-center gap-2 rounded-xl bg-zinc-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-zinc-800 dark:bg-white dark:text-zinc-950 dark:hover:bg-zinc-200"
      >
        <ArrowLeft className="h-4 w-4" />
        Kembali ke Galeri
      </Link>
    </main>
  );
}
