import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import axios from "axios";
import { Novel, Genre } from "./useNovels";
import { API_ENDPOINTS } from "../config/api";

export interface BrowseFilters {
  searchTerm: string;
  sortBy: string;
  selectedGenre: string;
  statusFilter: string;
}

export interface BrowseState {
  novels: Novel[];
  filteredNovels: Novel[];
  genres: Genre[];
  filters: BrowseFilters;
  isLoading: boolean;
  error: string | null;
}

export const useBrowse = () => {
  const searchParams = useSearchParams();
  const [novels, setNovels] = useState<Novel[]>([]);
  const [filteredNovels, setFilteredNovels] = useState<Novel[]>([]);
  const [genres, setGenres] = useState<Genre[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState(searchParams?.get("sort") || "popular");
  const [selectedGenre, setSelectedGenre] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch data based on sort order
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Fetch genres
        const genresResponse = await axios.get(API_ENDPOINTS.novels.genres);
        setGenres(genresResponse.data.genres || []);

        // Fetch novels based on sort order
        let apiEndpoint: string = API_ENDPOINTS.novels.browse;
        if (sortBy === "popular") {
          apiEndpoint = API_ENDPOINTS.novels.popular;
        } else if (sortBy === "latest") {
          apiEndpoint = API_ENDPOINTS.novels.latest;
        }

        const response = await axios.get(apiEndpoint);
        const novelList = response.data.novels || [];
        setNovels(novelList);
        setFilteredNovels(novelList);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Failed to load novels. Please try again later.");
        setNovels([]);
        setFilteredNovels([]);
        setGenres([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [sortBy]);

  // Filter and sort novels
  useEffect(() => {
    let filtered = novels.filter(novel => {
      // Search filter
      const matchesSearch = novel.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (novel.author && novel.author.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (novel.description && novel.description.toLowerCase().includes(searchTerm.toLowerCase()));

      // Genre filter
      const matchesGenre = !selectedGenre || 
        (novel.genres && novel.genres.some(genre => genre.slug === selectedGenre));

      // Status filter
      const matchesStatus = !statusFilter || novel.status === statusFilter;

      return matchesSearch && matchesGenre && matchesStatus;
    });

    // Additional sorting (for manual sort options)
    if (sortBy === "title") {
      filtered.sort((a, b) => a.title.localeCompare(b.title));
    } else if (sortBy === "author") {
      filtered.sort((a, b) => (a.author || "").localeCompare(b.author || ""));
    } else if (sortBy === "rating") {
      filtered.sort((a, b) => parseFloat(b.rating) - parseFloat(a.rating));
    }

    setFilteredNovels(filtered);
  }, [novels, searchTerm, selectedGenre, statusFilter, sortBy]);

  const updateFilter = (filterName: keyof BrowseFilters, value: string) => {
    switch (filterName) {
      case 'searchTerm':
        setSearchTerm(value);
        break;
      case 'sortBy':
        setSortBy(value);
        break;
      case 'selectedGenre':
        setSelectedGenre(value);
        break;
      case 'statusFilter':
        setStatusFilter(value);
        break;
    }
  };

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedGenre("");
    setStatusFilter("");
    setSortBy("popular");
  };

  const hasActiveFilters = Boolean(searchTerm || selectedGenre || statusFilter || sortBy !== "popular");

  const filters: BrowseFilters = {
    searchTerm,
    sortBy,
    selectedGenre,
    statusFilter,
  };

  return {
    novels,
    filteredNovels,
    genres,
    filters,
    isLoading,
    error,
    updateFilter,
    clearFilters,
    hasActiveFilters,
  };
};
