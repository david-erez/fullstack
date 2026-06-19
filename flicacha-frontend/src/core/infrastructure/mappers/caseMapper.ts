/**
 * El MER (mer.puml) define columnas en snake_case (user_id, post_id, created_at...).
 * El frontend trabaja en camelCase (userId, postId, createdAt...) por convención de TS/RN.
 * Estos helpers permiten convertir automáticamente las respuestas del backend
 * sin tener que tocar cada repositorio manualmente.
 *
 * Si el backend ya devuelve camelCase, estos mappers no son necesarios:
 * basta no usarlos. Se exponen como utilidad para integrarlos en el apiClient
 * (interceptor de response) si el compañero de backend expone snake_case crudo.
 */

type AnyObj = Record<string, any>;

function snakeToCamel(key: string): string {
  return key.replace(/_([a-z0-9])/g, (_, c) => c.toUpperCase());
}

function camelToSnake(key: string): string {
  return key.replace(/[A-Z]/g, (c) => `_${c.toLowerCase()}`);
}

export function keysToCamel<T = any>(input: unknown): T {
  if (Array.isArray(input)) {
    return input.map((item) => keysToCamel(item)) as unknown as T;
  }
  if (input !== null && typeof input === 'object' && !(input instanceof Date)) {
    const result: AnyObj = {};
    for (const [key, value] of Object.entries(input as AnyObj)) {
      result[snakeToCamel(key)] = keysToCamel(value);
    }
    return result as T;
  }
  return input as T;
}

export function keysToSnake<T = any>(input: unknown): T {
  if (Array.isArray(input)) {
    return input.map((item) => keysToSnake(item)) as unknown as T;
  }
  if (input !== null && typeof input === 'object' && !(input instanceof Date)) {
    const result: AnyObj = {};
    for (const [key, value] of Object.entries(input as AnyObj)) {
      result[camelToSnake(key)] = keysToSnake(value);
    }
    return result as T;
  }
  return input as T;
}
