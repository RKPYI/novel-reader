"use client";
import { useParams } from "next/navigation";
import { ChapterReaderPage } from "../../../../components";

export default function ChapterPage() {
  const params = useParams();
  const { novel_slug, chapter } = params as { novel_slug: string; chapter: string };

  return <ChapterReaderPage novelSlug={novel_slug} chapterNumber={chapter} />;
}