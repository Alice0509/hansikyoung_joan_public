// app/components/HeaderWithLogoSearch.tsx
import React, { useState } from 'react';
import {
  View,
  TextInput,
  Image,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
// DrawerActions, useNavigation을 통해 Drawer 열기
import { useNavigation } from '@react-navigation/native';
import { DrawerActions } from '@react-navigation/native';

export default function HeaderWithLogoSearch() {
  const navigation = useNavigation();

  // 검색 모드를 on/off
  const [searchMode, setSearchMode] = useState(false);
  const [searchText, setSearchText] = useState('');

  // 검색 모드 토글
  const toggleSearchMode = () => {
    setSearchMode((prev) => !prev);
    // 검색 모드를 껐을 때 입력 초기화
    if (searchMode) {
      setSearchText('');
    }
  };

  // Drawer 열기(왼쪽 햄버거 버튼)
  const openDrawer = () => {
    navigation.dispatch(DrawerActions.openDrawer());
  };

  return (
    <View style={styles.container}>
      {/* 왼쪽: 드로어 버튼(햄버거 아이콘) */}
      <TouchableOpacity onPress={openDrawer} style={styles.menuButton}>
        <Ionicons name="menu" size={24} color="#000" />
      </TouchableOpacity>

      {/* 중앙: 로고 or 검색창 */}
      <View style={styles.centerContainer}>
        {searchMode ? (
          <View style={styles.searchBox}>
            <Ionicons
              name="search"
              size={18}
              color="#888"
              style={{ marginRight: 4 }}
            />
            <TextInput
              style={styles.searchInput}
              value={searchText}
              onChangeText={setSearchText}
              placeholder="Search..."
              autoFocus
            />
          </View>
        ) : (
          <Image
            source={require('../../assets/images/myLogo.png')}
            style={styles.logo}
            resizeMode="contain"
          />
        )}
      </View>

      {/* 오른쪽 아이콘 영역: 알림 + 검색 아이콘 */}
      <View style={styles.rightContainer}>
        {/* 알림 아이콘 */}
        <TouchableOpacity style={styles.iconButton}>
          <Ionicons name="notifications-outline" size={22} color="#000" />
        </TouchableOpacity>

        {/* 검색 아이콘 (토글) */}
        <TouchableOpacity onPress={toggleSearchMode} style={styles.iconButton}>
          <Ionicons
            name={searchMode ? 'close' : 'search'}
            size={22}
            color="#000"
          />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    // 헤더 전체 컨테이너
    flexDirection: 'row',
    alignItems: 'center',
    height: 50,
    width: '100%',
    backgroundColor: '#fff',
    // iOS/Android 각기 다른 헤더 높이일 수 있으므로
    // 필요하면 paddingHorizontal, paddingTop 등 조정
  },
  menuButton: {
    paddingHorizontal: 10,
  },
  centerContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: 100,
    height: 40,
  },
  rightContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 8,
  },
  iconButton: {
    marginHorizontal: 5,
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    width: 180,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
  },
});
