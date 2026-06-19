import type { IPostRepository, CreatePostDTO, PaginatedResult, PaginationParams } from '@core/domain/repositories';
import type { Post } from '@core/domain/entities';
import { get, post, del } from '@core/infrastructure/api/apiClient';

export class PostRepository implements IPostRepository {
  async getFeed(params?: PaginationParams): Promise<PaginatedResult<Post>> {
    return get<PaginatedResult<Post>>('/feed', { params });
  }

  async getPostById(postId: number): Promise<Post> {
    return get<Post>(`/posts/${postId}`);
  }

  async getPostsByUser(userId: number, params?: PaginationParams): Promise<PaginatedResult<Post>> {
    return get<PaginatedResult<Post>>(`/users/${userId}/posts`, { params });
  }

  async getPostsByHashtag(tag: string, params?: PaginationParams): Promise<PaginatedResult<Post>> {
    return get<PaginatedResult<Post>>(`/hashtags/${encodeURIComponent(tag)}/posts`, { params });
  }

  async createPost(data: CreatePostDTO): Promise<Post> {
    if (data.mediaFiles?.length) {
      const formData = new FormData();
      formData.append('content', data.content);
      data.hashtags?.forEach((h) => formData.append('hashtags[]', h));
      data.mediaFiles.forEach((f, i) =>
        formData.append('media', { uri: f.uri, type: f.type, name: `media_${i}` } as any),
      );
      return post<Post>('/posts', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
    }
    return post<Post>('/posts', { content: data.content, hashtags: data.hashtags });
  }

  async deletePost(postId: number): Promise<void> {
    await del(`/posts/${postId}`);
  }

  async likePost(postId: number): Promise<void> {
    await post(`/posts/${postId}/like`);
  }

  async unlikePost(postId: number): Promise<void> {
    await del(`/posts/${postId}/like`);
  }

  async getLikedPosts(userId: number, params?: PaginationParams): Promise<PaginatedResult<Post>> {
    return get<PaginatedResult<Post>>(`/users/${userId}/liked`, { params });
  }
}

export const postRepository = new PostRepository();
