export type RootStackParamList = {
  Home: undefined; // Home에는 전달되는 params 없음
  Recipe: { recipeId: string }; // Recipe 화면에 recipeId를 전달
  Settings: undefined; // Settings 화면에는 전달되는 params 없음
};
