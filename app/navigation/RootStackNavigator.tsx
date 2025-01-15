// app/navigation/RootStackNavigator.tsx

import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import MainNavigator from './MainNavigator'; // 기존 MainNavigator import
import RecipeDetailScreen from '../screens/RecipeDetailScreen'; // RecipeDetailScreen으로 가정

import { RootStackParamList } from './types';

const RootStack = createStackNavigator<RootStackParamList>();

const RootStackNavigator: React.FC = () => {
  return (
    <RootStack.Navigator>
      <RootStack.Screen
        name="Main"
        component={MainNavigator}
        options={{ headerShown: false }}
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
