// app/navigation/MainNavigator.tsx

import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

// 스크린 컴포넌트 임포트
import HomeScreen from "../screens/HomeScreen";
import RecipeListScreen from "../screens/RecipeListScreen";
import SettingsScreen from "../screens/SettingsScreen";
import SplashScreen from "../screens/SplashScreen";
import IngredientScreen from "../screens/IngredientScreen";
import RecipeScreen from "../screens/RecipeScreen"; // RecipeScreen 임포트

// 네비게이션 타입 정의 임포트
import { RootStackParamList } from "./types";

const Stack = createStackNavigator<RootStackParamList>();

const MainNavigator: React.FC = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Splash">
        <Stack.Screen
          name="Splash"
          component={SplashScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ title: "Home" }}
        />
        <Stack.Screen
          name="RecipeList"
          component={RecipeListScreen}
          options={{ title: "Recipe List" }}
        />
        <Stack.Screen
          name="Settings"
          component={SettingsScreen}
          options={{ title: "Settings" }}
        />
        <Stack.Screen
          name="Ingredient"
          component={IngredientScreen}
          options={{ title: "Ingredient Details" }}
        />
        <Stack.Screen
          name="Recipe"
          component={RecipeScreen} // 'Recipe' 스크린 등록
          options={{ title: "Recipe Details" }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default MainNavigator;
