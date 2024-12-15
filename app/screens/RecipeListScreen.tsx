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
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import { getAllRecipes, getRecipesByCategory } from "../lib/contentful";
import { RecipeEntry } from "../types/Recipe";
import { RootStackParamList } from "../navigation/types";
import RecipeCard from "../components/RecipeCard";

type RecipeListScreenRouteProp = RouteProp<RootStackParamList, "Main">;

type RecipeListScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "Main"
>;

const RecipeListScreen: React.FC = () => {
  const navigation = useNavigation<RecipeListScreenNavigationProp>();
  const route = useRoute<RecipeListScreenRouteProp>();
  const { categoryId } = route.params || {};

  const [recipes, setRecipes] = useState<RecipeEntry[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        let items: RecipeEntry[] = [];
        if (categoryId) {
          items = await getRecipesByCategory(categoryId, "en");
        } else {
          items = await getAllRecipes("en");
        }
        console.log("Fetched recipes:", items); // 데이터 확인
        setRecipes(items);
      } catch (error) {
        console.error("Error fetching recipes:", error);
        setError("Failed to load recipes.");
      } finally {
        setLoading(false);
      }
    };

    fetchRecipes();
  }, [categoryId]);

  const renderItem = ({ item }: { item: RecipeEntry }) => {
    if (!item || !item.sys) {
      console.warn("Invalid recipe item:", item);
      return null; // 또는 대체 UI
    }

    return (
      <RecipeCard
        recipe={item}
        onPress={
          () => navigation.navigate("RecipeDetail", { recipeId: item.sys.id }) // 스크린 이름 일치
        }
        fullWidth={true} // 전체 너비 사용
        showCategory={false} // 카테고리 정보 표시 안 함
      />
    );
  };

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
        // 단일 열 레이아웃으로 유지
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 20, // 좌우 패딩 추가
    paddingTop: 10,
  },
  centeredContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20, // 좌우 패딩 추가
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  listContainer: {
    paddingBottom: 20,
    // 필요에 따라 추가 패딩 또는 마진 설정
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
