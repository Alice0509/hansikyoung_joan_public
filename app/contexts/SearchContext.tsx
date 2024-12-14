// app/contexts/SearchContext.tsx

import React, { createContext, useContext, useState, ReactNode } from "react";

interface SearchContextProps {
  keyword: string;
  setKeyword: (keyword: string) => void;
  filter: {
    category: string | null;
  };
  setFilter: (filter: { category: string | null }) => void;
}

const SearchContext = createContext<SearchContextProps | undefined>(undefined);

export const SearchProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [keyword, setKeyword] = useState<string>("");
  const [filter, setFilter] = useState<{ category: string | null }>({
    category: null,
  });

  return (
    <SearchContext.Provider value={{ keyword, setKeyword, filter, setFilter }}>
      {children}
    </SearchContext.Provider>
  );
};

export const useSearch = (): SearchContextProps => {
  const context = useContext(SearchContext);
  if (!context) {
    throw new Error("useSearch must be used within a SearchProvider");
  }
  return context;
};
