import { ChangeEvent, useEffect, useState } from "react";

interface UseFormProps<T> {
  initialValue: T; // 예시: { email: '', password: '' }
  validate: (values: T) => Record<keyof T, string>; // 값이 유효한지 검증하는 함수
}

function useForm<T>({ initialValue, validate }: UseFormProps<T>) {
  const [values, setValues] = useState(initialValue);
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});

  // 사용자가 입력값을 바꿀 때 실행되는 함수
  function handleChange(name: keyof T, text: string) {
    setValues(function (value) {
      return {
        ...value, // 기존 값 유지
        [name]: text, // 해당 name만 업데이트
      };
    });
  }
  function handleBlur(name: keyof T) {
    setTouched({ ...touched, [name]: true });
  }

  // 입력 필드 속성 가져오기
  function getInputProps(name: keyof T) {
    const value = values[name];
    function onChange(e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
      handleChange(name, e.target.value);
    }

    function onBlur() {
      handleBlur(name);
    }
    return {
      value,
      onChange,
      onBlur,
    };
  }
  //values가 변경 될 떄 마다 에러 검증 로직을 실행함.

  useEffect(() => {
    const newErrors = validate(values);
    setErrors(newErrors);
  }, [validate, values]);

  return { values, errors, touched, getInputProps };
}

export default useForm;
