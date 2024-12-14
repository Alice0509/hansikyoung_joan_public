// app/components/RecipeCard.tsx

import React from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Platform,
} from "react-native";
import { useFavorites } from "../contexts/FavoritesContext";
import { RecipeEntry } from "../types/Recipe";
import { getThumbnailFromEmbedUrl } from "../lib/getYouTubeThumbnail";

interface RecipeCardProps {
  recipe: RecipeEntry;
  onPress: () => void;
}

const RecipeCard: React.FC<RecipeCardProps> = ({ recipe, onPress }) => {
  const { favorites, addFavorite, removeFavorite } = useFavorites();
  const isFavorite = favorites.includes(recipe.sys.id);

  // 유튜브 썸네일 추출
  const youTubeThumbnail = recipe.fields.youTubeUrl
    ? getThumbnailFromEmbedUrl(recipe.fields.youTubeUrl)
    : null;

  // 이미지 우선순위 처리: 레시피 이미지 > 유튜브 썸네일 > 기본 이미지
  let imageUrl: string | null = null;
  if (
    recipe.fields.image &&
    recipe.fields.image.length > 0 &&
    recipe.fields.image[0].fields.file.url
  ) {
    imageUrl = `https:${recipe.fields.image[0].fields.file.url}`;
  } else if (youTubeThumbnail) {
    imageUrl = youTubeThumbnail;
  }

  const handleFavoriteToggle = () => {
    isFavorite ? removeFavorite(recipe.sys.id) : addFavorite(recipe.sys.id);
  };

  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      {/* 이미지 렌더링 */}
      {imageUrl ? (
        <Image
          source={{ uri: imageUrl }}
          style={styles.image}
          resizeMode="cover"
        />
      ) : (
        <Image
          source={require("../../assets/images/default.png")}
          style={styles.image}
          resizeMode="cover"
        />
      )}

      {/* 제목 및 카테고리 */}
      <View style={styles.content}>
        <Text style={styles.title}>
          {recipe.fields.titel || "Untitled Recipe"}
        </Text>
        <Text style={styles.category}>
          {recipe.fields.category || "No Category"}
        </Text>
      </View>

      {/* 즐겨찾기 버튼 */}
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
    backgroundColor: "#fff", // 배경색 추가
    borderRadius: 8,
    overflow: "hidden",
    // 그림자 스타일 플랫폼별로 적용
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
      },
      android: {
        elevation: 5,
      },
      web: {
        boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)", // 웹 전용 그림자
      },
    }),
    position: "relative",
  },
  image: {
    width: "100%",
    height: 150,
  },
  content: {
    padding: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
    color: "#000", // 텍스트 색상 명시
  },
  category: {
    fontSize: 14,
    color: "#666",
    marginBottom: 10,
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
