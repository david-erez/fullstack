import { useState, useEffect, useCallback } from 'react';
import type { Notification } from '@core/domain/entities';
import { notificationRepository } from '../../data/repositories/NotificationRepository';

export function useNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [res, count] = await Promise.all([
        notificationRepository.getNotifications({ page: 1, limit: 30 }),
        notificationRepository.getUnreadCount(),
      ]);
      setNotifications(res.data);
      setUnreadCount(count);
    } catch (e: any) {
      setError(e?.message ?? 'Error al cargar notificaciones');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, []);

  const markAsRead = useCallback(async (id: number) => {
    setNotifications((prev) =>
      prev.map((n) => (n.notificationId === id ? { ...n, isRead: true } : n)),
    );
    setUnreadCount((c) => Math.max(0, c - 1));
    await notificationRepository.markAsRead(id).catch(() => {});
  }, []);

  const markAllAsRead = useCallback(async () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    setUnreadCount(0);
    await notificationRepository.markAllAsRead().catch(() => {});
  }, []);

  return { notifications, loading, unreadCount, error, load, markAsRead, markAllAsRead };
}
