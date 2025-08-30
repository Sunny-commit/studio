
'use client';

import Link from 'next/link';
import { BrainCircuit, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Image from 'next/image';

export default function LandingPage() {
  return (
    <div className="flex flex-col">
      <section className="w-full py-20 md:py-32 lg:py-40 bg-gradient-to-br from-primary/10 to-background">
        <div className="container mx-auto grid grid-cols-1 gap-12 lg:grid-cols-2 items-center px-4">
          <div className="flex flex-col justify-center space-y-6">
            <div className="flex items-center gap-3">
              <BrainCircuit className="h-12 w-12 text-primary" />
              <h1 className="font-headline text-5xl font-bold tracking-tighter sm:text-6xl">
                SolveAI
              </h1>
            </div>
            <p className="max-w-xl text-xl text-foreground/80">
              The collaborative platform to find, solve, and share university exam questions. Ace your exams with community-powered solutions and AI assistance.
            </p>
            <div className="flex gap-4">
              <Button asChild size="lg" className="font-bold text-lg px-8 py-6">
                <Link href="/dashboard">
                  Explore Papers
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
          </div>
          <div className="relative flex items-center justify-center">
             <Image 
                src="https://picsum.photos/seed/landing/600/400"
                width={600}
                height={400}
                alt="Students collaborating"
                data-ai-hint="students collaborating"
                className="rounded-xl shadow-2xl aspect-video object-cover"
             />
          </div>
        </div>
      </section>
      
      <section className="w-full py-20 md:py-24">
        <div className="container mx-auto px-4">
            <div className="text-center space-y-4 mb-12">
                <h2 className="font-headline text-4xl font-bold tracking-tighter">Features</h2>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">Everything you need to conquer your exams.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                 <Card>
                    <CardHeader>
                        <CardTitle>Vast Paper Library</CardTitle>
                        <CardDescription>Access a huge, community-contributed repository of past exam papers.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Image src="https://picsum.photos/seed/library/400/250" width={400} height={250} alt="Paper library" data-ai-hint="library books" className="rounded-lg object-cover aspect-video" />
                    </CardContent>
                 </Card>
                 <Card>
                    <CardHeader>
                        <CardTitle>Community Solutions</CardTitle>
                        <CardDescription>Learn from detailed solutions submitted and voted on by fellow students.</CardDescription>
                    </CardHeader>
                     <CardContent>
                        <Image src="https://picsum.photos/seed/community/400/250" width={400} height={250} alt="Community solutions" data-ai-hint="community discussion" className="rounded-lg object-cover aspect-video" />
                    </CardContent>
                 </Card>
                 <Card>
                    <CardHeader>
                        <CardTitle>AI Assistant</CardTitle>
                        <CardDescription>Get unstuck with one-on-one help from a powerful AI tutor, available 24/7.</CardDescription>
                    </CardHeader>
                     <CardContent>
                        <Image src="https://picsum.photos/seed/ai/400/250" width={400} height={250} alt="AI assistant" data-ai-hint="friendly robot" className="rounded-lg object-cover aspect-video" />
                    </CardContent>
                 </Card>
            </div>
        </div>
      </section>

    </div>
  );
}
