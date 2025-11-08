'use client';

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { Search, Users, Loader2, Sparkles } from "lucide-react";
import { fetchCharacters } from "./api"
import styles from "./style.module.css";

type Topic = {
  id: number;
  topic: string;
  topic_image: string;
};

type Character = {
  id: number;
  name: string;
  role: string;
  description: string;
  avatar: string;
  is_active: boolean;
  topic: Topic;
};

export default function CharactersList() {
  const [characters, setCharacters] = useState<Character[]>([]);
  const [offset, setOffset] = useState(0);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [search, setSearch] = useState("");

  const observerRef = useRef<IntersectionObserver | null>(null);
  const lastElementRef = useRef<HTMLDivElement | null>(null);
  const hasLoadedOnce = useRef(false);
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const loadCharacters = async (reset = false, searchQuery = search) => {
    if (loading) return;
    if (!reset && !hasMore) return;
    
    setLoading(true);

    try {
      const newOffset = reset ? 0 : offset;
      const data = await fetchCharacters(20, newOffset, searchQuery);
      
      setCharacters(prev => reset ? data.data : [...prev, ...data.data]);
      setOffset(reset ? 20 : newOffset + 20);
      setHasMore(data.next_offset !== null);
    } catch (error) {
      console.error('Error loading characters:', error);
    } finally {
      setLoading(false);
    }
  };

  // Initial load
  useEffect(() => {
    if (hasLoadedOnce.current) return;
    hasLoadedOnce.current = true;
    loadCharacters(true, "");
  }, []);

  // Handle search with debounce
  useEffect(() => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    searchTimeoutRef.current = setTimeout(() => {
      setOffset(0);
      setHasMore(true);
      loadCharacters(true, search);
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
          loadCharacters(false);
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
          <Users className={styles.headerIcon} />
          <h2 className={styles.heading}>AI Characters</h2>
        </div>
        <p className={styles.subtitle}>Meet your personalized learning companions</p>
      </div>

      <div className={styles.searchWrapper}>
        <Search className={styles.searchIcon} />
        <input
          type="text"
          placeholder="Search characters..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className={styles.searchBox}
        />
      </div>

      <div className={styles.grid}>
        {characters.map((char, index) => (
          <div
            key={char.id}
            ref={index === characters.length - 1 ? lastElementRef : null}
            className={styles.card}
          >
            <Link href={`/characters/${char.id}/chat`}>
              <div className={styles.avatarWrapper}>
                <img
                  src={char.avatar}
                  alt={char.name}
                  className={styles.avatar}
                />
              </div>
              <div className={styles.info}>
                <h3 className={styles.characterName}>{char.name}</h3>
                <p className={styles.role}>{char.role}</p>
                <p className={styles.description}>{char.description}</p>
                <div className={styles.topicTag}>
                  <img 
                    src={char.topic.topic_image} 
                    alt={char.topic.topic}
                    className={styles.topicIcon}
                  />
                  <span>{char.topic.topic}</span>
                </div>
              </div>
            </Link>
          </div>
        ))}
      </div>

      {loading && (
        <div className={styles.loadingWrapper}>
          <Loader2 className={styles.spinner} />
          <p className={styles.loadingText}>Loading characters...</p>
        </div>
      )}
      
      {!loading && !hasMore && characters.length > 0 && (
        <p className={styles.endText}>You've met all characters</p>
      )}

      {!loading && characters.length === 0 && (
        <div className={styles.emptyState}>
          <Search className={styles.emptyIcon} />
          <p className={styles.emptyText}>No characters found</p>
          <p className={styles.emptyHint}>Try a different search term</p>
        </div>
      )}
    </div>
  );
}