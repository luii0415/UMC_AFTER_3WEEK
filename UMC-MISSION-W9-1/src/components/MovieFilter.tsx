import { memo, useState } from "react";
import { MovieLanguage, MovieFilters } from "../types/movie";
import Input from "./Input";
import SelectBox from "./SelectBox";
import LanguageSelector from "./LanguageSelector";
import { LANGUAGE_OPTIONS } from "../constants/movie";

interface MovieFilerProps {
  onChange: (filter: MovieFilters) => void;
}
const MovieFilter = ({ onChange }: MovieFilerProps) => {
  const [query, setQuery] = useState<string>("코난");
  const [includeAdult, setIncludeAdult] = useState<boolean>(false);
  const [language, setLanguage] = useState("ko-KR");

  const handleSubmit = () => {
    const filters: MovieFilters = {
      query,
      include_adult: includeAdult,
      language,
    };
    console.log(filters);
    onChange(filters);
  };

  return (
    <div className="transform space-y-6 rounded-2xl border border-gray-400 bg-white p-6 shadow-xl transition-all hover:shadow-2xl">
      <div className="flex flex-wrap gap-6">
        <div className="min-w-[450px] flex-1">
          <label className="mb-2 block text-sm font-medium text-gray-700">
            영화 제목
          </label>
          <Input
            value={query}
            onChange={setQuery}
            placeholder="검색어를 입력하세요."
          />
        </div>

        <div className="min-w-[250px] flex-1">
          <label className="mb-2 block text-sm font-medium text-gray-700">
            옵션
          </label>
          <SelectBox
            checked={includeAdult}
            onChange={setIncludeAdult}
            label="성인 콘텐츠 표시"
            id="include_adult"
            className="w-full rounded-lg border border-gray-300 px-4 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <div className="min-w-[250px] flex-1">
        <label className="mb-2 block text-sm font-medium text-gray-700">
          옵션
        </label>
        <LanguageSelector
          value={language}
          onChange={setLanguage}
          options={LANGUAGE_OPTIONS}
          className="w-full rounded-lg border border-gray-300 px-4 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div className="pt-4">
        <button
          onClick={handleSubmit}
          className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          영화 검색
        </button>
      </div>
    </div>
  );
};

//homepage의 28번 주석 내용을 이유로 memo로 감쌈.
export default memo(MovieFilter);
