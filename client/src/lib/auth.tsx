import { createContext, useContext, useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "./queryClient";
import { User } from "@shared/schema";

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<void>;
  register: (userData: {
    username: string;
    password: string;
    firstName: string;
    lastName?: string;
    email: string;
  }) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [, setLocation] = useLocation();
  const [isInitialized, setIsInitialized] = useState(false);
  
  // Check for demo user in localStorage
  const [demoUser, setDemoUser] = useState<User | null>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('demoUser');
      if (saved) {
        try {
          return JSON.parse(saved) as User;
        } catch (e) {
          return null;
        }
      }
    }
    return null;
  });

  // Get the current user from the server
  const { data: serverUser, isLoading, refetch } = useQuery<User | null>({
    queryKey: ["/api/auth/me"],
    queryFn: () => fetch("/api/auth/me", { credentials: "include" })
      .then(res => res.status === 401 ? null : res.json()),
    enabled: !isInitialized && !demoUser,
  });
  
  // Combined user from either server or demo mode
  const user = demoUser || serverUser;

  useEffect(() => {
    if (!isLoading || demoUser) {
      setIsInitialized(true);
    }
  }, [isLoading, demoUser]);

  async function login(username: string, password: string) {
    try {
      await apiRequest("POST", "/api/auth/login", { username, password });
      await refetch();
      setLocation("/");
    } catch (error) {
      throw error;
    }
  }

  async function register(userData: {
    username: string;
    password: string;
    firstName: string;
    lastName?: string;
    email: string;
  }) {
    try {
      await apiRequest("POST", "/api/auth/register", userData);
      await login(userData.username, userData.password);
    } catch (error) {
      throw error;
    }
  }

  async function logout() {
    try {
      // Check if we're in demo mode first
      if (demoUser) {
        // Clear demo user from state and localStorage
        localStorage.removeItem('demoUser');
        setDemoUser(null);
        setLocation("/login");
        return;
      }
      
      // Normal logout for server-authenticated users
      await apiRequest("POST", "/api/auth/logout", {});
      await refetch();
      setLocation("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user: user || null,
        isLoading,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

// Duplicated from queryClient.ts to avoid circular dependency
function getQueryFn<T>(options: { on401: "returnNull" | "throw" }) {
  return async ({ queryKey }: { queryKey: unknown[] }) => {
    const res = await fetch(queryKey[0] as string, {
      credentials: "include",
    });

    if (options.on401 === "returnNull" && res.status === 401) {
      return null;
    }

    if (!res.ok) {
      const text = (await res.text()) || res.statusText;
      throw new Error(`${res.status}: ${text}`);
    }
    
    return await res.json();
  };
}
