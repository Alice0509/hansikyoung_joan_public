// app/services/recipeService.ts

import { createClient } from "contentful";

const client = createClient({
  space: "YOUR_SPACE_ID", // Contentful 공간 ID
  accessToken: "YOUR_ACCESS_TOKEN", // Contentful 접근 토큰
});

export const fetchRecipes = async () => {
  try {
    const entries = await client.getEntries({
      content_type: "recipe", // Contentful에서 설정한 콘텐츠 유형
      include: 2, // 관련된 참조를 포함할 깊이
    });

    // 카테고리별로 레시피를 그룹화
    const categoriesMap: { [key: string]: { category: any; recipes: any[] } } =
      {};

    entries.items.forEach((item: any) => {
      const category = item.fields.category;
      if (category) {
        const categoryId = category.sys.id;
        if (!categoriesMap[categoryId]) {
          categoriesMap[categoryId] = { category, recipes: [] };
        }
        categoriesMap[categoryId].recipes.push(item);
      }
    });

    return Object.values(categoriesMap);
  } catch (error) {
    console.error("Error fetching recipes:", error);
    throw error;
  }
};
