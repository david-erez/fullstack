import type { ISearchRepository, PaginatedResult, PaginationParams } from '@core/domain/repositories';
import type { Post, User, Hashtag } from '@core/domain/entities';
import { get } from '@core/infrastructure/api/apiClient';

export class SearchRepository implements ISearchRepository {
  async searchPosts(query: string, params?: PaginationParams): Promise<PaginatedResult<Post>> {
    return get<PaginatedResult<Post>>('/search/posts', { params: { q: query, ...params } });
  }

  async searchUsers(query: string, params?: PaginationParams): Promise<PaginatedResult<User>> {
    return get<PaginatedResult<User>>('/search/users', { params: { q: query, ...params } });
  }

  async searchHashtags(query: string, params?: PaginationParams): Promise<PaginatedResult<Hashtag>> {
    return get<PaginatedResult<Hashtag>>('/search/hashtags', { params: { q: query, ...params } });
  }

  async getTrendingHashtags(): Promise<Hashtag[]> {
    return get<Hashtag[]>('/hashtags/trending');
  }
}

export const searchRepository = new SearchRepository();
