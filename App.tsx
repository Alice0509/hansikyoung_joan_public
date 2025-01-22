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
import { LanguageProvider } from './app/contexts/LanguageContext';
import { ThemeProvider, useTheme } from './app/contexts/ThemeContext';
import { FontSizeProvider } from './app/contexts/FontSizeContext';
import { FavoritesProvider } from './app/contexts/FavoritesContext';
import { SearchProvider } from './app/contexts/SearchContext';
import { IngredientsProvider } from './app/contexts/IngredientsContext';
import { LocaleProvider } from './app/contexts/LocaleProvider';
import { ShoppingListProvider } from './app/contexts/ShoppingListContext';
import ErrorBoundary from './app/components/ErrorBoundary';
import i18n from './app/i18n';
import RootStackNavigator from './app/navigation/RootStackNavigator';

const queryClient = new QueryClient();

const AppContent: React.FC = () => {
  const { theme } = useTheme();

  return (
    <QueryClientProvider client={queryClient}>
      <NavigationContainer theme={theme === 'dark' ? DarkTheme : DefaultTheme}>
        <RootStackNavigator />
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
                    <ShoppingListProvider>
                      <LocaleProvider>
                        <ErrorBoundary>
                          <SafeAreaView style={styles.container}>
                            <AppContent />
                          </SafeAreaView>
                        </ErrorBoundary>
                      </LocaleProvider>
                    </ShoppingListProvider>
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
