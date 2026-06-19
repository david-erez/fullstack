import type {
  User, Post, Comment, Hashtag, Notification,
  MediaFile, AuthSession, AuthTokens,
} from '../entities';

// ─── Pagination ───────────────────────────────────────────────────────────────
export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
}

// ─── Auth Repository ──────────────────────────────────────────────────────────
export interface IAuthRepository {
  login(email: string, password: string): Promise<AuthSession>;
  register(name: string, email: string, password: string): Promise<AuthSession>;
  logout(): Promise<void>;
  refreshToken(refreshToken: string): Promise<AuthTokens>;
  getStoredSession(): Promise<AuthSession | null>;
  saveSession(session: AuthSession): Promise<void>;
  clearSession(): Promise<void>;
}

// ─── User Repository ──────────────────────────────────────────────────────────
export interface IUserRepository {
  getUserById(userId: number): Promise<User>;
  updateProfile(userId: number, data: Partial<Pick<User, 'name' | 'avatarUrl'>>): Promise<User>;
  searchUsers(query: string, params?: PaginationParams): Promise<PaginatedResult<User>>;
  getFollowers(userId: number, params?: PaginationParams): Promise<PaginatedResult<User>>;
  getFollowing(userId: number, params?: PaginationParams): Promise<PaginatedResult<User>>;
  followUser(targetId: number): Promise<void>;
  unfollowUser(targetId: number): Promise<void>;
  isFollowing(targetId: number): Promise<boolean>;
}

// ─── Post Repository ──────────────────────────────────────────────────────────
export interface CreatePostDTO {
  content: string;
  mediaFiles?: { uri: string; type: string }[];
  hashtags?: string[];
}

export interface IPostRepository {
  getFeed(params?: PaginationParams): Promise<PaginatedResult<Post>>;
  getPostById(postId: number): Promise<Post>;
  getPostsByUser(userId: number, params?: PaginationParams): Promise<PaginatedResult<Post>>;
  getPostsByHashtag(tag: string, params?: PaginationParams): Promise<PaginatedResult<Post>>;
  createPost(data: CreatePostDTO): Promise<Post>;
  deletePost(postId: number): Promise<void>;
  likePost(postId: number): Promise<void>;
  unlikePost(postId: number): Promise<void>;
  getLikedPosts(userId: number, params?: PaginationParams): Promise<PaginatedResult<Post>>;
}

// ─── Comment Repository ───────────────────────────────────────────────────────
export interface ICommentRepository {
  getCommentsByPost(postId: number, params?: PaginationParams): Promise<PaginatedResult<Comment>>;
  createComment(postId: number, content: string): Promise<Comment>;
  deleteComment(commentId: number): Promise<void>;
  likeComment(commentId: number): Promise<void>;
  unlikeComment(commentId: number): Promise<void>;
}

// ─── Notification Repository ──────────────────────────────────────────────────
export interface INotificationRepository {
  getNotifications(params?: PaginationParams): Promise<PaginatedResult<Notification>>;
  markAsRead(notificationId: number): Promise<void>;
  markAllAsRead(): Promise<void>;
  getUnreadCount(): Promise<number>;
}

// ─── Search Repository ────────────────────────────────────────────────────────
export interface ISearchRepository {
  searchPosts(query: string, params?: PaginationParams): Promise<PaginatedResult<Post>>;
  searchUsers(query: string, params?: PaginationParams): Promise<PaginatedResult<User>>;
  searchHashtags(query: string, params?: PaginationParams): Promise<PaginatedResult<Hashtag>>;
  getTrendingHashtags(): Promise<Hashtag[]>;
}
