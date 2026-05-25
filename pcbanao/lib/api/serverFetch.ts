/**
 * Server-only fetch helpers that call the backend directly.
 * Never import this from a 'use client' file.
 */

const BACKEND = process.env.NEXT_PUBLIC_BACKEND_URL ?? "http://localhost:5000";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function serverGet<T = any>(path: string, revalidate: number | false = 60): Promise<T | null> {
  try {
    const res = await fetch(`${BACKEND}${path}`, {
      next: revalidate === false ? { revalidate: 0 } : { revalidate },
      headers: { "Content-Type": "application/json" },
    });
    if (!res.ok) return null;
    const json = await res.json();
    return json?.success ? (json.data as T) : null;
  } catch {
    return null;
  }
}

// ─── Public builds ─────────────────────────────────────────────────────────────

export interface RawBuild {
  _id: string;
  name: string;
  user: { _id: string; name: string; image?: string };
  components: Record<string, unknown>;
  totalPrice: number;
  totalWattage: number;
  isPublic: boolean;
  isCompatible: boolean;
  compatibilityIssues: string[];
  createdAt: string;
}

export async function fetchPublicBuilds(
  page = 1,
  limit = 20,
): Promise<{ builds: RawBuild[]; total: number }> {
  const data = await serverGet<{ builds: RawBuild[]; total: number }>(
    `/api/builds/public?page=${page}&limit=${limit}`,
    60, // revalidate every 60 s
  );
  return data ?? { builds: [], total: 0 };
}

export async function fetchBuildById(id: string): Promise<RawBuild | null> {
  return serverGet<RawBuild>(`/api/builds/${id}`, 30);
}

// ─── Products ─────────────────────────────────────────────────────────────────

export interface RawProduct {
  _id: string;
  name: string;
  brand: string;
  category: string;
  price: number;
  stock: number;
  image?: string;
  wattage?: number;
  specs: Record<string, unknown>;
}

export async function fetchProducts(params?: Record<string, string>): Promise<{ products: RawProduct[]; total: number }> {
  const qs = params ? "?" + new URLSearchParams(params).toString() : "";
  const data = await serverGet<{ products: RawProduct[]; total: number }>(
    `/api/products${qs}`,
    120, // revalidate every 2 min
  );
  return data ?? { products: [], total: 0 };
}
