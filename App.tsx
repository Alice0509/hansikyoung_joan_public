// App.tsx

import React from "react";
import { SafeAreaView, StyleSheet } from "react-native";
import MainNavigator from "./app/navigation/MainNavigator";
import { FavoritesProvider } from "./app/contexts/FavoritesContext";
import { SearchProvider } from "./app/contexts/SearchContext";
import { LocaleProvider } from "./app/contexts/LocaleContext";
import ErrorBoundary from "./app/components/ErrorBoundary";

const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <LocaleProvider>
        <SearchProvider>
          <FavoritesProvider>
            <SafeAreaView style={styles.container}>
              <MainNavigator />
            </SafeAreaView>
          </FavoritesProvider>
        </SearchProvider>
      </LocaleProvider>
    </ErrorBoundary>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1, // SafeAreaView가 전체 화면을 채우도록 설정
  },
});

export default App;
