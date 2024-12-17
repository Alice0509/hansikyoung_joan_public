// app/contexts/FontSizeContext.tsx

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface FontSizeContextProps {
  fontSize: number;
  setFontSize: (size: number) => void;
}

const FontSizeContext = createContext<FontSizeContextProps>({
  fontSize: 16,
  setFontSize: () => {},
});

export const FontSizeProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [fontSize, setFontSizeState] = useState<number>(16);

  useEffect(() => {
    const loadFontSize = async () => {
      try {
        const savedFontSize = await AsyncStorage.getItem("APP_FONT_SIZE");
        if (savedFontSize) {
          setFontSizeState(parseInt(savedFontSize, 10));
        }
      } catch (e) {
        console.error("Failed to load font size:", e);
      }
    };
    loadFontSize();
  }, []);

  useEffect(() => {
    const saveFontSize = async () => {
      try {
        await AsyncStorage.setItem("APP_FONT_SIZE", fontSize.toString());
      } catch (e) {
        console.error("Failed to save font size:", e);
      }
    };
    saveFontSize();
  }, [fontSize]);

  const setFontSize = (size: number) => {
    setFontSizeState(size);
  };

  return (
    <FontSizeContext.Provider value={{ fontSize, setFontSize }}>
      {children}
    </FontSizeContext.Provider>
  );
};

export const useFontSize = () => useContext(FontSizeContext);
