// app/navigation/types.ts

export type RootStackParamList = {
  Home: undefined;
  Recipe: { recipeId: string };
  RecipeList: undefined;
  Favorites: undefined;
  Ingredient: { ingredientId: string; locale: string };
  Settings: undefined;
  Splash: undefined;
  Test: undefined; // Test 스크린 추가
  // 다른 화면들 추가 가능
};
