//app/screens/FavoritesScreen.tsx

import React from "react";
import { View, FlatList, Text, StyleSheet } from "react-native";
import { useFavorites } from "../contexts/FavoritesContext";
import RecipeCard from "../components/RecipeCard";
import { getRecipeById } from "../lib/contentful";

const FavoritesScreen = () => {
  const { favorites } = useFavorites();
  const [favoriteRecipes, setFavoriteRecipes] = React.useState([]);

  React.useEffect(() => {
    const fetchFavorites = async () => {
      const data = await Promise.all(
        favorites.map((id) => getRecipeById(id, "en")),
      );
      setFavoriteRecipes(data);
    };

    fetchFavorites();
  }, [favorites]);

  if (favorites.length === 0) {
    return <Text style={styles.emptyText}>No favorites yet!</Text>;
  }

  return (
    <FlatList
      data={favoriteRecipes}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => <RecipeCard recipe={item} />}
    />
  );
};

const styles = StyleSheet.create({
  emptyText: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginTop: 50,
  },
});

export default FavoritesScreen;
