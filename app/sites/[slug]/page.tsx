import { notFound } from "next/navigation";
import { SitePreview } from "@/components/site-preview";
import { getPublishedProject } from "@/lib/projects";

export const dynamic = "force-dynamic";

export default async function PublishedSitePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = await getPublishedProject(slug);
  if (!project?.generatedSite) notFound();
  return <SitePreview site={project.generatedSite} />;
}
