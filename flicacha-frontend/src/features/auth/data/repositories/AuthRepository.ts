import type { IAuthRepository } from '@core/domain/repositories';
import type { AuthSession, AuthTokens } from '@core/domain/entities';
import { post } from '@core/infrastructure/api/apiClient';
import { secureStorage } from '@core/infrastructure/storage/secureStorage';

export class AuthRepository implements IAuthRepository {
  async login(email: string, password: string): Promise<AuthSession> {
    return post<AuthSession>('/auth/login', { email, password });
  }

  async register(name: string, email: string, password: string): Promise<AuthSession> {
    return post<AuthSession>('/auth/register', { name, email, password });
  }

  async logout(): Promise<void> {
    await post('/auth/logout').catch(() => {});
  }

  async refreshToken(refreshToken: string): Promise<AuthTokens> {
    return post<AuthTokens>('/auth/refresh', { refreshToken });
  }

  async getStoredSession(): Promise<AuthSession | null> {
    const [accessToken, refreshToken, user] = await Promise.all([
      secureStorage.getAccessToken(),
      secureStorage.getRefreshToken(),
      secureStorage.getUser(),
    ]);
    if (!accessToken || !refreshToken || !user) return null;
    return { tokens: { accessToken, refreshToken }, user: user as any };
  }

  async saveSession(session: AuthSession): Promise<void> {
    await secureStorage.setTokens(session.tokens.accessToken, session.tokens.refreshToken);
    await secureStorage.setUser(session.user);
  }

  async clearSession(): Promise<void> {
    await secureStorage.clearAll();
  }
}

export const authRepository = new AuthRepository();
