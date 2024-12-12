// App.tsx
import React from "react";
import { LocaleProvider } from "./app/contexts/LocaleContext";
import { SearchProvider } from "./app/contexts/SearchContext"; // 추가
import MainNavigator from "./app/navigation/MainNavigator";
import { NavigationContainer } from "@react-navigation/native";

export default function App() {
  return (
    <LocaleProvider>
      <SearchProvider> {/* SearchProvider 추가 */}
        <NavigationContainer>
          <MainNavigator />
        </NavigationContainer>
      </SearchProvider>
    </LocaleProvider>
  );
}
