// app/components/SearchBar.tsx

import React from 'react';
import { View, TextInput, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next'; // 번역 키 사용을 위해 추가
import { useSearch } from '../contexts/SearchContext';

const SearchBar = () => {
  const { keyword, setKeyword } = useSearch();
  const { t } = useTranslation(); // 번역 함수
  const placeholderText = t('search_recipes');

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder={placeholderText}
        placeholderTextColor="#999" // 플레이스홀더 텍스트 색상 설정
        value={keyword}
        onChangeText={setKeyword}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    marginVertical: 8,
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 8,
    fontSize: 16, // 글자 크기 명시적 설정
    color: '#000', // 텍스트 색상 설정
  },
});

export default SearchBar;
