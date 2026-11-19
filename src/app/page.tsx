import { GalleryClient } from "@/components/GalleryClient";
import { getPresentations } from "@/lib/presentations";

export default function HomePage() {
  const presentations = getPresentations();
  return <GalleryClient presentations={presentations} />;
}
