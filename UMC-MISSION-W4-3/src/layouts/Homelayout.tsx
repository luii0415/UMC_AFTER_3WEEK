import { Outlet, useNavigate } from "react-router-dom";
import useLocalStorage from "../hooks/useLocalStorage"; // 추가

function Homelayout() {
  const nav = useNavigate();
  const { getItem } = useLocalStorage();
  const accessToken = getItem("accessToken");

  return (
    <div className="h-dvh flex flex-col">
      <div className="flex flex-col">
        <header className="h-18 flex items-center justify-between bg-[#131a24] px-6 py-3">
          <button
            onClick={() => nav("/")}
            className="text-lg font-bold text-white"
          >
            UMC
          </button>
          <div className="space-x-2">
            <button
              onClick={() => nav("/login")}
              className="rounded bg-lpPink px-3 py-1 text-sm text-white"
            >
              로그인
            </button>
            <button
              onClick={() => nav("/signup")}
              className="rounded bg-gray-800 px-3 py-1 text-sm text-white"
            >
              회원가입
            </button>
            {/**{accessToken && ( // accessToken 존재할 때만 표시
              <button
                onClick={() => nav("/mypage")}
                className="rounded bg-gray-800 px-3 py-1 text-sm text-white"
              >
                마이페이지
              </button>
            )} */}

            <button
              onClick={() => nav("/mypage")}
              className="rounded bg-gray-800 px-3 py-1 text-sm text-white"
            >
              마이페이지
            </button>
          </div>
        </header>
      </div>
      <main className="flex-1">
        <Outlet />
      </main>
      <footer>푸터</footer>
    </div>
  );
}

export default Homelayout;
