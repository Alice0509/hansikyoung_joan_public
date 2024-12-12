// app/screens/RecipeScreen.tsx

import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  Button,
} from "react-native";
import { useRoute, RouteProp } from "@react-navigation/native";
import { getRecipeById } from "../lib/contentful";
import * as Speech from "expo-speech"; // expo-speech 사용
import Timer from "../components/Timer";
import ShoppingList from "../components/ShoppingList";
import { Recipe } from "../types/Recipe";
import RichTextRenderer from "../components/RichTextRenderer";
import { useLocale } from "../contexts/LocaleContext"; // LocaleContext 사용

type RecipeScreenRouteProp = RouteProp<
  { params: { recipeId: string } },
  "params"
>;

const RecipeScreen: React.FC = () => {
  const route = useRoute<RecipeScreenRouteProp>();
  const { recipeId } = route.params;
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const { locale } = useLocale(); // LocaleContext에서 locale 가져오기

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        const data = await getRecipeById(recipeId, locale);
        setRecipe(data);
        console.log("Fetched recipe:", data); // 로그 확인
      } catch (error) {
        console.error("Error fetching recipe:", error);
      }
    };

    fetchRecipe();
  }, [recipeId, locale]);

  const handleTimerComplete = () => {
    if (recipe && currentStep < recipe.fields.instructions.content.length - 1) {
      setCurrentStep((prev) => prev + 1);
    } else {
      alert("You have completed all steps!");
    }
  };

  const handleSpeak = () => {
    if (recipe) {
      const instructionsText = recipe.fields.instructions.content
        .map((instruction: any) => instruction.content?.[0]?.value || "")
        .join(". ");
      Speech.stop(); // 이전 읽기 중단
      Speech.speak(instructionsText, {
        language: "en-US", // 영어 (미국식)
        pitch: 1.0,
        rate: 1.0,
      });
      console.log("Started speaking instructions"); // 로그 확인
    }
  };

  const handleStop = () => {
    Speech.stop();
    console.log("Stopped speaking"); // 로그 확인
  };

  const getImageUrl = (): string | number => {
    const imageAsset = recipe?.fields.image?.[0]?.fields?.file?.url;
    const youtubeThumbnail = recipe?.fields.youTubeUrl
      ? `https://img.youtube.com/vi/${recipe.fields.youTubeUrl.split("v=")[1]?.split("&")[0]}/hqdefault.jpg`
      : null;
    return imageAsset
      ? `https:${imageAsset}`
      : youtubeThumbnail || require("../../assets/images/default.png");
  };

  if (!recipe) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Image source={{ uri: getImageUrl() }} style={styles.image} />
      <Text style={styles.title}>{recipe.fields.titel}</Text>
      <RichTextRenderer document={recipe.fields.description} />

      <ShoppingList ingredients={recipe.fields.ingredients} />

      <Text style={styles.sectionTitle}>Instructions</Text>
      <RichTextRenderer document={recipe.fields.instructions} />

      <Timer initialTime={120} onComplete={handleTimerComplete} />

      <Button title="Read Instructions" onPress={handleSpeak} />
      <Button title="Stop Speaking" onPress={handleStop} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#fff",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
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
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 16,
  },
  instruction: {
    fontSize: 16,
    color: "#333",
    marginVertical: 8,
  },
});

export default RecipeScreen;
