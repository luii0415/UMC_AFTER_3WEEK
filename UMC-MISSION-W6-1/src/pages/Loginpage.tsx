import React from "react";
import { UserSignInInformation, vaildateSignin } from "../utils/vaildate";
import useForm from "../hooks/useForm";
import useLocalStorage from "../hooks/useLocalStorage";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useMutation } from "@tanstack/react-query"; // 추가

function Loginpage() {
  const { values, errors, touched, getInputProps } =
    useForm<UserSignInInformation>({
      initialValue: {
        email: "",
        password: "",
      },
      validate: vaildateSignin,
    });

  const nav = useNavigate();
  const { login } = useAuth();

  //로그인 API 요청을 mutation으로 분리
  const loginMutation = useMutation({
    mutationFn: async (info: UserSignInInformation) => {
      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}v1/auth/signin`,
        {
          email: info.email,
          password: info.password,
        }
      );
      return response.data.data;
    },
    onSuccess: ({ accessToken, refreshToken, name }) => {
      login(accessToken, refreshToken, name); // context에 로그인 상태 업데이트
      alert("로그인 성공!");
      nav("/");
    },
    onError: (error) => {
      console.error("로그인 실패:", error);
      alert("로그인에 실패했습니다. 다시 시도해주세요.");
    },
  });

  function handleSubmit() {
    loginMutation.mutate({
      email: values.email,
      password: values.password,
    });
  }

  const isDisabled =
    Object.values(errors || {}).some((error) => error.length > 0) ||
    Object.values(values).some((value) => value === "");

  const handleGoogleLogin = () => {
    window.location.href =
      import.meta.env.VITE_API_BASE_URL + "v1/auth/google/login";
  };

  return (
    <div className="flex flex-col items-center justify-center h-full bg-white px-4">
      <div className="flex flex-col gap-3">
        <input
          {...getInputProps("email")}
          className={`border border-[#ccc] w-[300px] p-[10px] focus:border-[#807bff] rounded-sm ${
            errors?.email && touched?.email
              ? "border-red-500 bg-red-200"
              : "bg-gray-200"
          }`}
          type="email"
          placeholder="이메일"
        />
        {errors?.email && touched?.email && (
          <div className="text-red-500 text-sm">{errors.email}</div>
        )}
        <input
          {...getInputProps("password")}
          className={`border border-[#ccc] w-[300px] p-[10px] focus:border-[#807bff] rounded-sm ${
            errors?.password && touched?.password
              ? "border-red-500 bg-red-200"
              : "bg-gray-200"
          }`}
          type="password"
          placeholder="비밀번호"
        />
        {errors?.password && touched?.password && (
          <div className="text-red-500 text-sm">{errors.password}</div>
        )}
        <button
          type="button"
          onClick={handleSubmit}
          disabled={isDisabled || loginMutation.isPending} // 요청 중엔 비활성화
          className="w-full bg-blue-600 text-white py-3 rounded-md text-lg font-medium hover:bg-blue-700 transition-colors cursor-pointer disabled:bg-gray-300"
        >
          {loginMutation.isPending ? "로그인 중..." : "로그인"}
        </button>
        <button
          type="button"
          onClick={handleGoogleLogin}
          className="w-full bg-blue-600 text-white py-3 rounded-md text-lg font-medium hover:bg-blue-700 transition-colors"
        >
          구글 로그인
        </button>
      </div>
    </div>
  );
}

export default Loginpage;
