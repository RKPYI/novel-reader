import React from 'react';
import { Chapter, ReadingSettings } from '../hooks/useChapterReader';

interface ChapterContentProps {
  chapter: Chapter;
  readingSettings: ReadingSettings;
}

export const ChapterContent: React.FC<ChapterContentProps> = ({
  chapter,
  readingSettings
}) => {
  const formatContent = (content: string) => {
    const words = content.trim().split(/\s+/);

    // Get the first 2 words and the rest
    const firstTwo = words.slice(0, 2).join(' ');
    const rest = words.slice(2).join(' ');

    if (!rest) {
      // If there's only 2 words or fewer, show them
      return [<p key={0} className="mb-4 whitespace-pre-line">{firstTwo}</p>];
    }

    // Split the rest into sentences
    const sentences = rest.split(/(?<=[.!?])\s+/);

    return [
      <p key={0} className="mb-4 whitespace-pre-line">{firstTwo}</p>,
      ...sentences.filter(s => s.trim() !== "").map((s, idx) => (
        <p key={idx + 1} className="mb-4 whitespace-pre-line">{s.trim()}</p>
      ))
    ];
  };

  return (
    <div className="mb-12">
      <h1 className="text-xl font-bold mb-6 text-center text-white">
        {chapter.title}
      </h1>
      
      <article
        className={`prose prose-lg max-w-none leading-relaxed p-8 rounded-xl border border-grey-800/30`}
        style={{
          fontSize: `${readingSettings.fontSize}px`,
          lineHeight: readingSettings.lineHeight
        }}
      >
        {formatContent(chapter.content)}
      </article>
    </div>
  );
};
