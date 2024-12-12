// app/lib/contentful.ts
import { createClient } from "contentful";
import { saveData, getData } from "./storage"; // 로컬 저장 로직
import { Recipe, RecipeFields } from "../types/Recipe";

// Contentful 클라이언트 생성
const client = createClient({
  space: "CONTENTFUL_SPACE_ID",
  accessToken: "CONTENTFUL_ACCESS_TOKEN",
});

// 모든 레시피 가져오기
export const getRecipes = async (locale: string = "en"): Promise<Recipe[]> => {
  try {
    const response = await client.getEntries<RecipeFields>({
      content_type: "recipe",
      order: "fields.titel",
      locale: locale, // 현재 로케일을 전달
    });
    const recipes = response.items.map((item) => ({
      id: item.sys.id,
      title: item.fields.titel,
      description: item.fields.description,
      image: item.fields.image?.[0]?.fields?.file?.url,
      category: item.fields.category,
    }));
    await saveData("recipes", recipes); // 로컬에 저장
    console.log("Fetched recipes from Contentful:", recipes); // 디버깅용 로그
    return recipes;
  } catch (error) {
    console.error("Error fetching recipes, falling back to local data:", error);
    const localData = await getData("recipes");
    console.log("Loaded recipes from local storage:", localData); // 디버깅용 로그
    return localData;
  }
};

// 특정 레시피 데이터 가져오기
export const getRecipeById = async (
  id: string,
  locale: string = "en",
): Promise<Recipe> => {
  try {
    const entry = await client.getEntry<RecipeFields>(id, {
      include: 3,
      locale,
    });
    const recipe: Recipe = {
      id: entry.sys.id,
      title: entry.fields.titel,
      description: entry.fields.description,
      image: entry.fields.image?.[0]?.fields?.file?.url,
      category: entry.fields.category,
      preparationTime: entry.fields.preparationTime,
      servings: entry.fields.servings,
      ingredients: entry.fields.ingredients,
      instructions: entry.fields.instructions,
      videoFile: entry.fields.videoFile,
      youTubeUrl: entry.fields.youTubeUrl,
    };
    console.log("Fetched recipe by ID:", recipe); // 디버깅용 로그
    return recipe;
  } catch (error) {
    console.error(`Error fetching recipe with id ${id}:`, error);
    throw error;
  }
};

export default client;
