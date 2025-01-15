// app/navigation/TabNavigator.tsx

import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/Ionicons';
import StepsScreen from '../screens/StepsScreen';
import InstructionsScreen from '../screens/InstructionsScreen';

const Tab = createBottomTabNavigator();

const TabNavigator = () => {
  return (
    <Tab.Navigator
      initialRouteName="Steps"
      screenOptions={({ route }) => ({
        headerShown: false, // 각 탭의 헤더 숨기기
        tabBarIcon: ({ color, size }) => {
          let iconName;

          if (route.name === 'Steps') {
            iconName = 'list';
          } else if (route.name === 'Instructions') {
            iconName = 'book';
          }

          return <Icon name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#007AFF',
        tabBarInactiveTintColor: 'gray',
      })}
    >
      <Tab.Screen name="Steps" component={StepsScreen} />
      <Tab.Screen name="Instructions" component={InstructionsScreen} />
    </Tab.Navigator>
  );
};

export default TabNavigator;
