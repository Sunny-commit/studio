
'use client';

import { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import type { AuthenticatedUser } from '@/lib/types';

export function useAuth() {
  const [user, setUser] = useState<AuthenticatedUser | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const userCookie = Cookies.get('user_session');
    
    if (userCookie) {
      try {
        const parsedUser: AuthenticatedUser = JSON.parse(userCookie);
        setUser(parsedUser);
        setIsAuthenticated(true);
      } catch (error) {
        console.error("Failed to parse user cookie:", error);
        // Clear broken cookie
        Cookies.remove('user_session');
        setIsAuthenticated(false);
        setUser(null);
      }
    } else {
        setIsAuthenticated(false);
        setUser(null);
    }
    setIsLoading(false);
  }, []);

  return { user, isAuthenticated, isLoading };
}
