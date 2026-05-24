import axios, { AxiosRequestConfig } from 'axios';
import { getSession } from 'next-auth/react';

interface RetryableConfig extends AxiosRequestConfig {
  _retried?: boolean;
}

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_URL ?? 'http://localhost:5000',
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use(async (config) => {
  const session = await getSession();
  if (session?.backendToken) {
    config.headers.Authorization = `Bearer ${session.backendToken}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error: { response?: { status?: number }; config?: RetryableConfig }) => {
    // On 401 with a stale token, force a fresh session fetch and retry once.
    if (error?.response?.status === 401 && !error?.config?._retried) {
      const cfg = error.config as RetryableConfig;
      cfg._retried = true;
      const session = await getSession();
      if (session?.backendToken) {
        cfg.headers = { ...cfg.headers, Authorization: `Bearer ${session.backendToken}` };
        return api.request(cfg);
      }
    }
    return Promise.reject(error);
  },
);

export default api;
