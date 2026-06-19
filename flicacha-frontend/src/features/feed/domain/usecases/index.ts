import type { IPostRepository, PaginationParams, PaginatedResult } from '@core/domain/repositories';
import type { Post } from '@core/domain/entities';

export class GetFeedUseCase {
  constructor(private repo: IPostRepository) {}
  async execute(params?: PaginationParams): Promise<PaginatedResult<Post>> {
    return this.repo.getFeed(params);
  }
}

export class LikePostUseCase {
  constructor(private repo: IPostRepository) {}
  async execute(postId: number, isCurrentlyLiked: boolean): Promise<void> {
    if (isCurrentlyLiked) {
      return this.repo.unlikePost(postId);
    }
    return this.repo.likePost(postId);
  }
}

export class GetPostsByHashtagUseCase {
  constructor(private repo: IPostRepository) {}
  async execute(tag: string, params?: PaginationParams): Promise<PaginatedResult<Post>> {
    const cleanTag = tag.startsWith('#') ? tag.slice(1) : tag;
    return this.repo.getPostsByHashtag(cleanTag, params);
  }
}
