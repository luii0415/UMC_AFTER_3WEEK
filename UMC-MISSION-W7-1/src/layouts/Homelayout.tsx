import { Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useEffect, useRef, useState } from "react";
import { FaSearch, FaUser, FaList } from "react-icons/fa";

import axios from "axios"; //회원 탈퇴 용

function Homelayout() {
  const nav = useNavigate();
  const { isLoggedIn, logout, userName } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(window.innerWidth >= 768);
  const sidebarRef = useRef<HTMLDivElement | null>(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  const [isModalOpen, setIsModalOpen] = useState(false);

  // 화면 크기 변경 시 반응
  useEffect(() => {
    const handleResize = () => {
      const nowMobile = window.innerWidth < 768;
      setIsMobile(nowMobile);
      if (nowMobile) {
        setSidebarOpen(false); // 모바일로 전환 시 닫음
      } else {
        setSidebarOpen(true); // 데스크탑이면 항상 열림
      }
    };

    window.addEventListener("resize", handleResize);
    handleResize(); // 초기 체크
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // 모바일일 때만 바깥 클릭 시 사이드바 닫기
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        isMobile &&
        sidebarOpen &&
        sidebarRef.current &&
        !sidebarRef.current.contains(e.target as Node)
      ) {
        setSidebarOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [sidebarOpen, isMobile]);

  //회원 탈퇴

  const deleteUser = async () => {
    try {
      await axios.delete(`${import.meta.env.VITE_API_BASE_URL}v1/users`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });

      alert("회원 탈퇴가 완료되었습니다.");
      localStorage.clear(); // 토큰 및 사용자 정보 모두 삭제
      window.location.href = "/"; // 홈 페이지로 이동
    } catch (error) {
      console.error("회원 탈퇴 실패:", error);
      alert("탈퇴 요청에 실패했습니다. 다시 시도해주세요.");
    }
  };

  return (
    <div className="h-dvh flex flex-col relative">
      {/* 헤더 */}
      <header className="z-50 h-18 flex items-center justify-between bg-[#131a24] px-6 py-3">
        <div className="flex items-center gap-4">
          <button
            className="text-white "
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            <FaList />
          </button>
          <button
            onClick={() => nav("/")}
            className="text-lg font-bold text-white"
          >
            DOLIGO
          </button>
        </div>

        <div className="flex items-center gap-4 text-white">
          <FaSearch />
          <input
            type="text"
            placeholder=""
            className="px-3 py-1 rounded-sm border border-gray-300"
          />
          {isLoggedIn ? (
            <>
              <span>{userName}님 반갑습니다.</span>
              <button
                onClick={() => {
                  logout();
                  nav("/");
                }}
                className="text-white"
              >
                로그아웃
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => nav("/login")}
                className="h-8 w-20 text-white"
              >
                로그인
              </button>
              <button
                onClick={() => nav("/signup")}
                className="h-8 w-20 bg-pink-400 text-white rounded-xl"
              >
                회원가입
              </button>
            </>
          )}
        </div>
      </header>

      {/* 본문 */}
      <div className="flex flex-1 relative">
        {/* 사이드바 */}
        {sidebarOpen && (
          <>
            <aside
              ref={sidebarRef}
              className={`w-[200px] bg-black text-white p-4 z-20 ${
                isMobile ? "absolute h-full" : "static"
              }`}
            >
              <nav className="flex flex-col gap-6 text-sm">
                <button
                  className="flex items-center gap-2"
                  onClick={() => nav("/")}
                >
                  <FaSearch />
                  찾기
                </button>
                {isLoggedIn && (
                  <>
                    <button
                      className="flex items-center gap-2"
                      onClick={() => nav("/mypage")}
                    >
                      <FaUser />
                      마이페이지
                    </button>

                    <button
                      className="absolute top-150 left-15 mt-1"
                      onClick={() => setIsModalOpen(true)}
                    >
                      회원 탈퇴
                    </button>
                  </>
                )}
              </nav>
            </aside>

            {/* 오버레이 (모바일에서만 표시) */}
            {isMobile && (
              <div
                className="fixed inset-0 z-10 bg-black/30"
                onClick={() => setSidebarOpen(false)}
              />
            )}
            {isModalOpen && (
              <div className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm">
                <div className="w-80 h-40 absolute left-1/2 top-[300px] p-6 rounded-lg -translate-x-1/2 bg-[#1f1f1f] flex flex-col items-center justify-center gap-y-8">
                  <p className="text-white text-lg">정말 탈퇴하시겠습니까?</p>
                  <div className="flex justify-center gap-4">
                    <button
                      className="h-10 w-22 bg-gray-300 text-black px-4 py-2 rounded-md"
                      onClick={deleteUser}
                    >
                      예
                    </button>
                    <button
                      className="h-10 w-22 bg-pink-500 text-white px-4 py-2 rounded-md"
                      onClick={() => setIsModalOpen(false)}
                    >
                      아니오
                    </button>
                  </div>
                </div>
              </div>
            )}
          </>
        )}

        {/* 콘텐츠 */}
        <main className="flex-1 z-0">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default Homelayout;
