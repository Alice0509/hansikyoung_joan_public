// app/i18n.ts

import i18n from "i18next";
import { initReactI18next } from "react-i18next";

// 번역 파일 임포트
import en from "./locales/en.json";
import de from "./locales/de.json";

i18n
  .use(initReactI18next) // react-i18next 플러그인 사용
  .init({
    resources: {
      en: { translation: en },
      de: { translation: de },
    },
    lng: "en", // 기본 언어
    fallbackLng: "en",
    interpolation: {
      escapeValue: false, // React는 XSS 보호를 자체적으로 함
    },
  });

export default i18n;
