import { createContext, useContext, useState } from "react";
import type { ReactNode } from "react";

interface User {
  email: string;
  pubkey: string;
}

interface AuthContextType {
  user: User | null;
  isAdmin: boolean;
  login: () => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Lista de e-mails ou Chaves Públicas que têm direito de acesso ao AdminDash
const ADMIN_EMAILS = [
  "antonio@megacripto.com.br",
  "admin@exemplo.com",
  "user@exemplo.com",
]; // Adicionado user@ pra você testar agora

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  const login = () => {
    // Simulando o Magic Button do Web3Auth Auth
    setUser({
      email: "user@exemplo.com", // Como está na lista acima, ele vai virar admin
      pubkey: "DxL9cE7vFkH8Q2mTyQ8uF2A3M",
    });
  };

  const logout = () => {
    setUser(null);
  };

  const isAdmin = user !== null && ADMIN_EMAILS.includes(user.email);

  return (
    <AuthContext.Provider value={{ user, isAdmin, login, logout }}>
      {children}
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
