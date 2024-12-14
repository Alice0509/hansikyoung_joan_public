// app/screens/IngredientScreen.tsx

import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ActivityIndicator } from "react-native";
import { RouteProp } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { getIngredientById } from "../lib/contentful";
import { RootStackParamList } from "../navigation/types";

type IngredientScreenRouteProp = RouteProp<RootStackParamList, "Ingredient">;
type IngredientScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "Ingredient"
>;

interface IngredientScreenProps {
  route: IngredientScreenRouteProp;
  navigation: IngredientScreenNavigationProp;
}

const IngredientScreen: React.FC<IngredientScreenProps> = ({
  route,
  navigation,
}) => {
  const { ingredientId, locale } = route.params;
  const [ingredient, setIngredient] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchIngredient = async () => {
      try {
        const data = await getIngredientById(ingredientId, locale);
        setIngredient(data);
      } catch (error) {
        console.error("Error fetching ingredient:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchIngredient();
  }, [ingredientId, locale]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (!ingredient) {
    return (
      <View style={styles.container}>
        <Text>Ingredient not found.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{ingredient.name}</Text>
      <Text>{ingredient.description}</Text>
      {/* 추가 정보 표시 */}
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
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
});

export default IngredientScreen;
