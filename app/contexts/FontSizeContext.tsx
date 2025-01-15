// app/contexts/FontSizeContext.tsx

import React, { createContext, useState, useContext, ReactNode } from 'react';

interface FontSizeContextProps {
  fontSize: number;
  setFontSize: (size: number) => void;
}

const FontSizeContext = createContext<FontSizeContextProps | undefined>(
  undefined,
);

export const FontSizeProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [fontSize, setFontSize] = useState(16);

  return (
    <FontSizeContext.Provider value={{ fontSize, setFontSize }}>
      {children}
    </FontSizeContext.Provider>
  );
};

export const useFontSize = (): FontSizeContextProps => {
  const context = useContext(FontSizeContext);
  if (!context) {
    throw new Error('useFontSize must be used within a FontSizeProvider');
  }
  return context;
};
