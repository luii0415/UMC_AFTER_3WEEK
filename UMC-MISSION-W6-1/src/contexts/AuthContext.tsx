import { createContext, useContext, useEffect, useState } from "react";
import useLocalStorage from "../hooks/useLocalStorage";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";

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

  // 실제 로그아웃 처리 로직
  const performLogout = () => {
    removeItem("accessToken");
    removeItem("refreshToken");
    removeItem("userName");
    setUserName("");
    setIsLoggedIn(false);
  };

  // useMutation 기반 로그아웃 API 요청
  const logoutMutation = useMutation({
    mutationFn: async () => {
      const res = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}v1/auth/signout`,
        {},
        {
          headers: {
            Authorization: `Bearer ${getItem("accessToken")}`,
          },
        }
      );
      return res.data;
    },
    onSuccess: (data) => {
      console.log("로그아웃 성공:", data);
      performLogout();
    },
    onError: (err) => {
      console.error("로그아웃 실패:", err);
      performLogout(); // 실패해도 로컬 로그아웃은 수행
    },
  });

  // 외부에서 사용하는 logout 함수
  const logout = () => {
    logoutMutation.mutate();
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
