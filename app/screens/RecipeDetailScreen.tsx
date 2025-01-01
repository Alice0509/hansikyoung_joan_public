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
  Alert,
} from "react-native";
import { RouteProp } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { getRecipeById } from "../lib/contentful";
import RichTextRenderer from "../components/RichTextRenderer";
import {
  RecipeEntry,
  RecipeIngredient,
  Ingredient,
  RecipeStep,
} from "../types/Recipe";
import { RootStackParamList } from "../navigation/types";
import { getThumbnailFromEmbedUrl } from "../lib/getYouTubeThumbnail";
import { useLanguage } from "../contexts/LanguageContext";
import CustomText from "../components/CustomText";
import { useTheme } from "../contexts/ThemeContext";
import { useFontSize } from "../contexts/FontSizeContext";
import StepByStepGuide from "../components/StepByStepGuide";
import IngredientsChecklist from "../components/IngredientsChecklist";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { normalizeRichText } from "../utils/normalizeRichText"; // 변환 함수 임포트

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
  const { language } = useLanguage();
  const { colors } = useTheme();
  const { fontSize } = useFontSize();
  const [recipe, setRecipe] = useState<RecipeEntry | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [thumbnail, setThumbnail] = useState<string | null>(null);

  // Ingredients 체크 상태 관리
  const [checkedIngredients, setCheckedIngredients] = useState<boolean[]>([]);

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        const data = await getRecipeById(recipeId, language);
        console.log("Fetched Recipe Data:", JSON.stringify(data, null, 2));

        // Rich Text 필드 표준화
        const normalizedFields = { ...data.fields };
        ["titel", "description", "instructions"].forEach((field) => {
          if (
            data.fields[field] &&
            (data.fields[field] as any).nodeType === "document"
          ) {
            normalizedFields[field] = normalizeRichText(
              data.fields[field] as Document,
            );
            console.log(
              `Normalized ${field}:`,
              JSON.stringify(normalizedFields[field], null, 2),
            );
          } else if (typeof data.fields[field] === "string") {
            normalizedFields[field] = data.fields[field];
            console.log(`Field ${field} is a string and was not normalized.`);
          } else {
            console.warn(`Field ${field} is neither a Document nor a string.`);
          }
        });

        // Steps 필드 처리
        if (data.fields.steps && Array.isArray(data.fields.steps)) {
          normalizedFields.steps = data.fields.steps.map((step: any) => ({
            ...step,
            fields: {
              ...step.fields,
              description:
                step.fields.description &&
                (step.fields.description as any).nodeType === "document"
                  ? normalizeRichText(step.fields.description as Document)
                  : step.fields.description, // 문자열인 경우 그대로 사용
              timerDuration: step.fields.timerDuration || undefined, // timerDuration 필드 추가
            },
          }));
          console.log(
            "Normalized Steps:",
            JSON.stringify(normalizedFields.steps, null, 2),
          );
        } else {
          normalizedFields.steps = []; // steps가 없거나 배열이 아닐 경우 빈 배열 할당
          console.warn("Steps is not an array or is undefined.");
        }

        setRecipe({ ...data, fields: normalizedFields });

        if (normalizedFields.youTubeUrl) {
          const thumb = getThumbnailFromEmbedUrl(normalizedFields.youTubeUrl);
          setThumbnail(thumb);
        }

        // Ingredients 체크 상태 초기화 또는 불러오기
        if (normalizedFields.ingredients) {
          const storedChecked = await AsyncStorage.getItem(
            `checkedIngredients_${recipeId}`,
          );
          if (storedChecked) {
            setCheckedIngredients(JSON.parse(storedChecked));
          } else {
            setCheckedIngredients(
              new Array(normalizedFields.ingredients.length).fill(false),
            );
          }
        }

        // 디버깅을 위한 콘솔 로그 추가
        console.log("Fetched Recipe Steps:", normalizedFields.steps);
        console.log("Normalized Description:", normalizedFields.description);
        console.log("Normalized Instructions:", normalizedFields.instructions);
        if (normalizedFields.steps && Array.isArray(normalizedFields.steps)) {
          normalizedFields.steps.forEach((step: any, index: number) => {
            console.log(
              `Normalized Step ${index + 1}:`,
              JSON.stringify(step.fields.description, null, 2),
            );
          });
        }
      } catch (error) {
        console.error("Error fetching recipe details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecipe();
  }, [recipeId, language]);

  // 체크 상태 변경 시 저장
  const handleToggleCheck = async (index: number) => {
    const newChecked = [...checkedIngredients];
    newChecked[index] = !newChecked[index];
    setCheckedIngredients(newChecked);
    await AsyncStorage.setItem(
      `checkedIngredients_${recipeId}`,
      JSON.stringify(newChecked),
    );
  };

  // "Clear All" 버튼 핸들러
  const handleClearAll = async () => {
    if (recipe?.fields.ingredients && recipe.fields.ingredients.length > 0) {
      Alert.alert(
        "Confirm Clear",
        "Are you sure you want to clear all ingredients?",
        [
          {
            text: "Cancel",
            style: "cancel",
          },
          {
            text: "Clear All",
            style: "destructive",
            onPress: async () => {
              const cleared = new Array(recipe.fields.ingredients.length).fill(
                false,
              );
              setCheckedIngredients(cleared);
              await AsyncStorage.setItem(
                `checkedIngredients_${recipeId}`,
                JSON.stringify(cleared),
              );
            },
          },
        ],
        { cancelable: true },
      );
    }
  };

  // styles 객체 정의
  const styles = getStyles(colors, fontSize);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (!recipe) {
    return (
      <View style={styles.container}>
        <CustomText style={[styles.notFoundText, { color: colors.text }]}>
          Recipe not found.
        </CustomText>
      </View>
    );
  }

  const {
    titel, // 'title'에서 'titel'로 수정
    description,
    image,
    category,
    preparationTime,
    servings,
    ingredients,
    instructions,
    steps, // 단계별 조리 과정
    videoFile,
    youTubeUrl,
  } = recipe.fields;

  // 디버깅을 위한 콘솔 로그 추가
  console.log("Titel:", titel, typeof titel);
  console.log("Description:", description, typeof description);
  console.log("Instructions:", instructions, typeof instructions);
  console.log("Steps:", steps, Array.isArray(steps));

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

  // 재료 데이터를 `Ingredient` 형태로 매핑
  const mappedIngredients: Ingredient[] = ingredients.map(
    (ri: RecipeIngredient) => ({
      name: ri.fields.ingredient.fields.name,
      quantity: ri.fields.quantity || "",
      id: ri.fields.ingredient.sys.id,
      image: ri.fields.ingredient.fields.bild
        ? `https:${ri.fields.ingredient.fields.bild.fields.file.url}`
        : undefined,
    }),
  );

  // 디버깅을 위한 콘솔 로그 추가
  console.log("Mapped Ingredients:", mappedIngredients);

  // 단계별 조리 과정 데이터 확인
  console.log("Mapped Steps Before Mapping:", steps);

  // 단계별 조리 과정 데이터 매핑
  let mappedSteps: RecipeStep[] = [];
  if (steps && Array.isArray(steps)) {
    mappedSteps = steps.map((step: any, index: number) => ({
      stepNumber:
        step.fields.stepNumber !== undefined
          ? step.fields.stepNumber
          : index + 1,
      description: step.fields.description, // 이미 normalizeRichText로 처리됨
      image:
        step.fields.image && step.fields.image.length > 0
          ? `https:${step.fields.image[0].fields.file.url}`
          : undefined,
      timerDuration: step.fields.timerDuration || undefined, // timerDuration 필드 매핑
    }));
  } else {
    mappedSteps = []; // 명시적으로 빈 배열 할당
    console.warn("Steps is not an array or is undefined.");
  }

  // 디버깅을 위한 콘솔 로그 추가
  console.log("Mapped Steps After Mapping:", mappedSteps);

  return (
    <ScrollView
      style={styles.scrollContainer}
      contentContainerStyle={styles.scrollContent}
      keyboardShouldPersistTaps="handled"
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
      {typeof titel === "string" ? (
        <CustomText style={[styles.title, { color: colors.text }]}>
          {titel}
        </CustomText>
      ) : (
        <RichTextRenderer
          content={titel}
          style={{
            fontSize: fontSize + 4,
            color: colors.text,
            textAlign: "center",
            marginVertical: 10,
          }}
        />
      )}

      {/* 카테고리 */}
      <CustomText style={[styles.sectionHeader, { color: colors.text }]}>
        Category:
      </CustomText>
      <CustomText style={[styles.text, { color: colors.text }]}>
        {category || "No Category"}
      </CustomText>

      {/* 준비 시간 */}
      <CustomText style={[styles.sectionHeader, { color: colors.text }]}>
        Preparation Time:
      </CustomText>
      <CustomText style={[styles.text, { color: colors.text }]}>
        {preparationTime ? `${preparationTime} minutes` : "N/A"}
      </CustomText>

      {/* 인분 */}
      <CustomText style={[styles.sectionHeader, { color: colors.text }]}>
        Servings:
      </CustomText>
      <CustomText style={[styles.text, { color: colors.text }]}>
        {servings ? `${servings} servings` : "N/A"}
      </CustomText>

      {/* 재료 */}
      <CustomText style={[styles.sectionHeader, { color: colors.text }]}>
        Ingredients:
      </CustomText>
      <View style={styles.ingredientsContainer}>
        <IngredientsChecklist
          ingredients={mappedIngredients}
          checkedIngredients={checkedIngredients}
          onToggleCheck={handleToggleCheck}
          colors={{
            text: colors.text,
            linkText: colors.linkText,
            linkedRowBackground: colors.linkedRowBackground,
            tableHeaderBackground: colors.tableHeaderBackground, // 테이블 헤더 배경색 전달
          }}
          fontSize={fontSize}
        />
        {checkedIngredients.some(Boolean) && (
          <TouchableOpacity
            style={styles.clearAllButton}
            onPress={handleClearAll}
          >
            <CustomText
              style={[styles.clearAllText, { color: colors.buttonText }]}
            >
              Clear All
            </CustomText>
          </TouchableOpacity>
        )}
      </View>

      {/* 설명 */}
      <CustomText style={[styles.sectionHeader, { color: colors.text }]}>
        Description:
      </CustomText>
      {description ? (
        <RichTextRenderer
          content={description}
          style={{ fontSize: fontSize, color: colors.text }}
        />
      ) : (
        <CustomText style={[styles.description, { color: colors.text }]}>
          No Description Available
        </CustomText>
      )}

      {/* 조리 방법 */}
      <CustomText style={[styles.sectionHeader, { color: colors.text }]}>
        Instructions:
      </CustomText>
      {instructions ? (
        <RichTextRenderer
          content={instructions}
          style={{ fontSize: fontSize, color: colors.text }}
        />
      ) : (
        <CustomText style={[styles.text, { color: colors.text }]}>
          No Instructions Available
        </CustomText>
      )}

      {/* 단계별 조리 과정 */}
      {mappedSteps.length > 0 ? (
        <View style={[styles.section, styles.stepSection]}>
          <CustomText style={[styles.sectionHeader, { color: colors.text }]}>
            Step-by-Step Guide:
          </CustomText>
          <StepByStepGuide
            steps={mappedSteps}
            colors={{
              text: colors.text,
              primary: colors.primary,
              buttonText: colors.buttonText,
              stepBackground: colors.stepBackground,
              currentStepBorder: colors.currentStepBorder,
            }}
            fontSize={fontSize}
          />
        </View>
      ) : (
        <CustomText style={[styles.text, { color: colors.text }]}>
          No Steps Available
        </CustomText>
      )}

      {/* YouTube 썸네일 또는 비디오 링크 */}
      {youTubeUrl && (
        <View style={styles.youtubeContainer}>
          <CustomText style={[styles.sectionHeader, { color: colors.text }]}>
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
                <CustomText
                  style={[styles.playButtonText, { color: colors.buttonText }]}
                >
                  ▶
                </CustomText>
              </View>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity onPress={() => Linking.openURL(youTubeUrl)}>
              <CustomText style={[styles.link, { color: colors.primary }]}>
                {youTubeUrl}
              </CustomText>
            </TouchableOpacity>
          )}
        </View>
      )}

      {/* 비디오 파일 */}
      {videoFile && (
        <View style={styles.videoContainer}>
          <CustomText style={[styles.sectionHeader, { color: colors.text }]}>
            Video for reference:
          </CustomText>
          <TouchableOpacity
            onPress={() =>
              Linking.openURL(`https:${videoFile.fields.file.url}`)
            }
          >
            <CustomText style={[styles.link, { color: colors.primary }]}>
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
    scrollContent: {
      padding: 20,
    },
    container: {
      flex: 1,
      padding: 20,
      backgroundColor: colors.background, // 배경 색상 적용
    },
    title: {
      fontWeight: "bold",
      marginVertical: 10,
      color: colors.text, // 이미 style prop으로 전달됨
      fontSize: fontSize + 4,
      textAlign: "center",
    },
    notFoundText: {
      fontSize: fontSize,
      color: "#ff0000", // 에러 텍스트는 고정 색상 사용
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
      flexShrink: 1,
    },
    ingredientsContainer: {
      marginTop: 10,
    },
    videoContainer: {
      marginTop: 20,
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
    link: {
      color: colors.primary, // 링크 색상 테마에 맞게 조정
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
      backgroundColor: colors.background,
    },
    section: {
      marginTop: 20,
    },
    stepSection: {
      backgroundColor: colors.stepSectionBackground, // 테마에 따라 변경
      padding: 10, // 필요에 따라 패딩 조정
      borderRadius: 8,
      marginTop: 20,
    },
    clearAllButton: {
      marginTop: 10,
      padding: 10,
      backgroundColor: colors.activeButtonBackground, // 버튼 배경 색상 테마에 맞게 조정
      borderRadius: 5,
      alignItems: "center",
    },
    clearAllText: {
      color: colors.buttonText,
      fontSize: fontSize,
    },
    stepsContainer: {
      marginTop: 20,
      alignSelf: "stretch",
    },
    description: {
      fontSize: fontSize,
      color: colors.text,
      marginTop: 5,
    },
  });

export default RecipeScreen;
