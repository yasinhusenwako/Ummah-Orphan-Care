import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User as FirebaseUser } from 'firebase/auth';
import { onAuthChange, getUserData } from '@/integrations/firebase/auth';
import { User } from '@/types';

interface AuthContextType {
  user: FirebaseUser | null;
  userData: User | null;
  loading: boolean;
  isAdmin: boolean;
  isDonor: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  userData: null,
  loading: true,
  isAdmin: false,
  isDonor: false
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [userData, setUserData] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Set a timeout to prevent infinite loading
    const timeout = setTimeout(() => {
      console.warn('Auth initialization timeout - setting loading to false');
      setLoading(false);
    }, 3000); // 3 second timeout

    const unsubscribe = onAuthChange(async (firebaseUser) => {
      clearTimeout(timeout); // Clear timeout if auth completes
      setUser(firebaseUser);
      
      if (firebaseUser) {
        try {
          const data = await getUserData(firebaseUser.uid);
          setUserData(data);
        } catch (error) {
          console.error('Error fetching user data:', error);
          setUserData(null);
        }
      } else {
        setUserData(null);
      }
      
      setLoading(false);
    });

    return () => {
      clearTimeout(timeout);
      unsubscribe();
    };
  }, []);

  const value = {
    user,
    userData,
    loading,
    isAdmin: userData?.role === 'admin',
    isDonor: userData?.role === 'donor'
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
