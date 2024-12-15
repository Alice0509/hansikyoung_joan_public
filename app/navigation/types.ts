// app/navigation/types.ts

export type RootStackParamList = {
  Main: undefined;
  Home: undefined;
  RecipeDetail: { recipeId: string }; // 'Recipe' → 'RecipeDetail'으로 변경
  Favorites: undefined;
  Ingredient: { ingredientId: string; locale: string };
  IngredientDetail: { ingredientId: string };
  CategoryRecipeList: { categoryId: string };
  Settings: undefined;
  Splash: undefined;
  // 다른 화면들 추가 가능
};
export type TabParamList = {
  Home: undefined;
  RecipeList: undefined; // 탭 자체에서는 직접 접근하지 않도록 undefined로 설정
  Ingredients: undefined;
  Favorites: undefined;
  Settings: undefined;
};
