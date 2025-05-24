import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export interface LpCardProps {
  id: number;
  thumbnail: string;
  title: string;
  createdAt: string;
  likeCount: number;
}

export const LpCard = ({
  id,
  thumbnail,
  title,
  createdAt,
  likeCount,
}: LpCardProps) => {
  const navigate = useNavigate();
  const { isLoggedIn } = useAuth();

  const handleClick = () => {
    if (!isLoggedIn) {
      if (window.confirm("로그인이 필요한 서비스입니다. 로그인하시겠습니까?")) {
        navigate("/login");
      }
    } else {
      navigate(`/lp/${id}`);
    }
  };

  return (
    <div
      className="relative aspect-square overflow-hidden rounded shadow-md transition-transform hover:scale-105 cursor-pointer"
      onClick={handleClick}
    >
      <img
        src={thumbnail}
        alt={title}
        className="w-full h-full object-cover object-center"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 hover:opacity-100 transition-opacity flex flex-col justify-end p-3 text-white">
        <h3 className="text-sm font-semibold">{title}</h3>
        <p className="text-xs">{new Date(createdAt).toLocaleDateString()}</p>
        <p className="text-xs">♡ {likeCount}</p>
      </div>
    </div>
  );
};
