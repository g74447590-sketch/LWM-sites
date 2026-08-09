import type { Metadata } from "next";
import { cache } from "react";
import { notFound } from "next/navigation";
import { SitePreview } from "@/components/site-preview";
import { getPublishedProject } from "@/lib/projects";

export const dynamic = "force-dynamic";

const getCachedPublishedProject = cache(getPublishedProject);

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const project = await getCachedPublishedProject(slug);
  if (!project?.generatedSite) return { title: "Site não encontrado", robots: { index: false, follow: false } };
  const site = project.generatedSite;
  const title = site.seoTitle || site.businessName;
  const description = site.seoDescription || site.heroBody;
  const image = site.sections.find((section) => !section.hidden && section.imageUrl)?.imageUrl;
  return {
    title,
    description,
    openGraph: { title, description, type: "website", ...(image ? { images: [{ url: image }] } : {}) },
    twitter: { card: image ? "summary_large_image" : "summary", title, description, ...(image ? { images: [image] } : {}) },
  };
}

export default async function PublishedSitePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = await getCachedPublishedProject(slug);
  if (!project?.generatedSite) notFound();
  return <SitePreview site={project.generatedSite} />;
}
