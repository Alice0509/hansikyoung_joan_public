import React, { useEffect, useState } from "react";
import { View, Text, Image, StyleSheet, ScrollView } from "react-native";
import { useRoute, RouteProp } from "@react-navigation/native";
import { getIngredientById } from "../lib/contentful";
import { Ingredient } from "../types/Recipe";

type IngredientScreenRouteProp = RouteProp<
  { params: { ingredientId: string; locale: string } },
  "params"
>;

const IngredientScreen: React.FC = () => {
  const route = useRoute<IngredientScreenRouteProp>();
  const { ingredientId, locale } = route.params;
  const [ingredient, setIngredient] = useState<Ingredient | null>(null);

  useEffect(() => {
    const fetchIngredient = async () => {
      try {
        const data = await getIngredientById(ingredientId, locale);
        setIngredient(data);
      } catch (error) {
        console.error("Error fetching ingredient:", error);
      }
    };

    fetchIngredient();
  }, [ingredientId, locale]);

  if (!ingredient) {
    return <Text>Loading...</Text>;
  }

  const imageUrl =
    ingredient.fields.bild?.fields?.file?.url ||
    require("../../assets/images/default.png");

  return (
    <ScrollView style={styles.container}>
      <Image source={{ uri: imageUrl }} style={styles.image} />
      <Text style={styles.title}>{ingredient.fields.name}</Text>
      <Text style={styles.description}>
        {ingredient.fields.description?.content?.[0]?.content?.[0]?.value ||
          "No description available."}
      </Text>
      {ingredient.fields.germanMeatCut && (
        <View style={styles.infoContainer}>
          <Text style={styles.infoTitle}>German Meat Cut</Text>
          <Text style={styles.infoText}>{ingredient.fields.germanMeatCut}</Text>
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#fff",
  },
  image: {
    width: "100%",
    height: 200,
    borderRadius: 10,
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 8,
  },
  description: {
    fontSize: 16,
    color: "#666",
    marginBottom: 16,
  },
  infoContainer: {
    marginTop: 16,
    padding: 16,
    backgroundColor: "#f9f9f9",
    borderRadius: 8,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 4,
  },
  infoText: {
    fontSize: 16,
    color: "#333",
  },
});

export default IngredientScreen;
