
'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { onAuthStateChanged, signOut as firebaseSignOut, GoogleAuthProvider, signInWithPopup, User as FirebaseUser } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import type { AuthenticatedUser } from '@/lib/types';
import { usePathname, useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';
import { Loader2 } from 'lucide-react';

interface AuthContextType {
  user: AuthenticatedUser | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Helper function to handle token and user data
const setUserCookie = (user: AuthenticatedUser) => {
  Cookies.set('user', JSON.stringify(user), { expires: 1 }); // Expires in 1 day
};

const removeUserCookie = () => {
  Cookies.remove('user');
};

const getUserFromCookie = (): AuthenticatedUser | null => {
  const userCookie = Cookies.get('user');
  if (!userCookie) return null;
  try {
    return JSON.parse(userCookie);
  } catch (error) {
    return null;
  }
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<AuthenticatedUser | null>(getUserFromCookie());
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser: FirebaseUser | null) => {
      if (firebaseUser) {
        const idToken = await firebaseUser.getIdToken();
        const decodedToken: { name?: string; email?: string; picture?: string } = jwtDecode(idToken);
        const authUser: AuthenticatedUser = {
          id: firebaseUser.uid,
          name: decodedToken.name || firebaseUser.displayName || 'Anonymous',
          email: decodedToken.email || firebaseUser.email || '',
          picture: decodedToken.picture || firebaseUser.photoURL || '',
        };
        setUser(authUser);
        setUserCookie(authUser);
      } else {
        setUser(null);
        removeUserCookie();
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    try {
      setLoading(true);
      await signInWithPopup(auth, provider);
      // onAuthStateChanged will handle setting the user and cookie
      router.push('/dashboard');
    } catch (error) {
      console.error('Error signing in with Google', error);
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      await firebaseSignOut(auth);
      // onAuthStateChanged will handle clearing the user and cookie
      router.push('/');
    } catch (error) {
      console.error('Error signing out', error);
    }
  };
  
  // Route protection
  const protectedRoutes = ['/ai-assistant', '/submit-paper', '/leaderboard', '/setup-profile'];
  useEffect(() => {
    if (!loading && !user && protectedRoutes.includes(pathname)) {
        router.push(`/login?redirect=${pathname}`);
    }
   }, [user, loading, pathname, router]);

  if (loading) {
    return (
        <div className="flex h-screen items-center justify-center">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
        </div>
    )
  }

  return (
    <AuthContext.Provider value={{ user, loading, signInWithGoogle, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
