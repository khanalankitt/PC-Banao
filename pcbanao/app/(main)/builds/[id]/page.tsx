import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { fetchBuildById } from "@/lib/api/serverFetch";
import BuildDetailClient from "./BuildDetailClient";

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const build = await fetchBuildById(id);
  if (!build) return { title: "Build not found" };

  const desc = `$${build.totalPrice.toLocaleString()} · ${build.totalWattage}W · ${build.isCompatible ? "Compatible" : "Has issues"}`;
  return {
    title: build.name,
    description: `${build.name} — ${desc}. Built with PC Banao.`,
    openGraph: {
      title: `${build.name} | PC Banao`,
      description: desc,
    },
  };
}

export default async function BuildDetailPage({ params }: Props) {
  const { id } = await params;
  const build = await fetchBuildById(id);
  if (!build) notFound();
  return <BuildDetailClient rawBuild={build} />;
}
