import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { CreateProjectForm } from "@/components/create-project-form";
import { SiteHeader } from "@/components/site-header";
import { authOptions } from "@/lib/auth";

export default async function CreateProjectPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) redirect("/login?callbackUrl=%2Fcreate%2Fproject");
  return <><SiteHeader app /><main className="centered-page"><CreateProjectForm /></main></>;
}
