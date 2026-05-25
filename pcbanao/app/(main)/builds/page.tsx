import { fetchPublicBuilds } from "@/lib/api/serverFetch";
import BuildsClient from "./BuildsClient";

export const revalidate = 60;

export default async function BuildsPage() {
  const { builds, total } = await fetchPublicBuilds(1, 20);
  return <BuildsClient initialBuilds={builds} initialTotal={total} />;
}
