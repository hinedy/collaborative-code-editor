"use client";

import { useEditorStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CreateProjectDialog } from "./create-project-dialog";
import { formatDistanceToNow } from "date-fns";
import { Trash2, Users } from "lucide-react";
import Link from "next/link";

export function ProjectList() {
  const { projects, deleteProject } = useEditorStore();

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Your Projects</h1>
        <CreateProjectDialog />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project) => (
          <Card key={project.id}>
            <CardHeader>
              <CardTitle>{project.name}</CardTitle>
              <CardDescription>
                {project.description || "No description provided"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Last updated {formatDistanceToNow(project.updatedAt)} ago
              </p>
              <div className="flex items-center gap-2 mt-2">
                <Users className="h-4 w-4" />
                <span className="text-sm">{project.files.length} files</span>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button asChild>
                <Link href={`/editor/${project.id}`}>Open Project</Link>
              </Button>
              <Button
                variant="destructive"
                size="icon"
                onClick={() => deleteProject(project.id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
