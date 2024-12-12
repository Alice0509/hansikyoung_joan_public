// app/navigation/MainNavigator.tsx

import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { TouchableOpacity, Text, StyleSheet } from "react-native";

// Screens
import HomeScreen from "../screens/HomeScreen";
import RecipeScreen from "../screens/RecipeScreen";
import SettingsScreen from "../screens/SettingsScreen";
import IngredientScreen from "../screens/IngredientScreen";
import FavoritesScreen from "../screens/FavoritesScreen";

// Contexts
import { useLocale } from "../contexts/LocaleContext";

// Define the navigation parameters for each screen
type MainStackParamList = {
  Home: undefined;
  Recipe: undefined;
  Ingredient: undefined;
  Settings: undefined;
  Favorites: undefined;
};

// Create the Stack Navigator
const Stack = createNativeStackNavigator<MainStackParamList>();

const MainNavigator = () => {
  const { locale } = useLocale(); // Locale 상태를 사용

  return (
    <Stack.Navigator>
      {/* Home Screen */}
      <Stack.Screen
        name="Home"
        component={HomeScreen}
        options={({ navigation }) => ({
          title: locale === "de" ? "Rezeptliste" : "Recipe List",
          headerRight: () => (
            <TouchableOpacity
              style={styles.headerButton}
              onPress={() => navigation.navigate("Settings")}
            >
              <Text style={styles.headerButtonText}>Settings</Text>
            </TouchableOpacity>
          ),
        })}
      />
      {/* Recipe Details */}
      <Stack.Screen
        name="Recipe"
        component={RecipeScreen}
        options={{
          title: locale === "de" ? "Rezeptdetails" : "Recipe Details",
        }}
      />
      {/* Ingredient Details */}
      <Stack.Screen
        name="Ingredient"
        component={IngredientScreen}
        options={{
          title: locale === "de" ? "Zutaten Details" : "Ingredient Details",
        }}
      />
      {/* Settings Screen */}
      <Stack.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          title: locale === "de" ? "Einstellungen" : "Settings",
        }}
      />
      {/* Favorites Screen */}
      <Stack.Screen
        name="Favorites"
        component={FavoritesScreen}
        options={{
          title: locale === "de" ? "Favoriten" : "Favorites",
        }}
      />
    </Stack.Navigator>
  );
};

const styles = StyleSheet.create({
  headerButton: {
    marginRight: 10,
  },
  headerButtonText: {
    color: "#007BFF",
    fontSize: 16,
  },
});

export default MainNavigator;
