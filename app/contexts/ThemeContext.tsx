// app/contexts/ThemeContext.tsx

import React, { createContext, useContext, useState, ReactNode } from "react";

type Theme = "light" | "dark";

interface ThemeContextProps {
  theme: Theme;
  toggleTheme: () => void;
  colors: {
    background: string;
    text: string;
    primary: string;
    secondary: string;
    buttonBackground: string;
    buttonText: string;
    activeButtonBackground: string;
  };
}

const ThemeContext = createContext<ThemeContextProps | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<Theme>("light");

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  const colors = theme === "light"
    ? {
        background: "#f5f5f5",
        text: "#000",
        primary: "#007AFF",
        secondary: "#34C759",
        buttonBackground: "#007AFF",
        buttonText: "#fff",
        activeButtonBackground: "#005BBB",
      }
    : {
        background: "#121212",
        text: "#fff",
        primary: "#0A84FF",
        secondary: "#30D158",
        buttonBackground: "#0A84FF",
        buttonText: "#fff",
        activeButtonBackground: "#005BBB",
      };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, colors }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextProps => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};
