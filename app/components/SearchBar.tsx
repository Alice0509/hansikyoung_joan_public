//app/components/SearchBar.tsx

import React from "react";
import { View, TextInput, StyleSheet } from "react-native";
import { useSearch } from "../contexts/SearchContext";

const SearchBar = () => {
  const { keyword, setKeyword } = useSearch();

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Search recipes..."
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
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 8,
  },
});

export default SearchBar;
