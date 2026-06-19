import React, { useCallback } from 'react';
import {
  View, Text, StyleSheet, FlatList, TouchableOpacity,
  ActivityIndicator, Image, RefreshControl, ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { theme } from '@shared/theme';
import { useProfile } from '../hooks/useProfile';
import { Avatar } from '@shared/components/ui/Avatar';
import { PostCard } from '@features/feed/presentation/components/PostCard';
import type { Post } from '@core/domain/entities';

interface Props {
  userId: number;
  onBack?: () => void;
  onNavigatePost: (post: Post) => void;
  onNavigateHashtag: (tag: string) => void;
  onNavigateComments: (post: Post) => void;
  onNavigateEditProfile?: () => void;
}

export function ProfileScreen({
  userId, onBack, onNavigatePost, onNavigateHashtag,
  onNavigateComments, onNavigateEditProfile,
}: Props) {
  const {
    profile, posts, loading, error, isOwnProfile,
    isFollowing, followPending, toggleFollow, refresh,
  } = useProfile(userId);

  const renderPost = useCallback(({ item }: { item: Post }) => (
    <PostCard
      post={item}
      onLike={() => {}}
      onComment={onNavigateComments}
      onProfile={() => {}}
      onHashtag={onNavigateHashtag}
      onPress={onNavigatePost}
    />
  ), [onNavigatePost, onNavigateHashtag, onNavigateComments]);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator color={theme.colors.primary} size="large" />
      </View>
    );
  }

  if (error || !profile) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>{error ?? 'Perfil no encontrado'}</Text>
        <TouchableOpacity onPress={refresh} style={styles.retryBtn}>
          <Text style={styles.retryText}>Reintentar</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const ListHeader = () => (
    <View>
      {/* Banner */}
      <View style={styles.banner} />

      <View style={styles.profileInfo}>
        {/* Avatar */}
        <View style={styles.avatarRow}>
          <Avatar uri={profile.avatarUrl} name={profile.name} size={80} style={styles.avatar} />
          <View style={styles.actionArea}>
            {isOwnProfile ? (
              <TouchableOpacity
                style={styles.editBtn}
                onPress={onNavigateEditProfile}
              >
                <Text style={styles.editBtnText}>Editar perfil</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={[styles.followBtn, isFollowing && styles.followingBtn]}
                onPress={toggleFollow}
                disabled={followPending}
              >
                {followPending
                  ? <ActivityIndicator size="small" color={theme.colors.textPrimary} />
                  : <Text style={[styles.followBtnText, isFollowing && styles.followingBtnText]}>
                      {isFollowing ? 'Siguiendo' : 'Seguir'}
                    </Text>
                }
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Name */}
        <Text style={styles.name}>{profile.name}</Text>
        <Text style={styles.handle}>@{profile.name}</Text>

        {/* Stats */}
        <View style={styles.stats}>
          <View style={styles.statItem}>
            <Text style={styles.statNum}>{profile.postsCount ?? posts.length}</Text>
            <Text style={styles.statLabel}>Posts</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNum}>{profile.followersCount ?? 0}</Text>
            <Text style={styles.statLabel}>Seguidores</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNum}>{profile.followingCount ?? 0}</Text>
            <Text style={styles.statLabel}>Siguiendo</Text>
          </View>
        </View>
      </View>

      <View style={styles.postsLabel}>
        <Text style={styles.postsLabelText}>Posts</Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {onBack && (
        <TouchableOpacity onPress={onBack} style={styles.backBtn}>
          <Text style={styles.backText}>← Volver</Text>
        </TouchableOpacity>
      )}
      <FlatList
        data={posts}
        renderItem={renderPost}
        keyExtractor={(item) => String(item.postId)}
        ListHeaderComponent={ListHeader}
        refreshControl={
          <RefreshControl
            refreshing={false}
            onRefresh={refresh}
            tintColor={theme.colors.primary}
          />
        }
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <Text style={styles.emptyText}>Aún no hay posts</Text>
        }
        contentContainerStyle={styles.listContent}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  listContent: { paddingBottom: theme.spacing['16'] },
  backBtn: {
    paddingHorizontal: theme.spacing['4'],
    paddingVertical: theme.spacing['3'],
  },
  backText: {
    color: theme.colors.primary,
    fontFamily: theme.typography.fontBodyMedium,
    fontSize: theme.typography.base,
  },
  banner: {
    height: 100,
    backgroundColor: theme.colors.card,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  profileInfo: {
    paddingHorizontal: theme.spacing['4'],
    paddingBottom: theme.spacing['4'],
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  avatarRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginTop: -40,
    marginBottom: theme.spacing['3'],
  },
  avatar: {
    borderWidth: 3,
    borderColor: theme.colors.background,
  },
  actionArea: {},
  editBtn: {
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.radii.full,
    paddingHorizontal: theme.spacing['4'],
    paddingVertical: theme.spacing['2'],
  },
  editBtnText: {
    color: theme.colors.textPrimary,
    fontFamily: theme.typography.fontBodyMedium,
    fontSize: theme.typography.sm,
  },
  followBtn: {
    backgroundColor: theme.colors.primary,
    borderRadius: theme.radii.full,
    paddingHorizontal: theme.spacing['5'],
    paddingVertical: theme.spacing['2'],
    minWidth: 90,
    alignItems: 'center',
  },
  followingBtn: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  followBtnText: {
    color: theme.colors.textPrimary,
    fontFamily: theme.typography.fontDisplay,
    fontSize: theme.typography.sm,
  },
  followingBtnText: {
    color: theme.colors.textSecondary,
  },
  name: {
    fontFamily: theme.typography.fontDisplay,
    fontSize: theme.typography.xl,
    color: theme.colors.textPrimary,
    letterSpacing: -0.5,
  },
  handle: {
    fontFamily: theme.typography.fontBody,
    fontSize: theme.typography.base,
    color: theme.colors.textMuted,
    marginBottom: theme.spacing['4'],
  },
  stats: {
    flexDirection: 'row',
    gap: theme.spacing['6'],
  },
  statItem: { alignItems: 'center' },
  statNum: {
    fontFamily: theme.typography.fontDisplay,
    fontSize: theme.typography.lg,
    color: theme.colors.textPrimary,
  },
  statLabel: {
    fontFamily: theme.typography.fontBody,
    fontSize: theme.typography.xs,
    color: theme.colors.textMuted,
  },
  postsLabel: {
    paddingHorizontal: theme.spacing['4'],
    paddingVertical: theme.spacing['3'],
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  postsLabelText: {
    fontFamily: theme.typography.fontDisplay,
    fontSize: theme.typography.md,
    color: theme.colors.textPrimary,
  },
  emptyText: {
    textAlign: 'center',
    color: theme.colors.textMuted,
    fontFamily: theme.typography.fontBody,
    fontSize: theme.typography.base,
    paddingVertical: theme.spacing['10'],
  },
  errorText: {
    color: theme.colors.error,
    fontFamily: theme.typography.fontBody,
    fontSize: theme.typography.base,
    marginBottom: theme.spacing['4'],
  },
  retryBtn: {
    backgroundColor: theme.colors.primary,
    borderRadius: theme.radii.full,
    paddingHorizontal: theme.spacing['5'],
    paddingVertical: theme.spacing['2'],
  },
  retryText: {
    color: theme.colors.textPrimary,
    fontFamily: theme.typography.fontBodyMedium,
    fontSize: theme.typography.sm,
  },
});
