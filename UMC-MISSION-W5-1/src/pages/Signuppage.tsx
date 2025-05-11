import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, ChevronLeft } from "lucide-react";
import useLocalStorage from "../hooks/useLocalStorage";
import { useNavigate } from "react-router-dom";
import axios from "axios";

// 이메일 입력용 스키마
const emailSchema = z.object({
  email: z.string().email({ message: "올바른 이메일 형식을 입력해주세요." }),
});

// 비밀번호 입력용 스키마
const passwordSchema = z
  .object({
    password: z
      .string()
      .min(8, { message: "비밀번호는 8자 이상이어야 합니다." }),
    confirmPassword: z
      .string()
      .min(8, { message: "비밀번호는 8자 이상이어야 합니다." }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "비밀번호가 일치하지 않습니다.",
  });

// 닉네임 입력용 스키마
const nicknameSchema = z.object({
  nickname: z.string().min(1, { message: "닉네임을 입력해주세요." }),
});

type EmailForm = z.infer<typeof emailSchema>;
type PasswordForm = z.infer<typeof passwordSchema>;
type NicknameForm = z.infer<typeof nicknameSchema>;

function SignupPage() {
  const [step, setStep] = useState(1);
  const { setItem, getItem, removeItem } = useLocalStorage();
  const nav = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // 이메일 폼
  const {
    register: registerEmail,
    handleSubmit: handleSubmitEmail,
    formState: { errors: emailErrors, isValid: isEmailValid },
  } = useForm<EmailForm>({
    resolver: zodResolver(emailSchema),
    mode: "onChange",
  });

  // 비밀번호 폼
  const {
    register: registerPassword,
    handleSubmit: handleSubmitPassword,
    formState: { errors: passwordErrors, isValid: isPasswordValid },
  } = useForm<PasswordForm>({
    resolver: zodResolver(passwordSchema),
    mode: "onChange",
  });

  // 닉네임 폼
  const {
    register: registerNickname,
    handleSubmit: handleSubmitNickname,
    formState: { errors: nicknameErrors, isValid: isNicknameValid },
  } = useForm<NicknameForm>({
    resolver: zodResolver(nicknameSchema),
    mode: "onChange",
  });

  const onEmailSubmit = (data: EmailForm) => {
    setItem("email", data.email);
    setStep(2);
  };

  const onPasswordSubmit = (data: PasswordForm) => {
    setItem("password", data.password);
    setStep(3);
  };

  //회원가입 API 요청

  const onNicknameSubmit = async (data: NicknameForm) => {
    try {
      setItem("nickname", data.nickname);

      const email = getItem("email");
      const password = getItem("password");
      const name = data.nickname;

      if (!email || !password || !name) {
        alert("회원가입 정보가 올바르지 않습니다.");
        return;
      }

      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}v1/auth/signup`,
        {
          email,
          password,
          name,
        }
      );
      console.log(response);

      // ✅ (추가) 회원가입 성공 후 localStorage에서 email, password, nickname 삭제
      removeItem("email");
      removeItem("password");
      removeItem("nickname");

      alert("회원가입이 완료되었습니다!");
      nav("/login");
    } catch (error) {
      console.error("회원가입 실패:", error);
      alert("회원가입 중 오류가 발생했습니다.");
    }
  };

  //  이전 단계로 이동
  const handlePrevStep = () => {
    if (step > 1) {
      setStep((prev) => prev - 1);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-full bg-white px-4">
      {step === 1 && (
        <form
          onSubmit={handleSubmitEmail(onEmailSubmit)}
          className="flex flex-col gap-4 w-[300px]"
        >
          <div className="flex items-center gap-2 mb-2">
            {/* step 1은 첫 페이지이므로 백버튼 비활성화 */}
            <div className="w-6" />
            <h2 className="text-xl font-bold text-center flex-1">회원가입</h2>
            <div className="w-6" />
          </div>

          <input
            {...registerEmail("email")}
            type="email"
            placeholder="이메일을 입력해주세요!"
            className={`border p-2 rounded ${
              emailErrors.email
                ? "border-red-500 bg-red-100"
                : "border-gray-300"
            }`}
          />
          {emailErrors.email && (
            <div className="text-red-500 text-sm">
              {emailErrors.email.message}
            </div>
          )}

          <button
            type="submit"
            className="bg-black text-white py-2 rounded disabled:bg-gray-400"
            disabled={!isEmailValid}
          >
            다음
          </button>
        </form>
      )}

      {step === 2 && (
        <form
          onSubmit={handleSubmitPassword(onPasswordSubmit)}
          className="flex flex-col gap-4 w-[300px]"
        >
          <div className="flex items-center gap-2 mb-2">
            <button type="button" onClick={handlePrevStep}>
              <ChevronLeft size={24} />
            </button>
            <h2 className="text-xl font-bold text-center flex-1">회원가입</h2>
            <div className="w-6" />
          </div>

          <div className="flex items-center gap-2 border p-2 rounded bg-gray-100">
            {getItem("email")}
          </div>

          <div className="relative">
            <input
              {...registerPassword("password")}
              type={showPassword ? "text" : "password"}
              placeholder="비밀번호"
              className={`border p-2 rounded w-full ${
                passwordErrors.password
                  ? "border-red-500 bg-red-100"
                  : "border-gray-300"
              }`}
            />
            <button
              type="button"
              className="absolute right-2 top-2 text-gray-500"
              onClick={() => setShowPassword((prev) => !prev)}
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          <div className="relative">
            <input
              {...registerPassword("confirmPassword")}
              type={showConfirmPassword ? "text" : "password"}
              placeholder="비밀번호 재확인"
              className={`border p-2 rounded w-full ${
                passwordErrors.confirmPassword
                  ? "border-red-500 bg-red-100"
                  : "border-gray-300"
              }`}
            />
            <button
              type="button"
              className="absolute right-2 top-2 text-gray-500"
              onClick={() => setShowConfirmPassword((prev) => !prev)}
            >
              {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          {passwordErrors.password && (
            <div className="text-red-500 text-sm">
              {passwordErrors.password.message}
            </div>
          )}
          {passwordErrors.confirmPassword && (
            <div className="text-red-500 text-sm">
              {passwordErrors.confirmPassword.message}
            </div>
          )}

          <button
            type="submit"
            className="bg-pink-500 text-white py-2 rounded disabled:bg-gray-400"
            disabled={!isPasswordValid}
          >
            다음
          </button>
        </form>
      )}

      {step === 3 && (
        <form
          onSubmit={handleSubmitNickname(onNicknameSubmit)}
          className="flex flex-col gap-4 w-[300px]"
        >
          <div className="flex items-center gap-2 mb-2">
            <button type="button" onClick={handlePrevStep}>
              <ChevronLeft size={24} />
            </button>
            <h2 className="text-xl font-bold text-center flex-1">회원가입</h2>
            <div className="w-6" />
          </div>

          <div className="mx-auto mb-4 h-28 w-28 rounded-full bg-gray-400" />

          <input
            {...registerNickname("nickname")}
            type="text"
            placeholder="닉네임 입력"
            className={`border p-2 rounded ${
              nicknameErrors.nickname
                ? "border-red-500 bg-red-100"
                : "border-gray-300"
            }`}
          />
          {nicknameErrors.nickname && (
            <div className="text-red-500 text-sm">
              {nicknameErrors.nickname.message}
            </div>
          )}

          <button
            type="submit"
            className="bg-black text-white py-2 rounded disabled:bg-gray-400"
            disabled={!isNicknameValid}
          >
            회원가입 완료
          </button>
        </form>
      )}
    </div>
  );
}

export default SignupPage;
