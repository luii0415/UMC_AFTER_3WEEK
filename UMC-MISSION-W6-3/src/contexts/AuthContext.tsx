import { createContext, useContext, useEffect, useState } from "react";
import useLocalStorage from "../hooks/useLocalStorage";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";

interface AuthContextType {
  isLoggedIn: boolean;
  userName: string;
  userId: number | null;
  login: (
    accessToken: string,
    refreshToken: string,
    name: string,
    userId: number
  ) => void;
  logout: () => void;
  updateUserName: (newName: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const { getItem, setItem, removeItem } = useLocalStorage();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState(
    localStorage.getItem("userName") || ""
  );
  const [userId, setUserId] = useState<number | null>(
    localStorage.getItem("userId")
      ? Number(localStorage.getItem("userId"))
      : null
  );

  useEffect(() => {
    const token = getItem("accessToken");
    const name = getItem("userName");
    const userId = getItem("userId");
    setIsLoggedIn(!!token);
    if (name) setUserName(name);
    if (userId) setUserId(Number(userId));
  }, []);

  const login = (
    accessToken: string,
    refreshToken: string,
    name: string,
    userId: number
  ) => {
    setItem("accessToken", accessToken);
    setItem("refreshToken", refreshToken);
    setItem("userName", name);
    setItem("userId", userId.toString());
    setUserName(name);
    setUserId(userId);
    setIsLoggedIn(true);
  };

  // 실제 로그아웃 처리 로직
  const performLogout = () => {
    removeItem("accessToken");
    removeItem("refreshToken");
    removeItem("userName");
    removeItem("userId");
    setUserName("");
    setUserId(null);
    setIsLoggedIn(false);
  };

  //유저 이름 업데이트
  const updateUserName = (newName: string) => {
    setUserName(newName);
    localStorage.setItem("userName", newName);
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

  //  외부에서 사용하는 logout 함수
  const logout = () => {
    logoutMutation.mutate();
  };

  return (
    <AuthContext.Provider
      value={{ isLoggedIn, userName, userId, login, logout, updateUserName }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};
