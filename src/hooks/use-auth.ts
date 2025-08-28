
'use client';

import { useState, useEffect } from 'react';
import Cookies from 'js-cookie';

interface User {
  name: string;
  email: string;
  picture: string;
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const userCookie = Cookies.get('user_session');
    
    if (userCookie) {
      try {
        const parsedUser = JSON.parse(userCookie);
        setUser(parsedUser);
        setIsAuthenticated(true);
      } catch (error) {
        console.error("Failed to parse user cookie:", error);
        setIsAuthenticated(false);
        setUser(null);
        Cookies.remove('user_session');
      }
    } else {
        setIsAuthenticated(false);
        setUser(null);
    }
    setIsLoading(false);
  }, []);

  return { user, isAuthenticated, isLoading };
}
