import React, { useEffect } from "react";
import useLocalStorage from "../hooks/useLocalStorage";
import { useAuth } from "../contexts/AuthContext";

const GoogleLoginRedirectPage = () => {
  const { login } = useAuth();

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    console.log(window.location.search, urlParams); // 여기서 urlParams.get("name ") 등으로 가져오기 가능

    // TOKEN
    const accessToken = urlParams.get("accessToken");
    const refreshToken = urlParams.get("refreshToken");
    const name = urlParams.get("name");

    if (accessToken && refreshToken && name) {
      login(accessToken, refreshToken, name);
      window.location.href = "/mypage";
    } else {
      alert("로그인 정보가 누락되었습니다.");
    }
  }, []);

  return <div>GoogleLoginRedirectPage</div>;
};

export default GoogleLoginRedirectPage;
