import axios from "axios";

const baseURL = import.meta.env.VITE_API_BASE_URL;

const refreshtoken = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
});

/**
 * refreshToken을 이용해 새로운 accessToken + refreshToken을 발급받는 함수
 */
export async function requestNewTokens() {
  const refresh = localStorage.getItem("refreshToken");
  if (!refresh) {
    throw new Error("Refresh Token이 없습니다.");
  }

  const response = await refreshtoken.post("v1/auth/refresh", { refresh });

  const { accessToken, refreshToken: newRefreshToken } = response.data.data;

  if (!accessToken || !newRefreshToken) {
    throw new Error("AccessToken 또는 RefreshToken 재발급 실패");
  }

  localStorage.setItem("accessToken", accessToken);
  localStorage.setItem("refreshToken", newRefreshToken);

  return accessToken; // 새 accessToken 반환
}

export default refreshtoken;
