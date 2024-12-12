// app/components/ShoppingList.tsx

import React, { useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { useNavigation } from "@react-navigation/native";

type ShoppingListProps = {
  ingredients: { id: string; title: string; quantity: string }[];
};

const ShoppingList: React.FC<ShoppingListProps> = ({ ingredients }) => {
  const [checkedItems, setCheckedItems] = useState<string[]>([]);
  const navigation = useNavigation();

  const toggleItem = (title: string) => {
    setCheckedItems((prev) =>
      prev.includes(title)
        ? prev.filter((item) => item !== title)
        : [...prev, title],
    );
  };

  const handlePress = (ingredientId: string) => {
    navigation.navigate("Ingredient", { ingredientId, locale: "en" }); // 선택된 재료로 이동
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Shopping List</Text>
      <FlatList
        data={ingredients}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.itemContainer}>
            <TouchableOpacity
              style={styles.item}
              onPress={() => toggleItem(item.title)}
            >
              <Text
                style={[
                  styles.itemText,
                  checkedItems.includes(item.title) && styles.checkedText,
                ]}
              >
                {item.quantity} - {item.title}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.detailsButton}
              onPress={() => handlePress(item.id)}
            >
              <Text style={styles.detailsText}>Details</Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 16,
    paddingHorizontal: 16,
    backgroundColor: "#f9f9f9",
    borderRadius: 8,
    paddingVertical: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
  },
  itemContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  item: {
    flex: 1,
  },
  itemText: {
    fontSize: 16,
  },
  checkedText: {
    textDecorationLine: "line-through",
    color: "#888",
  },
  detailsButton: {
    marginLeft: 16,
  },
  detailsText: {
    fontSize: 14,
    color: "#007BFF",
  },
});

export default ShoppingList;
