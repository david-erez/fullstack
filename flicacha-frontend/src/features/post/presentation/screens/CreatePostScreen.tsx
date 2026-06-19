import React, { useState, useRef } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  ScrollView, KeyboardAvoidingView, Platform, Image,
  ActivityIndicator, Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';
import { theme } from '@shared/theme';
import { postRepository } from '@features/feed/data/repositories/PostRepository';
import type { Post } from '@core/domain/entities';
import { Avatar } from '@shared/components/ui/Avatar';
import { useAuthStore } from '@features/auth/presentation/hooks/useAuthStore';

const MAX_CHARS = 280;

interface Props {
  onBack: () => void;
  onSuccess: (post: Post) => void;
}

export function CreatePostScreen({ onBack, onSuccess }: Props) {
  const user = useAuthStore((s) => s.user);
  const [content, setContent] = useState('');
  const [media, setMedia] = useState<{ uri: string; type: string }[]>([]);
  const [loading, setLoading] = useState(false);

  const remaining = MAX_CHARS - content.length;
  const isOverLimit = remaining < 0;

  const pickMedia = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permiso requerido', 'Necesitamos acceso a tu galería');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsMultipleSelection: true,
      quality: 0.85,
      selectionLimit: 4,
    });
    if (!result.canceled) {
      const picked = result.assets.map((a) => ({
        uri: a.uri,
        type: a.type === 'video' ? 'video/mp4' : 'image/jpeg',
      }));
      setMedia((prev) => [...prev, ...picked].slice(0, 4));
    }
  };

  const removeMedia = (index: number) => {
    setMedia((prev) => prev.filter((_, i) => i !== index));
  };

  // Extract hashtags from content
  const extractHashtags = (text: string): string[] => {
    const matches = text.match(/#(\w+)/g) ?? [];
    return matches.map((h) => h.slice(1));
  };

  const handlePost = async () => {
    if (!content.trim() || isOverLimit) return;
    setLoading(true);
    try {
      const newPost = await postRepository.createPost({
        content: content.trim(),
        mediaFiles: media,
        hashtags: extractHashtags(content),
      });
      onSuccess(newPost);
    } catch (e: any) {
      Alert.alert('Error', e?.response?.data?.message ?? 'No se pudo publicar');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        {/* Top bar */}
        <View style={styles.topBar}>
          <TouchableOpacity onPress={onBack} style={styles.cancelBtn}>
            <Text style={styles.cancelText}>Cancelar</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.postBtn, (isOverLimit || !content.trim()) && styles.postBtnDisabled]}
            onPress={handlePost}
            disabled={isOverLimit || !content.trim() || loading}
          >
            {loading ? (
              <ActivityIndicator color={theme.colors.textPrimary} size="small" />
            ) : (
              <Text style={styles.postBtnText}>Publicar</Text>
            )}
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.scroll} keyboardShouldPersistTaps="handled">
          <View style={styles.composerRow}>
            <Avatar uri={user?.avatarUrl} name={user?.name} size={44} />
            <TextInput
              style={styles.input}
              multiline
              placeholder="¿Qué está pasando?"
              placeholderTextColor={theme.colors.textMuted}
              value={content}
              onChangeText={setContent}
              autoFocus
              maxLength={MAX_CHARS + 50}
              textAlignVertical="top"
            />
          </View>

          {/* Media preview */}
          {media.length > 0 && (
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.mediaRow}>
              {media.map((m, i) => (
                <View key={i} style={styles.mediaThumb}>
                  <Image source={{ uri: m.uri }} style={styles.mediaImage} />
                  <TouchableOpacity
                    style={styles.removeMedia}
                    onPress={() => removeMedia(i)}
                  >
                    <Text style={styles.removeMediaText}>✕</Text>
                  </TouchableOpacity>
                </View>
              ))}
            </ScrollView>
          )}
        </ScrollView>

        {/* Bottom toolbar */}
        <View style={styles.toolbar}>
          <TouchableOpacity
            onPress={pickMedia}
            style={styles.toolbarBtn}
            disabled={media.length >= 4}
          >
            <Text style={[styles.toolbarIcon, media.length >= 4 && styles.toolbarIconDisabled]}>
              🖼
            </Text>
          </TouchableOpacity>

          <View style={styles.charCountWrap}>
            <Text style={[styles.charCount, isOverLimit && styles.charCountOver]}>
              {remaining}
            </Text>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: theme.spacing['4'],
    paddingVertical: theme.spacing['3'],
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  cancelBtn: { padding: theme.spacing['2'] },
  cancelText: {
    fontFamily: theme.typography.fontBody,
    fontSize: theme.typography.base,
    color: theme.colors.textSecondary,
  },
  postBtn: {
    backgroundColor: theme.colors.primary,
    borderRadius: theme.radii.full,
    paddingHorizontal: theme.spacing['5'],
    paddingVertical: theme.spacing['2'],
    minWidth: 80,
    alignItems: 'center',
  },
  postBtnDisabled: { opacity: 0.4 },
  postBtnText: {
    fontFamily: theme.typography.fontDisplay,
    fontSize: theme.typography.sm,
    color: theme.colors.textPrimary,
  },
  scroll: { flex: 1 },
  composerRow: {
    flexDirection: 'row',
    gap: theme.spacing['3'],
    padding: theme.spacing['4'],
    alignItems: 'flex-start',
  },
  input: {
    flex: 1,
    fontFamily: theme.typography.fontBody,
    fontSize: theme.typography.md,
    color: theme.colors.textPrimary,
    minHeight: 120,
    lineHeight: theme.typography.md * 1.5,
  },
  mediaRow: {
    paddingHorizontal: theme.spacing['4'],
    marginBottom: theme.spacing['4'],
  },
  mediaThumb: {
    width: 100,
    height: 100,
    borderRadius: theme.radii.md,
    marginRight: theme.spacing['2'],
    overflow: 'visible',
  },
  mediaImage: {
    width: 100,
    height: 100,
    borderRadius: theme.radii.md,
  },
  removeMedia: {
    position: 'absolute',
    top: -8,
    right: -8,
    width: 22,
    height: 22,
    borderRadius: theme.radii.full,
    backgroundColor: theme.colors.elevated,
    borderWidth: 1,
    borderColor: theme.colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  removeMediaText: {
    color: theme.colors.textSecondary,
    fontSize: 10,
    fontFamily: theme.typography.fontBodyMedium,
  },
  toolbar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: theme.spacing['4'],
    paddingVertical: theme.spacing['3'],
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
    justifyContent: 'space-between',
  },
  toolbarBtn: { padding: theme.spacing['2'] },
  toolbarIcon: { fontSize: 22 },
  toolbarIconDisabled: { opacity: 0.3 },
  charCountWrap: {},
  charCount: {
    fontFamily: theme.typography.fontBodyMedium,
    fontSize: theme.typography.sm,
    color: theme.colors.textMuted,
  },
  charCountOver: { color: theme.colors.error },
});
