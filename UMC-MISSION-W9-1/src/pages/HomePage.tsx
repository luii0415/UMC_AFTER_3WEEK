import { useCallback, useMemo, useState } from "react";
import MovieFilter from "../components/MovieFilter";
import MovieList from "../components/MovieList";
import useFetch from "../hooks/useFetch";
import { MovieFilters, MovieResponse } from "../types/movie";

export default function HomePage() {
  const [filters, setFilters] = useState<MovieFilters>({
    query: "코난",
    include_adult: false,
    language: "ko-KR",
  });

  const axiosRequestConfig = useMemo(
    () => ({
      params: filters,
    }),
    [filters]
  );

  const { data, error, loading } = useFetch<MovieResponse>(
    "/search/movie",
    axiosRequestConfig
  );

  //참조값을 고정시키기 (레퍼런스 함수가 됨)
  //setfilter 값이 변경되지 않는한, 같은 함수로 취급
  //단, props로 전달하기 때문에 문제가 됨. -> memo 사용 (memo를 사용해야지 props의 변경 여부 체크함.(리렌더링 여부 결정))
  const handleMovieFilters = useCallback(
    (filters: MovieFilters) => {
      setFilters(filters);
    },
    [setFilters]
  );

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="container">
      <MovieFilter onChange={handleMovieFilters} />
      {loading ? (
        <div>로딩중...</div>
      ) : (
        <MovieList movies={data?.results || []} />
      )}
    </div>
  );
}
