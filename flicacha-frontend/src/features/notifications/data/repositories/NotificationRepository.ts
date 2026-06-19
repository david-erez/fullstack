import type { INotificationRepository, PaginatedResult, PaginationParams } from '@core/domain/repositories';
import type { Notification } from '@core/domain/entities';
import { get, patch, post } from '@core/infrastructure/api/apiClient';

export class NotificationRepository implements INotificationRepository {
  async getNotifications(params?: PaginationParams): Promise<PaginatedResult<Notification>> {
    return get<PaginatedResult<Notification>>('/notifications', { params });
  }

  async markAsRead(notificationId: number): Promise<void> {
    await patch(`/notifications/${notificationId}/read`);
  }

  async markAllAsRead(): Promise<void> {
    await patch('/notifications/read-all');
  }

  async getUnreadCount(): Promise<number> {
    const res = await get<{ count: number }>('/notifications/unread-count');
    return res.count;
  }
}

export const notificationRepository = new NotificationRepository();
