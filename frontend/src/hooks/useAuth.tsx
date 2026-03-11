import { createContext, useContext, useState, useEffect, useCallback } from "react";
import type { ReactNode } from "react";
import { signInWithPopup, signOut, onAuthStateChanged } from "firebase/auth";
import type { User as FirebaseUser } from "firebase/auth";
import { auth, googleProvider } from "../lib/firebase";

interface User {
  email: string;
  pubkey: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isVerified: boolean;
  isAdmin: boolean;
  isLoading: boolean;
  login: () => Promise<void>;
  logout: () => Promise<void>;
  completeKyc: (simulationType: 'APPROVE' | 'REJECT') => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const ADMIN_EMAILS = ["digitoinovacao.tec@gmail.com"];

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isVerified, setIsVerified] = useState(false);

  const checkVerificationStatus = useCallback(async (email: string) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/google-login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      if (response.ok) {
        const data = await response.json();
        setIsVerified(data.userStatus.isVerified);
      } else {
        setIsVerified(false);
      }
    } catch (error) {
      console.error("Failed to fetch verification status", error);
      setIsVerified(false);
    }
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(
      auth,
      async (firebaseUser: FirebaseUser | null) => {
        setIsLoading(true);
        if (firebaseUser?.email) {
          await checkVerificationStatus(firebaseUser.email);
          setUser({
            email: firebaseUser.email,
            pubkey: firebaseUser.uid.slice(0, 20),
          });
        } else {
          setUser(null);
          setIsVerified(false);
        }
        setIsLoading(false);
      },
    );

    return () => unsubscribe();
  }, [checkVerificationStatus]);

  const login = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      console.error("Erro ao fazer login com o Google:", error);
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
    }
  };

  const completeKyc = async (simulationType: 'APPROVE' | 'REJECT') => {
    if (!user) return;
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/users/complete-profile`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: user.email, simulationType }),
      });
      if (response.ok) {
        setIsVerified(true);
        // Maybe force a reload or redirect? For now, just update the state.
      } else {
        const errorData = await response.json();
        alert(`Falha na simulação de KYC: ${errorData.error}`);
      }
    } catch (error) {
      console.error("Failed to complete KYC", error);
      alert("Ocorreu um erro ao completar a verificação KYC.");
    }
  };

  const isAuthenticated = user !== null;
  const isAdmin = user !== null && ADMIN_EMAILS.includes(user.email);

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, isVerified, isAdmin, isLoading, login, logout, completeKyc }}>
      {!isLoading && children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
