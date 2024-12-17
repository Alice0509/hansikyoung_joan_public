// app/screens/SettingsScreen.tsx

import React from "react";
import {
  View,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Button,
  Linking,
} from "react-native";
import { useTranslation } from "react-i18next";
import { useLanguage } from "../contexts/LanguageContext";
import { useTheme } from "../contexts/ThemeContext";
import { useFontSize } from "../contexts/FontSizeContext";
import Ionicons from "@expo/vector-icons/Ionicons"; // 아이콘 사용
import CustomText from "../components/CustomText";

const SettingsScreen: React.FC = () => {
  const { t } = useTranslation();
  const { language, setLanguage } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  const { fontSize, setFontSize } = useFontSize();

  // 웹사이트 주소
  const websiteURL = "https://www.leckere-koreanische-rezepte.de/";

  const changeLanguage = async (lang: string) => {
    await setLanguage(lang);
  };

  const increaseFontSize = () => {
    setFontSize(Math.min(fontSize + 2, 30)); // 최대 30
  };

  const decreaseFontSize = () => {
    setFontSize(Math.max(fontSize - 2, 12)); // 최소 12
  };

  const openWebsite = () => {
    Linking.openURL(websiteURL).catch((err) =>
      console.error("Failed to open URL:", err),
    );
  };

  const sendFeedback = () => {
    Linking.openURL(
      "mailto:joan.korean.rezepte@gmail.com?subject=Feedback&body=Your feedback here",
    ).catch((err) => console.error("Failed to send feedback:", err));
  };

  const logout = () => {
    // 로그아웃 로직 구현 (예: 인증 상태 초기화)
    alert("The logout function has not been implemented yet.");
  };

  const openPrivacyPolicy = () => {
    Linking.openURL(
      "https://www.leckere-koreanische-rezepte.de/privacy-policy",
    ).catch((err) => console.error("Failed to open privacy policy:", err));
  };

  // 현재 테마와 글꼴 크기를 기반으로 동적으로 스타일 생성
  const styles = getStyles(theme, fontSize);

  return (
    <View style={styles.container}>
      <CustomText style={styles.title}>{t("settings")}</CustomText>

      {/* 언어 설정 */}
      <CustomText style={styles.label}>{t("language")}:</CustomText>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[
            styles.button,
            language === "en" ? styles.activeButton : null,
          ]}
          onPress={() => changeLanguage("en")}
        >
          <CustomText style={styles.buttonText}>{t("english")}</CustomText>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.button,
            language === "de" ? styles.activeButton : null,
          ]}
          onPress={() => changeLanguage("de")}
        >
          <CustomText style={styles.buttonText}>{t("german")}</CustomText>
        </TouchableOpacity>
      </View>

      {/* 테마 설정 */}
      <CustomText style={styles.label}>{t("theme")}:</CustomText>
      <TouchableOpacity style={styles.button} onPress={toggleTheme}>
        <CustomText style={styles.buttonText}>
          {theme === "light" ? t("dark_mode") : t("light_mode")}
        </CustomText>
      </TouchableOpacity>

      {/* 글꼴 크기 조절 */}
      <CustomText style={styles.label}>{t("font_size")}:</CustomText>
      <View style={styles.fontSizeContainer}>
        <TouchableOpacity style={styles.smallButton} onPress={decreaseFontSize}>
          <CustomText style={styles.fontSizeButtonText}>-</CustomText>
        </TouchableOpacity>
        <CustomText style={styles.fontSizeText}>{fontSize}px</CustomText>
        <TouchableOpacity style={styles.smallButton} onPress={increaseFontSize}>
          <CustomText style={styles.fontSizeButtonText}>+</CustomText>
        </TouchableOpacity>
      </View>

      {/* 피드백 */}
      <CustomText style={styles.label}>{t("feedback")}:</CustomText>
      <TouchableOpacity style={styles.button} onPress={sendFeedback}>
        <CustomText style={styles.buttonText}>{t("send_feedback")}</CustomText>
      </TouchableOpacity>

      {/* 로그아웃 */}
      <CustomText style={styles.label}>{t("account")}:</CustomText>
      <TouchableOpacity style={styles.button} onPress={logout}>
        <CustomText style={styles.buttonText}>{t("logout")}</CustomText>
      </TouchableOpacity>

      {/* 개인정보 보호 정책 */}
      <CustomText style={styles.label}>{t("privacy_policy")}:</CustomText>
      <TouchableOpacity style={styles.button} onPress={openPrivacyPolicy}>
        <CustomText style={styles.buttonText}>
          https://www.leckere-koreanische-rezepte.de/privacy-policy
        </CustomText>
      </TouchableOpacity>

      {/* 앱 정보 (웹사이트 링크) */}
      <CustomText style={styles.label}>{t("app_info")}:</CustomText>
      <TouchableOpacity style={styles.button} onPress={openWebsite}>
        <CustomText style={styles.buttonText}>
          https://www.leckere-koreanische-rezepte.de/
        </CustomText>
      </TouchableOpacity>
    </View>
  );
};

// 테마와 글꼴 크기에 따라 동적으로 스타일 생성
const getStyles = (theme: string, fontSize: number) =>
  StyleSheet.create({
    container: {
      flex: 1,
      padding: 20,
      backgroundColor: theme === "dark" ? "#000" : "#fff",
    },
    title: {
      fontWeight: "bold",
      marginBottom: 20,
      color: theme === "dark" ? "#fff" : "#000",
      fontSize: fontSize + 4,
    },
    label: {
      marginTop: 20,
      marginBottom: 10,
      color: theme === "dark" ? "#fff" : "#000",
      fontSize: fontSize,
    },
    buttonContainer: {
      flexDirection: "row",
      justifyContent: "space-around",
    },
    button: {
      padding: 10,
      backgroundColor: "#007AFF",
      borderRadius: 5,
      marginVertical: 10,
      alignItems: "center",
    },
    activeButton: {
      backgroundColor: "#005BBB",
    },
    buttonText: {
      color: "#fff",
      fontSize: fontSize,
    },
    fontSizeContainer: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-around",
      marginVertical: 10,
    },
    smallButton: {
      padding: 10,
      backgroundColor: "#007AFF",
      borderRadius: 5,
    },
    fontSizeButtonText: {
      color: "#fff",
      fontSize: 20,
    },
    fontSizeText: {
      fontSize: 16,
      color: theme === "dark" ? "#fff" : "#000",
    },
  });

export default SettingsScreen;
