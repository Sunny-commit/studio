'use client';

import Link from 'next/link';
import { BrainCircuit, Menu, FileUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from '@/components/ui/sheet';
import { usePathname } from 'next/navigation';

export default function Header() {
  const pathname = usePathname();

  const navLinks = [
    { href: '/dashboard', label: 'Dashboard' },
    { href: '/leaderboard', label: 'Leaderboard' },
    { href: '/ai-assistant', label: 'AI Assistant' },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2">
            <BrainCircuit className="h-7 w-7 text-primary" />
            <span className="font-headline text-xl font-bold">SolveAI</span>
          </Link>
          <nav className="hidden items-center gap-2 md:flex">
            {navLinks.map(link => (
                <Button key={link.href} variant={pathname === link.href ? "secondary" : "ghost"} size="sm" asChild className="font-medium">
                    <Link href={link.href}>{link.label}</Link>
                </Button>
            ))}
          </nav>
        </div>
        <div className="flex items-center gap-4">
            <div className="hidden md:flex">
                <Button asChild>
                   <Link href="/submit-paper">
                     <FileUp className="mr-2 h-4 w-4" />
                     Submit Paper
                   </Link>
                 </Button>
            </div>
            <Sheet>
                <SheetTrigger asChild>
                    <Button variant="outline" size="icon" className="md:hidden">
                        <Menu className="h-5 w-5" />
                        <span className="sr-only">Toggle Menu</span>
                    </Button>
                </SheetTrigger>
                <SheetContent side="right">
                     <nav className="grid gap-6 text-lg font-medium mt-8">
                        {navLinks.map(link => (
                            <Link key={link.href} href={link.href} className="text-muted-foreground hover:text-foreground">
                                {link.label}
                            </Link>
                        ))}
                         <Link href="/submit-paper" className="text-muted-foreground hover:text-foreground">
                            Submit Paper
                        </Link>
                    </nav>
                </SheetContent>
            </Sheet>
        </div>
      </div>
    </header>
  );
}
