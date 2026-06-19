import { useState, useCallback, useRef } from 'react';
import type { Post } from '@core/domain/entities';
import { postRepository } from '../../data/repositories/PostRepository';
import { GetFeedUseCase, LikePostUseCase } from '../../domain/usecases';

const getFeedUC = new GetFeedUseCase(postRepository);
const likePostUC = new LikePostUseCase(postRepository);

const PAGE_SIZE = 20;

export function useFeed() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const pageRef = useRef(1);

  const fetchFeed = useCallback(async (reset = false) => {
    if (reset) {
      pageRef.current = 1;
      setRefreshing(true);
    } else {
      if (loading || !hasMore) return;
      setLoading(true);
    }
    setError(null);
    try {
      const result = await getFeedUC.execute({ page: pageRef.current, limit: PAGE_SIZE });
      setPosts((prev) => reset ? result.data : [...prev, ...result.data]);
      setHasMore(result.hasMore);
      pageRef.current += 1;
    } catch (e: any) {
      setError(e?.message ?? 'Error al cargar el feed');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [loading, hasMore]);

  const toggleLike = useCallback(async (postId: number) => {
    // Optimistic update
    setPosts((prev) =>
      prev.map((p) =>
        p.postId === postId
          ? {
              ...p,
              isLiked: !p.isLiked,
              likesCount: (p.likesCount ?? 0) + (p.isLiked ? -1 : 1),
            }
          : p,
      ),
    );
    try {
      const post = posts.find((p) => p.postId === postId);
      if (post) await likePostUC.execute(postId, post.isLiked ?? false);
    } catch {
      // Revert on error
      setPosts((prev) =>
        prev.map((p) =>
          p.postId === postId
            ? {
                ...p,
                isLiked: !p.isLiked,
                likesCount: (p.likesCount ?? 0) + (p.isLiked ? 1 : -1),
              }
            : p,
        ),
      );
    }
  }, [posts]);

  const refresh = useCallback(() => fetchFeed(true), [fetchFeed]);
  const loadMore = useCallback(() => fetchFeed(false), [fetchFeed]);

  return { posts, loading, refreshing, hasMore, error, refresh, loadMore, toggleLike, setPosts };
}
