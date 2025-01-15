// app/contexts/ThemeContext.tsx

import React, { createContext, useContext, useState, ReactNode } from 'react';

interface ThemeColors {
  background: string;
  text: string;
  primary: string;
  secondary: string;
  buttonBackground: string;
  buttonText: string;
  activeButtonBackground: string;
  linkText: string;
  linkedRowBackground: string;
  stepSectionBackground: string;
  stepBackground: string;
  currentStepBorder: string;
  tableHeaderBackground: string; // 테이블 헤더 배경색 추가
  accordionBackground: string; // 아코디언 배경색 추가
  accordionBodyBackground: string; // 아코디언 본문 배경색 추가
}

interface ThemeContextProps {
  theme: 'light' | 'dark';
  colors: ThemeColors;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextProps>({
  theme: 'light',
  colors: {
    background: '#f5f5f5',
    text: '#000',
    primary: '#007AFF',
    secondary: '#34C759',
    buttonBackground: '#007AFF',
    buttonText: '#fff',
    activeButtonBackground: '#005BBB',
    linkText: '#007AFF',
    linkedRowBackground: '#e6f7ff',
    stepSectionBackground: '#fff',
    stepBackground: '#f9f9f9',
    currentStepBorder: '#007AFF',
    tableHeaderBackground: '#e6f7ff',
    accordionBackground: '#E0E0E0', // 라이트 모드 아코디언 배경색
    accordionBodyBackground: '#F9F9F9', // 라이트 모드 아코디언 본문 배경색
  },
  toggleTheme: () => {},
});

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  const colors: ThemeColors =
    theme === 'light'
      ? {
          background: '#f5f5f5',
          text: '#000',
          primary: '#007AFF',
          secondary: '#34C759',
          buttonBackground: '#007AFF',
          buttonText: '#fff',
          activeButtonBackground: '#005BBB',
          linkText: '#007AFF',
          linkedRowBackground: '#e6f7ff',
          stepSectionBackground: '#fff',
          stepBackground: '#f9f9f9',
          currentStepBorder: '#007AFF',
          tableHeaderBackground: '#e6f7ff',
          accordionBackground: '#E0E0E0', // 라이트 모드 아코디언 배경색
          accordionBodyBackground: '#F9F9F9', // 라이트 모드 아코디언 본문 배경색
        }
      : {
          background: '#121212',
          text: '#fff',
          primary: '#0A84FF',
          secondary: '#30D158',
          buttonBackground: '#0A84FF',
          buttonText: '#fff',
          activeButtonBackground: '#005BBB',
          linkText: '#0A84FF',
          linkedRowBackground: '#1e1e1e',
          stepSectionBackground: '#1e1e1e',
          stepBackground: '#1e1e1e',
          currentStepBorder: '#0A84FF',
          tableHeaderBackground: '#2c2c2c',
          accordionBackground: '#1e1e1e', // 다크 모드 아코디언 배경색
          accordionBodyBackground: '#2c2c2c', // 다크 모드 아코디언 본문 배경색
        };

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  return (
    <ThemeContext.Provider value={{ theme, colors, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
