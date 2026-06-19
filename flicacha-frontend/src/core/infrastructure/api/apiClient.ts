import axios, { AxiosInstance, AxiosRequestConfig, InternalAxiosRequestConfig } from 'axios';
import { keysToCamel, keysToSnake } from '../mappers/caseMapper';

// ─── Config ───────────────────────────────────────────────────────────────────
export const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost:3000/api/v1';

/**
 * Si el backend del compañero responde en snake_case (tal como está el MER:
 * user_id, post_id, created_at...), activa esta bandera para que el cliente
 * convierta automáticamente las respuestas a camelCase y las peticiones de
 * vuelta a snake_case. Si el backend ya normaliza a camelCase, déjala en false.
 */
export const AUTO_CASE_MAPPING = process.env.EXPO_PUBLIC_API_SNAKE_CASE === 'true';

// ─── Token manager interface (injected to avoid circular deps) ────────────────
let _getToken: (() => string | null) | null = null;
let _onUnauthorized: (() => void) | null = null;

export function configureApiClient(opts: {
  getToken: () => string | null;
  onUnauthorized: () => void;
}) {
  _getToken = opts.getToken;
  _onUnauthorized = opts.onUnauthorized;
}

// ─── Axios instance ───────────────────────────────────────────────────────────
export const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15_000,
  headers: { 'Content-Type': 'application/json' },
});

// Request interceptor: attach auth token + optional camelCase->snake_case
apiClient.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  if (_getToken) {
    const token = _getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  if (AUTO_CASE_MAPPING && config.data && !(config.data instanceof FormData)) {
    config.data = keysToSnake(config.data);
  }
  return config;
});

// Response interceptor: handle 401 + optional snake_case->camelCase
apiClient.interceptors.response.use(
  (res) => {
    if (AUTO_CASE_MAPPING && res.data) {
      res.data = keysToCamel(res.data);
    }
    return res;
  },
  (error) => {
    if (error.response?.status === 401 && _onUnauthorized) {
      _onUnauthorized();
    }
    return Promise.reject(error);
  },
);

// ─── Generic request helpers ──────────────────────────────────────────────────
export async function get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
  const res = await apiClient.get<T>(url, config);
  return res.data;
}

export async function post<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
  const res = await apiClient.post<T>(url, data, config);
  return res.data;
}

export async function put<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
  const res = await apiClient.put<T>(url, data, config);
  return res.data;
}

export async function patch<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
  const res = await apiClient.patch<T>(url, data, config);
  return res.data;
}

export async function del<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
  const res = await apiClient.delete<T>(url, config);
  return res.data;
}
