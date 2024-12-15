// app/components/IngredientCard.tsx

import React from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import { Entry } from "contentful"; // Contentful Entry 타입 임포트
import { Ingredient } from "../types/Recipe"; // Ingredient 타입 임포트
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../navigation/types";
import RichTextRenderer from "./RichTextRenderer";

type IngredientCardNavigationProp = StackNavigationProp<
  RootStackParamList,
  "Ingredient"
>;

interface IngredientCardProps {
  ingredient: Entry<Ingredient>;
}

const IngredientCard: React.FC<IngredientCardProps> = ({ ingredient }) => {
  const navigation = useNavigation<IngredientCardNavigationProp>();
  const { name, germanMeatCut, bild, description } = ingredient.fields;

  // 이미지가 없는 경우 카드 표시하지 않음
  if (!bild) {
    return null;
  }

  const imageUrl = bild.fields.file.url
    ? `https:${bild.fields.file.url}`
    : null;

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() =>
        navigation.navigate("Ingredient", {
          ingredientId: ingredient.sys.id,
          locale: "en", // 필요한 locale을 전달
        })
      }
    >
      {imageUrl && <Image source={{ uri: imageUrl }} style={styles.image} />}
      <View style={styles.infoContainer}>
        <Text style={styles.name}>{name}</Text>
        {germanMeatCut && (
          <Text style={styles.germanMeatCut}>
            독일식 고기 부위: {germanMeatCut}
          </Text>
        )}
        {description && <RichTextRenderer content={description} />}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#f9f9f9",
    borderRadius: 8,
    marginBottom: 15,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 2,
  },
  image: {
    width: "100%",
    height: 150,
  },
  infoContainer: {
    padding: 10,
  },
  name: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#000",
    marginBottom: 5,
  },
  germanMeatCut: {
    fontSize: 14,
    color: "#555",
    marginBottom: 5,
  },
});

export default IngredientCard;
