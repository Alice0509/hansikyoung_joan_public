// app/components/CategoryCard.tsx

import React from "react";
import {
  TouchableOpacity,
  Text,
  Image,
  StyleSheet,
  Dimensions,
} from "react-native";
import { Entry } from "contentful";
import { Category } from "../types/Recipe";

interface CategoryCardProps {
  category: Entry<Category>;
  onPress: () => void;
}

const CategoryCard: React.FC<CategoryCardProps> = ({ category, onPress }) => {
  const imageUrl = category.fields.image?.fields.file.url
    ? `https:${category.fields.image.fields.file.url}`
    : null;

  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      {imageUrl && <Image source={{ uri: imageUrl }} style={styles.image} />}
      <Text style={styles.cardTitle}>{category.fields.name}</Text>
    </TouchableOpacity>
  );
};

const { width } = Dimensions.get("window");
const CARD_WIDTH = width * 0.6;

const styles = StyleSheet.create({
  card: {
    width: CARD_WIDTH,
    marginRight: 15,
    backgroundColor: "#f9f9f9",
    borderRadius: 10,
    overflow: "hidden",
    elevation: 3, // 안드로이드 그림자
    shadowColor: "#000", // iOS 그림자
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    alignItems: "center",
  },
  image: {
    width: "100%",
    height: CARD_WIDTH * 0.8, // 비율에 맞게 조정
    resizeMode: "cover",
  },
  cardTitle: {
    padding: 10,
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
});

export default CategoryCard;
