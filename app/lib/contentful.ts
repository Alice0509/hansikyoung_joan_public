// app/lib/contentful.ts

import { createClient, Entry } from "contentful";
import { Recipe, Category, Ingredient, RecipeSkeleton } from "../types/Recipe";
import { CONTENTFUL_SPACE_ID, CONTENTFUL_ACCESS_TOKEN } from "@env";

// Contentful 클라이언트 생성
const client = createClient({
  space: CONTENTFUL_SPACE_ID,
  accessToken: CONTENTFUL_ACCESS_TOKEN,
});

/**
 * 특정 카테고리에 속한 레시피를 가져옵니다.
 */
export const getRecipesByCategory = async (
  categoryId: string,
  locale: string = "en",
): Promise<Recipe[]> => {
  try {
    const entries = await client.getEntries<RecipeSkeleton>({
      content_type: "recipe",
      locale,
      "fields.categories.sys.id": categoryId, // 'categories' 필드 사용 (다중 참조)
      include: 2,
    });
    console.log(
      `Fetched Recipes for Category ID ${categoryId}:`,
      entries.items,
    );
    return entries.items as Recipe[];
  } catch (error) {
    console.error("Error fetching recipes by category:", error);
    throw new Error("Failed to fetch recipes by category.");
  }
};

/**
 * 모든 카테고리를 로케일과 함께 가져옵니다.
 */
export const getAllCategories = async (
  locale: string = "en",
): Promise<Entry<Category>[]> => {
  try {
    const entries = await client.getEntries<Category>({
      content_type: "category",
      locale,
      order: "fields.order", // 정렬 순서
    });
    return entries.items;
  } catch (error) {
    console.error("Error fetching categories:", error);
    throw new Error("Failed to fetch categories.");
  }
};

/**
 * 모든 레시피를 로케일과 함께 가져옵니다.
 */
export const getAllRecipes = async (
  locale: string = "en",
): Promise<Recipe[]> => {
  try {
    const entries = await client.getEntries<RecipeSkeleton>({
      content_type: "recipe",
      locale,
      include: 2, // 연결된 엔트리 포함 수준
    });
    console.log("Fetched Recipes:", entries.items); // 데이터 확인
    return entries.items as Recipe[]; // 올바르게 타입 캐스팅
  } catch (error) {
    console.error("Error fetching recipes:", error);
    throw new Error("Failed to fetch recipes.");
  }
};

/**
 * 모든 Ingredients를 가져옵니다.
 */
export const getAllIngredients = async (
  locale: string = "en",
): Promise<Entry<Ingredient>[]> => {
  try {
    const entries = await client.getEntries<Ingredient>({
      content_type: "ingredient", // Contentful에서 설정한 콘텐츠 타입
      locale,
      include: 3,
    });
    return entries.items as Entry<Ingredient>[];
  } catch (error) {
    console.error("Error fetching all ingredients:", error);
    throw new Error("Failed to fetch ingredients.");
  }
};

/**
 * 특정 레시피를 ID로 가져옵니다.
 */
export const getRecipeById = async (
  recipeId: string,
  locale: string = "en",
): Promise<Recipe> => {
  try {
    const entry = await client.getEntry<RecipeSkeleton>(recipeId, {
      locale,
      include: 3,
    });
    console.log(`Fetched Recipe ID ${recipeId}:`, entry);
    return entry as Recipe; // 올바르게 타입 캐스팅
  } catch (error) {
    console.error(`Error fetching recipe with id ${recipeId}:`, error);
    throw new Error("Failed to fetch recipe.");
  }
};

/**
 * 특정 Ingredient를 ID로 가져옵니다.
 */
export const getIngredientById = async (
  ingredientId: string,
  locale: string = "en",
): Promise<Entry<Ingredient>> => {
  try {
    const entry = await client.getEntry<Ingredient>(ingredientId, {
      locale,
      include: 1,
    });
    return entry;
  } catch (error) {
    console.error(`Error fetching ingredient with id ${ingredientId}:`, error);
    throw new Error("Failed to fetch ingredient.");
  }
};

/**
 * 모든 카테고리와 해당 카테고리에 속한 레시피를 가져옵니다.
 */
export const fetchCategoriesWithRecipes = async (
  locale: string = "en",
): Promise<{ category: Entry<Category>; recipes: Recipe[] }[]> => {
  try {
    const categories = await getAllCategories(locale);
    const categoriesData: { category: Entry<Category>; recipes: Recipe[] }[] =
      [];

    await Promise.all(
      categories.map(async (category) => {
        const recipes = await getRecipesByCategory(category.sys.id, locale);
        categoriesData.push({ category, recipes });
      }),
    );

    // 카테고리 순서에 따라 정렬 (order 필드 기준)
    categoriesData.sort(
      (a, b) => (a.category.fields.order || 0) - (b.category.fields.order || 0),
    );

    return categoriesData;
  } catch (error) {
    console.error("Error fetching categories with recipes:", error);
    throw new Error("Failed to fetch categories with recipes.");
  }
};
