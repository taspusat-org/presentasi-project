import fs from "node:fs";
import path from "node:path";

export interface PresentationMeta {
  slug: string;
  fileName: string;
  publicUrl: string;
  title: string;
  description: string;
  slideCount: number;
  format: "Interactive Deck" | "Document Deck" | "HTML Showcase";
  accent: string;
  accentSoft: string;
  sizeBytes: number;
  sizeLabel: string;
  updatedAt: string;
  updatedLabel: string;
  tags: string[];
}

const ACCENT_PALETTE = [
  { accent: "#6366f1", soft: "rgba(99, 102, 241, 0.14)" },
  { accent: "#14b8a6", soft: "rgba(20, 184, 166, 0.14)" },
  { accent: "#f59e0b", soft: "rgba(245, 158, 11, 0.14)" },
  { accent: "#ec4899", soft: "rgba(236, 72, 153, 0.14)" },
  { accent: "#3b82f6", soft: "rgba(59, 130, 246, 0.14)" },
];

function decodeHtmlEntities(text: string): string {
  return text
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&mdash;/g, "—")
    .replace(/&ndash;/g, "–")
    .replace(/&nbsp;/g, " ");
}

function stripTags(html: string): string {
  return decodeHtmlEntities(html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim());
}

function slugify(fileName: string): string {
  return fileName
    .replace(/\.html?$/i, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function prettifyFileName(fileName: string): string {
  return fileName
    .replace(/\.html?$/i, "")
    .replace(/[-_]+/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function formatDateId(date: Date): string {
  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(date);
}

function extractTitle(html: string, fallbackFileName: string): string {
  const titleMatch = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
  if (titleMatch?.[1]) {
    const cleaned = stripTags(titleMatch[1]);
    if (cleaned) return cleaned;
  }

  const h1Match = html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i);
  if (h1Match?.[1]) {
    const cleaned = stripTags(h1Match[1]);
    if (cleaned) return cleaned;
  }

  return prettifyFileName(fallbackFileName);
}

function extractDescription(html: string): string {
  const metaDesc = html.match(
    /<meta[^>]+name=["']description["'][^>]+content=["']([^"']+)["']/i
  );
  if (metaDesc?.[1]) return decodeHtmlEntities(metaDesc[1]).trim();

  const cvSub = html.match(/<p[^>]+class=["'][^"']*cv-sub[^"']*["'][^>]*>([\s\S]*?)<\/p>/i);
  if (cvSub?.[1]) return stripTags(cvSub[1]);

  const lead = html.match(/<p[^>]+class=["'][^"']*lead[^"']*["'][^>]*>([\s\S]*?)<\/p>/i);
  if (lead?.[1]) return stripTags(lead[1]);

  const divLead = html.match(/<div[^>]+class=["'][^"']*lead[^"']*["'][^>]*>([\s\S]*?)<\/div>/i);
  if (divLead?.[1]) return stripTags(divLead[1]);

  return "Dokumen presentasi HTML interaktif yang siap ditinjau langsung di browser maupun dicetak ke PDF.";
}

function detectSlideCount(html: string): number {
  const screenMatches = html.match(/class=["'][^"']*\bscreen\b[^"']*["']/gi);
  if (screenMatches && screenMatches.length > 0) return screenMatches.length;

  const slideMatches = html.match(/class=["'][^"']*\bslide\b[^"']*["']/gi);
  const coverMatches = html.match(/class=["'][^"']*\bcover\b[^"']*["']/gi);
  const flowMatches = html.match(/class=["'][^"']*\bflow\b[^"']*["']/gi);
  const total =
    (slideMatches?.length ?? 0) +
    (coverMatches?.length ?? 0) +
    (flowMatches?.length ?? 0);

  return total > 0 ? total : 1;
}

function detectFormat(html: string): PresentationMeta["format"] {
  if (/id=["']stage["']/i.test(html) || /class=["'][^"']*\bscreen\b/i.test(html)) {
    return "Interactive Deck";
  }
  if (/@page/i.test(html) || /class=["'][^"']*\bslide\b/i.test(html)) {
    return "Document Deck";
  }
  return "HTML Showcase";
}

function detectAccent(html: string, index: number): { accent: string; soft: string } {
  const accentVar = html.match(/--accent\s*:\s*(#[0-9a-fA-F]{3,6})/);
  if (accentVar?.[1]) {
    return { accent: accentVar[1], soft: `${accentVar[1]}24` };
  }
  if (/#534AB7/i.test(html)) {
    return { accent: "#6366f1", soft: "rgba(99, 102, 241, 0.14)" };
  }
  return ACCENT_PALETTE[index % ACCENT_PALETTE.length];
}

function buildTags(html: string, format: PresentationMeta["format"]): string[] {
  const tags: string[] = [];
  if (format === "Interactive Deck") tags.push("Interaktif");
  if (format === "Document Deck") tags.push("Multi-Halaman");
  if (/@page|@media\s+print/i.test(html)) tags.push("PDF Ready");
  if (/data-pop|<script/i.test(html)) tags.push("Hover Detail");
  if (/<svg/i.test(html) || /class=["'][^"']*\bdg\b/i.test(html)) tags.push("Diagram");
  return tags.slice(0, 3);
}

export function getPresentations(): PresentationMeta[] {
  const presentationsDir = path.join(process.cwd(), "public", "presentations");
  if (!fs.existsSync(presentationsDir)) {
    return [];
  }

  const files = fs
    .readdirSync(presentationsDir, { withFileTypes: true })
    .filter((entry) => entry.isFile() && entry.name.toLowerCase().endsWith(".html"))
    .map((entry) => entry.name)
    .sort((a, b) => a.localeCompare(b, "id"));

  return files.map((fileName, index) => {
    const fullPath = path.join(presentationsDir, fileName);
    const stat = fs.statSync(fullPath);
    const html = fs.readFileSync(fullPath, "utf8");

    const title = extractTitle(html, fileName);
    const description = extractDescription(html);
    const slideCount = detectSlideCount(html);
    const format = detectFormat(html);
    const { accent, soft } = detectAccent(html, index);
    const tags = buildTags(html, format);

    return {
      slug: slugify(fileName),
      fileName,
      publicUrl: `/presentations/${encodeURIComponent(fileName)}`,
      title,
      description,
      slideCount,
      format,
      accent,
      accentSoft: soft,
      sizeBytes: stat.size,
      sizeLabel: formatBytes(stat.size),
      updatedAt: stat.mtime.toISOString(),
      updatedLabel: formatDateId(stat.mtime),
      tags,
    };
  });
}

export function getPresentationBySlug(slug: string): PresentationMeta | undefined {
  return getPresentations().find((item) => item.slug === slug);
}
