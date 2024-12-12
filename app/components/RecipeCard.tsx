// app/components/RecipeCard.tsx

import React from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useFavorites } from "../contexts/FavoritesContext";
import { Recipe } from "../types/Recipe";

const RecipeCard: React.FC<{ recipe: Recipe; onPress: () => void }> = ({
  recipe,
  onPress,
}) => {
  const navigation = useNavigation();
  const { favorites, addFavorite, removeFavorite } = useFavorites();
  const isFavorite = favorites.includes(recipe.sys.id);

  // 유튜브 썸네일 URL 생성 함수
  const getYouTubeThumbnail = (url: string) => {
    const videoId = url.split("v=")[1]?.split("&")[0];
    return videoId
      ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`
      : null;
  };

  // 이미지 우선순위 처리
  const imageUrl =
    recipe.fields.image?.[0]?.fields?.file?.url || // 1순위: 첫 번째 이미지
    getYouTubeThumbnail(recipe.fields.youTubeUrl || "") || // 2순위: YouTube 썸네일
    null; // 디폴트 이미지로 fallback

  const handleFavoriteToggle = () => {
    isFavorite ? removeFavorite(recipe.sys.id) : addFavorite(recipe.sys.id);
  };

  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <Image
        source={
          imageUrl
            ? { uri: `https:${imageUrl}` }
            : require("../../assets/images/default.png")
        } // 디폴트 이미지 경로 설정
        style={styles.image}
      />
      <Text style={styles.title}>
        {recipe.fields.titel || "Untitled Recipe"}
      </Text>
      <TouchableOpacity
        style={styles.favoriteButton}
        onPress={handleFavoriteToggle}
      >
        <Text style={styles.favoriteText}>{isFavorite ? "★" : "☆"}</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    marginBottom: 16,
    backgroundColor: "#f9f9f9",
    borderRadius: 8,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    position: "relative",
  },
  image: {
    width: "100%",
    height: 150,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    margin: 8,
  },
  favoriteButton: {
    position: "absolute",
    top: 10,
    right: 10,
    backgroundColor: "rgba(0,0,0,0.5)",
    borderRadius: 20,
    padding: 5,
  },
  favoriteText: {
    fontSize: 18,
    color: "#fff",
  },
});

export default RecipeCard;
