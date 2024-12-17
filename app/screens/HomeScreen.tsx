// app/screens/HomeScreen.tsx

import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { getAllCategories, getRecipesByCategory } from "../lib/contentful";
import { Entry } from "contentful";
import { Category, RecipeEntry } from "../types/Recipe";
import RecipeCard from "../components/RecipeCard";
import { useSearch } from "../contexts/SearchContext";
import { useTranslation } from "react-i18next"; // 번역 키 사용을 위해 추가
import SearchBar from "../components/SearchBar";
import { useDebounce } from "use-debounce";
import { documentToPlainTextString } from "@contentful/rich-text-plain-text-renderer"; // Rich Text 변환

type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, "Main">;

interface CategoryWithRecipes {
  category: Entry<Category>;
  recipes: RecipeEntry[];
}

const HomeScreen: React.FC = () => {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const { t } = useTranslation();
  const { keyword, setKeyword } = useSearch();
  const [debouncedKeyword] = useDebounce(keyword, 300); // 300ms debounce
  const [categoriesWithRecipes, setCategoriesWithRecipes] = useState<
    CategoryWithRecipes[]
  >([]);
  const [filteredCategories, setFilteredCategories] = useState<
    CategoryWithRecipes[]
  >([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategoriesAndRecipes = async () => {
      try {
        const categories = await getAllCategories("en"); // 언어 코드 동적으로 처리 가능
        const categoriesData: CategoryWithRecipes[] = [];

        // 각 카테고리에 대한 레시피를 비동기적으로 가져오기
        await Promise.all(
          categories.map(async (category) => {
            const recipes = await getRecipesByCategory(category.sys.id, "en");
            categoriesData.push({ category, recipes });
          }),
        );

        // 카테고리 순서에 따라 정렬 (order 필드 기준)
        categoriesData.sort(
          (a, b) =>
            (a.category.fields.order || 0) - (b.category.fields.order || 0),
        );

        setCategoriesWithRecipes(categoriesData);
        setFilteredCategories(categoriesData); // 초기 상태 설정
      } catch (error) {
        console.error("Error fetching categories and recipes:", error);
        setError(t("failed_to_load_categories_and_recipes"));
      } finally {
        setLoading(false);
      }
    };

    fetchCategoriesAndRecipes();
  }, [t]);

  useEffect(() => {
    if (debouncedKeyword.trim() === "") {
      setFilteredCategories(categoriesWithRecipes);
    } else {
      const lowerKeyword = debouncedKeyword.toLowerCase();
      const filtered = categoriesWithRecipes
        .map(({ category, recipes }) => {
          const filteredRecipes = recipes.filter((recipe: RecipeEntry) => {
            const name = recipe.fields.name || "";
            let description = "";

            if (recipe.fields.description) {
              if (typeof recipe.fields.description === "string") {
                description = recipe.fields.description;
              } else {
                // Rich Text 필드인 경우 플레인 텍스트로 변환
                description = documentToPlainTextString(
                  recipe.fields.description,
                );
              }
            }

            return (
              name.toLowerCase().includes(lowerKeyword) ||
              description.toLowerCase().includes(lowerKeyword)
            );
          });
          return { category, recipes: filteredRecipes };
        })
        .filter(({ recipes }) => recipes.length > 0);
      setFilteredCategories(filtered);
    }
  }, [debouncedKeyword, categoriesWithRecipes]);

  const renderRecipeItem = ({ item }: { item: RecipeEntry }) => {
    if (!item || !item.sys) {
      console.warn("Invalid recipe item:", item);
      return null; // 또는 대체 UI
    }

    return (
      <RecipeCard
        recipe={item}
        onPress={() =>
          navigation.navigate("RecipeDetail", { recipeId: item.sys.id })
        }
        fullWidth={false} // 홈 스크린에서는 전체 너비 사용 안 함
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

  if (categoriesWithRecipes.length === 0) {
    return (
      <View style={styles.centeredContainer}>
        <Text style={styles.noDataText}>{t("no_categories_available")}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* 검색 바 추가 */}
      <SearchBar />

      <ScrollView>
        {filteredCategories.map(({ category, recipes }) => (
          <View key={category.sys.id} style={styles.categorySection}>
            <Text style={styles.categoryTitle}>{category.fields.name}</Text>
            {recipes.length > 0 ? (
              <FlatList
                data={recipes}
                keyExtractor={(item) => item.sys.id}
                renderItem={renderRecipeItem}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.recipesList}
                initialNumToRender={5}
                windowSize={5}
                ItemSeparatorComponent={() => <View style={{ width: 15 }} />}
                ListHeaderComponent={<View style={{ width: 10 }} />}
              />
            ) : (
              <Text style={styles.noRecipesText}>
                {t("no_recipes_available")}
              </Text>
            )}
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 10,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  categorySection: {
    marginBottom: 20,
    paddingHorizontal: 20, // 좌우 패딩 추가
  },
  categoryTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  recipesList: {
    paddingLeft: 10,
  },
  noRecipesText: {
    fontSize: 16,
    color: "#666",
    fontStyle: "italic",
  },
  errorText: {
    textAlign: "center",
    fontSize: 16,
    color: "red",
  },
  centeredContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20, // 좌우 패딩 추가
  },
  noDataText: {
    textAlign: "center",
    fontSize: 16,
    color: "#000",
  },
});

export default HomeScreen;
