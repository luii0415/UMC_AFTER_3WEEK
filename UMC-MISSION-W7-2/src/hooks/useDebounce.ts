import { useEffect, useState } from "react";

function useDebounce<T>(value: T, delay: number) {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  //value나 delay가 변경될 때 마다 실행
  useEffect(() => {
    //delay(ms)후에 실행된다.
    //delay 시간 후에 value 를 debouncedValue로 업데이트하는 타이머를 시작
    const hander = setTimeout(() => setDebouncedValue(value), delay);

    //value가 변경되면, 기존 타이머를 지워서 업데이트를 취소
    //값이 바뀔때마다 마지막에 멈춘 값만 업데이트
    return () => clearTimeout(hander);
  }, [value, delay]);

  return debouncedValue;
}

export default useDebounce;
