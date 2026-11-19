import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PresentationViewer } from "@/components/PresentationViewer";
import {
  getPresentationBySlug,
  getPresentations,
} from "@/lib/presentations";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return getPresentations().map((item) => ({
    slug: item.slug,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const presentation = getPresentationBySlug(slug);
  if (!presentation) {
    return { title: "Presentasi Tidak Ditemukan" };
  }
  return {
    title: `${presentation.title} — Presentasi Hub`,
    description: presentation.description,
  };
}

export default async function PresentationPage({ params }: PageProps) {
  const { slug } = await params;
  const presentation = getPresentationBySlug(slug);

  if (!presentation) {
    notFound();
  }

  const allPresentations = getPresentations();

  return (
    <PresentationViewer
      presentation={presentation}
      allPresentations={allPresentations}
    />
  );
}
