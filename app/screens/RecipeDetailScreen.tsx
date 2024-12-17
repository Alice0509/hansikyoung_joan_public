// app/screens/RecipeDetailScreen.tsx

import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  ActivityIndicator,
  StyleSheet,
  Linking,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { RouteProp } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { getRecipeById } from "../lib/contentful";
import RichTextRenderer from "../components/RichTextRenderer";
import { RecipeEntry, RecipeIngredient, Ingredient } from "../types/Recipe";
import { RootStackParamList } from "../navigation/types";
import { getThumbnailFromEmbedUrl } from "../lib/getYouTubeThumbnail";
import { useLanguage } from "../contexts/LanguageContext"; // LanguageContext 임포트

type RecipeScreenRouteProp = RouteProp<RootStackParamList, "RecipeDetail">;
type RecipeScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "RecipeDetail"
>;

interface RecipeScreenProps {
  route: RecipeScreenRouteProp;
  navigation: RecipeScreenNavigationProp;
}

const RecipeScreen: React.FC<RecipeScreenProps> = ({ route, navigation }) => {
  const { recipeId } = route.params;
  const { language } = useLanguage(); // 현재 언어 가져오기
  const [recipe, setRecipe] = useState<RecipeEntry | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [thumbnail, setThumbnail] = useState<string | null>(null);

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        const data = await getRecipeById(recipeId, language); // 언어 적용
        setRecipe(data);

        if (data.fields.youTubeUrl) {
          const thumb = getThumbnailFromEmbedUrl(data.fields.youTubeUrl);
          setThumbnail(thumb);
        }

        console.log("Fetched Recipe:", data); // 데이터 확인
      } catch (error) {
        console.error("Error fetching recipe details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecipe();
  }, [recipeId, language]); // 언어가 변경될 때마다 재페칭

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  if (!recipe) {
    return (
      <View style={styles.container}>
        <Text style={styles.notFoundText}>Recipe not found.</Text>
      </View>
    );
  }

  const {
    titel,
    description,
    image,
    category,
    preparationTime,
    servings,
    ingredients,
    instructions,
    videoFile,
    youTubeUrl,
  } = recipe.fields;

  // 이미지 URL 설정: Contentful 이미지 > YouTube 썸네일 > 기본 이미지
  let displayImageSource;

  if (image?.[0]?.fields?.file?.url) {
    displayImageSource = { uri: `https:${image[0].fields.file.url}` };
    console.log("Displaying Contentful Image:", displayImageSource.uri);
  } else if (thumbnail) {
    displayImageSource = { uri: thumbnail };
    console.log("Displaying YouTube Thumbnail:", displayImageSource.uri);
  } else {
    displayImageSource = require("../../assets/images/default.png");
    console.log("Displaying Default Image");
  }

  // 모든 재료 표시 (이미지가 있는 재료에만 링크 걸기)
  const renderIngredients = () => {
    if (!ingredients || ingredients.length === 0) {
      return <Text style={styles.text}>No ingredients available.</Text>;
    }

    return ingredients.map(
      (recipeIngredient: RecipeIngredient, index: number) => {
        const ingredient = recipeIngredient.fields.ingredient as Ingredient;
        const { name, bild } = ingredient.fields;
        const quantity = recipeIngredient.fields.quantity || "";

        // 이미지 존재 여부 확인
        const hasImage = !!bild;
        const ingredientId = ingredient.sys.id;

        return (
          <View key={recipeIngredient.sys.id} style={styles.ingredientItem}>
            {/* 재료 이름 표시 (이미지가 있을 경우 네비게이션 링크 걸기) */}
            {hasImage ? (
              <TouchableOpacity
                onPress={() =>
                  navigation.navigate("IngredientDetail", {
                    // 스크린 이름 수정
                    ingredientId: ingredientId,
                  })
                }
              >
                <Text style={styles.ingredientLink}>{name}</Text>
              </TouchableOpacity>
            ) : (
              <Text style={styles.ingredientText}>{name}</Text>
            )}

            {/* Quantity 표시 */}
            <Text style={styles.ingredientQuantity}>{quantity}</Text>
          </View>
        );
      },
    );
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.scrollContent}
    >
      {/* 이미지 렌더링 */}
      <Image
        source={displayImageSource}
        style={styles.image}
        resizeMode="cover"
        onError={(error) =>
          console.error("Failed to load image:", error.nativeEvent.error)
        }
      />

      {/* 제목 */}
      <Text style={styles.title}>{titel || "Untitled"}</Text>

      {/* 카테고리 */}
      <Text style={styles.sectionHeader}>Category:</Text>
      <Text style={styles.text}>{category || "No Category"}</Text>

      {/* 준비 시간 */}
      <Text style={styles.sectionHeader}>Preparation Time:</Text>
      <Text style={styles.text}>
        {preparationTime ? `${preparationTime} 분` : "N/A"}
      </Text>

      {/* 인분 */}
      <Text style={styles.sectionHeader}>Servings:</Text>
      <Text style={styles.text}>{servings ? `${servings} 인분` : "N/A"}</Text>

      {/* 재료 */}
      <Text style={styles.sectionHeader}>Ingredients:</Text>
      <View style={styles.ingredientsContainer}>{renderIngredients()}</View>

      {/* 설명 */}
      <Text style={styles.sectionHeader}>Description:</Text>
      {description ? (
        <RichTextRenderer content={description} />
      ) : (
        <Text style={styles.text}>No Description Available</Text>
      )}

      {/* 조리 방법 */}
      <Text style={styles.sectionHeader}>Instructions:</Text>
      {instructions ? (
        <RichTextRenderer content={instructions} />
      ) : (
        <Text style={styles.text}>No Instructions Available</Text>
      )}

      {/* YouTube 썸네일 또는 비디오 링크 */}
      {youTubeUrl && (
        <View style={styles.youtubeContainer}>
          <Text style={styles.sectionHeader}>Video for reference:</Text>
          {thumbnail ? (
            <TouchableOpacity onPress={() => Linking.openURL(youTubeUrl)}>
              <Image
                source={{ uri: thumbnail }}
                style={styles.youtubeImage}
                resizeMode="cover"
                onError={() =>
                  console.error("Failed to load YouTube thumbnail image")
                }
              />
              <View style={styles.playButton}>
                <Text style={styles.playButtonText}>▶</Text>
              </View>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity onPress={() => Linking.openURL(youTubeUrl)}>
              <Text style={styles.link}>{youTubeUrl}</Text>
            </TouchableOpacity>
          )}
        </View>
      )}

      {/* 비디오 파일 */}
      {videoFile && (
        <View style={styles.videoContainer}>
          <Text style={styles.sectionHeader}>Video for reference:</Text>
          <TouchableOpacity
            onPress={() =>
              Linking.openURL(`https:${videoFile.fields.file.url}`)
            }
          >
            <Text style={styles.link}>{videoFile.fields.file.url}</Text>
          </TouchableOpacity>
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#fff",
    flex: 1, // ScrollView가 전체 화면을 차지하도록 설정
  },
  scrollContent: {
    paddingBottom: 20,
    flexGrow: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
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
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginVertical: 10,
    color: "#000",
  },
  sectionHeader: {
    marginTop: 20,
    fontSize: 18,
    fontWeight: "bold",
    color: "#000",
  },
  text: {
    fontSize: 16,
    color: "#333",
    marginTop: 5,
  },
  ingredientsContainer: {
    marginTop: 10,
  },
  ingredientItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  ingredientQuantity: {
    fontSize: 16,
    color: "#555",
    marginLeft: 10, // 재료 이름과 양 사이 간격 조정
  },
  ingredientLink: {
    fontSize: 16,
    color: "blue",
    textDecorationLine: "underline",
  },
  ingredientText: {
    fontSize: 16,
    color: "#333",
  },
  youtubeContainer: {
    marginTop: 20,
    alignItems: "center",
  },
  youtubeImage: {
    width: Dimensions.get("window").width - 40,
    height: ((Dimensions.get("window").width - 40) * 9) / 16, // 16:9 비율 유지
    borderRadius: 8,
  },
  playButton: {
    position: "absolute",
    top: "40%",
    left: "45%",
    backgroundColor: "rgba(0,0,0,0.6)",
    borderRadius: 25,
    padding: 10,
  },
  playButtonText: {
    color: "#fff",
    fontSize: 20,
  },
  videoContainer: {
    marginTop: 20,
  },
  link: {
    color: "blue",
    textDecorationLine: "underline",
  },
});

export default RecipeScreen;
