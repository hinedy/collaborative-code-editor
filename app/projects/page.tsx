import { ProjectList } from "@/components/project/project-list";
import { requireAuth } from "@/lib/auth";

export default async function ProjectsPage() {
  await requireAuth();

  return <ProjectList />;
}
