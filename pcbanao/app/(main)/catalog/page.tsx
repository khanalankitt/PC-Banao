import { fetchProducts } from "@/lib/api/serverFetch";
import CatalogClient from "./CatalogClient";

export const revalidate = 120;

export default async function CatalogPage() {
  const { products } = await fetchProducts({ limit: "100", page: "1" });
  return <CatalogClient initialProducts={products} />;
}
