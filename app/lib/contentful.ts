// app/lib/contentful.ts

import { createClient } from "contentful";
import { Recipe } from "../types/Recipe";

const client = createClient({
  space: process.env.CONTENTFUL_SPACE_ID!,
  accessToken: process.env.CONTENTFUL_ACCESS_TOKEN!,
});

/**
 * 특정 레시피를 ID로 가져옵니다.
 * @param recipeId - 레시피의 고유 ID
 * @param locale - 로케일 (기본값: 'en')
 */
export const getRecipeById = async (
  recipeId: string,
  locale: string = "en",
): Promise<Recipe> => {
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
 * 모든 레시피를 로케일과 함께 가져옵니다.
 * @param locale - 로케일 (기본값: 'en')
 */
export const getRecipes = async (locale: string = "en"): Promise<Recipe[]> => {
  try {
    const entries = await client.getEntries<Recipe>({
      content_type: "recipe",
      locale,
      include: 2,
    });
    return entries.items;
  } catch (error) {
    console.error("Error fetching recipes:", error);
    throw new Error("Failed to fetch recipes.");
  }
};

/**
 * 특정 Ingredient를 ID로 가져옵니다.
 * @param ingredientId - Ingredient의 고유 ID
 * @param locale - 로케일 (기본값: 'en')
 */
export const getIngredientById = async (
  ingredientId: string,
  locale: string = "en",
): Promise<any> => {
  try {
    const entry = await client.getEntry(ingredientId, { locale, include: 1 });
    return entry;
  } catch (error) {
    console.error(`Error fetching ingredient with id ${ingredientId}:`, error);
    throw new Error("Failed to fetch ingredient.");
  }
};
