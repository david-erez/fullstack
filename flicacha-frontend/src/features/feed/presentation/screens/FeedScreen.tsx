import React, { useEffect, useCallback } from 'react';
import {
  View, FlatList, StyleSheet, Text, RefreshControl,
  ActivityIndicator, TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { theme } from '@shared/theme';
import { useFeed } from '../hooks/useFeed';
import { PostCard } from '../components/PostCard';
import type { Post } from '@core/domain/entities';

interface Props {
  onNavigatePost: (post: Post) => void;
  onNavigateProfile: (userId: number) => void;
  onNavigateHashtag: (tag: string) => void;
  onNavigateComments: (post: Post) => void;
  onNavigateCreatePost: () => void;
}

export function FeedScreen({
  onNavigatePost,
  onNavigateProfile,
  onNavigateHashtag,
  onNavigateComments,
  onNavigateCreatePost,
}: Props) {
  const { posts, loading, refreshing, hasMore, error, refresh, loadMore, toggleLike } = useFeed();

  useEffect(() => { refresh(); }, []);

  const renderItem = useCallback(({ item }: { item: Post }) => (
    <PostCard
      post={item}
      onLike={toggleLike}
      onComment={onNavigateComments}
      onProfile={onNavigateProfile}
      onHashtag={onNavigateHashtag}
      onPress={onNavigatePost}
    />
  ), [toggleLike, onNavigateComments, onNavigateProfile, onNavigateHashtag, onNavigatePost]);

  const keyExtractor = useCallback((item: Post) => String(item.postId), []);

  const ListHeader = () => (
    <View style={styles.header}>
      <Text style={styles.headerTitle}>flicacha</Text>
    </View>
  );

  const ListFooter = () =>
    loading && !refreshing ? (
      <ActivityIndicator color={theme.colors.primary} style={styles.loader} />
    ) : null;

  const ListEmpty = () =>
    !loading ? (
      <View style={styles.empty}>
        <Text style={styles.emptyIcon}>🔥</Text>
        <Text style={styles.emptyTitle}>Nada por aquí todavía</Text>
        <Text style={styles.emptySubtitle}>Sigue a personas para ver sus posts</Text>
      </View>
    ) : (
      <ActivityIndicator color={theme.colors.primary} style={styles.loader} />
    );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <FlatList
        data={posts}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        ListHeaderComponent={ListHeader}
        ListFooterComponent={ListFooter}
        ListEmptyComponent={ListEmpty}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={refresh}
            tintColor={theme.colors.primary}
            colors={[theme.colors.primary]}
          />
        }
        onEndReached={loadMore}
        onEndReachedThreshold={0.4}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
      />

      {/* FAB */}
      <TouchableOpacity
        style={styles.fab}
        onPress={onNavigateCreatePost}
        activeOpacity={0.85}
      >
        <Text style={styles.fabIcon}>+</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  listContent: {
    paddingBottom: theme.spacing['16'],
  },
  header: {
    paddingHorizontal: theme.spacing['6'],
    paddingVertical: theme.spacing['4'],
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  headerTitle: {
    fontFamily: theme.typography.fontDisplay,
    fontSize: theme.typography.xl,
    color: theme.colors.textPrimary,
    letterSpacing: -1,
  },
  loader: {
    paddingVertical: theme.spacing['8'],
  },
  empty: {
    alignItems: 'center',
    paddingVertical: theme.spacing['16'],
    paddingHorizontal: theme.spacing['8'],
  },
  emptyIcon: { fontSize: 48, marginBottom: theme.spacing['4'] },
  emptyTitle: {
    fontFamily: theme.typography.fontDisplay,
    fontSize: theme.typography.lg,
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing['2'],
  },
  emptySubtitle: {
    fontFamily: theme.typography.fontBody,
    fontSize: theme.typography.base,
    color: theme.colors.textMuted,
    textAlign: 'center',
  },
  fab: {
    position: 'absolute',
    bottom: theme.spacing['6'],
    right: theme.spacing['6'],
    width: 56,
    height: 56,
    borderRadius: theme.radii.full,
    backgroundColor: theme.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    ...theme.shadows.glow,
  },
  fabIcon: {
    color: theme.colors.textPrimary,
    fontSize: 28,
    fontFamily: theme.typography.fontDisplay,
    lineHeight: 30,
  },
});
