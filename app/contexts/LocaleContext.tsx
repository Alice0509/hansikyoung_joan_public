// app/contexts/LocaleContext.tsx

import React, { createContext, useContext, useState, ReactNode } from "react";

interface LocaleContextProps {
  locale: string;
  setLocale: (locale: string) => void;
}

const LocaleContext = createContext<LocaleContextProps | undefined>(undefined);

export const LocaleProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [locale, setLocale] = useState<string>("en");

  return (
    <LocaleContext.Provider value={{ locale, setLocale }}>
      {children}
    </LocaleContext.Provider>
  );
};

export const useLocale = (): LocaleContextProps => {
  const context = useContext(LocaleContext);
  if (!context) {
    throw new Error("useLocale must be used within a LocaleProvider");
  }
  return context;
};
