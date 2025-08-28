
'use client';

import Link from 'next/link';
import { BrainCircuit, LogOut, User, Menu, FileUp } from 'lucide-react';
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
import { usePathname } from 'next/navigation';


export default function Header() {
  const { user, isAuthenticated } = useAuth();
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
          <Link href={isAuthenticated ? "/dashboard" : "/"} className="flex items-center gap-2">
            <BrainCircuit className="h-7 w-7 text-primary" />
            <span className="font-headline text-xl font-bold">SolveAI</span>
          </Link>
          {isAuthenticated && (
            <nav className="hidden items-center gap-2 md:flex">
              {navLinks.map(link => (
                  <Button key={link.href} variant={pathname === link.href ? "secondary" : "ghost"} size="sm" asChild className="font-medium">
                      <Link href={link.href}>{link.label}</Link>
                  </Button>
              ))}
            </nav>
          )}
        </div>

        <div className="flex items-center gap-2">
           {isAuthenticated && (
             <Button asChild size="sm">
               <Link href="/submit-paper">
                 <FileUp className="mr-2 h-4 w-4" />
                 Submit Paper
               </Link>
             </Button>
           )}
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
                      <DropdownMenuItem asChild>
                        <Link href="/setup-profile">
                          <User className="mr-2 h-4 w-4" />
                          <span>Profile</span>
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem asChild>
                         <Link href="/api/auth/logout">
                           <LogOut className="mr-2 h-4 w-4" />
                           Sign Out
                         </Link>
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
                        {isAuthenticated && user ? (
                          <div className="space-y-4">
                             <div className="flex items-center gap-3">
                                <Avatar className="h-10 w-10">
                                  <AvatarImage src={user.picture} alt={user.name} />
                                  <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <div>
                                  <p className="text-sm font-medium leading-none">{user.name}</p>
                                  <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
                                </div>
                             </div>
                             <Button asChild className="w-full">
                                <Link href="/api/auth/logout">Sign Out</Link>
                             </Button>
                           </div>
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
