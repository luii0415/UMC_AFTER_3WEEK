import React, { useEffect, useRef, useState } from "react";
import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../contexts/AuthContext";
import { FiMoreVertical, FiEdit2, FiTrash2, FiCheck } from "react-icons/fi"; // React Icons 사용

interface Author {
  id: number;
  name: string;
}

interface Comment {
  id: number;
  content: string;
  lpId: number;
  authorId: number;
  createdAt: string;
  updatedAt: string;
  author: Author;
}

interface CommentResponse {
  data: Comment[];
  nextCursor: number | null;
  hasNext: boolean;
}

const fetchComments = async ({
  pageParam,
  lpId,
  order,
}: {
  pageParam: number | null;
  lpId: string;
  order: "asc" | "desc";
}): Promise<CommentResponse> => {
  const token = localStorage.getItem("accessToken");

  const res = await axios.get(
    `${import.meta.env.VITE_API_BASE_URL}v1/lps/${lpId}/comments`,
    {
      params: { cursor: pageParam, limit: 10, order },
      ...(token && {
        headers: { Authorization: `Bearer ${token}` },
      }),
    }
  );

  return res.data.data;
};

const LpComment = () => {
  const { id: lpId } = useParams();
  const observerRef = useRef<HTMLDivElement | null>(null);
  const { userName } = useAuth();
  const [order, setOrder] = useState<"asc" | "desc">("desc");
  const [inputValue, setInputValue] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editContent, setEditContent] = useState("");
  const [menuOpenId, setMenuOpenId] = useState<number | null>(null);

  const queryClient = useQueryClient();

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
    error,
  } = useInfiniteQuery({
    queryKey: ["lpComments", lpId, order],
    queryFn: ({ pageParam = 0 }) =>
      fetchComments({ pageParam, lpId: lpId!, order }),
    initialPageParam: 0,
    getNextPageParam: (lastPage) =>
      lastPage.hasNext ? lastPage.nextCursor : undefined,
    enabled: !!lpId,
  });

  useEffect(() => {
    if (!observerRef.current || !hasNextPage) return;
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        fetchNextPage();
      }
    });
    observer.observe(observerRef.current);
    return () => observer.disconnect();
  }, [hasNextPage, fetchNextPage]);

  const createMutation = useMutation({
    mutationFn: async (content: string) => {
      const token = localStorage.getItem("accessToken");
      const res = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}v1/lps/${lpId}/comments`,
        { content },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return res.data;
    },
    onSuccess: () => {
      setInputValue("");
      queryClient.invalidateQueries({ queryKey: ["lpComments", lpId, order] });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({
      commentId,
      content,
    }: {
      commentId: number;
      content: string;
    }) => {
      const token = localStorage.getItem("accessToken");
      const res = await axios.patch(
        `${
          import.meta.env.VITE_API_BASE_URL
        }v1/lps/${lpId}/comments/${commentId}`,
        { content },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return res.data;
    },
    onSuccess: () => {
      setEditingId(null);
      setEditContent("");
      queryClient.invalidateQueries({ queryKey: ["lpComments", lpId, order] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (commentId: number) => {
      const token = localStorage.getItem("accessToken");
      const res = await axios.delete(
        `${
          import.meta.env.VITE_API_BASE_URL
        }v1/lps/${lpId}/comments/${commentId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return res.data;
    },
    onSuccess: () => {
      alert("댓글이 삭제되었습니다.");
      queryClient.invalidateQueries({ queryKey: ["lpComments", lpId, order] });
    },
  });

  if (isError) return <div>에러 발생: {error.message}</div>;

  return (
    <div className="p-4 flex flex-col gap-4">
      {/* 정렬 헤더 */}
      <div className="flex justify-between items-center mb-2">
        <span className="text-white text-lg font-bold">댓글</span>
        <div className="flex border border-black rounded-[10px] overflow-hidden text-sm">
          <button
            className={`px-3 py-1 font-medium transition ${
              order === "asc" ? "bg-blue-300 text-black" : "bg-black text-white"
            }`}
            onClick={() => setOrder("asc")}
          >
            오래된순
          </button>
          <button
            className={`px-3 py-1 font-medium transition ${
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

      {/* 댓글 입력 */}
      <div className="flex items-center gap-2">
        <input
          type="text"
          placeholder="댓글을 입력해주세요"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          className="flex-1 px-3 py-2 rounded bg-gray-800 text-white border border-gray-600 text-sm"
        />
        <button
          onClick={() => {
            if (inputValue.trim()) createMutation.mutate(inputValue);
          }}
          className="px-3 py-2 text-sm bg-gray-500 text-white rounded"
        >
          작성
        </button>
      </div>

      {/* 댓글 목록 */}
      <div className="flex flex-col gap-2">
        {data?.pages.map((page) =>
          page.data.map((comment: Comment) => {
            const isAuthor = comment.author.name === userName;
            const isEditing = editingId === comment.id;
            const isMenuOpen = menuOpenId === comment.id;

            return (
              <div
                key={comment.id}
                className="min-h-[80px] flex items-start justify-between py-3 px-2 border-b border-gray-700 relative"
              >
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-pink-600 flex items-center justify-center text-white text-xs font-bold">
                    {comment.author.name.charAt(0)}
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-semibold text-white">
                      {comment.author.name}
                    </span>
                    {isEditing ? (
                      <input
                        type="text"
                        value={editContent}
                        onChange={(e) => setEditContent(e.target.value)}
                        className="text-sm h-7 w-100 mt-1 px-2 py-1 text-white bg-transparent border border-gray-600 rounded "
                      />
                    ) : (
                      <span className="text-sm text-gray-300">
                        {comment.content}
                      </span>
                    )}
                  </div>
                </div>

                {isAuthor && (
                  <div className="relative flex items-center">
                    {!isEditing && (
                      <button
                        onClick={() =>
                          setMenuOpenId((prev) =>
                            prev === comment.id ? null : comment.id
                          )
                        }
                        className="text-white"
                      >
                        <FiMoreVertical />
                      </button>
                    )}

                    {isMenuOpen && (
                      <div className="absolute top-full right-0 mt-1 flex gap-2 bg-[#1f1f1f] p-1 rounded shadow">
                        <button
                          onClick={() => {
                            setEditingId(comment.id);
                            setEditContent(comment.content);
                            setMenuOpenId(null);
                          }}
                          className="text-white"
                        >
                          <FiEdit2 />
                        </button>
                        <button
                          onClick={() => deleteMutation.mutate(comment.id)}
                          className="text-white"
                        >
                          <FiTrash2 />
                        </button>
                      </div>
                    )}

                    {isEditing && (
                      <button
                        onClick={() =>
                          updateMutation.mutate({
                            commentId: comment.id,
                            content: editContent,
                          })
                        }
                        className="text-green-400 text-base ml-2"
                      >
                        <FiCheck />
                      </button>
                    )}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* 로딩 UI */}
      {(isLoading || isFetchingNextPage) && (
        <div className="flex flex-col gap-4 mt-4">
          {Array.from({ length: 6 }).map((_, idx) => (
            <div
              key={idx}
              className="flex items-start gap-3 py-3 px-2 rounded bg-gray-700 animate-pulse"
            >
              <div className="w-8 h-8 rounded-full bg-gray-600" />
              <div className="flex-1 space-y-2">
                <div className="w-24 h-4 bg-gray-600 rounded" />
                <div className="w-full h-4 bg-gray-600 rounded" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 스크롤 트리거 */}
      <div ref={observerRef} className="h-4" />
    </div>
  );
};

export default LpComment;
