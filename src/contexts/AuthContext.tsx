import { createContext, useContext, useEffect, useState, ReactNode } from "react";

interface User {
  user_id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  rank?: string;
  role: 'user' | 'admin';
  status: string;
  division?: string;
  department?: string;
}

interface AuthContextType {
  isLoggedIn: boolean;
  user: User | null;
  login: (user: User, rememberMe: boolean) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");
    
    if (token && storedUser) {
      try {
        const userData = JSON.parse(storedUser);
        setIsLoggedIn(true);
        setUser(userData);
      } catch (error) {
        console.error('Error parsing stored user data:', error);
        logout();
      }
    }
  }, []);

  const login = (userData: User, rememberMe: boolean) => {
    setIsLoggedIn(true);
    setUser(userData);
    
    if (rememberMe) {
      localStorage.setItem("isLoggedIn", "true");
      localStorage.setItem("user", JSON.stringify(userData));
    } else {
      sessionStorage.setItem("isLoggedIn", "true");
      sessionStorage.setItem("user", JSON.stringify(userData));
    }
  };

  const logout = () => {
    setIsLoggedIn(false);
    setUser(null);
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    sessionStorage.removeItem("isLoggedIn");
    sessionStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
