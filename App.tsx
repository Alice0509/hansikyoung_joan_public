// app/App.tsx

import React from "react";
import { SafeAreaView, StyleSheet } from "react-native";
import MainNavigator from "./app/navigation/MainNavigator";
import { FavoritesProvider } from "./app/contexts/FavoritesContext";
import { SearchProvider } from "./app/contexts/SearchContext";
import { LanguageProvider } from "./app/contexts/LanguageContext"; // LanguageProvider 임포트
import { ThemeProvider, useTheme } from "./app/contexts/ThemeContext"; // ThemeProvider 추가
import { FontSizeProvider } from "./app/contexts/FontSizeContext"; // FontSizeProvider 추가
import ErrorBoundary from "./app/components/ErrorBoundary";
import {
  NavigationContainer,
  DefaultTheme,
  DarkTheme,
} from "@react-navigation/native";
import "./app/i18n"; // i18n 초기화 파일 임포트
import { QueryClient, QueryClientProvider } from "react-query";

// react-query 클라이언트 생성
const queryClient = new QueryClient();

const AppContent: React.FC = () => {
  const { theme } = useTheme();

  return (
    <QueryClientProvider client={queryClient}>
      <NavigationContainer theme={theme === "dark" ? DarkTheme : DefaultTheme}>
        <MainNavigator />
      </NavigationContainer>
    </QueryClientProvider>
  );
};

const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <LanguageProvider>
        <FontSizeProvider>
          <ThemeProvider>
            <FavoritesProvider>
              <SearchProvider>
                <SafeAreaView style={styles.container}>
                  <AppContent />
                </SafeAreaView>
              </SearchProvider>
            </FavoritesProvider>
          </ThemeProvider>
        </FontSizeProvider>
      </LanguageProvider>
    </ErrorBoundary>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1, // SafeAreaView가 전체 화면을 채우도록 설정
    backgroundColor: "#fff", // 기본 배경색 설정
  },
});

export default App;
