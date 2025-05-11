import React, { useEffect } from "react";
import useLocalStorage from "../hooks/useLocalStorage";

const GoogleLoginRedirectPage = () => {
  const { setItem } = useLocalStorage();

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    console.log(window.location.search, urlParams); // 여기서 urlParams.get("name ") 등으로 가져오기 가능

    // TOKEN
    const accessToken = urlParams.get("accessToken");
    const refreshToken = urlParams.get("refreshToken");

    if (accessToken && refreshToken) {
      setItem("accessToken", accessToken);
      setItem("refreshToken", refreshToken);
      window.location.href = "/mypage";
    }
  }, []);

  return <div>GoogleLoginRedirectPage</div>;
};

export default GoogleLoginRedirectPage;
