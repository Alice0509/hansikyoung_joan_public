// app/lib/contentful.ts

import { createClient, Entry } from "contentful";
import { Recipe, Category, Ingredient } from "../types/Recipe";

// Contentful 클라이언트 생성
const client = createClient({
  space: process.env.CONTENTFUL_SPACE_ID!,
  accessToken: process.env.CONTENTFUL_ACCESS_TOKEN!,
});

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
): Promise<Entry<Recipe>[]> => {
  try {
    const entries = await client.getEntries<Recipe>({
      content_type: "recipe",
      locale,
      include: 2, // 연결된 엔트리 포함 수준
    });
    return entries.items;
  } catch (error) {
    console.error("Error fetching recipes:", error);
    throw new Error("Failed to fetch recipes.");
  }
};

/**
 * 특정 카테고리에 속한 레시피를 가져옵니다.
 */
export const getRecipesByCategory = async (
  categoryId: string,
  locale: string = "en",
): Promise<Entry<Recipe>[]> => {
  try {
    const entries = await client.getEntries<Recipe>({
      content_type: "recipe",
      locale,
      "fields.categories.sys.id": categoryId, // 특정 카테고리에 속한 레시피 필터링
      include: 2,
    });
    return entries.items;
  } catch (error) {
    console.error("Error fetching recipes by category:", error);
    throw new Error("Failed to fetch recipes by category.");
  }
};

/**
 * 특정 레시피를 ID로 가져옵니다.
 */
export const getRecipeById = async (
  recipeId: string,
  locale: string = "en",
): Promise<Entry<Recipe>> => {
  try {
    const entry = await client.getEntry<Recipe>(recipeId, {
      locale,
      include: 2,
    });
    return entry;
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
 * 모든 Ingredients를 로케일과 함께 가져옵니다.
 */
export const getAllIngredients = async (
  locale: string = "en",
): Promise<Entry<Ingredient>[]> => {
  try {
    const entries = await client.getEntries<Ingredient>({
      content_type: "ingredient",
      locale,
      include: 3, // 연결된 엔트리 포함 수준 (필요 시 조정)
    });
    return entries.items;
  } catch (error) {
    console.error("Error fetching ingredients:", error);
    throw new Error("Failed to fetch ingredients.");
  }
};
