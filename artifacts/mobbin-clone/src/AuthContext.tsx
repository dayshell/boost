import { createContext, useContext, useState, useEffect, ReactNode } from "react";

const API_URL = "http://localhost:3000";

interface User {
  id: number;
  email: string;
  nickname: string | null;
  name: string;
  initial: string;
  isAdmin: boolean;
  isBooster: boolean;
  isBanned: boolean;
  role: "user" | "booster" | "admin";
  balance: number;
  avatar: string | null;
  hasPassword: boolean;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password?: string) => Promise<void>;
  logout: () => void;
  setPassword: (password: string) => Promise<void>;
  updateNickname: (nickname: string) => Promise<void>;
  changeUserRole: (userId: number, newRole: "user" | "booster" | "admin") => Promise<void>;
  getAllUsers: () => Promise<any[]>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  login: async () => {},
  logout: () => {},
  setPassword: async () => {},
  updateNickname: async () => {},
  changeUserRole: async () => {},
  getAllUsers: async () => [],
});

function buildUser(apiUser: any): User {
  const name = apiUser.nickname || apiUser.email.split("@")[0] || "User";
  const initial = name.charAt(0).toUpperCase();
  const role = apiUser.role || "user";
  const isAdmin = role === "admin";
  const isBooster = role === "booster" || role === "admin";
  const isBanned = apiUser.isBanned || false;
  
  return {
    id: apiUser.id,
    email: apiUser.email,
    nickname: apiUser.nickname || null,
    name,
    initial,
    isAdmin,
    isBooster,
    isBanned,
    role,
    balance: apiUser.balance || 0,
    avatar: apiUser.avatar,
    hasPassword: apiUser.hasPassword ?? false,
  };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [banInfo, setBanInfo] = useState<any>(null);

  // Загрузка пользователя при старте
  useEffect(() => {
    const token = localStorage.getItem("boost_token");
    if (token) {
      fetch(`${API_URL}/api/auth/me`, {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then(res => res.json())
        .then(data => {
          if (data.user) {
            setUser(buildUser(data.user));
            setBanInfo(data.ban);
          } else {
            localStorage.removeItem("boost_token");
          }
        })
        .catch(() => {
          localStorage.removeItem("boost_token");
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, []);

  async function login(email: string, password?: string) {
    try {
      console.log("Login attempt:", { email, hasPassword: !!password });
      
      // Проверяем, нужен ли пароль
      const checkRes = await fetch(`${API_URL}/api/auth/check-email`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      
      console.log("Check email response status:", checkRes.status);
      
      if (!checkRes.ok) {
        const errorText = await checkRes.text();
        console.error("Check email error response:", errorText);
        throw new Error("Failed to check email");
      }
      
      const checkData = await checkRes.json();
      console.log("Check email data:", checkData);

      let loginRes;
      if (checkData.requiresPassword && password) {
        console.log("Logging in with password");
        // Вход с паролем
        loginRes = await fetch(`${API_URL}/api/auth/signin-password`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        });
      } else if (!checkData.requiresPassword) {
        console.log("Logging in without password");
        // Вход без пароля (автоматическая регистрация)
        loginRes = await fetch(`${API_URL}/api/auth/signin-email`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        });
      } else {
        throw new Error("Password required");
      }

      console.log("Login response status:", loginRes.status);

      if (!loginRes.ok) {
        const errorData = await loginRes.json();
        console.error("Login error response:", errorData);
        
        // Проверяем бан
        if (errorData.banned) {
          throw new Error("BANNED");
        }
        
        throw new Error(errorData.error || "Login failed");
      }

      const loginData = await loginRes.json();
      console.log("Login data:", loginData);
      
      if (loginData.error) {
        throw new Error(loginData.error);
      }

      localStorage.setItem("boost_token", loginData.token);
      setUser(buildUser(loginData.user));
      console.log("Login successful");
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  }

  async function setPassword(password: string) {
    const token = localStorage.getItem("boost_token");
    if (!token) throw new Error("Not authenticated");

    const res = await fetch(`${API_URL}/api/auth/set-password`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ password }),
    });

    const data = await res.json();
    if (data.error) {
      throw new Error(data.error);
    }

    // Обновляем пользователя
    if (user) {
      setUser({ ...user, hasPassword: true });
    }
  }

  async function updateNickname(nickname: string) {
    const token = localStorage.getItem("boost_token");
    if (!token) throw new Error("Not authenticated");

    const res = await fetch(`${API_URL}/api/auth/profile`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ nickname }),
    });

    const data = await res.json();
    if (data.error) {
      throw new Error(data.error);
    }

    // Обновляем пользователя
    if (user) {
      setUser({ ...user, nickname, name: nickname || user.email.split("@")[0] });
    }
  }

  async function changeUserRole(userId: number, newRole: "user" | "booster" | "admin") {
    const token = localStorage.getItem("boost_token");
    if (!token) throw new Error("Not authenticated");

    const res = await fetch(`${API_URL}/api/auth/change-role`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ userId, newRole }),
    });

    const data = await res.json();
    if (data.error) {
      throw new Error(data.error);
    }

    return data;
  }

  async function getAllUsers() {
    const token = localStorage.getItem("boost_token");
    if (!token) throw new Error("Not authenticated");

    const res = await fetch(`${API_URL}/api/auth/users`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await res.json();
    if (data.error) {
      throw new Error(data.error);
    }

    return data.users;
  }

  function logout() {
    setUser(null);
    localStorage.removeItem("boost_token");
    localStorage.removeItem("boost_user"); // Для совместимости
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, setPassword, updateNickname, changeUserRole, getAllUsers }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
