import React, { useEffect, useRef, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { FiSettings, FiCheck } from "react-icons/fi";
import useLocalStorage from "../hooks/useLocalStorage";
import exampleimg from "../../public/open-book-ge119db7e8_1920.jpg";
import { useAuth } from "../contexts/AuthContext";

interface UserInfo {
  name: string;
  bio: string | null;
  email: string;
}

const Mypage = () => {
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [lpImage, setLpImage] = useState<string | null>(null);
  const [order, setOrder] = useState<"asc" | "desc">("desc");

  const [lpTitle, setLpTitle] = useState("");
  const [lpContent, setLpContent] = useState("");
  const [lpTag, setLpTag] = useState("");
  const [tags, setTags] = useState<string[]>([]);

  const imageInputRef = useRef<HTMLInputElement | null>(null);

  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState("");
  const [editedBio, setEditedBio] = useState("");

  const { setItem } = useLocalStorage();
  const { updateUserName } = useAuth();

  // 모달 외부 클릭 닫기
  const modalRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
        setIsModalOpen(false);
      }
    };
    if (isModalOpen) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isModalOpen]);

  // 사용자 정보 fetch (API 사용)
  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}v1/users/me`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            },
          }
        );
        const { name, email, bio } = res.data.data;
        setUserInfo({ name, email, bio });
        setEditedName(name);
        setEditedBio(bio ?? "");
      } catch (err) {
        console.error("유저 정보 불러오기 실패:", err);
      }
    };
    fetchUserInfo();
  }, []);

  const handleImageClick = () => {
    imageInputRef.current?.click();
  };
  //LP 이미지 관리 함수
  //URL.createObjectURL(file)를 이용하면, 사용자가 선택한 이미지를 즉시 화면에 보여줄 수 있음
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setLpImage(URL.createObjectURL(file)); // 임시 URL 생성
    }
  };
  // LP 생성 API
  const createLp = async (data: {
    title: string;
    content: string;
    thumbnail: string;
    tags: string[];
    published: boolean;
  }) => {
    const res = await axios.post(
      `${import.meta.env.VITE_API_BASE_URL}v1/lps`,
      data
    );
    return res.data;
  };

  const createLpMutation = useMutation({ mutationFn: createLp });

  const updateUser = async (data: { name: string; bio?: string }) => {
    const res = await axios.patch(
      `${import.meta.env.VITE_API_BASE_URL}v1/users`,
      data,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      }
    );
    return res.data;
  };

  const updateUserMutation = useMutation({
    mutationFn: updateUser,
    onSuccess: () => {
      setUserInfo((prev) =>
        prev ? { ...prev, name: editedName, bio: editedBio } : null
      );
      alert("유저 정보 수정 성공!");
      setItem("userName", editedName); // 로컬스토리지
      updateUserName(editedName); // Optimistic Update 전역 반영
      setIsEditing(false);
    },
    onError: () => {
      alert("수정 실패! 다시 시도해주세요.");
    },
  });

  return (
    <div className="w-full bg-black text-white min-h-screen relative">
      {/* 사용자 정보 */}
      <div className="flex items-center gap-4 p-6 border-b border-gray-700">
        <div className="w-20 h-20 rounded-full bg-gray-600" />
        <div>
          {isEditing ? (
            <>
              <input
                className="text-xl font-semibold bg-gray-800 text-white px-2 py-1 rounded mb-1 w-full"
                value={editedName}
                onChange={(e) => setEditedName(e.target.value)}
              />
              <input
                className="text-sm bg-gray-800 text-gray-200 px-2 py-1 rounded w-full"
                value={editedBio}
                onChange={(e) => setEditedBio(e.target.value)}
              />
            </>
          ) : (
            <>
              <h2 className="text-2xl font-semibold">{userInfo?.name}</h2>
              <p className="text-sm text-gray-300">
                {userInfo?.bio ?? "소개 없음"}
              </p>
            </>
          )}
          <p className="text-sm text-gray-400">{userInfo?.email}</p>
        </div>
        <div className="ml-auto text-white">
          {isEditing ? (
            <button
              onClick={() =>
                updateUserMutation.mutate({ name: editedName, bio: editedBio })
              }
            >
              <FiCheck className="text-2xl" />
            </button>
          ) : (
            <button onClick={() => setIsEditing(true)}>
              <FiSettings className="text-2xl" />
            </button>
          )}
        </div>
      </div>

      {/* 탭 */}
      <div className="flex justify-center gap-6 mt-6 text-gray-400 border-b border-gray-600">
        <button className="pb-2 border-b-2 border-white text-white">
          내가 좋아요 한 LP
        </button>
        <button className="pb-2">내가 작성한 LP</button>
      </div>

      {/* 정렬 버튼 */}
      <div className="flex justify-end px-6 mt-4">
        <div className="flex rounded-[10px] overflow-hidden">
          <button
            className={`w-24 px-4 py-1 text-sm font-medium transition ${
              order === "asc" ? "bg-blue-300 text-black" : "bg-black text-white"
            }`}
            onClick={() => setOrder("asc")}
          >
            오래된순
          </button>
          <button
            className={`w-24 px-4 py-1 text-sm font-medium transition ${
              order === "desc"
                ? "bg-blue-300 text-black"
                : "bg-black text-white"
            }`}
            onClick={() => setOrder("desc")}
          >
            최신순
          </button>
        </div>
      </div>

      {/* LP 목록 */}
      <div className="grid grid-cols-3 gap-4 px-6 pb-24 mt-4">
        {[...Array(6)].map((_, idx) => (
          <div
            key={idx}
            className="w-full aspect-square bg-gray-600 rounded-md overflow-hidden"
          >
            <img
              src={exampleimg}
              alt="LP"
              className="w-full h-full object-cover"
            />
          </div>
        ))}
      </div>

      {/* + 버튼 */}
      <button
        onClick={() => setIsModalOpen(true)}
        className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-pink-500 text-white text-3xl font-bold flex items-center justify-center shadow-lg z-50"
      >
        <span className="leading-none pb-[6px]">+</span>
      </button>

      {isModalOpen && (
        <div className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm">
          <div
            ref={modalRef}
            className="absolute left-1/2 top-[170px] p-6 rounded-lg w-96 h-130 -translate-x-1/2  bg-[#1f1f1f]"
          >
            {/* 닫기 버튼 */}
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-2 right-3 text-xl text-gray-300"
            >
              ×
            </button>

            {/* LP 이미지 */}
            <div
              className="relative w-45 h-45 mx-auto mb-4 rounded-full bg-gray-500 flex items-center justify-center overflow-hidden cursor-pointer"
              onClick={handleImageClick}
            >
              {lpImage && (
                <img
                  src={lpImage} //임시 url로 생성됨
                  alt="Preview"
                  className="absolute top-0 left-0 w-full h-full object-cover rounded-full z-10"
                />
              )}
              <div className="w-10 h-10 bg-white rounded-full z-20" />
              <input
                ref={imageInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageChange}
              />
            </div>

            {/* 입력 필드들 */}
            <input
              type="text"
              placeholder="LP Name"
              value={lpTitle}
              onChange={(e) => setLpTitle(e.target.value)}
              className="w-full h-10 mb-2 px-3 py-3 my-3 rounded-[10px] border-1 border-gray-400 bg-gray-800 text-white"
            />
            <input
              type="text"
              placeholder="LP Content"
              value={lpContent}
              onChange={(e) => setLpContent(e.target.value)}
              className="w-full h-10 mb-2 px-3 py-3 my-3 rounded-[10px] border-1 border-gray-400 bg-gray-800 text-white"
            />
            <div className="flex mb-2 gap-2">
              <input
                type="text"
                placeholder="LP Tag"
                value={lpTag}
                onChange={(e) => setLpTag(e.target.value)}
                className="flex-1 h-10 px-3 py-3 my-3 rounded-tl-[10px] rounded-bl-[10px] border-1 border-gray-400 bg-gray-800 text-white"
              />
              <button
                onClick={() => {
                  if (lpTag.trim()) {
                    setTags((prev) => [...prev, lpTag.trim()]);
                    setLpTag("");
                  }
                }}
                className="px-2 h-10 my-3 bg-gray-700 rounded-r border-1 border-gray-400 text-white"
              >
                Add
              </button>
            </div>
            <div className="flex flex-wrap gap-2 mb-2">
              {tags.map((tag, idx) => (
                <span
                  key={idx}
                  className="text-sm bg-gray-700 text-white px-2 py-1 rounded"
                >
                  #{tag}
                </span>
              ))}
            </div>
            <button
              onClick={() => {
                if (!lpTitle || !lpContent || !lpImage) {
                  alert("모든 필드를 입력해주세요.");
                  return;
                }
                createLpMutation.mutate(
                  //Lp 생성을 위한 데이터 입력
                  {
                    title: lpTitle,
                    content: lpContent,
                    thumbnail: lpImage,
                    tags,
                    published: true,
                  },
                  {
                    onSuccess: () => {
                      alert("LP가 성공적으로 생성되었습니다.");
                      setIsModalOpen(false);
                      setLpTitle("");
                      setLpContent("");
                      setTags([]);
                      setLpTag("");
                      setLpImage(null);
                    },
                    onError: () => {
                      alert("생성 실패! 다시 시도해주세요.");
                    },
                  }
                );
              }}
              className="w-full h-10 mt-7 bg-gray-400 text-black py-2 rounded"
            >
              Add LP
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Mypage;
