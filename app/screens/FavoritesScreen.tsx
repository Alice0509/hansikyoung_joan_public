// app/screens/FavoritesScreen.tsx

import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  FlatList,
  Text,
  ActivityIndicator,
} from "react-native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../navigation/types";
import { useNavigation } from "@react-navigation/native";
import { useFavorites } from "../contexts/FavoritesContext";
import RecipeCard from "../components/RecipeCard";
import { getRecipeById } from "../lib/contentful";
import { Entry } from "contentful";
import { Recipe } from "../types/Recipe";

type FavoritesScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "Favorites"
>;

const FavoritesScreen: React.FC = () => {
  const navigation = useNavigation<FavoritesScreenNavigationProp>();
  const { favorites } = useFavorites(); // 레시피 ID 문자열 목록
  const [favoriteRecipes, setFavoriteRecipes] = useState<Entry<Recipe>[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFavoriteRecipes = async () => {
      try {
        if (favorites.length === 0) {
          setFavoriteRecipes([]);
          setLoading(false);
          return;
        }

        // 모든 즐겨찾기한 레시피의 데이터를 비동기적으로 가져오기
        const recipes = await Promise.all(
          favorites.map(async (id) => {
            const entry = await getRecipeById(id, "en"); // 필요에 따라 locale 조정
            return entry; // Entry<Recipe> 객체 그대로 반환
          }),
        );

        setFavoriteRecipes(recipes);
      } catch (err) {
        console.error("Error fetching favorite recipes:", err);
        setError("Failed to load favorite recipes.");
      } finally {
        setLoading(false);
      }
    };

    fetchFavoriteRecipes();
  }, [favorites]);

  const renderItem = ({ item }: { item: Entry<Recipe> }) => (
    <RecipeCard
      recipe={item}
      onPress={() =>
        navigation.navigate("RecipeDetail", { recipeId: item.sys.id })
      }
      fullWidth={true}
    />
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}
      {favoriteRecipes.length > 0 ? (
        <FlatList
          data={favoriteRecipes}
          keyExtractor={(item) => item.sys.id}
          renderItem={renderItem}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No favorites yet.</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContainer: {
    padding: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorContainer: {
    padding: 20,
    alignItems: "center",
  },
  errorText: {
    color: "red",
    fontSize: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyText: {
    fontSize: 18,
    color: "#555",
  },
});

export default FavoritesScreen;
