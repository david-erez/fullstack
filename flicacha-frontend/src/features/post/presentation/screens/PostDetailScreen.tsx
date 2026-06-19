import React, { useEffect, useState, useCallback } from 'react';
import {
  View, Text, FlatList, StyleSheet, TouchableOpacity,
  TextInput, KeyboardAvoidingView, Platform, ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { theme } from '@shared/theme';
import type { Post, Comment } from '@core/domain/entities';
import { Avatar } from '@shared/components/ui/Avatar';
import { timeAgo } from '@shared/utils/date';
import { get, post as apiPost, del } from '@core/infrastructure/api/apiClient';
import { useAuthStore } from '@features/auth/presentation/hooks/useAuthStore';

interface Props {
  post: Post;
  onBack: () => void;
  onProfile: (userId: number) => void;
  onHashtag: (tag: string) => void;
}

export function PostDetailScreen({ post, onBack, onProfile, onHashtag }: Props) {
  const currentUser = useAuthStore((s) => s.user);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [draft, setDraft] = useState('');
  const [postData, setPostData] = useState<Post>(post);

  useEffect(() => {
    loadComments();
  }, []);

  const loadComments = async () => {
    setLoading(true);
    try {
      const res = await get<{ data: Comment[] }>(`/posts/${post.postId}/comments`);
      setComments(res.data);
    } catch { } finally { setLoading(false); }
  };

  const handleLike = async () => {
    const wasLiked = postData.isLiked;
    setPostData((p) => ({
      ...p,
      isLiked: !p.isLiked,
      likesCount: (p.likesCount ?? 0) + (p.isLiked ? -1 : 1),
    }));
    try {
      if (wasLiked) await del(`/posts/${post.postId}/like`);
      else await apiPost(`/posts/${post.postId}/like`);
    } catch {
      setPostData((p) => ({
        ...p,
        isLiked: wasLiked,
        likesCount: (p.likesCount ?? 0) + (wasLiked ? 1 : -1),
      }));
    }
  };

  const handleComment = async () => {
    if (!draft.trim()) return;
    setSending(true);
    try {
      const newComment = await apiPost<Comment>(`/posts/${post.postId}/comments`, { content: draft.trim() });
      setComments((prev) => [newComment, ...prev]);
      setPostData((p) => ({ ...p, commentsCount: (p.commentsCount ?? 0) + 1 }));
      setDraft('');
    } catch { } finally { setSending(false); }
  };

  const handleLikeComment = async (comment: Comment) => {
    const wasLiked = comment.isLiked;
    setComments((prev) =>
      prev.map((c) =>
        c.commentId === comment.commentId
          ? { ...c, isLiked: !c.isLiked, likesCount: (c.likesCount ?? 0) + (c.isLiked ? -1 : 1) }
          : c,
      ),
    );
    try {
      if (wasLiked) await del(`/comments/${comment.commentId}/like`);
      else await apiPost(`/comments/${comment.commentId}/like`);
    } catch {
      setComments((prev) =>
        prev.map((c) =>
          c.commentId === comment.commentId
            ? { ...c, isLiked: wasLiked, likesCount: (c.likesCount ?? 0) + (wasLiked ? 1 : -1) }
            : c,
        ),
      );
    }
  };

  const renderComment = useCallback(({ item }: { item: Comment }) => (
    <View style={styles.comment}>
      <TouchableOpacity onPress={() => item.user && onProfile(item.user.userId)}>
        <Avatar uri={item.user?.avatarUrl} name={item.user?.name} size={32} />
      </TouchableOpacity>
      <View style={styles.commentBody}>
        <TouchableOpacity onPress={() => item.user && onProfile(item.user.userId)}>
          <Text style={styles.commentUser}>@{item.user?.name}</Text>
        </TouchableOpacity>
        <Text style={styles.commentContent}>{item.content}</Text>
        <View style={styles.commentMeta}>
          <Text style={styles.commentTime}>{timeAgo(item.createdAt)}</Text>
          <TouchableOpacity style={styles.commentLike} onPress={() => handleLikeComment(item)}>
            <Text style={styles.commentLikeIcon}>{item.isLiked ? '❤️' : '🤍'}</Text>
            <Text style={[styles.commentLikeCount, item.isLiked && styles.commentLikeCountActive]}>
              {item.likesCount ?? 0}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  ), [onProfile]);

  const PostHeader = () => (
    <View style={styles.postSection}>
      {/* Back */}
      <TouchableOpacity onPress={onBack} style={styles.backBtn}>
        <Text style={styles.backText}>← Volver</Text>
      </TouchableOpacity>

      {/* Post header */}
      <View style={styles.postHeader}>
        <TouchableOpacity onPress={() => postData.user && onProfile(postData.user.userId)}>
          <Avatar uri={postData.user?.avatarUrl} name={postData.user?.name} size={44} />
        </TouchableOpacity>
        <View style={styles.postHeaderInfo}>
          <Text style={styles.postUsername}>@{postData.user?.name}</Text>
          <Text style={styles.postTime}>{timeAgo(postData.createdAt)}</Text>
        </View>
      </View>

      <Text style={styles.postContent}>{postData.content}</Text>

      {/* Post actions */}
      <View style={styles.postActions}>
        <TouchableOpacity style={styles.actionBtn} onPress={handleLike}>
          <Text style={styles.actionIcon}>{postData.isLiked ? '❤️' : '🤍'}</Text>
          <Text style={[styles.actionCount, postData.isLiked && styles.likedCount]}>
            {postData.likesCount ?? 0}
          </Text>
        </TouchableOpacity>
        <View style={styles.actionBtn}>
          <Text style={styles.actionIcon}>💬</Text>
          <Text style={styles.actionCount}>{postData.commentsCount ?? 0}</Text>
        </View>
      </View>

      <View style={styles.commentsHeader}>
        <Text style={styles.commentsTitle}>Comentarios</Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={0}
      >
        <FlatList
          data={comments}
          renderItem={renderComment}
          keyExtractor={(item) => String(item.commentId)}
          ListHeaderComponent={PostHeader}
          ListEmptyComponent={
            loading
              ? <ActivityIndicator color={theme.colors.primary} style={styles.loader} />
              : <Text style={styles.noComments}>Sin comentarios aún</Text>
          }
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
        />

        {/* Comment input */}
        <View style={styles.inputBar}>
          <Avatar uri={currentUser?.avatarUrl} name={currentUser?.name} size={32} />
          <TextInput
            style={styles.commentInput}
            value={draft}
            onChangeText={setDraft}
            placeholder="Agrega un comentario..."
            placeholderTextColor={theme.colors.textMuted}
            multiline
            maxLength={500}
          />
          <TouchableOpacity
            style={[styles.sendBtn, (!draft.trim() || sending) && styles.sendBtnDisabled]}
            onPress={handleComment}
            disabled={!draft.trim() || sending}
          >
            {sending
              ? <ActivityIndicator color={theme.colors.textPrimary} size="small" />
              : <Text style={styles.sendIcon}>↑</Text>
            }
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  container: { flex: 1, backgroundColor: theme.colors.background },
  listContent: { paddingBottom: theme.spacing['4'] },
  postSection: {
    padding: theme.spacing['4'],
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  backBtn: { marginBottom: theme.spacing['4'] },
  backText: {
    color: theme.colors.primary,
    fontFamily: theme.typography.fontBodyMedium,
    fontSize: theme.typography.base,
  },
  postHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing['3'],
    marginBottom: theme.spacing['3'],
  },
  postHeaderInfo: {},
  postUsername: {
    fontFamily: theme.typography.fontBodyMedium,
    fontSize: theme.typography.base,
    color: theme.colors.textPrimary,
  },
  postTime: {
    fontFamily: theme.typography.fontBody,
    fontSize: theme.typography.xs,
    color: theme.colors.textMuted,
  },
  postContent: {
    fontFamily: theme.typography.fontBody,
    fontSize: theme.typography.md,
    color: theme.colors.textPrimary,
    lineHeight: theme.typography.md * 1.5,
    marginBottom: theme.spacing['4'],
  },
  postActions: {
    flexDirection: 'row',
    gap: theme.spacing['5'],
    paddingVertical: theme.spacing['3'],
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
    marginBottom: theme.spacing['4'],
  },
  actionBtn: { flexDirection: 'row', alignItems: 'center', gap: theme.spacing['2'] },
  actionIcon: { fontSize: 20 },
  actionCount: {
    fontFamily: theme.typography.fontBodyMedium,
    fontSize: theme.typography.sm,
    color: theme.colors.textMuted,
  },
  likedCount: { color: theme.colors.like },
  commentsHeader: { marginTop: theme.spacing['2'] },
  commentsTitle: {
    fontFamily: theme.typography.fontDisplay,
    fontSize: theme.typography.lg,
    color: theme.colors.textPrimary,
  },
  comment: {
    flexDirection: 'row',
    gap: theme.spacing['3'],
    paddingHorizontal: theme.spacing['4'],
    paddingVertical: theme.spacing['3'],
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  commentBody: { flex: 1 },
  commentUser: {
    fontFamily: theme.typography.fontBodyMedium,
    fontSize: theme.typography.sm,
    color: theme.colors.textPrimary,
    marginBottom: 2,
  },
  commentContent: {
    fontFamily: theme.typography.fontBody,
    fontSize: theme.typography.base,
    color: theme.colors.textPrimary,
    lineHeight: theme.typography.base * 1.5,
  },
  commentMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: theme.spacing['2'],
  },
  commentTime: {
    fontFamily: theme.typography.fontBody,
    fontSize: theme.typography.xs,
    color: theme.colors.textMuted,
  },
  commentLike: { flexDirection: 'row', alignItems: 'center', gap: theme.spacing['1'] },
  commentLikeIcon: { fontSize: 14 },
  commentLikeCount: {
    fontFamily: theme.typography.fontBody,
    fontSize: theme.typography.xs,
    color: theme.colors.textMuted,
  },
  commentLikeCountActive: { color: theme.colors.like },
  loader: { paddingVertical: theme.spacing['8'] },
  noComments: {
    textAlign: 'center',
    color: theme.colors.textMuted,
    fontFamily: theme.typography.fontBody,
    fontSize: theme.typography.base,
    paddingVertical: theme.spacing['8'],
  },
  inputBar: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: theme.spacing['3'],
    padding: theme.spacing['3'],
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
    backgroundColor: theme.colors.background,
  },
  commentInput: {
    flex: 1,
    backgroundColor: theme.colors.card,
    borderRadius: theme.radii.xl,
    paddingHorizontal: theme.spacing['4'],
    paddingVertical: theme.spacing['3'],
    color: theme.colors.textPrimary,
    fontFamily: theme.typography.fontBody,
    fontSize: theme.typography.base,
    maxHeight: 100,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  sendBtn: {
    width: 40,
    height: 40,
    borderRadius: theme.radii.full,
    backgroundColor: theme.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendBtnDisabled: { opacity: 0.4 },
  sendIcon: {
    color: theme.colors.textPrimary,
    fontSize: 18,
    fontFamily: theme.typography.fontDisplay,
  },
});
