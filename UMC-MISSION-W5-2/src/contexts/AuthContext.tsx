import { createContext, useContext, useEffect, useState } from "react";
import useLocalStorage from "../hooks/useLocalStorage";

interface AuthContextType {
  isLoggedIn: boolean;
  userName: string;
  login: (accessToken: string, refreshToken: string, name: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const { getItem, setItem, removeItem } = useLocalStorage();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState("");

  useEffect(() => {
    const token = getItem("accessToken");
    const name = getItem("userName");
    setIsLoggedIn(!!token);
    if (name) setUserName(name);
  }, []);

  const login = (accessToken: string, refreshToken: string, name: string) => {
    setItem("accessToken", accessToken);
    setItem("refreshToken", refreshToken);
    setItem("userName", name);
    setUserName(name);
    setIsLoggedIn(true);
  };

  const logout = () => {
    removeItem("accessToken");
    removeItem("refreshToken");
    removeItem("userName");
    setUserName("");
    setIsLoggedIn(false);
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, userName, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};
