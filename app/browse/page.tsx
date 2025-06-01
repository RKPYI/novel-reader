"use client";
import { useBrowse } from "../hooks";
import { 
  BrowseHeader, 
  BrowseFilters, 
  NovelGrid, 
  LoadingState, 
  ErrorState 
} from "../components/browse";
import { Suspense } from "react";

function BrowsePageContent() {
  const {
    filteredNovels,
    genres,
    filters,
    isLoading,
    error,
    updateFilter,
    clearFilters,
    hasActiveFilters,
  } = useBrowse();

  if (isLoading) {
    return <LoadingState />;
  }

  if (error) {
    return <ErrorState error={error} />;
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white py-12">
      <div className="max-w-7xl mx-auto px-4">
        <BrowseHeader />
        
        <BrowseFilters 
          filters={filters}
          genres={genres}
          onFilterChange={updateFilter}
          onClearFilters={clearFilters}
          hasActiveFilters={hasActiveFilters}
        />
        
        <NovelGrid 
          novels={filteredNovels}
          onClearFilters={clearFilters}
        />
      </div>
    </div>
  );
}

export default function BrowsePage() {
  return (
    <Suspense fallback={<LoadingState />}>
      <BrowsePageContent />
    </Suspense>
  )
}