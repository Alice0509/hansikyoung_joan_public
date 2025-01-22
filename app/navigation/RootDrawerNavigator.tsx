// app/navigation/RootDrawerNavigator.tsx
import React from 'react';
import {
  createDrawerNavigator,
  DrawerToggleButton,
} from '@react-navigation/drawer';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';
import { View, TouchableOpacity, StyleSheet } from 'react-native';

import MainTabNavigator from './MainTabNavigator';
import ShoppingListScreen from '../screens/ShoppingListScreen';
import SettingsScreen from '../screens/SettingsScreen';
import CenterLogoSearch from '../components/CenterLogoSearch';

const Drawer = createDrawerNavigator();

/** 오른쪽 아이콘들 (알림 등) */
function HeaderRightIcons() {
  return (
    <View style={styles.rightContainer}>
      <TouchableOpacity style={{ marginHorizontal: 5 }}>
        <Ionicons name="notifications-outline" size={22} color="#000" />
      </TouchableOpacity>
      {/* 필요한 다른 아이콘도 추가 가능 */}
    </View>
  );
}

export default function RootDrawerNavigator() {
  const { t } = useTranslation(); // useTranslation 훅을 선언하여 t를 사용

  return (
    <Drawer.Navigator initialRouteName="Home">
      <Drawer.Screen
        name={t('dashboard')}
        component={MainTabNavigator}
        options={{
          // (1) 왼쪽: 표준 드로어 토글 버튼
          headerLeft: () => <DrawerToggleButton />,

          // (2) 가운데: 로고 / 검색 토글
          headerTitle: () => <CenterLogoSearch />,

          // (3) 오른쪽: 알림 아이콘, 기타 아이콘
          headerRight: () => <HeaderRightIcons />,

          // 가운데 정렬 (iOS에선 잘 맞지만 Android는 조금 다를 수 있음)
          headerTitleAlign: 'center',
        }}
      />
      <Drawer.Screen name={t('Shopping List')} component={ShoppingListScreen} />
      <Drawer.Screen name={t('Settings')} component={SettingsScreen} />
    </Drawer.Navigator>
  );
}

const styles = StyleSheet.create({
  rightContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 8,
  },
});
