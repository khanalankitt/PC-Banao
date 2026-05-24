import axios, { AxiosRequestConfig } from 'axios';
import { getSession } from 'next-auth/react';

interface RetryableConfig extends AxiosRequestConfig {
  _retried?: boolean;
}

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_URL ?? 'http://localhost:5000',
  headers: { 'Content-Type': 'application/json' },
});

// Cache the session in memory for 30 seconds to avoid a round-trip to
// /api/auth/session before every single API call.
let cachedToken: string | null = null;
let cacheExpiresAt = 0;

async function getToken(): Promise<string | null> {
  if (cachedToken && Date.now() < cacheExpiresAt) return cachedToken;
  const session = await getSession();
  cachedToken = session?.backendToken ?? null;
  cacheExpiresAt = Date.now() + 30_000;
  return cachedToken;
}

export function invalidateTokenCache() {
  cachedToken = null;
  cacheExpiresAt = 0;
}

api.interceptors.request.use(async (config) => {
  const token = await getToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error: { response?: { status?: number }; config?: RetryableConfig }) => {
    if (error?.response?.status === 401 && !error?.config?._retried) {
      const cfg = error.config as RetryableConfig;
      cfg._retried = true;
      // Force a fresh session fetch, bypassing the cache
      invalidateTokenCache();
      const token = await getToken();
      if (token) {
        cfg.headers = { ...cfg.headers, Authorization: `Bearer ${token}` };
        return api.request(cfg);
      }
    }
    return Promise.reject(error);
  },
);

export default api;
