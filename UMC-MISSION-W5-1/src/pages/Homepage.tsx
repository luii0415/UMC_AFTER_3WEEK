import React, { useState } from "react";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { LpCard } from "../components/LpCard";

const fetchLpData = async (order: "asc" | "desc") => {
  const response = await axios.get(
    `${import.meta.env.VITE_API_BASE_URL}v1/lps`,
    {
      params: {
        number: 0,
        limit: 30,
        search: "",
        order: order,
      },
    }
  );
  return response.data;
};

const Homepage = () => {
  const [order, setOrder] = useState<"asc" | "desc">("desc");

  const {
    data: lpData,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["lpData", order],
    queryFn: () => fetchLpData(order),
    staleTime: 1000 * 30,
  });

  if (isLoading) return <div>로딩 중...</div>;
  if (isError) return <div>에러 발생: {(error as Error).message}</div>;

  return (
    <div className="p-4">
      {/* 정렬 버튼 */}
      <div className="flex justify-end mb-4">
        <div className="flex border border-white rounded overflow-hidden">
          <button
            className={`px-4 py-1 text-sm font-medium transition ${
              order === "asc"
                ? "bg-blue-300 text-black"
                : "bg-black text-white border-l border-white"
            }`}
            onClick={() => setOrder("asc")}
          >
            오래된순
          </button>
          <button
            className={`px-4 py-1 text-sm font-medium transition ${
              order === "desc"
                ? "bg-blue-300 text-black"
                : "bg-black text-white border-l border-white"
            }`}
            onClick={() => setOrder("desc")}
          >
            최신순
          </button>
        </div>
      </div>

      {/* LP 카드 목록 */}
      <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
        {lpData.data.data.map((lp: any) => (
          <LpCard
            key={lp.id}
            id={lp.id}
            thumbnail={lp.thumbnail}
            title={lp.title}
            createdAt={lp.createdAt}
            likeCount={lp.likes.length}
          />
        ))}
      </div>
    </div>
  );
};

export default Homepage;
