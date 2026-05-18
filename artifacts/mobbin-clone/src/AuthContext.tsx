import { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface User {
  email: string;
  name: string;
  initial: string;
  isAdmin: boolean;
}

interface AuthContextType {
  user: User | null;
  login: (email: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  login: () => {},
  logout: () => {},
});

function buildUser(email: string): User {
  const name = email.split("@")[0] || "User";
  const initial = name.charAt(0).toUpperCase();
  const isAdmin = email === "admin@boost.com";
  return { email, name, initial, isAdmin };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    try {
      const stored = localStorage.getItem("boost_user");
      if (stored) {
        const parsed = JSON.parse(stored);
        return { ...parsed, isAdmin: parsed.email === "admin@boost.com" };
      }
      return null;
    } catch {
      return null;
    }
  });

  function login(email: string) {
    const u = buildUser(email);
    setUser(u);
    localStorage.setItem("boost_user", JSON.stringify(u));
  }

  function logout() {
    setUser(null);
    localStorage.removeItem("boost_user");
  }

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
