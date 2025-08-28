
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
  const [isLoading, setIsLoading] = useState(true); // Start with loading state

  useEffect(() => {
    // We use js-cookie here because document.cookie is not available on the server
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
        // Clear potentially corrupted cookie
        Cookies.remove('user_session');
      }
    }
    setIsLoading(false); // Finished checking
  }, []);

  return { user, isAuthenticated, isLoading };
}
