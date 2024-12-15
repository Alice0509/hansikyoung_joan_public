// app/navigation/MainNavigator.tsx

import React from "react";
import { createStackNavigator } from "@react-navigation/stack";

import SplashScreen from "../screens/SplashScreen";
import MainTabNavigator from "./MainTabNavigator";
import IngredientScreen from "../screens/IngredientScreen";
import RecipeDetailScreen from "../screens/RecipeDetailScreen";
import FavoritesScreen from "../screens/FavoritesScreen";

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
      {/* IngredientScreen 및 RecipeDetailScreen 등록 */}
      <Stack.Screen
        name="Ingredient"
        component={IngredientScreen}
        options={{ title: "Ingredient Details" }}
      />
      <Stack.Screen
        name="RecipeDetail"
        component={RecipeDetailScreen}
        options={{ title: "Recipe Details" }}
      />
      <Stack.Screen
        name="Favorites"
        component={FavoritesScreen}
        options={{ title: "Favorites" }}
      />
    </Stack.Navigator>
  );
};

export default MainNavigator;
