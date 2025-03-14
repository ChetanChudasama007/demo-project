import { createContext, useContext, useEffect, useState } from 'react';
import { 
  User,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  onAuthStateChanged,
  createUserWithEmailAndPassword
} from 'firebase/auth';
import { auth } from '@/lib/firebase';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  signInWithEmail: (email: string, password: string) => Promise<boolean>;
  signInWithGoogle: () => Promise<boolean>;
  registerWithEmail: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const clearError = () => setError(null);

  const signInWithEmail = async (email: string, password: string): Promise<boolean> => {
    try {
      setError(null);
      await signInWithEmailAndPassword(auth, email, password);
      return true;
    } catch (error: unknown) {
      if (error instanceof Error) {
        const message = (error as { code?: string }).code === 'auth/invalid-credential'
          ? 'Invalid email or password'
          : 'An error occurred during sign in';
        setError(message);
      } else {
        setError('An error occurred during sign in');
      }
      return false;
    }
  };

  const signInWithGoogle = async (): Promise<boolean> => {
    try {
      setError(null);
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      return true;
    } catch (_error: unknown) {
      console.error('Google sign in error:', _error);
      setError('An error occurred during Google sign in');
      return false;
    }
  };

  const registerWithEmail = async (email: string, password: string): Promise<boolean> => {
    try {
      setError(null);
      await createUserWithEmailAndPassword(auth, email, password);
      return true;
    } catch (_error: unknown) {
      console.error('Registration error:', _error);
      setError('An error occurred during registration');
      return false;
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (_error: unknown) {
      setError('An error occurred during logout');
      console.error('Logout error:', _error);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      error,
      signInWithEmail,
      signInWithGoogle,
      registerWithEmail,
      logout,
      clearError,
    }}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext); 