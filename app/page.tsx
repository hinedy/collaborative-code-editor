import { Button } from '@/components/ui/button'
import { CodeIcon } from 'lucide-react'
import Link from 'next/link'

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-background">
      <div className="z-10 max-w-5xl w-full items-center justify-center font-mono text-sm lg:flex flex-col gap-8">
        <div className="flex items-center justify-center gap-4">
          <CodeIcon className="h-12 w-12" />
          <h1 className="text-4xl font-bold">Collaborative Code Editor</h1>
        </div>
        
        <p className="text-center text-lg text-muted-foreground max-w-2xl">
          A real-time collaborative code editor with support for multiple programming languages,
          syntax highlighting, and live collaboration features.
        </p>

        <div className="flex gap-4 mt-8">
          <Button asChild size="lg">
            <Link href="/editor">Start Coding</Link>
          </Button>
          <Button variant="outline" size="lg" asChild>
            <Link href="/docs">Documentation</Link>
          </Button>
        </div>
      </div>
    </main>
  )
}