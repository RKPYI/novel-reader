import { useParams } from "next/navigation";
import { useNovelDetail } from "../hooks";
import { NovelHeader } from "./NovelHeader";
import { ChaptersList } from "./ChaptersList";
import { NovelDetailLoading } from "./NovelDetailLoading";
import { NovelDetailError } from "./NovelDetailError";

export const NovelDetailPage = () => {
  const { novel_slug } = useParams();
  const { novel, chapters, isLoading, error } = useNovelDetail(novel_slug);

  if (isLoading) {
    return <NovelDetailLoading />;
  }

  if (error || !novel) {
    return <NovelDetailError error={error || "Novel not found"} />;
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <NovelHeader novel={novel} chapters={chapters} />
      <ChaptersList novel={novel} chapters={chapters} />
    </div>
  );
};
