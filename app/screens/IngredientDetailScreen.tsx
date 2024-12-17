// app/screens/IngredientDetailScreen.tsx

import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Image,
  ScrollView,
} from "react-native";
import { RouteProp } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { getIngredientById } from "../lib/contentful";
import { RootStackParamList } from "../navigation/types";
import RichTextRenderer from "../components/RichTextRenderer"; // RichTextRenderer 임포트
import { Entry } from "contentful"; // Contentful Entry 타입 임포트
import { Ingredient } from "../types/Recipe"; // Ingredient 타입 임포트
import { useLanguage } from "../contexts/LanguageContext"; // LanguageContext 임포트

type IngredientDetailScreenRouteProp = RouteProp<
  RootStackParamList,
  "IngredientDetail"
>;
type IngredientDetailScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "IngredientDetail"
>;

interface IngredientDetailScreenProps {
  route: IngredientDetailScreenRouteProp;
  navigation: IngredientDetailScreenNavigationProp;
}

const IngredientDetailScreen: React.FC<IngredientDetailScreenProps> = ({
  route,
  navigation,
}) => {
  console.log("route.params:", route.params); // 추가

  // 1. route.params가 정의되었는지 확인
  if (!route.params) {
    return (
      <View style={styles.centeredContainer}>
        <Text style={styles.notFoundText}>No parameters passed.</Text>
      </View>
    );
  }

  const { ingredientId, locale } = route.params;

  // 2. ingredientId가 존재하는지 확인
  if (!ingredientId) {
    return (
      <View style={styles.centeredContainer}>
        <Text style={styles.notFoundText}>Ingredient ID is missing.</Text>
      </View>
    );
  }

  const { language } = useLanguage(); // 현재 언어 가져오기
  const [ingredient, setIngredient] = useState<Entry<Ingredient> | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchIngredient = async () => {
      try {
        console.log(
          `Route Params - ingredientId: ${ingredientId}, Language: ${language}`,
        );
        console.log(
          `Fetching ingredient with ID: ${ingredientId}, Language: ${language}`,
        );
        const data = await getIngredientById(ingredientId, language); // 언어 적용
        setIngredient(data);
        console.log("Fetched Ingredient:", JSON.stringify(data, null, 2)); // 응답 데이터 로그
      } catch (error) {
        console.error("Error fetching ingredient:", error);
        setError("Failed to load ingredient.");
      } finally {
        setLoading(false);
      }
    };

    fetchIngredient();
  }, [ingredientId, language]); // 언어가 변경될 때마다 재페칭

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

  if (!ingredient) {
    return (
      <View style={styles.centeredContainer}>
        <Text style={styles.notFoundText}>Ingredient not found.</Text>
      </View>
    );
  }

  const { name, slug, germanMeatCut, bild, description } = ingredient.fields;

  // 이미지가 없는 경우 페이지를 표시하지 않음
  if (!bild || !bild.fields.file.url) {
    return (
      <View style={styles.centeredContainer}>
        <Text style={styles.notFoundText}>
          Ingredients without images will not be displayed.
        </Text>
      </View>
    );
  }

  const imageUrl = `https:${bild.fields.file.url}`;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Image source={{ uri: imageUrl }} style={styles.image} />
      <Text style={styles.name}>{name}</Text>
      {germanMeatCut && (
        <Text style={styles.germanMeatCut}>
          German-style meat cuts: {germanMeatCut}
        </Text>
      )}
      {description ? (
        <RichTextRenderer content={description} />
      ) : (
        <Text style={styles.text}>No Description Available</Text>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#fff",
    flexGrow: 1,
    justifyContent: "flex-start",
    alignItems: "center",
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
  errorText: {
    textAlign: "center",
    fontSize: 16,
    color: "red",
  },
  notFoundText: {
    fontSize: 18,
    color: "#ff0000",
    textAlign: "center",
  },
  image: {
    width: "100%",
    height: 200,
    borderRadius: 8,
    marginBottom: 10,
  },
  name: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 5,
    color: "#000",
    textAlign: "center",
  },
  slug: {
    fontSize: 16,
    marginBottom: 10,
    color: "#333",
    textAlign: "center",
  },
  germanMeatCut: {
    fontSize: 16,
    marginBottom: 10,
    color: "#333",
    textAlign: "center",
  },
  text: {
    fontSize: 16,
    color: "#333",
    textAlign: "left",
    width: "100%",
  },
});

export default IngredientDetailScreen;
