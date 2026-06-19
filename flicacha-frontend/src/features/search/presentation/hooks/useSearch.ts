import { useState, useEffect, useCallback, useRef } from 'react';
import type { User, Post, Hashtag } from '@core/domain/entities';
import { searchRepository } from '../../data/repositories/SearchRepository';

type SearchTab = 'posts' | 'users' | 'hashtags';

export function useSearch() {
  const [query, setQuery] = useState('');
  const [tab, setTab] = useState<SearchTab>('posts');
  const [posts, setPosts] = useState<Post[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [hashtags, setHashtags] = useState<Hashtag[]>([]);
  const [trending, setTrending] = useState<Hashtag[]>([]);
  const [loading, setLoading] = useState(false);
  const debounceRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    searchRepository.getTrendingHashtags()
      .then(setTrending)
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (!query.trim()) {
      setPosts([]); setUsers([]); setHashtags([]);
      return;
    }
    debounceRef.current = setTimeout(() => {
      doSearch(query.trim());
    }, 400);
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
  }, [query, tab]);

  const doSearch = async (q: string) => {
    setLoading(true);
    try {
      if (tab === 'posts') {
        const res = await searchRepository.searchPosts(q);
        setPosts(res.data);
      } else if (tab === 'users') {
        const res = await searchRepository.searchUsers(q);
        setUsers(res.data);
      } else {
        const res = await searchRepository.searchHashtags(q);
        setHashtags(res.data);
      }
    } catch { } finally { setLoading(false); }
  };

  const clear = useCallback(() => setQuery(''), []);

  return { query, setQuery, tab, setTab, posts, users, hashtags, trending, loading, clear };
}
