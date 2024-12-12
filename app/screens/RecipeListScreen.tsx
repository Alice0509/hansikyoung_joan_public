//app/screens/RecipeListScreen.tsx

import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Image,
  ActivityIndicator,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { getRecipes } from "../lib/contentful";
import { Recipe } from "../types/Recipe";

export default function RecipeListScreen() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const items = await getRecipes();
        setRecipes(items);
      } catch (error) {
        console.error("Error fetching recipes:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecipes();
  }, []);

  const renderItem = ({ item }: { item: Recipe }) => {
    const imageUrl = item.fields.image?.[0]?.fields?.file?.url
      ? `https:${item.fields.image[0].fields.file.url}`
      : null;

    return (
      <TouchableOpacity
        style={styles.item}
        onPress={() =>
          navigation.navigate<"Recipe">("Recipe", { recipeId: item.sys.id })
        }
      >
        <Image
          source={
            imageUrl
              ? { uri: imageUrl }
              : require("../../assets/images/default.png")
          }
          style={styles.image}
        />
        <Text style={styles.title}>{item.fields.titel || "Untitled"}</Text>
      </TouchableOpacity>
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {recipes.length === 0 ? (
        <Text style={styles.noDataText}>No recipes available.</Text>
      ) : (
        <FlatList
          data={recipes}
          keyExtractor={(item) => item.sys.id}
          renderItem={renderItem}
          contentContainerStyle={styles.listContainer}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    flex: 1,
    backgroundColor: "#fff",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  item: {
    marginBottom: 20,
    borderRadius: 8,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    backgroundColor: "#fff",
  },
  image: {
    width: "100%",
    height: 150,
  },
  title: {
    marginTop: 10,
    fontSize: 18,
    fontWeight: "bold",
    paddingHorizontal: 10,
  },
  noDataText: {
    textAlign: "center",
    marginTop: 20,
    fontSize: 16,
  },
  listContainer: {
    paddingBottom: 20,
  },
});
