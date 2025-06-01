import { useParams } from "next/navigation";
import { useNovelDetail } from "../hooks";
import { NovelHeader } from "./NovelHeader";
import { ChaptersList } from "./ChaptersList";
import { NovelDetailLoading } from "./NovelDetailLoading";
import { NovelDetailError } from "./NovelDetailError";
import CommentSectionSimple from "./CommentSectionSimple";

export const NovelDetailPage = () => {
  const { novel_slug } = useParams();
  const { novel, chapters, isLoading, error } = useNovelDetail(novel_slug as string); // Ensure novel_slug is treated as string

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
      
      {/* Comment and Rating Section */}
      {novel && (
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <CommentSectionSimple 
            novelSlug={novel.slug} // Pass novel.slug as novelSlug
            novelId={novel.id}     // Pass novel.id as novelId
          />
        </div>
      )}
    </div>
  );
};
