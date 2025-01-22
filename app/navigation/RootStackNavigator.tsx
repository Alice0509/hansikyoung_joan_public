// app/navigation/RootStackNavigator.tsx

import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import RootDrawerNavigator from './RootDrawerNavigator'; // <-- Drawer 임포트
import IngredientDetailScreen from '../screens/IngredientDetailScreen';
import RecipeDetailScreen from '../screens/RecipeDetailScreen';
import { RootStackParamList } from './types';

const RootStack = createStackNavigator<RootStackParamList>();

const RootStackNavigator: React.FC = () => {
  return (
    <RootStack.Navigator>
      {/* Drawer 최상위 라우트 */}
      <RootStack.Screen
        name="Recipes"
        component={RootDrawerNavigator}
        options={{ headerShown: false }}
      />

      {/* 디테일 스크린 등록 */}
      <RootStack.Screen
        name="IngredientDetail"
        component={IngredientDetailScreen}
        options={{ title: 'Ingredient Details' }}
      />
      <RootStack.Screen
        name="RecipeDetail"
        component={RecipeDetailScreen}
        options={{ title: 'Recipe Details' }}
      />
    </RootStack.Navigator>
  );
};

export default RootStackNavigator;
