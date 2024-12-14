// app/components/FilterBar.tsx

import React from "react";
import { View, Button, StyleSheet } from "react-native";
import { useSearch } from "../contexts/SearchContext";

const categories = [
  { key: "Vegetarian", label: "Vegetarian" },
  { key: "Quick", label: "Quick Recipes" },
  { key: "Desserts", label: "Desserts" }, // 추가 필터 예시
];

const FilterBar: React.FC = () => {
  const { filter, setFilter } = useSearch();

  const toggleCategory = (category: string) => {
    setFilter((prev: { category?: string; maxTime?: number }) => ({
      ...prev,
      category: prev.category === category ? undefined : category,
    }));
  };

  return (
    <View style={styles.container}>
      {categories.map((cat) => (
        <Button
          key={cat.key}
          title={cat.label}
          onPress={() => toggleCategory(cat.key)}
          color={filter.category === cat.key ? "blue" : "gray"} // 선택된 상태 강조
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    flexWrap: "wrap", // 작은 화면에서 버튼이 줄 바꿈되도록 설정
    justifyContent: "space-around",
    marginVertical: 8,
  },
});

export default FilterBar;
