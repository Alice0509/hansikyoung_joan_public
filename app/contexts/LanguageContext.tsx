// app/contexts/LanguageContext.tsx

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTranslation } from 'react-i18next';

interface LanguageContextProps {
  language: 'en' | 'de'; // 'en' 또는 'de'로 제한
  setLanguage: (lang: 'en' | 'de') => void;
}

const LanguageContext = createContext<LanguageContextProps>({
  language: 'en',
  setLanguage: () => {},
});

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const { i18n } = useTranslation();
  const [language, setLanguageState] = useState<'en' | 'de'>('en');

  useEffect(() => {
    const loadLanguage = async () => {
      try {
        const savedLanguage = await AsyncStorage.getItem('APP_LANGUAGE');
        if (savedLanguage === 'de' || savedLanguage === 'en') {
          setLanguageState(savedLanguage);
          i18n.changeLanguage(savedLanguage);
        } else {
          // 기본 언어 설정 (디바이스 언어를 기반으로 할 수도 있음)
          const deviceLanguage = i18n.language.startsWith('de') ? 'de' : 'en';
          setLanguageState(deviceLanguage);
          i18n.changeLanguage(deviceLanguage);
        }
      } catch (e) {
        console.error('Failed to load language:', e);
      }
    };
    loadLanguage();
  }, [i18n]);

  const setLanguage = async (lang: 'en' | 'de') => {
    try {
      await AsyncStorage.setItem('APP_LANGUAGE', lang);
      setLanguageState(lang);
      i18n.changeLanguage(lang);
    } catch (e) {
      console.error('Failed to set language:', e);
    }
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
