// app/screens/RecipeListScreen.tsx

import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { StackNavigationProp } from "@react-navigation/stack";
import { useNavigation } from "@react-navigation/native";
import { getRecipes } from "../lib/contentful";
import { RecipeEntry } from "../types/Recipe";
import { RootStackParamList } from "../navigation/types";
import RecipeCard from "../components/RecipeCard";

type RecipeListScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "RecipeList"
>;

const RecipeListScreen: React.FC = () => {
  const navigation = useNavigation<RecipeListScreenNavigationProp>();
  const [recipes, setRecipes] = useState<RecipeEntry[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const items = await getRecipes("en");
        setRecipes(items);
      } catch (error) {
        console.error("Error fetching recipes:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecipes();
  }, []);

  const renderItem = ({ item }: { item: RecipeEntry }) => (
    <RecipeCard
      recipe={item}
      onPress={() => navigation.navigate("Recipe", { recipeId: item.sys.id })}
    />
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (recipes.length === 0) {
    return (
      <View style={styles.container}>
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
        showsVerticalScrollIndicator={true}
        style={styles.flatList}
        scrollEnabled={true}
        nestedScrollEnabled={true}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#fff",
    flex: 1, // 부모 View가 전체 화면을 차지하도록 설정
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  noDataText: {
    textAlign: "center",
    marginTop: 20,
    fontSize: 16,
    color: "#000",
  },
  listContainer: {
    paddingBottom: 20,
  },
  flatList: {
    flexGrow: 1,
  },
});

export default RecipeListScreen;
