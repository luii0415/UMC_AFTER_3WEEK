import React from "react";
import { UserSignInInformation, vaildateSignin } from "../utils/vaildate";
import useForm from "../hooks/useForm";
import useLocalStorage from "../hooks/useLocalStorage";
import axios from "axios";
import { useNavigate } from "react-router-dom";

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
  const { setItem } = useLocalStorage();

  //로그인 API 요청
  async function handleSubmit() {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}v1/auth/signin`,
        {
          email: values.email,
          password: values.password,
        }
      );
      console.log(response);

      const { accessToken, refreshToken } = response.data.data;

      setItem("accessToken", accessToken);
      setItem("refreshToken", refreshToken);

      alert("로그인 성공!");

      nav("/");
    } catch (error) {
      console.error("로그인 실패:", error);
      alert("로그인에 실패했습니다. 다시 시도해주세요.");
    }
  }

  //오류가 하나도 없거나, 입력값이 비어있으면 버튼 비활성화
  const isDisabled =
    Object.values(errors || {}).some((error) => error.length > 0) || //오류가 있으면 true
    Object.values(values).some((value) => value === ""); //입력값이 비어있으면 true

  /**  이렇게도 가능
     * const isDisabled =
    Object.values(errors || {}).some((error) => error.length >0) ||
    !values.email ||
    !values.password; */

  return (
    <div className="flex flex-col items-center justify-center h-full gap-4">
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
        {/*에러 처리*/}
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
          disabled={isDisabled}
          className="w-full bg-blue-600 text-white py-3 rounded-md text-lg font-medium hover:bg-blue-700 translation-colors cursor-pointer disabled:bg-gray-300"
        >
          로그인
        </button>
      </div>
    </div>
  );
}

export default Loginpage;
