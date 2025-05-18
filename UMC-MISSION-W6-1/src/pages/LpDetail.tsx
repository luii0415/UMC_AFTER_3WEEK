import React from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import LpComment from "../components/LpComment";

interface Tag {
  id: number;
  name: string;
}

interface Like {
  id: number;
  userId: number;
  lpId: number;
}

interface Author {
  id: number;
  name: string;
  email: string;
  bio: string | null;
  avatar: string | null;
  createdAt: string;
  updatedAt: string;
}

interface LpDetailData {
  id: number;
  title: string;
  content: string;
  thumbnail: string;
  published: boolean;
  authorId: number;
  createdAt: string;
  updatedAt: string;
  tags: Tag[];
  likes: Like[];
  author: Author;
}

function formatTimeAgo(updatedAt: string): string {
  const now = new Date();
  const updated = new Date(updatedAt);
  const diffMs = now.getTime() - updated.getTime();

  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffHours / 24);
  const diffMonths = Math.floor(diffDays / 30);
  const diffYears = Math.floor(diffMonths / 12);

  if (diffYears >= 1) return `${diffYears}년 전`;
  if (diffMonths >= 1) return `${diffMonths}개월 전`;
  if (diffDays >= 1) return `${diffDays}일 전`;
  return `${diffHours}시간 전`;
}

const fetchLpDetail = async (id: string) => {
  const res = await axios.get(
    `${import.meta.env.VITE_API_BASE_URL}v1/lps/${id}`
  );
  console.log(res.data.data);
  return res.data.data;
};

const LpDetail = () => {
  const { id } = useParams();
  const {
    data: lp,
    isLoading,
    isError,
  } = useQuery<LpDetailData>({
    queryKey: ["lpDetail", id],
    queryFn: () => fetchLpDetail(id!),
    enabled: !!id,
  });

  if (isLoading) return <div className="text-white p-4">로딩 중...</div>;
  if (isError || !lp)
    return <div className="text-white p-4">오류가 발생했습니다.</div>;

  return (
    <div>
      <div className="p-4 max-w-xl mx-auto bg-[#1c1c1e] text-white rounded-xl shadow-md">
        <div className="flex justify-between items-center mb-2">
          <div className="font-semibold">{lp.author.name}</div>
          <div className="text-sm text-gray-300">
            {formatTimeAgo(lp.updatedAt)}
          </div>
        </div>

        <h1 className="text-xl font-bold mb-4">{lp.title}</h1>

        {/* 회전 CD */}
        <div
          className="relative animate-spin w-64 h-64 rounded-full overflow-hidden shadow-lg mx-auto my-6"
          style={{ animationDuration: "25s" }}
        >
          {/* 회전 이미지 */}
          <img
            src={lp.thumbnail}
            alt="CD Thumbnail"
            className="w-full h-full object-cover object-center"
          />

          <div className="absolute top-1/2 left-1/2 w-[50px] h-[50px] -translate-x-1/2 -translate-y-1/2 bg-white rounded-full z-10 shadow-inner"></div>
        </div>

        <p className="text-sm text-gray-300 mb-4 whitespace-pre-line">
          {lp.content}
        </p>

        {/* 태그 */}
        {lp.tags?.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {lp.tags.map((tag) => (
              <span
                key={tag.id}
                className="bg-gray-700 text-white text-xs px-3 py-1 rounded-full"
              >
                #{tag.name}
              </span>
            ))}
          </div>
        )}

        {/* 좋아요 */}
        <div className="flex justify-center items-center gap-2">
          <span>❤️</span>
          <span>{lp.likes.length}</span>
        </div>
      </div>

      {/*간격 조정용 */}
      <div className="h-2.5 max-w-xl mx" />

      <div className="p-4 max-w-xl mx-auto bg-[#1c1c1e] text-white rounded-xl shadow-md">
        <LpComment />
      </div>
    </div>
  );
};

export default LpDetail;
