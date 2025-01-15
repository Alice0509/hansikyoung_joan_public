// app/screens/RecipeDetailScreen.tsx

import React, { useState, useEffect } from 'react';
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
} from 'react-native';
import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useKeepAwake } from 'expo-keep-awake';
import { useTranslation } from 'react-i18next';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { Snackbar } from 'react-native-paper';
import * as Speech from 'expo-speech'; // (여전히 사용하신다면)
import { getRecipeById } from '../lib/contentful';
import RichTextRenderer from '../components/RichTextRenderer';
import {
  RecipeEntry,
  RecipeIngredient,
  Ingredient,
  RecipeStep,
} from '../types/Recipe';
import { RootStackParamList } from '../navigation/types';
import { getThumbnailFromEmbedUrl } from '../lib/getYouTubeThumbnail';
import { useLanguage } from '../contexts/LanguageContext';
import CustomText from '../components/CustomText';
import { useTheme } from '../contexts/ThemeContext';
import { useFontSize } from '../contexts/FontSizeContext';
import StepByStepGuide from '../components/StepByStepGuide';
import IngredientsChecklist from '../components/IngredientsChecklist';
import { normalizeRichText } from '../utils/normalizeRichText';
import AccordionSection from '../components/AccordionSection';

// ★ 추가: FavoritesContext (즐겨찾기)
import { useFavorites } from '../contexts/FavoritesContext';

type RecipeScreenRouteProp = RouteProp<RootStackParamList, 'RecipeDetail'>;
type RecipeScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'RecipeDetail'
>;

interface RecipeScreenProps {
  route: RecipeScreenRouteProp;
  navigation: RecipeScreenNavigationProp;
}

