declare module 'process' {
  global {
    namespace NodeJS {
      interface ProcessEnv {
        EXPO_PUBLIC_API_URL?: string;
        EXPO_PUBLIC_API_SNAKE_CASE?: string;
      }
    }
  }
}

export {};
