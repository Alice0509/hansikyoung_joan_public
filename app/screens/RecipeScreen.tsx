// app/screens/RecipeScreen.tsx

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
import { RecipeEntry } from "../types/Recipe";
import { RootStackParamList } from "../navigation/types";
import { getThumbnailFromEmbedUrl } from "../lib/getYouTubeThumbnail";

type RecipeScreenRouteProp = RouteProp<RootStackParamList, "Recipe">;
type RecipeScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "Recipe"
>;

interface RecipeScreenProps {
  route: RecipeScreenRouteProp;
  navigation: RecipeScreenNavigationProp;
}

const RecipeScreen: React.FC<RecipeScreenProps> = ({ route, navigation }) => {
  const { recipeId } = route.params;
  const [recipe, setRecipe] = useState<RecipeEntry | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [thumbnail, setThumbnail] = useState<string | null>(null);

  const { width } = Dimensions.get("window");

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        const data = await getRecipeById(recipeId, "en");
        setRecipe(data);

        if (data.fields.youTubeUrl) {
          const thumb = getThumbnailFromEmbedUrl(data.fields.youTubeUrl);
          setThumbnail(thumb);
        }
      } catch (error) {
        console.error("Error fetching recipe details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecipe();
  }, [recipeId]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (!recipe) {
    return (
      <View style={styles.container}>
        <Text>Recipe not found.</Text>
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

  // 이미지 URL이 배열 형태로 제공되는지 확인
  const imageUrl = image?.[0]?.fields?.file?.url
    ? `https:${image[0].fields.file.url}`
    : null;

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.scrollContent}
    >
      {/* 이미지 렌더링 */}
      {imageUrl ? (
        <Image source={{ uri: imageUrl }} style={styles.image} />
      ) : (
        <Image
          source={require("../../assets/images/default.png")}
          style={styles.image}
        />
      )}

      {/* 제목 */}
      <Text style={styles.title}>{titel || "Untitled"}</Text>

      {/* 카테고리 */}
      <Text style={styles.sectionHeader}>카테고리:</Text>
      <Text style={styles.text}>{category || "No Category"}</Text>

      {/* 준비 시간 */}
      <Text style={styles.sectionHeader}>준비 시간:</Text>
      <Text style={styles.text}>
        {preparationTime ? `${preparationTime} 분` : "N/A"}
      </Text>

      {/* 인분 */}
      <Text style={styles.sectionHeader}>인분:</Text>
      <Text style={styles.text}>{servings ? `${servings} 인분` : "N/A"}</Text>

      {/* 재료 */}
      <Text style={styles.sectionHeader}>재료:</Text>
      <View style={styles.ingredientsContainer}>
        {ingredients && ingredients.length > 0 ? (
          ingredients.map((recipeIngredient, index) => {
            const ingredientName =
              recipeIngredient.fields.ingredient?.fields?.name ||
              "Unnamed Ingredient";
            const quantity = recipeIngredient.fields.quantity || "";
            const ingredientId = recipeIngredient.fields.ingredient?.sys.id;
            const localeToUse = "en";

            if (!ingredientId) {
              return (
                <Text key={index} style={styles.text}>
                  - {ingredientName} {quantity ? `(${quantity})` : ""}
                </Text>
              );
            }

            return (
              <TouchableOpacity
                key={index}
                onPress={() =>
                  navigation.navigate("Ingredient", {
                    ingredientId,
                    locale: localeToUse,
                  })
                }
              >
                <Text style={styles.text}>
                  - {ingredientName} {quantity ? `(${quantity})` : ""}
                </Text>
              </TouchableOpacity>
            );
          })
        ) : (
          <Text style={styles.text}>No Ingredients Available</Text>
        )}
      </View>

      {/* 설명 */}
      <Text style={styles.sectionHeader}>설명:</Text>
      {description ? (
        <RichTextRenderer content={description} />
      ) : (
        <Text>No Description Available</Text>
      )}

      {/* 조리 방법 */}
      <Text style={styles.sectionHeader}>조리 방법:</Text>
      {instructions ? (
        <RichTextRenderer content={instructions} />
      ) : (
        <Text>No Instructions Available</Text>
      )}

      {/* YouTube 썸네일 */}
      {youTubeUrl && (
        <View style={styles.youtubeContainer}>
          <Text style={styles.sectionHeader}>유튜브 영상:</Text>
          {thumbnail ? (
            <TouchableOpacity onPress={() => Linking.openURL(youTubeUrl)}>
              <Image
                source={{ uri: thumbnail }}
                style={styles.youtubeImage}
                resizeMode="cover"
                onError={() => console.error("Failed to load thumbnail image")}
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
          <Text style={styles.sectionHeader}>비디오 파일:</Text>
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
    minHeight: Dimensions.get("window").height,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    width: "100%",
    height: 200,
    borderRadius: 8,
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
    marginTop: 5,
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
