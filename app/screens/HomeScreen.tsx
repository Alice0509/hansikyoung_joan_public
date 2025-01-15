// app/screens/HomeScreen.tsx

import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  Button,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Entry } from 'contentful';
import { useTranslation } from 'react-i18next';
import { useDebounce } from 'use-debounce';
import { documentToPlainTextString } from '@contentful/rich-text-plain-text-renderer'; // Rich Text 변환
import { fetchCategoriesWithRecipes } from '../lib/contentful';
import { Category, Recipe } from '../types/Recipe'; // 'RecipeEntry' 대신 'Recipe' 사용
import RecipeCard from '../components/RecipeCard';
import { useSearch } from '../contexts/SearchContext';
import SearchBar from '../components/SearchBar';
import { useLanguage } from '../contexts/LanguageContext'; // LanguageContext 사용

type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Main'>;

interface CategoryWithRecipes {
  category: Entry<Category>;
  recipes: Recipe[];
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
  const { language } = useLanguage(); // LanguageContext에서 현재 언어 가져오기

  // 로케일 설정 (localeMap 사용하지 않고 직접 language 사용)
  const locale = language || 'en'; // 'en' 또는 'de'

  useEffect(() => {
    const fetchCategoriesAndRecipes = async () => {
      try {
        const categoriesData = await fetchCategoriesWithRecipes(locale);
        setCategoriesWithRecipes(categoriesData);
        setFilteredCategories(categoriesData); // 초기 상태 설정
      } catch (error) {
        console.error('Error fetching categories and recipes:', error);
        setError(t('failed_to_load_categories_and_recipes'));
      } finally {
        setLoading(false);
      }
    };

    fetchCategoriesAndRecipes();
  }, [locale, t]);

  useEffect(() => {
    if (debouncedKeyword.trim() === '') {
      setFilteredCategories(categoriesWithRecipes);
    } else {
      const lowerKeyword = debouncedKeyword.toLowerCase();
      const filtered = categoriesWithRecipes
        .map(({ category, recipes }) => {
          const filteredRecipes = recipes.filter((recipe: Recipe) => {
            // 'Recipe' 타입 사용
            const name = recipe.fields.titel || '';
            let description = '';

            if (recipe.fields.description) {
              if (typeof recipe.fields.description === 'string') {
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

  const renderRecipeItem = ({ item }: { item: Recipe }) => {
    // 'RecipeEntry' 대신 'Recipe' 사용
    if (!item || !item.sys || !item.sys.id) {
      console.warn('Invalid recipe item:', item);
      return null; // 또는 대체 UI
    }

    return (
      <RecipeCard
        recipe={item}
        onPress={() =>
          navigation.navigate('RecipeDetail', { recipeId: item.sys.id })
        }
        fullWidth={false} // 홈 스크린에서는 전체 너비 사용 안 함
      />
    );
  };

  const handleRetry = () => {
    setLoading(true);
    setError(null);
    setCategoriesWithRecipes([]);
    setFilteredCategories([]);
    const fetchCategoriesAndRecipes = async () => {
      try {
        const categoriesData = await fetchCategoriesWithRecipes(locale);
        setCategoriesWithRecipes(categoriesData);
        setFilteredCategories(categoriesData);
      } catch (error) {
        console.error('Error fetching categories and recipes:', error);
        setError(t('failed_to_load_categories_and_recipes'));
      } finally {
        setLoading(false);
      }
    };

    fetchCategoriesAndRecipes();
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
        {/* 재시도 버튼 추가 */}
        <View style={styles.retryButton}>
          <Button title={t('retry')} onPress={handleRetry} />
        </View>
      </View>
    );
  }

  if (categoriesWithRecipes.length === 0) {
    return (
      <View style={styles.centeredContainer}>
        <Text style={styles.noDataText}>{t('no_categories_available')}</Text>
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
                extraData={recipes} // 상태 변경 시 재렌더링을 강제합니다.
              />
            ) : (
              <Text style={styles.noRecipesText}>
                {t('no_recipes_available')}
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
    backgroundColor: '#fff',
    padding: 10,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  categorySection: {
    marginBottom: 20,
    paddingHorizontal: 20, // 좌우 패딩 추가
  },
  categoryTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  recipesList: {
    paddingLeft: 10,
  },
  noRecipesText: {
    fontSize: 16,
    color: '#666',
    fontStyle: 'italic',
  },
  errorText: {
    textAlign: 'center',
    fontSize: 16,
    color: 'red',
  },
  centeredContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20, // 좌우 패딩 추가
  },
  noDataText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#000',
  },
  retryButton: {
    marginTop: 10,
  },
  debugText: {
    // 디버깅을 위한 스타일
    fontSize: 12,
    color: '#888',
    marginBottom: 5,
  },
});

export default HomeScreen;
