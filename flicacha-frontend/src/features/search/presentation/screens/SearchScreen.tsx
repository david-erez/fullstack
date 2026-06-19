import React, { useCallback } from 'react';
import {
  View, Text, TextInput, FlatList, StyleSheet, TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { theme } from '@shared/theme';
import { useSearch } from '../hooks/useSearch';
import { Avatar } from '@shared/components/ui/Avatar';
import { PostCard } from '@features/feed/presentation/components/PostCard';
import type { User, Post, Hashtag } from '@core/domain/entities';

interface Props {
  onNavigateProfile: (userId: number) => void;
  onNavigatePost: (post: Post) => void;
  onNavigateHashtag: (tag: string) => void;
  onNavigateComments: (post: Post) => void;
}

export function SearchScreen({
  onNavigateProfile, onNavigatePost, onNavigateHashtag, onNavigateComments,
}: Props) {
  const { query, setQuery, tab, setTab, posts, users, hashtags, trending, loading, clear } = useSearch();

  const TABS = [
    { key: 'posts', label: 'Posts' },
    { key: 'users', label: 'Personas' },
    { key: 'hashtags', label: 'Hashtags' },
  ] as const;

  const renderUser = useCallback(({ item }: { item: User }) => (
    <TouchableOpacity
      style={styles.userRow}
      onPress={() => onNavigateProfile(item.userId)}
    >
      <Avatar uri={item.avatarUrl} name={item.name} size={44} />
      <View style={styles.userInfo}>
        <Text style={styles.userName}>@{item.name}</Text>
        <Text style={styles.userMeta}>
          {item.followersCount ?? 0} seguidores
        </Text>
      </View>
    </TouchableOpacity>
  ), [onNavigateProfile]);

  const renderHashtag = useCallback(({ item }: { item: Hashtag }) => (
    <TouchableOpacity
      style={styles.hashtagRow}
      onPress={() => onNavigateHashtag(item.tag)}
    >
      <View style={styles.hashtagIcon}>
        <Text style={styles.hashtagIconText}>#</Text>
      </View>
      <View style={styles.hashtagInfo}>
        <Text style={styles.hashtagName}>#{item.tag}</Text>
        {item.postsCount != null && (
          <Text style={styles.hashtagCount}>{item.postsCount} posts</Text>
        )}
      </View>
    </TouchableOpacity>
  ), [onNavigateHashtag]);

  const renderPost = useCallback(({ item }: { item: Post }) => (
    <PostCard
      post={item}
      onLike={() => {}}
      onComment={onNavigateComments}
      onProfile={onNavigateProfile}
      onHashtag={onNavigateHashtag}
      onPress={onNavigatePost}
    />
  ), [onNavigatePost, onNavigateComments, onNavigateProfile, onNavigateHashtag]);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Search bar */}
      <View style={styles.searchBar}>
        <Text style={styles.searchIcon}>🔍</Text>
        <TextInput
          style={styles.searchInput}
          value={query}
          onChangeText={setQuery}
          placeholder="Buscar posts, personas, #hashtags..."
          placeholderTextColor={theme.colors.textMuted}
          autoCapitalize="none"
          returnKeyType="search"
        />
        {query.length > 0 && (
          <TouchableOpacity onPress={clear} style={styles.clearBtn}>
            <Text style={styles.clearText}>✕</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Tabs */}
      <View style={styles.tabs}>
        {TABS.map((t) => (
          <TouchableOpacity
            key={t.key}
            style={[styles.tab, tab === t.key && styles.tabActive]}
            onPress={() => setTab(t.key)}
          >
            <Text style={[styles.tabText, tab === t.key && styles.tabTextActive]}>
              {t.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Results */}
      {loading ? (
        <ActivityIndicator color={theme.colors.primary} style={styles.loader} />
      ) : query.trim() ? (
        tab === 'posts' ? (
          <FlatList
            data={posts}
            renderItem={renderPost}
            keyExtractor={(item) => String(item.postId)}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.listContent}
            ListEmptyComponent={
              <View style={styles.empty}>
                <Text style={styles.emptyText}>Sin resultados para "{query}"</Text>
              </View>
            }
          />
        ) : tab === 'users' ? (
          <FlatList
            data={users}
            renderItem={renderUser}
            keyExtractor={(item) => String(item.userId)}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.listContent}
            ListEmptyComponent={
              <View style={styles.empty}>
                <Text style={styles.emptyText}>Sin resultados para "{query}"</Text>
              </View>
            }
          />
        ) : (
          <FlatList
            data={hashtags}
            renderItem={renderHashtag}
            keyExtractor={(item) => String(item.hashtagId)}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.listContent}
            ListEmptyComponent={
              <View style={styles.empty}>
                <Text style={styles.emptyText}>Sin resultados para "{query}"</Text>
              </View>
            }
          />
        )
      ) : (
        /* Trending */
        <FlatList
          ListHeaderComponent={
            <Text style={styles.trendingTitle}>Trending</Text>
          }
          data={trending}
          renderItem={renderHashtag}
          keyExtractor={(item) => String(item.hashtagId)}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={
            <View style={styles.empty}>
              <Text style={styles.emptyText}>Escribe para buscar</Text>
            </View>
          }
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing['3'],
    marginHorizontal: theme.spacing['4'],
    marginVertical: theme.spacing['3'],
    backgroundColor: theme.colors.card,
    borderRadius: theme.radii.xl,
    paddingHorizontal: theme.spacing['4'],
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  searchIcon: { fontSize: 16 },
  searchInput: {
    flex: 1,
    paddingVertical: theme.spacing['3'],
    color: theme.colors.textPrimary,
    fontFamily: theme.typography.fontBody,
    fontSize: theme.typography.base,
  },
  clearBtn: { padding: theme.spacing['2'] },
  clearText: {
    color: theme.colors.textMuted,
    fontSize: 14,
  },
  tabs: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  tab: {
    flex: 1,
    paddingVertical: theme.spacing['3'],
    alignItems: 'center',
  },
  tabActive: {
    borderBottomWidth: 2,
    borderBottomColor: theme.colors.primary,
  },
  tabText: {
    fontFamily: theme.typography.fontBody,
    fontSize: theme.typography.sm,
    color: theme.colors.textMuted,
  },
  tabTextActive: {
    color: theme.colors.primary,
    fontFamily: theme.typography.fontBodyMedium,
  },
  listContent: { paddingBottom: theme.spacing['16'] },
  loader: { paddingVertical: theme.spacing['8'] },
  trendingTitle: {
    fontFamily: theme.typography.fontDisplay,
    fontSize: theme.typography.lg,
    color: theme.colors.textPrimary,
    paddingHorizontal: theme.spacing['4'],
    paddingVertical: theme.spacing['4'],
  },
  userRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing['3'],
    paddingHorizontal: theme.spacing['4'],
    paddingVertical: theme.spacing['4'],
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  userInfo: {},
  userName: {
    fontFamily: theme.typography.fontBodyMedium,
    fontSize: theme.typography.base,
    color: theme.colors.textPrimary,
  },
  userMeta: {
    fontFamily: theme.typography.fontBody,
    fontSize: theme.typography.xs,
    color: theme.colors.textMuted,
    marginTop: 2,
  },
  hashtagRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing['3'],
    paddingHorizontal: theme.spacing['4'],
    paddingVertical: theme.spacing['4'],
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  hashtagIcon: {
    width: 44,
    height: 44,
    borderRadius: theme.radii.full,
    backgroundColor: theme.colors.primaryGlow,
    alignItems: 'center',
    justifyContent: 'center',
  },
  hashtagIconText: {
    color: theme.colors.primary,
    fontFamily: theme.typography.fontDisplay,
    fontSize: theme.typography.xl,
  },
  hashtagInfo: {},
  hashtagName: {
    fontFamily: theme.typography.fontBodyMedium,
    fontSize: theme.typography.base,
    color: theme.colors.textPrimary,
  },
  hashtagCount: {
    fontFamily: theme.typography.fontBody,
    fontSize: theme.typography.xs,
    color: theme.colors.textMuted,
    marginTop: 2,
  },
  empty: {
    alignItems: 'center',
    paddingVertical: theme.spacing['10'],
  },
  emptyText: {
    fontFamily: theme.typography.fontBody,
    fontSize: theme.typography.base,
    color: theme.colors.textMuted,
  },
});
