import React, { useCallback } from 'react';
import {
  View, Text, FlatList, StyleSheet, TouchableOpacity,
  RefreshControl, ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { theme } from '@shared/theme';
import { useNotifications } from '../hooks/useNotifications';
import { Avatar } from '@shared/components/ui/Avatar';
import type { Notification } from '@core/domain/entities';
import { timeAgo } from '@shared/utils/date';

const NOTIF_ICONS: Record<string, string> = {
  like_post: '❤️',
  like_comment: '❤️',
  comment: '💬',
  follow: '👤',
  mention: '@',
};

const NOTIF_LABELS: Record<string, string> = {
  like_post: 'le dio like a tu post',
  like_comment: 'le dio like a tu comentario',
  comment: 'comentó tu post',
  follow: 'empezó a seguirte',
  mention: 'te mencionó',
};

interface Props {
  onNavigateProfile: (userId: number) => void;
  onNavigatePost: (postId: number) => void;
}

export function NotificationsScreen({ onNavigateProfile, onNavigatePost }: Props) {
  const { notifications, loading, unreadCount, error, load, markAsRead, markAllAsRead } = useNotifications();

  const renderItem = useCallback(({ item }: { item: Notification }) => (
    <TouchableOpacity
      style={[styles.item, !item.isRead && styles.itemUnread]}
      onPress={() => {
        markAsRead(item.notificationId);
        if (item.type === 'follow') {
          onNavigateProfile(item.actorId);
        } else {
          onNavigatePost(item.referenceId);
        }
      }}
      activeOpacity={0.75}
    >
      <View style={styles.iconBadge}>
        <Text style={styles.iconText}>{NOTIF_ICONS[item.type] ?? '🔔'}</Text>
      </View>
      <TouchableOpacity onPress={() => onNavigateProfile(item.actorId)}>
        <Avatar uri={item.actor?.avatarUrl} name={item.actor?.name} size={40} />
      </TouchableOpacity>
      <View style={styles.content}>
        <Text style={styles.text}>
          <Text style={styles.actor}>@{item.actor?.name ?? 'alguien'} </Text>
          <Text style={styles.action}>{NOTIF_LABELS[item.type] ?? 'interactuó contigo'}</Text>
        </Text>
        <Text style={styles.time}>{timeAgo(item.createdAt)}</Text>
      </View>
      {!item.isRead && <View style={styles.unreadDot} />}
    </TouchableOpacity>
  ), [markAsRead, onNavigateProfile, onNavigatePost]);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Notificaciones</Text>
          {unreadCount > 0 && (
            <Text style={styles.unreadLabel}>{unreadCount} sin leer</Text>
          )}
        </View>
        {unreadCount > 0 && (
          <TouchableOpacity onPress={markAllAsRead} style={styles.readAllBtn}>
            <Text style={styles.readAllText}>Marcar todas</Text>
          </TouchableOpacity>
        )}
      </View>

      <FlatList
        data={notifications}
        renderItem={renderItem}
        keyExtractor={(item) => String(item.notificationId)}
        refreshControl={
          <RefreshControl
            refreshing={loading}
            onRefresh={load}
            tintColor={theme.colors.primary}
          />
        }
        ListEmptyComponent={
          loading
            ? <ActivityIndicator color={theme.colors.primary} style={styles.loader} />
            : <View style={styles.empty}>
                <Text style={styles.emptyIcon}>🔔</Text>
                <Text style={styles.emptyText}>Sin notificaciones</Text>
              </View>
        }
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    paddingHorizontal: theme.spacing['4'],
    paddingVertical: theme.spacing['4'],
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  title: {
    fontFamily: theme.typography.fontDisplay,
    fontSize: theme.typography.xl,
    color: theme.colors.textPrimary,
    letterSpacing: -0.5,
  },
  unreadLabel: {
    fontFamily: theme.typography.fontBody,
    fontSize: theme.typography.xs,
    color: theme.colors.primary,
    marginTop: 2,
  },
  readAllBtn: {},
  readAllText: {
    fontFamily: theme.typography.fontBodyMedium,
    fontSize: theme.typography.sm,
    color: theme.colors.primary,
  },
  listContent: { paddingBottom: theme.spacing['16'] },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing['3'],
    paddingHorizontal: theme.spacing['4'],
    paddingVertical: theme.spacing['4'],
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
    position: 'relative',
  },
  itemUnread: {
    backgroundColor: 'rgba(255,69,0,0.04)',
  },
  iconBadge: {
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconText: { fontSize: 14 },
  content: { flex: 1 },
  text: {
    fontFamily: theme.typography.fontBody,
    fontSize: theme.typography.sm,
    color: theme.colors.textPrimary,
    flexShrink: 1,
  },
  actor: { fontFamily: theme.typography.fontBodyMedium },
  action: {},
  time: {
    fontFamily: theme.typography.fontBody,
    fontSize: theme.typography.xs,
    color: theme.colors.textMuted,
    marginTop: 2,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: theme.radii.full,
    backgroundColor: theme.colors.primary,
  },
  loader: { paddingVertical: theme.spacing['8'] },
  empty: {
    alignItems: 'center',
    paddingVertical: theme.spacing['16'],
  },
  emptyIcon: { fontSize: 40, marginBottom: theme.spacing['3'] },
  emptyText: {
    fontFamily: theme.typography.fontBody,
    fontSize: theme.typography.base,
    color: theme.colors.textMuted,
  },
});
