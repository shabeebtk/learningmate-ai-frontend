'use client';

import { useSearchParams } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import { Search, BookMarked, Filter, Loader2, ChevronDown } from "lucide-react";
import { fetchTopics, fetchCategories } from "./api";
import styles from "./style.module.css";
import Link from "next/link";

type Category = {
  id: number;
  category: string;
  category_image: string;
  description: string;
};

type Topic = {
  id: number;
  topic: string;
  topic_image: string;
  description: string;
  category: Category;
};

export default function TopicsList() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get("category") || "";

  const [topics, setTopics] = useState<Topic[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [category, setCategory] = useState(initialCategory);
  const [offset, setOffset] = useState(0);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const observerRef = useRef<IntersectionObserver | null>(null);
  const lastElementRef = useRef<HTMLDivElement | null>(null);
  const hasLoadedOnce = useRef(false);
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Fetch Topics
  const loadTopics = async (reset = false, customSearch = search, customCategory = category) => {
    if (loading) return;
    if (!reset && !hasMore) return;

    setLoading(true);

    try {
      const newOffset = reset ? 0 : offset;
      const data = await fetchTopics(20, newOffset, customSearch, customCategory);

      setTopics(prev => (reset ? data.data : [...prev, ...data.data]));
      setOffset(reset ? 20 : newOffset + 20);
      setHasMore(data.next_offset !== null);
    } catch (error) {
      console.error('Error loading topics:', error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch categories once
  const loadCategories = async () => {
    try {
      const data = await fetchCategories(100, 0, "");
      setCategories(data.data);
    } catch (error) {
      console.error('Error loading categories:', error);
    }
  };

  // Initial load
  useEffect(() => {
    if (hasLoadedOnce.current) return;
    hasLoadedOnce.current = true;
    loadCategories();
    loadTopics(true);
  }, []);

  // Debounced search
  useEffect(() => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    searchTimeoutRef.current = setTimeout(() => {
      setOffset(0);
      setHasMore(true);
      loadTopics(true, search, category);
    }, 500);

    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [search]);

  // Reload when category changes
  useEffect(() => {
    setOffset(0);
    setHasMore(true);
    loadTopics(true, search, category);
  }, [category]);

  // Infinite scroll
  useEffect(() => {
    if (observerRef.current) observerRef.current.disconnect();

    observerRef.current = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting && hasMore && !loading) {
          loadTopics(false);
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
          <BookMarked className={styles.headerIcon} />
          <h2 className={styles.heading}>Explore Topics</h2>
        </div>
        <p className={styles.subtitle}>Deep dive into subjects that spark your curiosity</p>
      </div>

      <div className={styles.filterSection}>
        <div className={styles.searchWrapper}>
          <Search className={styles.searchIcon} />
          <input
            type="text"
            placeholder="Search topics..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className={styles.searchBox}
          />
        </div>

        <div className={styles.selectWrapper}>
          <Filter className={styles.selectIcon} />
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className={styles.dropdown}
          >
            <option value="">All Categories</option>
            {categories.map(cat => (
              <option key={cat.id} value={cat.category}>
                {cat.category}
              </option>
            ))}
          </select>
          <ChevronDown className={styles.chevronIcon} />
        </div>
      </div>

      <div className={styles.grid}>
        {topics.map((t, index) => (
          <div
            key={t.id}
            ref={index === topics.length - 1 ? lastElementRef : null}
            className={styles.card}
          >
            <Link href={`/learn/topics/${t.id}`}>
              <div className={styles.imageWrapper}>
                <img src={t.topic_image} alt={t.topic} className={styles.image} />
                <div className={styles.overlay}></div>
              </div>
              <div className={styles.info}>
                <h3 className={styles.topicTitle}>{t.topic}</h3>
                <p className={styles.categoryLabel}>{t.category.category}</p>
                <p className={styles.description}>{t.description}</p>
              </div>
            </Link>
          </div>
        ))}
      </div>

      {loading && (
        <div className={styles.loadingWrapper}>
          <Loader2 className={styles.spinner} />
          <p className={styles.loadingText}>Loading topics...</p>
        </div>
      )}

      {!loading && !hasMore && topics.length > 0 && (
        <p className={styles.endText}>You've explored all topics</p>
      )}

      {!loading && topics.length === 0 && (
        <div className={styles.emptyState}>
          <Search className={styles.emptyIcon} />
          <p className={styles.emptyText}>No topics found</p>
          <p className={styles.emptyHint}>Try adjusting your search or category filter</p>
        </div>
      )}
    </div>
  );
}