// app/components/CenterLogoSearch.tsx
import React, { useState } from 'react';
import {
  View,
  Image,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSearch } from '../contexts/SearchContext';

export default function CenterLogoSearch() {
  const [searchMode, setSearchMode] = useState(false);
  const { keyword, setKeyword } = useSearch();

  // 검색 모드 끌 때 검색어 초기화
  const toggleSearchMode = () => {
    setSearchMode((prev) => !prev);
    if (searchMode) {
      setKeyword(''); // 검색모드 종료 시 전역 검색어를 ''
    }
  };

  // 텍스트 변경 핸들러
  const handleTextChange = (text: string) => {
    setSearchText(text);
    // 여기서 추가 로직 수행
    // 예: 전역 상태(Context)에 저장하거나 API 호출 등
    // setKeyword(text);  // 예시로 Context 업데이트
  };

  return (
    <View style={styles.container}>
      {searchMode ? (
        // 검색 모드라면 검색창
        <View style={styles.searchBox}>
          <Ionicons
            name="search"
            size={18}
            color="#888"
            style={{ marginRight: 4 }}
          />
          <TextInput
            style={styles.searchInput}
            value={keyword}
            onChangeText={(text) => setKeyword(text)}
            placeholder="Search..."
            autoFocus
          />
        </View>
      ) : (
        // 로고 모드라면 로고
        <Image
          source={require('../../assets/images/myLogo.png')}
          style={styles.logo}
          resizeMode="contain"
        />
      )}

      {/* 검색 아이콘 (토글 버튼) */}
      <TouchableOpacity onPress={toggleSearchMode} style={styles.iconButton}>
        <Ionicons
          name={searchMode ? 'close' : 'search'}
          size={22}
          color="#000"
        />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logo: {
    width: 100,
    height: 40,
  },
  searchBox: {
    flexDirection: 'row',
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
  },
  iconButton: {
    paddingHorizontal: 6,
  },
});
