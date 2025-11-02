'use client';

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { Search, BookOpen, Loader2 } from "lucide-react";
import { fetchCategories } from "./api";
import styles from "./style.module.css";

type Category = {
  id: number;
  category: string;
  category_image: string;
  description: string;
};

export default function CategoriesList() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [offset, setOffset] = useState(0);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [search, setSearch] = useState("");

  const observerRef = useRef<IntersectionObserver | null>(null);
  const lastElementRef = useRef<HTMLDivElement | null>(null);
  const hasLoadedOnce = useRef(false);
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const loadCategories = async (reset = false, searchQuery = search) => {
    if (loading) return;
    if (!reset && !hasMore) return;
    
    setLoading(true);

    try {
      const newOffset = reset ? 0 : offset;
      const data = await fetchCategories(20, newOffset, searchQuery);
      
      setCategories(prev => reset ? data.data : [...prev, ...data.data]);
      setOffset(reset ? 20 : newOffset + 20);
      setHasMore(data.next_offset !== null);
    } catch (error) {
      console.error('Error loading categories:', error);
    } finally {
      setLoading(false);
    }
  };

  // Initial load
  useEffect(() => {
    if (hasLoadedOnce.current) return;
    hasLoadedOnce.current = true;
    loadCategories(true, "");
  }, []);

  // Handle search with debounce
  useEffect(() => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    searchTimeoutRef.current = setTimeout(() => {
      setOffset(0);
      setHasMore(true);
      loadCategories(true, search);
    }, 500);

    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [search]);

  // Intersection observer for infinite scroll
  useEffect(() => {
    if (observerRef.current) observerRef.current.disconnect();

    observerRef.current = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting && hasMore && !loading) {
          loadCategories(false);
        }
      },
      { threshold: 0.1 }
    );

    if (lastElementRef.current) {
      observerRef.current.observe(lastElementRef.current);
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [hasMore, loading, offset]);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.titleWrapper}>
          <BookOpen className={styles.headerIcon} />
          <h2 className={styles.heading}>Explore Categories</h2>
        </div>
        <p className={styles.subtitle}>Discover topics that inspire your learning journey</p>
      </div>

      <div className={styles.searchWrapper}>
        <Search className={styles.searchIcon} />
        <input
          type="text"
          placeholder="Search categories..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className={styles.searchBox}
        />
      </div>

      <div className={styles.grid}>
        {categories.map((cat, index) => (
          <div
            key={cat.id}
            ref={index === categories.length - 1 ? lastElementRef : null}
            className={styles.card}
          >
            <Link href={`/learn/topics?category=${encodeURIComponent(cat.category)}`}>
              <div className={styles.imageWrapper}>
                <img
                  src={cat.category_image}
                  alt={cat.category}
                  className={styles.image}
                />
                <div className={styles.overlay}></div>
              </div>
              <div className={styles.info}>
                <h3 className={styles.categoryTitle}>{cat.category}</h3>
                <p className={styles.description}>{cat.description}</p>
              </div>
            </Link>
          </div>
        ))}
      </div>

      {loading && (
        <div className={styles.loadingWrapper}>
          <Loader2 className={styles.spinner} />
          <p className={styles.loadingText}>Loading categories...</p>
        </div>
      )}
      
      {!loading && !hasMore && categories.length > 0 && (
        <p className={styles.endText}>You've explored all categories</p>
      )}

      {!loading && categories.length === 0 && (
        <div className={styles.emptyState}>
          <Search className={styles.emptyIcon} />
          <p className={styles.emptyText}>No categories found</p>
          <p className={styles.emptyHint}>Try a different search term</p>
        </div>
      )}
    </div>
  );
}