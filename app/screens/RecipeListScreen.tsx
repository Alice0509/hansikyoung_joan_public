// app/screens/RecipeListScreen.tsx

import React, { useEffect, useState } from "react";
import {
  View,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  Text,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../navigation/types";
import { Recipe } from "../types/Recipe";
import RecipeCard from "../components/RecipeCard"; // RecipeCard 임포트
import { getAllRecipes } from "../lib/contentful"; // getAllRecipes 임포트

type RecipeListScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "RecipeList"
>;

const RecipeListScreen: React.FC = () => {
  const navigation = useNavigation<RecipeListScreenNavigationProp>();
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const data = await getAllRecipes("en"); // 필요한 locale로 설정
        // 이미지가 있거나 유튜브 URL이 있는 레시피만 필터링
        const filteredData = data.filter(
          (recipe) =>
            (recipe.fields.image &&
              recipe.fields.image.length > 0 &&
              recipe.fields.image[0].fields.file.url) ||
            recipe.fields.youTubeUrl,
        );
        setRecipes(filteredData);
        console.log("Fetched Recipes:", filteredData);
      } catch (error) {
        console.error("Error fetching recipes:", error);
        setError("Failed to load recipes.");
      } finally {
        setLoading(false);
      }
    };

    fetchRecipes();
  }, []);

  const renderItem = ({ item }: { item: Recipe }) => (
    <RecipeCard
      recipe={item}
      onPress={() =>
        navigation.navigate("RecipeDetail", {
          recipeId: item.sys.id,
          locale: "en",
        })
      }
      fullWidth={true} // 전체 너비 사용
      showCategory={true}
    />
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centeredContainer}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  if (recipes.length === 0) {
    return (
      <View style={styles.centeredContainer}>
        <Text style={styles.noDataText}>No recipes available.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={recipes}
        keyExtractor={(item) => item.sys.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        initialNumToRender={10}
        windowSize={5}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  centeredContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  listContainer: {
    paddingBottom: 20,
    // alignItems: "center", // 전체 너비 사용 시 필요 없음
  },
  errorText: {
    textAlign: "center",
    fontSize: 16,
    color: "red",
  },
  noDataText: {
    textAlign: "center",
    fontSize: 16,
    color: "#000",
  },
});

export default RecipeListScreen;
