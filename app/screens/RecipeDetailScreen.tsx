// app/screens/RecipeDetailScreen.tsx

import React, { useState, useEffect } from "react";
import {
  View,
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
import CustomText from "../components/CustomText"; // CustomText 임포트
import { useTheme } from "../contexts/ThemeContext"; // ThemeContext 임포트
import { useFontSize } from "../contexts/FontSizeContext"; // FontSizeContext 임포트

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
  const { colors } = useTheme(); // ThemeContext에서 colors 가져오기
  const { fontSize } = useFontSize(); // FontSizeContext에서 fontSize 가져오기
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

  // 스타일 생성은 컴포넌트 내부에서
  const styles = getStyles(colors, fontSize);

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
        <CustomText style={styles.notFoundText}>Recipe not found.</CustomText>
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
      return (
        <CustomText style={styles.text}>No ingredients available.</CustomText>
      );
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
                    ingredientId: ingredientId,
                  })
                }
                style={{ flex: 1, flexShrink: 1 }}
              >
                <CustomText style={styles.ingredientLink}>{name}</CustomText>
              </TouchableOpacity>
            ) : (
              <CustomText style={styles.ingredientText}>{name}</CustomText>
            )}

            {/* Quantity 표시 */}
            <CustomText style={styles.ingredientQuantity}>
              {quantity}
            </CustomText>
          </View>
        );
      },
    );
  };

  return (
    <ScrollView
      style={styles.scrollContainer}
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
      <CustomText style={styles.title}>{titel || "Untitled"}</CustomText>

      {/* 카테고리 */}
      <CustomText style={styles.sectionHeader}>Category:</CustomText>
      <CustomText style={styles.text}>{category || "No Category"}</CustomText>

      {/* 준비 시간 */}
      <CustomText style={styles.sectionHeader}>Preparation Time:</CustomText>
      <CustomText style={styles.text}>
        {preparationTime ? `${preparationTime} minutes` : "N/A"}
      </CustomText>

      {/* 인분 */}
      <CustomText style={styles.sectionHeader}>Servings:</CustomText>
      <CustomText style={styles.text}>
        {servings ? `${servings} servings` : "N/A"}
      </CustomText>

      {/* 재료 */}
      <CustomText style={styles.sectionHeader}>Ingredients:</CustomText>
      <View style={styles.ingredientsContainer}>{renderIngredients()}</View>

      {/* 설명 */}
      <CustomText style={styles.sectionHeader}>Description:</CustomText>
      {description ? (
        <RichTextRenderer content={description} />
      ) : (
        <CustomText style={styles.text}>No Description Available</CustomText>
      )}

      {/* 조리 방법 */}
      <CustomText style={styles.sectionHeader}>Instructions:</CustomText>
      {instructions ? (
        <RichTextRenderer content={instructions} />
      ) : (
        <CustomText style={styles.text}>No Instructions Available</CustomText>
      )}

      {/* YouTube 썸네일 또는 비디오 링크 */}
      {youTubeUrl && (
        <View style={styles.youtubeContainer}>
          <CustomText style={styles.sectionHeader}>
            Video for reference:
          </CustomText>
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
                <CustomText style={styles.playButtonText}>▶</CustomText>
              </View>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity onPress={() => Linking.openURL(youTubeUrl)}>
              <CustomText style={styles.link}>{youTubeUrl}</CustomText>
            </TouchableOpacity>
          )}
        </View>
      )}

      {/* 비디오 파일 */}
      {videoFile && (
        <View style={styles.videoContainer}>
          <CustomText style={styles.sectionHeader}>
            Video for reference:
          </CustomText>
          <TouchableOpacity
            onPress={() =>
              Linking.openURL(`https:${videoFile.fields.file.url}`)
            }
          >
            <CustomText style={styles.link}>
              {videoFile.fields.file.url}
            </CustomText>
          </TouchableOpacity>
        </View>
      )}
    </ScrollView>
  );
};

// 테마와 글꼴 크기에 따라 동적으로 스타일 생성
const getStyles = (colors: any, fontSize: number) =>
  StyleSheet.create({
    scrollContainer: {
      flex: 1,
      backgroundColor: colors.background,
    },
    container: {
      flex: 1,
      padding: 20,
    },
    title: {
      fontWeight: "bold",
      marginVertical: 10,
      color: colors.text,
      fontSize: fontSize + 4,
      textAlign: "center",
    },
    notFoundText: {
      fontSize: fontSize,
      color: "#ff0000",
      textAlign: "center",
    },
    sectionHeader: {
      marginTop: 20,
      fontSize: fontSize + 2,
      fontWeight: "bold",
      color: colors.text,
    },
    text: {
      fontSize: fontSize,
      color: colors.text,
      marginTop: 5,
      flexShrink: 1, // 텍스트가 컨테이너를 넘지 않도록 설정
    },
    ingredientsContainer: {
      marginTop: 10,
    },
    ingredientItem: {
      flexDirection: "row",
      alignItems: "flex-start",
      marginBottom: 10,
      flexWrap: "wrap",
    },
    ingredientQuantity: {
      fontSize: fontSize,
      color: "#555",
      marginLeft: 10,
      flex: 1,
      flexShrink: 1,
    },
    ingredientLink: {
      fontSize: fontSize,
      color: "blue",
      textDecorationLine: "underline",
      flex: 1,
      flexShrink: 1,
    },
    ingredientText: {
      fontSize: fontSize,
      color: colors.text,
      flex: 1,
      flexShrink: 1,
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
      fontSize: fontSize,
    },
    image: {
      width: "100%",
      height: 200,
      borderRadius: 8,
      marginBottom: 10,
    },
    loadingContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
    },
  });

export default RecipeScreen;
