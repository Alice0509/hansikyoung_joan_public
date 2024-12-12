//app/contexts/SearchContext.tsx

import React, { createContext, useContext, useState } from "react";

type SearchContextType = {
  keyword: string;
  setKeyword: (keyword: string) => void;
  filter: { category?: string; maxTime?: number };
  setFilter: (filter: { category?: string; maxTime?: number }) => void;
};

type SearchProviderProps = {
  children: React.ReactNode; // ReactNode를 사용하여 자식 요소 타입 정의
};

const SearchContext = createContext<SearchContextType | undefined>(undefined);

export const SearchProvider: React.FC<SearchProviderProps> = ({ children }) => {
  const [keyword, setKeyword] = useState("");
  const [filter, setFilter] = useState<{ category?: string; maxTime?: number }>(
    {},
  );

  return (
    <SearchContext.Provider value={{ keyword, setKeyword, filter, setFilter }}>
      {children}
    </SearchContext.Provider>
  );
};

export const useSearch = () => {
  const context = useContext(SearchContext);
  if (!context) {
    throw new Error("useSearch must be used within a SearchProvider");
  }
  return context;
};
