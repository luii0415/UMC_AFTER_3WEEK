import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { useInfiniteQuery } from "@tanstack/react-query";
import { LpCard } from "../components/LpCard";
import { FaSearch } from "react-icons/fa";
import useDebounce from "../hooks/useDebounce";
interface Lp {
  id: number;
  title: string;
  content: string;
  thumbnail: string;
  authorId: number;
  createdAt: string;
  updatedAt: string;
  likes: { id: number; userId: number; lpId: number }[];
}

interface LpApiResponse {
  data: Lp[];
  nextCursor: number | null;
  hasNext: boolean;
}

const Homepage = () => {
  const [order, setOrder] = useState<"asc" | "desc">("desc");
  const [search, setSearch] = useState("");
  const debouncedValue = useDebounce(search, 3000);
  // LP 데이터 페칭 함수
  const fetchLpData = async ({
    pageParam = null,
    order,
    search,
  }: {
    pageParam: number | null;
    order: "asc" | "desc";
    search: string;
  }): Promise<LpApiResponse> => {
    const response = await axios.get(
      `${import.meta.env.VITE_API_BASE_URL}v1/lps`,
      {
        params: {
          cursor: pageParam,
          limit: 12,
          search,
          order,
        },
      }
    );
    return response.data.data;
  };

  const {
    data,
    isLoading,
    isError,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery<LpApiResponse, Error>({
    queryKey: ["lpData", order, debouncedValue], // 검색어가 바뀌면 새로운 쿼리로 인식
    queryFn: ({ pageParam = null }) =>
      fetchLpData({
        pageParam: pageParam as number | null,
        order: order,
        search: debouncedValue,
      }),

    initialPageParam: null,
    getNextPageParam: (lastPage) =>
      lastPage.hasNext ? lastPage.nextCursor : undefined,
    staleTime: 1000 * 30,
  });

  const observerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!observerRef.current || !hasNextPage) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          fetchNextPage();
        }
      },
      { threshold: 1 }
    );

    observer.observe(observerRef.current);
    return () => observer.disconnect();
  }, [hasNextPage, fetchNextPage]);

  if (isLoading) {
    return (
      <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 p-4">
        {Array.from({ length: 12 }).map((_, idx) => (
          <div
            key={idx}
            className="aspect-square rounded shadow-md bg-gray-700 animate-soft-pulse"
          ></div>
        ))}
      </div>
    );
  }

  if (isError) return <div>에러 발생: {(error as Error).message}</div>;

  return (
    <div className="p-4">
      <div className="flex justify-between items-center w-full mb-4">
        {/* 검색창 */}
        <div className="flex items-center gap-2">
          <FaSearch />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="px-2 py-1 border rounded"
            placeholder="검색어를 입력하세요."
          />
        </div>

        {/* 정렬 버튼 */}
        <div className="flex border border-white rounded-[10px] overflow-hidden">
          <button
            className={`w-24 px-4 py-1 text-sm font-medium transition ${
              order === "asc"
                ? "bg-blue-300 text-black"
                : "bg-black text-white border-l border-white"
            }`}
            onClick={() => setOrder("asc")}
          >
            오래된순
          </button>
          <button
            className={`w-24 px-4 py-1 text-sm font-medium transition ${
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
        {data?.pages.map((page) =>
          page.data.map((lp: Lp) => (
            <LpCard
              key={lp.id}
              id={lp.id}
              thumbnail={lp.thumbnail}
              title={lp.title}
              createdAt={lp.createdAt}
              likeCount={lp.likes.length}
            />
          ))
        )}
      </div>

      {/* 로딩 중 스켈레톤 */}
      {isFetchingNextPage && (
        <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 mt-4">
          {Array.from({ length: 6 }).map((_, idx) => (
            <div
              key={idx}
              className="aspect-square rounded shadow-md bg-gray-700 animate-pulse"
            ></div>
          ))}
        </div>
      )}

      {/* 무한 스크롤 트리거 요소 */}
      <div ref={observerRef} className="h-4" />
    </div>
  );
};

export default Homepage;
