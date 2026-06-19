import { useState, useEffect, useCallback } from 'react';
import type { User, Post } from '@core/domain/entities';
import { userRepository } from '../../data/repositories/UserRepository';
import { postRepository } from '@features/feed/data/repositories/PostRepository';
import { useAuthStore } from '@features/auth/presentation/hooks/useAuthStore';

export function useProfile(userId: number) {
  const currentUser = useAuthStore((s) => s.user);
  const setUser = useAuthStore((s) => s.setUser);
  const isOwnProfile = currentUser?.userId === userId;

  const [profile, setProfile] = useState<User | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [postsLoading, setPostsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isFollowing, setIsFollowing] = useState(false);
  const [followPending, setFollowPending] = useState(false);

  useEffect(() => {
    loadProfile();
  }, [userId]);

  const loadProfile = async () => {
    setLoading(true);
    setError(null);
    try {
      const [userData, postsData, followingStatus] = await Promise.all([
        userRepository.getUserById(userId),
        postRepository.getPostsByUser(userId, { page: 1, limit: 20 }),
        isOwnProfile ? Promise.resolve(false) : userRepository.isFollowing(userId),
      ]);
      setProfile(userData);
      setPosts(postsData.data);
      setIsFollowing(followingStatus);
    } catch (e: any) {
      setError(e?.message ?? 'Error al cargar el perfil');
    } finally {
      setLoading(false);
    }
  };

  const toggleFollow = useCallback(async () => {
    if (followPending || isOwnProfile) return;
    setFollowPending(true);
    const wasFollowing = isFollowing;
    setIsFollowing(!wasFollowing);
    setProfile((p) =>
      p
        ? {
            ...p,
            followersCount: (p.followersCount ?? 0) + (wasFollowing ? -1 : 1),
          }
        : p,
    );
    try {
      if (wasFollowing) await userRepository.unfollowUser(userId);
      else await userRepository.followUser(userId);
    } catch {
      setIsFollowing(wasFollowing);
      setProfile((p) =>
        p
          ? {
              ...p,
              followersCount: (p.followersCount ?? 0) + (wasFollowing ? 1 : -1),
            }
          : p,
      );
    } finally {
      setFollowPending(false);
    }
  }, [isFollowing, followPending, isOwnProfile, userId]);

  return {
    profile,
    posts,
    loading,
    postsLoading,
    error,
    isOwnProfile,
    isFollowing,
    followPending,
    toggleFollow,
    refresh: loadProfile,
  };
}
