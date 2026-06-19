import type { IUserRepository, PaginatedResult, PaginationParams } from '@core/domain/repositories';
import type { User } from '@core/domain/entities';
import { get, patch, post, del } from '@core/infrastructure/api/apiClient';

export class UserRepository implements IUserRepository {
  async getUserById(userId: number): Promise<User> {
    return get<User>(`/users/${userId}`);
  }

  async updateProfile(userId: number, data: Partial<Pick<User, 'name' | 'avatarUrl'>>): Promise<User> {
    return patch<User>(`/users/${userId}`, data);
  }

  async searchUsers(query: string, params?: PaginationParams): Promise<PaginatedResult<User>> {
    return get<PaginatedResult<User>>('/users/search', { params: { q: query, ...params } });
  }

  async getFollowers(userId: number, params?: PaginationParams): Promise<PaginatedResult<User>> {
    return get<PaginatedResult<User>>(`/users/${userId}/followers`, { params });
  }

  async getFollowing(userId: number, params?: PaginationParams): Promise<PaginatedResult<User>> {
    return get<PaginatedResult<User>>(`/users/${userId}/following`, { params });
  }

  async followUser(targetId: number): Promise<void> {
    await post(`/users/${targetId}/follow`);
  }

  async unfollowUser(targetId: number): Promise<void> {
    await del(`/users/${targetId}/follow`);
  }

  async isFollowing(targetId: number): Promise<boolean> {
    const res = await get<{ isFollowing: boolean }>(`/users/${targetId}/is-following`);
    return res.isFollowing;
  }
}

export const userRepository = new UserRepository();
