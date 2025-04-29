// src/components/ProtectedRoute.tsx

import React, { useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import useLocalStorage from "../hooks/useLocalStorage";
import axios from "axios";

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { getItem } = useLocalStorage();
  const [loading, setLoading] = useState(true);
  const [isValid, setIsValid] = useState(false);
  const nav = useNavigate();

  useEffect(() => {
    let isMounted = true;

    const accessToken = getItem("accessToken");

    if (!accessToken) {
      alert("로그인이 필요합니다.");
      nav("/login");
      return;
    }

    axios
      .get(`${import.meta.env.VITE_API_BASE_URL}v1/auth/protected`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
      .then((response) => {
        if (isMounted) {
          console.log("로그인 정보", response);
          setIsValid(true);
          setLoading(false);
        }
      })
      .catch((err) => {
        if (isMounted) {
          console.error(" 토큰 검증 실패:", err);
          alert("로그인 정보가 유효하지 않습니다.");
          nav("/login");
        }
      });

    return () => {
      isMounted = false;
    };
  }, [getItem, nav]);

  if (loading) return <div>인증 중...</div>;

  if (!isValid) return null; // 유효성 실패한 경우 아무것도 렌더링하지 않음

  return <>{children}</>;
}

export default ProtectedRoute;
