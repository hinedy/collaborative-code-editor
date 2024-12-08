import { Button } from "@/components/ui/button";
import { CodeIcon } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-background p-24">
      <div className="z-10 w-full max-w-5xl flex-col items-center justify-center gap-8 font-mono text-sm lg:flex">
        <div className="flex items-center justify-center gap-4">
          <CodeIcon className="h-12 w-12" />
          <h1 className="text-4xl font-bold">Collaborative Code Editor</h1>
        </div>

        <p className="max-w-2xl text-center text-lg text-muted-foreground">
          A real-time collaborative code editor with support for multiple
          programming languages, syntax highlighting, and live collaboration
          features.
        </p>

        <div className="mt-8 flex gap-4">
          <Button asChild size="lg">
            <Link href="/editor">Start Coding</Link>
          </Button>
          <Button variant="outline" size="lg" asChild>
            <Link href="/docs">Documentation</Link>
          </Button>
        </div>
      </div>
    </main>
  );
}
