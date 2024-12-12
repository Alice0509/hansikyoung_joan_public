import React, { createContext, useContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Text } from "react-native"; // Text 컴포넌트 추가

type LocaleContextType = {
  locale: string;
  setLocale: (locale: string) => void;
};
type LocaleProviderProps = {
  defaultLocale?: string;
  children: React.ReactNode; // ReactNode를 사용하여 자식 요소 타입 정의
};
const LocaleContext = createContext<LocaleContextType | undefined>(undefined);

const supportedLocales = ["en", "de"]; // 지원 언어 목록

export const LocaleProvider: React.FC<LocaleProviderProps> = ({
  children,
  defaultLocale = "en",
}) => {
  const [locale, setLocaleState] = useState<string>(defaultLocale);

  useEffect(() => {
    const loadLocale = async () => {
      try {
        const storedLocale = await AsyncStorage.getItem("locale");
        if (storedLocale && supportedLocales.includes(storedLocale)) {
          setLocaleState(storedLocale);
        }
      } catch (error) {
        console.error("Error loading locale:", error);
      }
    };
    loadLocale();
  }, [defaultLocale]);

  const updateLocale = async (newLocale: string) => {
    if (!supportedLocales.includes(newLocale)) {
      throw new Error(`Unsupported locale: ${newLocale}`);
    }
    try {
      setLocaleState(newLocale);
      await AsyncStorage.setItem("locale", newLocale);
    } catch (error) {
      console.error("Error updating locale:", error);
    }
  };

  return (
    <LocaleContext.Provider value={{ locale, setLocale: updateLocale }}>
      {/* <Text>는 필요한 경우 텍스트를 출력할 때만 사용 */}
      <>{children}</>
    </LocaleContext.Provider>
  );
};

export const useLocale = () => {
  const context = useContext(LocaleContext);
  if (!context) {
    throw new Error("useLocale must be used within a LocaleProvider");
  }
  return context;
};
