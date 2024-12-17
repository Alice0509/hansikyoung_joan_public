// app/contexts/LanguageContext.tsx

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useTranslation } from "react-i18next";

interface LanguageContextProps {
  language: string;
  setLanguage: (lang: string) => void;
}

const LanguageContext = createContext<LanguageContextProps>({
  language: "en",
  setLanguage: () => {},
});

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const { i18n } = useTranslation();
  const [language, setLanguageState] = useState<string>("en");

  useEffect(() => {
    const loadLanguage = async () => {
      try {
        const savedLanguage = await AsyncStorage.getItem("APP_LANGUAGE");
        if (savedLanguage) {
          setLanguageState(savedLanguage);
          i18n.changeLanguage(savedLanguage);
        } else {
          const deviceLanguage = i18n.language || "en";
          setLanguageState(deviceLanguage);
          i18n.changeLanguage(deviceLanguage);
        }
      } catch (e) {
        console.error("Failed to load language:", e);
      }
    };
    loadLanguage();
  }, [i18n]);

  const setLanguage = async (lang: string) => {
    try {
      await AsyncStorage.setItem("APP_LANGUAGE", lang);
      setLanguageState(lang);
      i18n.changeLanguage(lang);
    } catch (e) {
      console.error("Failed to set language:", e);
    }
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