const RecipeDetailScreen: React.FC<RecipeScreenProps> = ({
  route,
  navigation,
}) => {
  // =====================================
  // 기존 Props / Hooks
  // =====================================
  const { recipeId } = route.params;
  const { language } = useLanguage();
  const { colors } = useTheme();
  const { fontSize } = useFontSize();
  const { t } = useTranslation();

  const [recipe, setRecipe] = useState<RecipeEntry | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [thumbnail, setThumbnail] = useState<string | null>(null);

  // Ingredients 체크 상태 관리
  const [checkedIngredients, setCheckedIngredients] = useState<boolean[]>([]);
  const [isKeepAwake, setIsKeepAwake] = useState<boolean>(true); // 화면 잠금 방지 상태
  const [snackbarVisible, setSnackbarVisible] = useState<boolean>(false);
  const [snackbarMessage, setSnackbarMessage] = useState<string>('');

  // =====================================
  // 1) 오프라인 캐싱 키
  // =====================================
  const offlineKey = `recipe_offline_${recipeId}_${language}`;

  // =====================================
  // 2) 즐겨찾기
  // =====================================
  const { addFavorite, removeFavorite, isFavorite } = useFavorites();
  const [isFav, setIsFav] = useState(false);

  useEffect(() => {
    // 컴포넌트 마운트 시 현재 레시피가 즐겨찾기에 있는지 확인
    setIsFav(isFavorite(recipeId));
  }, [recipeId, isFavorite]);

  const toggleFavorite = () => {
    if (isFav) {
      removeFavorite(recipeId);
      setIsFav(false);
    } else {
      addFavorite(recipeId);
      setIsFav(true);
    }
  };

  // 화면 잠금 방지
  useKeepAwake(isKeepAwake);

  // =====================================
  // 3) Fetch + 오프라인 캐싱
  // =====================================
  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        setLoading(true);

        // ----- 3-1) 온라인 Fetch
        const data = await getRecipeById(recipeId, language);

        // 필드 표준화
        const normalizedFields = { ...data.fields };
        ['titel', 'description', 'instructions'].forEach((field) => {
          if (
            data.fields[field] &&
            (data.fields[field] as any).nodeType === 'document'
          ) {
            normalizedFields[field] = normalizeRichText(
              data.fields[field] as Document,
            );
          } else if (typeof data.fields[field] === 'string') {
            normalizedFields[field] = data.fields[field];
          } else {
            console.warn(`Field ${field} is neither a Document nor a string.`);
          }
        });

        // Steps 필드
        if (Array.isArray(data.fields.steps)) {
          normalizedFields.steps = data.fields.steps.map((step: any) => ({
            ...step,
            fields: {
              ...step.fields,
              description:
                step.fields.description &&
                (step.fields.description as any).nodeType === 'document'
                  ? normalizeRichText(step.fields.description as Document)
                  : step.fields.description,
              timerDuration: step.fields.timerDuration || undefined,
            },
          }));
        } else {
          normalizedFields.steps = [];
        }

        const finalData: RecipeEntry = { ...data, fields: normalizedFields };
        setRecipe(finalData);

        // 유튜브 썸네일
        if (normalizedFields.youTubeUrl) {
          const thumb = getThumbnailFromEmbedUrl(normalizedFields.youTubeUrl);
          setThumbnail(thumb);
        }

        // ----- 3-2) 캐싱 (AsyncStorage)
        await AsyncStorage.setItem(offlineKey, JSON.stringify(finalData));

        // Ingredients 체크 목록 불러오기
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
      } catch (error) {
        console.error('Error fetching recipe details:', error);

        // ----- 3-3) Fetch 실패 → 오프라인 캐시 로드
        const cached = await AsyncStorage.getItem(offlineKey);
        if (cached) {
          const parsed: RecipeEntry = JSON.parse(cached);

          // setRecipe + Ingredients
          setRecipe(parsed);
          if (parsed.fields?.ingredients) {
            const storedChecked = await AsyncStorage.getItem(
              `checkedIngredients_${recipeId}`,
            );
            if (storedChecked) {
              setCheckedIngredients(JSON.parse(storedChecked));
            } else {
              setCheckedIngredients(
                new Array(parsed.fields.ingredients.length).fill(false),
              );
            }
          }
          // 오프라인 안내
          setSnackbarMessage('Showing offline cached data.');
          setSnackbarVisible(true);
        } else {
          console.warn('No offline data found either.');
          setSnackbarMessage('No offline data found.');
          setSnackbarVisible(true);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchRecipe();
  }, [recipeId, language]);

  // =====================================
  // 체크 상태 변경 시 저장
  // =====================================
  const handleToggleCheck = async (index: number) => {
    const newChecked = [...checkedIngredients];
    newChecked[index] = !newChecked[index];
    setCheckedIngredients(newChecked);
    await AsyncStorage.setItem(
      `checkedIngredients_${recipeId}`,
      JSON.stringify(newChecked),
    );
  };

  // "Clear All" 버튼
  const handleClearAll = async () => {
    if (recipe?.fields?.ingredients && recipe.fields.ingredients.length > 0) {
      Alert.alert(
        t('confirmClearTitle'),
        t('confirmClearMessage'),
        [
          {
            text: t('cancel'),
            style: 'cancel',
          },
          {
            text: t('clearAll'),
            style: 'destructive',
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

  // TTS (expo-speech) 예시
  const handleReadAloud = (text: string) => {
    Speech.stop();
    Speech.speak(text, {
      language: language === 'de-DE' ? 'de-DE' : 'en-US',
      pitch: 1,
      rate: 1,
    });
  };

  // KeepAwake 토글
  const handleToggleKeepAwake = (newKeepAwake: boolean) => {
    setIsKeepAwake(newKeepAwake);
    setSnackbarMessage(
      newKeepAwake ? t('keepScreenOnMessage') : t('keepScreenOffMessage'),
    );
    setSnackbarVisible(true);
  };

  // 스타일
  const styles = getStyles(colors, fontSize);

  // 로딩 중
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  // 레시피 없음
  if (!recipe) {
    return (
      <View style={styles.container}>
        <CustomText style={[styles.notFoundText, { color: colors.text }]}>
          {t('recipeNotFound')}
        </CustomText>
      </View>
    );
  }

  // =====================================
  // 구조분해
  // =====================================
  const {
    titel,
    description,
    image,
    category,
    preparationTime,
    servings,
    ingredients,
    instructions,
    steps,
    videoFile,
    youTubeUrl,
  } = recipe.fields;

  // 썸네일 or 기본
  let displayImageSource;
  if (image?.[0]?.fields?.file?.url) {
    displayImageSource = { uri: `https:${image[0].fields.file.url}` };
  } else if (thumbnail) {
    displayImageSource = { uri: thumbnail };
  } else {
    displayImageSource = require('../../assets/images/default.png');
  }

  // ingredients 매핑
  const mappedIngredients: Ingredient[] = (ingredients || []).map(
    (ri: RecipeIngredient) => ({
      name: ri.fields.ingredient.fields.name,
      quantity: ri.fields.quantity || '',
      id: ri.fields.ingredient.sys.id,
      image: ri.fields.ingredient.fields.bild
        ? `https:${ri.fields.ingredient.fields.bild.fields.file.url}`
        : undefined,
    }),
  );

  // steps 매핑
  let mappedSteps: RecipeStep[] = [];
  if (Array.isArray(steps) && steps.length > 0) {
    mappedSteps = steps.map((step: any, index: number) => ({
      stepNumber:
        step.fields.stepNumber !== undefined
          ? step.fields.stepNumber
          : index + 1,
      description: step.fields.description,
      image:
        step.fields.image && step.fields.image.length > 0
          ? `https:${step.fields.image[0].fields.file.url}`
          : undefined,
      timerDuration: step.fields.timerDuration || undefined,
    }));
  }

  const hasSteps = mappedSteps.length > 0;

  // =====================================
  // 렌더링
  // =====================================
  return (
    <>
      <ScrollView
        style={styles.scrollContainer}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        accessible
      >
        {/* 레시피 메인 이미지 */}
        <View style={styles.imageContainer}>
          <Image
            source={displayImageSource}
            style={styles.image}
            resizeMode="cover"
          />
          {/* 즐겨찾기 하트 아이콘 */}
          <TouchableOpacity
            onPress={toggleFavorite}
            style={styles.favoriteBtn}
            accessible
            accessibilityRole="button"
            accessibilityHint="Toggle favorite"
          >
            <MaterialIcons
              name={isFav ? 'favorite' : 'favorite-border'}
              size={30}
              color={isFav ? 'red' : 'white'}
            />
          </TouchableOpacity>
        </View>

        {/* 제목 */}
        {typeof titel === 'string' ? (
          <CustomText style={[styles.title, { color: colors.text }]}>
            {titel}
          </CustomText>
        ) : (
          <RichTextRenderer
            content={titel}
            style={{
              fontSize: fontSize + 4,
              color: colors.text,
              textAlign: 'center',
              marginVertical: 10,
            }}
          />
        )}

        {/* 카테고리 */}
        <CustomText style={[styles.sectionHeader, { color: colors.text }]}>
          {`${t('category')}:`}
        </CustomText>
        <CustomText style={[styles.text, { color: colors.text }]}>
          {category || t('noCategory')}
        </CustomText>

        {/* 준비 시간 */}
        <CustomText style={[styles.sectionHeader, { color: colors.text }]}>
          {`${t('preparationTime')}:`}
        </CustomText>
        <CustomText style={[styles.text, { color: colors.text }]}>
          {preparationTime ? `${preparationTime} ${t('minutes')}` : t('nA')}
        </CustomText>

        {/* 인분 */}
        <CustomText style={[styles.sectionHeader, { color: colors.text }]}>
          {`${t('servings')}:`}
        </CustomText>
        <CustomText style={[styles.text, { color: colors.text }]}>
          {servings ? `${servings} ${t('servingsText')}` : t('nA')}
        </CustomText>

        {/* KeepAwake 토글 */}
        <TouchableOpacity
          onPress={() => handleToggleKeepAwake(!isKeepAwake)}
          style={[
            styles.toggleButton,
            {
              backgroundColor: isKeepAwake
                ? colors.background === '#121212'
                  ? '#333333'
                  : '#fff5b8'
                : colors.background === '#121212'
                  ? '#555555'
                  : '#ececec',
            },
          ]}
        >
          <MaterialIcons
            name={isKeepAwake ? 'lock' : 'lock-open'}
            size={24}
            color={colors.background === '#121212' ? '#fff' : colors.text}
            style={styles.icon}
          />
          <CustomText style={styles.keepAwakeText}>
            {isKeepAwake ? t('keepScreenOn') : t('keepScreenOff')}
          </CustomText>
        </TouchableOpacity>

        {/* Ingredients 아코디언 */}
        {Array.isArray(mappedIngredients) && mappedIngredients.length > 0 && (
          <AccordionSection
            title={t('ingredients')}
            colors={{
              text: colors.text,
              primary: colors.primary,
              accordionBackground: colors.accordionBackground,
              accordionBodyBackground: colors.accordionBodyBackground,
            }}
            fontSize={fontSize}
          >
            <IngredientsChecklist
              ingredients={mappedIngredients}
              checkedIngredients={checkedIngredients}
              onToggleCheck={handleToggleCheck}
              colors={{
                text: colors.text,
                linkText: colors.linkText,
                linkedRowBackground: colors.linkedRowBackground,
                tableHeaderBackground: colors.tableHeaderBackground,
              }}
              fontSize={fontSize}
            />
            {checkedIngredients.some(Boolean) && (
              <TouchableOpacity
                style={[
                  styles.clearAllButton,
                  { backgroundColor: colors.primary },
                ]}
                onPress={handleClearAll}
              >
                <CustomText
                  style={[styles.clearAllText, { color: colors.buttonText }]}
                >
                  {t('clearAll')}
                </CustomText>
              </TouchableOpacity>
            )}
          </AccordionSection>
        )}

        {/* Description 아코디언 */}
        <AccordionSection
          title={t('description')}
          colors={{
            text: colors.text,
            primary: colors.primary,
            accordionBackground: colors.accordionBackground,
            accordionBodyBackground: colors.accordionBodyBackground,
          }}
          fontSize={fontSize}
        >
          {description ? (
            <RichTextRenderer
              content={description}
              style={{ fontSize, color: colors.text }}
            />
          ) : (
            <CustomText style={[styles.description, { color: colors.text }]}>
              {t('noDescriptionAvailable')}
            </CustomText>
          )}
        </AccordionSection>

        {/* Instructions 아코디언 */}
        <AccordionSection
          title={t('instructions')}
          colors={{
            text: colors.text,
            primary: colors.primary,
            accordionBackground: colors.accordionBackground,
            accordionBodyBackground: colors.accordionBodyBackground,
          }}
          fontSize={fontSize}
        >
          {instructions ? (
            <RichTextRenderer
              content={instructions}
              style={{ fontSize, color: colors.text }}
            />
          ) : (
            <CustomText style={[styles.text, { color: colors.text }]}>
              {t('noInstructionsAvailable')}
            </CustomText>
          )}
        </AccordionSection>

        {/* Steps 아코디언 */}
        {hasSteps && (
          <AccordionSection
            title={t('stepByStepGuide')}
            colors={{
              text: colors.text,
              primary: colors.primary,
              accordionBackground: colors.accordionBackground,
              accordionBodyBackground: colors.accordionBodyBackground,
            }}
            fontSize={fontSize}
          >
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
              fixedColor={colors.primary}
              onReadAloud={handleReadAloud}
              language={language === 'de-DE' ? 'de-DE' : 'en-US'}
            />
          </AccordionSection>
        )}

        {/* YouTube/Video (기존 로직 그대로) */}
        {/* ... */}
      </ScrollView>

      {/* Snackbar */}
      <Snackbar
        visible={snackbarVisible}
        onDismiss={() => setSnackbarVisible(false)}
        duration={3000}
      >
        {snackbarMessage}
      </Snackbar>
    </>
  );
};

// 스타일 (기존 코드 그대로)
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
      padding: 10,
      backgroundColor: '#fff',
    },
    loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: colors.background,
    },
    notFoundText: {
      fontSize,
      color: '#ff0000',
      textAlign: 'center',
    },
    imageContainer: {
      position: 'relative',
      width: '100%',
      height: 200,
      marginBottom: 10,
    },
    image: {
      width: '100%',
      height: '100%',
      borderRadius: 8,
    },
    favoriteBtn: {
      position: 'absolute',
      top: 15,
      right: 15,
      backgroundColor: 'rgba(0,0,0,0.4)',
      borderRadius: 20,
      padding: 5,
    },
    title: {
      fontWeight: 'bold',
      marginVertical: 10,
      fontSize: fontSize + 4,
      textAlign: 'center',
    },
    sectionHeader: {
      marginTop: 20,
      fontSize: fontSize + 2,
      fontWeight: 'bold',
      color: colors.text,
    },
    text: {
      fontSize,
      color: colors.text,
      marginTop: 5,
      flexShrink: 1,
    },
    description: {
      fontSize,
      color: colors.text,
      marginTop: 5,
    },
    toggleButton: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 15,
      borderRadius: 10,
      marginTop: 20,
      elevation: 3,
    },
    icon: {
      marginRight: 10,
    },
    keepAwakeText: {
      fontSize,
      color: colors.text,
      fontWeight: '500',
      flex: 1,
    },
    clearAllButton: {
      marginTop: 10,
      padding: 10,
      borderRadius: 5,
      alignItems: 'center',
    },
    clearAllText: {
      fontSize,
    },
  });

export default RecipeDetailScreen;
