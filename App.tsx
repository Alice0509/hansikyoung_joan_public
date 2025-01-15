// App.tsx

import React from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaView, StyleSheet } from 'react-native';
import { QueryClient, QueryClientProvider } from 'react-query';
import {
  NavigationContainer,
  DarkTheme,
  DefaultTheme,
} from '@react-navigation/native';
import { I18nextProvider } from 'react-i18next';
import MainNavigator from './app/navigation/MainNavigator';
import { FavoritesProvider } from './app/contexts/FavoritesContext';
import { SearchProvider } from './app/contexts/SearchContext';
import { LanguageProvider } from './app/contexts/LanguageContext';
import { ThemeProvider, useTheme } from './app/contexts/ThemeContext'; // useTheme import
import { FontSizeProvider } from './app/contexts/FontSizeContext';
import { IngredientsProvider } from './app/contexts/IngredientsContext';
import { LocaleProvider } from './app/contexts/LocaleProvider';
import ErrorBoundary from './app/components/ErrorBoundary';
import i18n from './app/i18n';

const queryClient = new QueryClient();

const AppContent: React.FC = () => {
  const { theme } = useTheme(); // useTheme 사용

  return (
    <QueryClientProvider client={queryClient}>
      <NavigationContainer theme={theme === 'dark' ? DarkTheme : DefaultTheme}>
        <MainNavigator />
      </NavigationContainer>
    </QueryClientProvider>
  );
};

const App: React.FC = () => {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <I18nextProvider i18n={i18n}>
        <LanguageProvider>
          <FontSizeProvider>
            <ThemeProvider>
              <FavoritesProvider>
                <SearchProvider>
                  <IngredientsProvider>
                    <LocaleProvider>
                      <ErrorBoundary>
                        <SafeAreaView style={styles.container}>
                          <AppContent />
                        </SafeAreaView>
                      </ErrorBoundary>
                    </LocaleProvider>
                  </IngredientsProvider>
                </SearchProvider>
              </FavoritesProvider>
            </ThemeProvider>
          </FontSizeProvider>
        </LanguageProvider>
      </I18nextProvider>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});

export default App;
