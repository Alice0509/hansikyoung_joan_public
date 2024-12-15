// app/screens/IngredientListScreen.tsx

import React, { useEffect, useState } from "react";
import {
  View,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  Text,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../navigation/types";
import { Entry } from "contentful";
import { Ingredient } from "../types/Recipe";
import IngredientCard from "../components/IngredientCard"; // IngredientCard 임포트
import { getAllIngredients } from "../lib/contentful"; // getAllIngredients 임포트

type IngredientListScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "Ingredients"
>;

const IngredientListScreen: React.FC = () => {
  const navigation = useNavigation<IngredientListScreenNavigationProp>();
  const [ingredients, setIngredients] = useState<Entry<Ingredient>[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchIngredients = async () => {
      try {
        const data = await getAllIngredients("en"); // 필요한 locale로 설정
        // bild 필드가 있는 항목만 필터링
        const filteredData = data.filter(
          (ingredient) =>
            ingredient.fields.bild && ingredient.fields.bild.fields.file.url,
        );
        setIngredients(filteredData);
        console.log("Fetched Ingredients:", filteredData);
      } catch (error) {
        console.error("Error fetching ingredients:", error);
        setError("Failed to load ingredients.");
      } finally {
        setLoading(false);
      }
    };

    fetchIngredients();
  }, []);

  const renderItem = ({ item }: { item: Entry<Ingredient> }) => (
    <IngredientCard ingredient={item} />
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centeredContainer}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  if (ingredients.length === 0) {
    return (
      <View style={styles.centeredContainer}>
        <Text style={styles.noDataText}>No ingredients available.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={ingredients}
        keyExtractor={(item) => item.sys.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        initialNumToRender={10}
        windowSize={5}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  centeredContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  listContainer: {
    paddingBottom: 20,
  },
  errorText: {
    textAlign: "center",
    fontSize: 16,
    color: "red",
  },
  noDataText: {
    textAlign: "center",
    fontSize: 16,
    color: "#000",
  },
});

export default IngredientListScreen;
