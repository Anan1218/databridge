'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { User, signInWithEmailAndPassword, signOut, createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/utils/firebase';
import { UserSubscription } from '@/types/user';

interface AuthContextType {
  user: User | null;
  userData: any | null;
  refreshUserData: () => Promise<void>;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  isWelcomeFlow: boolean;
  setIsWelcomeFlow: (value: boolean) => void;
  subscription: UserSubscription | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuthContext must be used within an AuthContextProvider');
  }
  return context;
};

export const AuthContextProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userData, setUserData] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [isWelcomeFlow, setIsWelcomeFlow] = useState(false);

  const fetchUserData = async (uid: string) => {
    try {
      const response = await fetch(`/api/users?uid=${uid}`);
      if (!response.ok) return null;
      const data = await response.json();
      setUserData(data);
      return data;
    } catch (error) {
      console.error('Error fetching user data:', error);
      return null;
    }
  };

  const refreshUserData = async () => {
    if (user?.uid) {
      return await fetchUserData(user.uid);
    }
    return null;
  };

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      setUser(user);
      if (user?.uid) {
        await fetchUserData(user.uid);
      } else {
        setUserData(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const signInHandler = async (email: string, password: string) => {
    await signInWithEmailAndPassword(auth, email, password);
  };

  const signUpHandler = async (email: string, password: string) => {
    await createUserWithEmailAndPassword(auth, email, password);
  };

  const signOutHandler = async () => {
    await signOut(auth);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        userData,
        refreshUserData,
        loading,
        signIn: signInHandler,
        signUp: signUpHandler,
        signOut: signOutHandler,
        isWelcomeFlow,
        setIsWelcomeFlow,
        subscription: userData?.subscription || null,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
