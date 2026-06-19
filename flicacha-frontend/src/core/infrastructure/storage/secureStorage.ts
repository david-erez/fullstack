import * as SecureStore from 'expo-secure-store';

const KEYS = {
  ACCESS_TOKEN: 'flicacha_access_token',
  REFRESH_TOKEN: 'flicacha_refresh_token',
  USER_DATA: 'flicacha_user',
} as const;

export const secureStorage = {
  async setTokens(access: string, refresh: string) {
    await SecureStore.setItemAsync(KEYS.ACCESS_TOKEN, access);
    await SecureStore.setItemAsync(KEYS.REFRESH_TOKEN, refresh);
  },
  async getAccessToken(): Promise<string | null> {
    return SecureStore.getItemAsync(KEYS.ACCESS_TOKEN);
  },
  async getRefreshToken(): Promise<string | null> {
    return SecureStore.getItemAsync(KEYS.REFRESH_TOKEN);
  },
  async setUser(user: object) {
    await SecureStore.setItemAsync(KEYS.USER_DATA, JSON.stringify(user));
  },
  async getUser<T>(): Promise<T | null> {
    const raw = await SecureStore.getItemAsync(KEYS.USER_DATA);
    if (!raw) return null;
    return JSON.parse(raw) as T;
  },
  async clearAll() {
    await SecureStore.deleteItemAsync(KEYS.ACCESS_TOKEN);
    await SecureStore.deleteItemAsync(KEYS.REFRESH_TOKEN);
    await SecureStore.deleteItemAsync(KEYS.USER_DATA);
  },
};
