import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import useLocalStorage from "../hooks/useLocalStorage";
import { requestNewTokens } from "./refreshtoken";

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { getItem } = useLocalStorage();
  const [loading, setLoading] = useState(true);
  const [isValid, setIsValid] = useState(false);
  const nav = useNavigate();

  useEffect(() => {
    let isMounted = true;

    async function verifyToken() {
      let accessToken = getItem("accessToken");

      if (!accessToken) {
        alert("로그인이 필요합니다.");
        nav("/login");
        return;
      }

      try {
        await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}v1/auth/protected`,
          {
            headers: { Authorization: `Bearer ${accessToken}` },
          }
        );

        if (isMounted) {
          setIsValid(true);
          setLoading(false);
        }
      } catch (error) {
        console.error("토큰 검증 실패:", error);

        try {
          const newAccessToken = await requestNewTokens();
          console.log("새로운 토큰 발급 성공");

          // 새 accessToken으로 다시 요청
          const retryResponse = await axios.get(
            `${import.meta.env.VITE_API_BASE_URL}v1/auth/protected`,
            {
              headers: { Authorization: `Bearer ${newAccessToken}` },
            }
          );

          if (isMounted) {
            console.log("리프레시 후 로그인 정보:", retryResponse);
            alert("새로운 토큰을 발급 받았습니다!");
            setIsValid(true);
            setLoading(false);
          }
        } catch (refreshError) {
          console.error("Refresh 실패:", refreshError);
          alert("로그인 정보가 유효하지 않습니다.");
          nav("/login");
        }
      }
    }

    verifyToken();

    return () => {
      isMounted = false;
    };
  }, [getItem, nav]);

  if (loading) return <div>인증 중...</div>;
  if (!isValid) return null;

  return <>{children}</>;
}

export default ProtectedRoute;
