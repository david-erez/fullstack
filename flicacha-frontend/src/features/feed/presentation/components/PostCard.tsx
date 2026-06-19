import React, { memo } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, Image, Pressable,
} from 'react-native';
import { theme } from '@shared/theme';
import type { Post } from '@core/domain/entities';
import { timeAgo } from '@shared/utils/date';
import { Avatar } from '@shared/components/ui/Avatar';
import { HashtagText } from '@shared/components/ui/HashtagText';
import { MediaGrid } from './MediaGrid';

interface Props {
  post: Post;
  onLike: (postId: number) => void;
  onComment: (post: Post) => void;
  onProfile: (userId: number) => void;
  onHashtag: (tag: string) => void;
  onPress: (post: Post) => void;
}

export const PostCard = memo(function PostCard({
  post, onLike, onComment, onProfile, onHashtag, onPress,
}: Props) {
  return (
    <Pressable onPress={() => onPress(post)} style={styles.card}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => post.user && onProfile(post.user.userId)}>
          <Avatar uri={post.user?.avatarUrl} name={post.user?.name} size={40} />
        </TouchableOpacity>
        <View style={styles.headerInfo}>
          <TouchableOpacity onPress={() => post.user && onProfile(post.user.userId)}>
            <Text style={styles.username}>@{post.user?.name ?? '...'}</Text>
          </TouchableOpacity>
          <Text style={styles.time}>{timeAgo(post.createdAt)}</Text>
        </View>
      </View>

      {/* Content */}
      <HashtagText
        text={post.content}
        style={styles.content}
        onHashtagPress={onHashtag}
      />

      {/* Media */}
      {post.media && post.media.length > 0 && (
        <MediaGrid media={post.media} />
      )}

      {/* Hashtags row */}
      {post.hashtags && post.hashtags.length > 0 && (
        <View style={styles.hashtagRow}>
          {post.hashtags.map((h) => (
            <TouchableOpacity
              key={h.hashtagId}
              onPress={() => onHashtag(h.tag)}
              style={styles.hashtagChip}
            >
              <Text style={styles.hashtagChipText}>#{h.tag}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      {/* Actions */}
      <View style={styles.actions}>
        <TouchableOpacity
          style={styles.actionBtn}
          onPress={() => onLike(post.postId)}
          activeOpacity={0.75}
        >
          <Text style={[styles.actionIcon, post.isLiked && styles.likedIcon]}>
            {post.isLiked ? '❤️' : '🤍'}
          </Text>
          <Text style={[styles.actionCount, post.isLiked && styles.likedCount]}>
            {post.likesCount ?? 0}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionBtn}
          onPress={() => onComment(post)}
          activeOpacity={0.75}
        >
          <Text style={styles.actionIcon}>💬</Text>
          <Text style={styles.actionCount}>{post.commentsCount ?? 0}</Text>
        </TouchableOpacity>
      </View>
    </Pressable>
  );
});

const styles = StyleSheet.create({
  card: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.radii.xl,
    padding: theme.spacing['4'],
    marginHorizontal: theme.spacing['4'],
    marginVertical: theme.spacing['2'],
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing['3'],
    gap: theme.spacing['3'],
  },
  headerInfo: { flex: 1 },
  username: {
    fontFamily: theme.typography.fontBodyMedium,
    fontSize: theme.typography.base,
    color: theme.colors.textPrimary,
  },
  time: {
    fontFamily: theme.typography.fontBody,
    fontSize: theme.typography.xs,
    color: theme.colors.textMuted,
    marginTop: 2,
  },
  content: {
    fontFamily: theme.typography.fontBody,
    fontSize: theme.typography.base,
    color: theme.colors.textPrimary,
    lineHeight: theme.typography.base * theme.typography.normal,
    marginBottom: theme.spacing['3'],
  },
  hashtagRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing['2'],
    marginBottom: theme.spacing['3'],
  },
  hashtagChip: {
    backgroundColor: theme.colors.primaryGlow,
    borderRadius: theme.radii.full,
    paddingHorizontal: theme.spacing['3'],
    paddingVertical: theme.spacing['1'],
  },
  hashtagChipText: {
    color: theme.colors.primary,
    fontFamily: theme.typography.fontBodyMedium,
    fontSize: theme.typography.xs,
  },
  actions: {
    flexDirection: 'row',
    gap: theme.spacing['5'],
    marginTop: theme.spacing['2'],
    paddingTop: theme.spacing['3'],
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing['2'],
  },
  actionIcon: { fontSize: 18 },
  likedIcon: {},
  actionCount: {
    fontFamily: theme.typography.fontBodyMedium,
    fontSize: theme.typography.sm,
    color: theme.colors.textMuted,
  },
  likedCount: { color: theme.colors.like },
});
