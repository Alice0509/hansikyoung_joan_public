// app/navigation/types.ts

export type RootStackParamList = {
  Main: undefined;
  Home: undefined;
  RecipeDetail: { recipeId: string; locale?: string };
  IngredientDetail: { ingredientId: string; locale?: string };
  CategoryRecipeList: { categoryId: string };
  Settings: undefined;
  Splash: undefined;
  // 다른 화면들 추가 가능
};
export type TabParamList = {
  Home: undefined;
  RecipeList: undefined; // 탭 자체에서는 직접 접근하지 않도록 undefined로 설정
  Ingredients: undefined;
  Favorites: undefined; // Tab Navigator 내에만 존재
  Settings: undefined;
};
