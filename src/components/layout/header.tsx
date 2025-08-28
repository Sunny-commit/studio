
'use client';

import Link from 'next/link';
import { BrainCircuit, LogOut, User, Menu } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';


export default function Header() {
  const { user, isAuthenticated } = useAuth();

  const navLinks = [
    { href: '/dashboard', label: 'Dashboard' },
    { href: '/leaderboard', label: 'Leaderboard' },
    { href: '/submit-paper', label: 'Submit Paper' },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-card">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-6">
          <Link href="/dashboard" className="flex items-center gap-2">
            <BrainCircuit className="h-7 w-7 text-primary" />
            <span className="font-headline text-xl font-bold">SolveAI</span>
          </Link>
          <nav className="hidden items-center gap-4 md:flex">
             {navLinks.map(link => (
                <Button key={link.href} variant="link" asChild className="text-sm font-medium text-muted-foreground">
                    <Link href={link.href}>{link.label}</Link>
                </Button>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-4">
            <div className="hidden md:flex">
              {isAuthenticated && user ? (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={user.picture} alt={user.name} />
                          <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56" align="end" forceMount>
                      <DropdownMenuLabel className="font-normal">
                        <div className="flex flex-col space-y-1">
                          <p className="text-sm font-medium leading-none">{user.name}</p>
                           <p className="text-xs leading-none text-muted-foreground">
                            {user.email}
                          </p>
                        </div>
                      </DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem>
                        <User className="mr-2 h-4 w-4" />
                        <span>Profile</span>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem>
                        <LogOut className="mr-2 h-4 w-4" />
                         <Link href="/api/auth/logout">Sign Out</Link>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
              ) : (
                 <Button asChild>
                    <Link href="/api/auth/google">Sign In</Link>
                  </Button>
              )}
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
                    </nav>
                     <div className="mt-6">
                        {isAuthenticated ? (
                             <Button asChild className="w-full">
                                <Link href="/api/auth/logout">Sign Out</Link>
                             </Button>
                        ) : (
                             <Button asChild className="w-full">
                                <Link href="/api/auth/google">Sign In</Link>
                            </Button>
                        )}
                    </div>
                </SheetContent>
            </Sheet>
        </div>
      </div>
    </header>
  );
}

