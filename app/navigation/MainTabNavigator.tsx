// app/navigation/MainTabNavigator.tsx

import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';

import HomeScreen from '../screens/HomeScreen';
import RecipeListScreen from '../screens/RecipeListScreen';
import SettingsScreen from '../screens/SettingsScreen';
import IngredientListScreen from '../screens/IngredientListScreen';
import FavoritesScreen from '../screens/FavoritesScreen';

import { TabParamList } from './types';

const Tab = createBottomTabNavigator<TabParamList>();

const MainTabNavigator: React.FC = () => {
  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName = '';

          switch (route.name) {
            case 'Home':
              iconName = focused ? 'home' : 'home-outline';
              break;
            case 'RecipeList':
              iconName = focused ? 'list' : 'list-outline';
              break;
            case 'Ingredients':
              iconName = focused ? 'nutrition' : 'nutrition-outline';
              break;
            case 'Favorites':
              iconName = focused ? 'heart' : 'heart-outline';
              break;
            case 'Settings':
              iconName = focused ? 'settings' : 'settings-outline';
              break;
            default:
              iconName = 'ellipse';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#007AFF',
        tabBarInactiveTintColor: 'gray',
        headerShown: false,
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="RecipeList" component={RecipeListScreen} />
      <Tab.Screen name="Ingredients" component={IngredientListScreen} />
      <Tab.Screen name="Favorites" component={FavoritesScreen} />
      <Tab.Screen name="Settings" component={SettingsScreen} />
    </Tab.Navigator>
  );
};

export default MainTabNavigator;
