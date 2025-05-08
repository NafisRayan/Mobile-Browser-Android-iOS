declare global {
  namespace NodeJS {
    interface ProcessEnv {
      EXPO_PUBLIC_DEFAULT_SEARCH_ENGINE: string;
      EXPO_PUBLIC_FILTER_LIST_URL: string;
    }
  }
}

// Ensure this file is treated as a module
export {};