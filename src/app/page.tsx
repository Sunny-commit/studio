import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BrainCircuit } from 'lucide-react';

export default function SignInPage() {
  return (
    <div className="flex min-h-[calc(100vh-10rem)] w-full items-center justify-center p-4">
      <div className="grid grid-cols-1 gap-16 lg:grid-cols-2">
        <div className="flex flex-col justify-center space-y-6">
          <div className="flex items-center gap-3">
            <BrainCircuit className="h-10 w-10 text-primary" />
            <h1 className="font-headline text-4xl font-bold tracking-tighter">
              SolveAI
            </h1>
          </div>
          <p className="max-w-md text-xl text-foreground/80">
            The collaborative platform to find, solve, and share university exam questions. Ace your exams with community-powered solutions.
          </p>
          <div className="flex gap-4">
            <Button asChild size="lg" className="font-bold">
              <Link href="/dashboard">Get Started</Link>
            </Button>
            <Button asChild size="lg" variant="secondary" className="font-bold">
              <Link href="#learn-more">Learn More</Link>
            </Button>
          </div>
        </div>

        <div className="relative flex items-center justify-center">
            <div className="absolute -inset-2 rounded-lg bg-gradient-to-r from-primary to-accent opacity-75 blur"></div>
            <Card className="relative w-full max-w-sm">
              <CardHeader className="text-center">
                <CardTitle className="font-headline text-2xl">Welcome Back!</CardTitle>
                <CardDescription>Sign in to continue your journey.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col space-y-4">
                  <Button variant="outline" asChild>
                    <Link href="/dashboard">
                      <svg role="img" viewBox="0 0 24 24" className="mr-2 h-4 w-4">
                        <path
                          fill="currentColor"
                          d="M12.48 10.92v3.28h7.84c-.24 1.84-.85 3.18-1.73 4.1-1.02 1.02-2.3 1.62-3.9 1.62-3.03 0-5.49-2.3-5.49-5.22s2.46-5.22 5.49-5.22c1.39 0 2.53.54 3.44 1.45l2.5-2.5C16.16 3.57 14.09 3 12.48 3c-4.97 0-9 3.88-9 8.7s4.03 8.7 9 8.7c2.53 0 4.46-.8 6.04-2.43 1.64-1.64 2.04-4.03 2.04-6.69 0-.61-.05-1.21-.16-1.8z"
                        ></path>
                      </svg>
                      Sign in with Google
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
        </div>
      </div>
    </div>
  );
}
