// ─── User Entity ──────────────────────────────────────────────────────────────
export interface User {
  userId: number;
  name: string;
  email: string;
  avatarUrl: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  // computed/joined fields
  followersCount?: number;
  followingCount?: number;
  postsCount?: number;
  isFollowing?: boolean;
}

// ─── Post Entity ──────────────────────────────────────────────────────────────
export interface Post {
  postId: number;
  userId: number;
  content: string;
  isVisible: boolean;
  createdAt: string;
  updatedAt: string;
  // joined
  user?: User;
  media?: MediaFile[];
  hashtags?: Hashtag[];
  likesCount?: number;
  commentsCount?: number;
  isLiked?: boolean;
}

// ─── Comment Entity ───────────────────────────────────────────────────────────
export interface Comment {
  commentId: number;
  postId: number;
  userId: number;
  content: string;
  createdAt: string;
  // joined
  user?: User;
  likesCount?: number;
  isLiked?: boolean;
}

// ─── Hashtag Entity ───────────────────────────────────────────────────────────
export interface Hashtag {
  hashtagId: number;
  tag: string;
  createdAt: string;
  // computed
  postsCount?: number;
}

// ─── Notification Entity ──────────────────────────────────────────────────────
export type NotificationType = 'like_post' | 'like_comment' | 'comment' | 'follow' | 'mention';

export interface Notification {
  notificationId: number;
  userId: number;
  actorId: number;
  type: NotificationType;
  referenceId: number;
  isRead: boolean;
  createdAt: string;
  // joined
  actor?: User;
}

// ─── MediaFile Entity ─────────────────────────────────────────────────────────
export type MediaType = 'image' | 'video' | 'gif';

export interface MediaFile {
  mediaId: number;
  postId: number;
  url: string;
  mediaType: MediaType;
  createdAt: string;
}

// ─── PostLike Entity ──────────────────────────────────────────────────────────
export interface PostLike {
  userId: number;
  postId: number;
  createdAt: string;
}

// ─── CommentLike Entity ───────────────────────────────────────────────────────
export interface CommentLike {
  userId: number;
  commentId: number;
  createdAt: string;
}

// ─── UserFollow Entity ────────────────────────────────────────────────────────
export interface UserFollow {
  followerId: number;
  followingId: number;
  createdAt: string;
}

// ─── Auth Entities ────────────────────────────────────────────────────────────
export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface AuthSession {
  user: User;
  tokens: AuthTokens;
}
