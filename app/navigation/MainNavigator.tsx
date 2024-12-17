// app/navigation/MainNavigator.tsx

import React from "react";
import { createStackNavigator } from "@react-navigation/stack";

import SplashScreen from "../screens/SplashScreen";
import MainTabNavigator from "./MainTabNavigator";
import RecipeDetailScreen from "../screens/RecipeDetailScreen";
import IngredientDetailScreen from "../screens/IngredientDetailScreen";
// import FavoritesScreen from "../screens/FavoritesScreen"; // Stack Navigator에서 제거

import { RootStackParamList } from "./types";

const Stack = createStackNavigator<RootStackParamList>();

const MainNavigator: React.FC = () => {
  return (
    <Stack.Navigator initialRouteName="Splash">
      {/* SplashScreen 등록 */}
      <Stack.Screen
        name="Splash"
        component={SplashScreen}
        options={{ headerShown: false }}
      />
      {/* Main 탭 네비게이터 등록 */}
      <Stack.Screen
        name="Main"
        component={MainTabNavigator}
        options={{ headerShown: false }}
      />
      {/* RecipeDetailScreen 등록 */}
      <Stack.Screen
        name="RecipeDetail"
        component={RecipeDetailScreen}
        options={{ title: "Recipe Details" }}
      />
      {/* IngredientDetailScreen 등록 */}
      <Stack.Screen
        name="IngredientDetail"
        component={IngredientDetailScreen}
        options={{ title: "Ingredient Details" }}
      />
      {/* FavoritesScreen 제거 */}
    </Stack.Navigator>
  );
};

export default MainNavigator;
