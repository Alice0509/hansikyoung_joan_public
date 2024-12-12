// app/screens/RecipeDetail.js

import React, { useState, useEffect } from "react";
import { View, Text, ScrollView, Image, ActivityIndicator } from "react-native";
import { getRecipes } from "../../lib/contentful";
import { useRoute } from "@react-navigation/native";

const RecipeDetail = () => {
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const route = useRoute();
  const { recipeId } = route.params;

  useEffect(() => {
    const fetchRecipeDetail = async () => {
      try {
        const recipes = await getRecipes();
        const selectedRecipe = recipes.find((r) => r.sys.id === recipeId);
        setRecipe(selectedRecipe);
      } catch (error) {
        console.error("Error fetching recipe detail:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecipeDetail();
  }, [recipeId]);

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  return (
    <ScrollView style={{ padding: 20 }}>
      {recipe && (
        <>
          <Image
            source={{ uri: recipe.fields.image.fields.file.url }}
            style={{ width: "100%", height: 200, borderRadius: 8 }}
          />
          <Text
            style={{ fontSize: 24, fontWeight: "bold", marginVertical: 10 }}
          >
            {recipe.fields.titel}
          </Text>
          <Text style={{ fontSize: 16 }}>{recipe.fields.description}</Text>
          <Text style={{ marginTop: 20, fontWeight: "bold" }}>조리 방법:</Text>
          <Text>{recipe.fields.instructions}</Text>
        </>
      )}
    </ScrollView>
  );
};

export default RecipeDetail;
