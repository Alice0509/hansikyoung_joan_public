// app/screens/IngredientDetailScreen.tsx

import React, { useEffect, useState } from 'react';
import {
  ScrollView,
  View,
  Image,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Entry, Document } from 'contentful';
import { RootStackParamList } from '../navigation/types';
import { getIngredientById } from '../lib/contentful';
import CustomText from '../components/CustomText';
import RichTextRenderer from '../components/RichTextRenderer';
import { useTheme } from '../contexts/ThemeContext';
import { useFontSize } from '../contexts/FontSizeContext';
import { IngredientFields } from '../types/Recipe';
import { useLanguage } from '../contexts/LanguageContext';
import { normalizeRichText } from '../utils/normalizeRichText';

type IngredientDetailRouteProp = RouteProp<
  RootStackParamList,
  'IngredientDetail'
>;

type IngredientDetailNavigationProp = StackNavigationProp<
  RootStackParamList,
  'IngredientDetail'
>;

interface IngredientDetailProps {
  route: IngredientDetailRouteProp;
  navigation: IngredientDetailNavigationProp;
}

const IngredientDetailScreen: React.FC<IngredientDetailProps> = ({
  route,
  navigation,
}) => {
  const { ingredientId } = route.params;
  const { colors } = useTheme();
  const { fontSize } = useFontSize(); // setFontSize 제거 (사용하지 않는 경우)
  const { language } = useLanguage();
  const [ingredient, setIngredient] = useState<Entry<IngredientFields> | null>(
    null,
  );
  const [loading, setLoading] = useState<boolean>(true);
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  useEffect(() => {
    const fetchIngredient = async () => {
      try {
        const data = await getIngredientById(ingredientId, language);

        // Rich Text 필드 표준화
        const normalizedFields = { ...data.fields };
        ['description'].forEach((field) => {
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

        setIngredient({ ...data, fields: normalizedFields });

        // 이미지 URL 설정
        if (normalizedFields.bild && normalizedFields.bild.fields.file.url) {
          const url = `https:${normalizedFields.bild.fields.file.url}`;
          setImageUrl(url);
        } else {
          setImageUrl(null);
        }
      } catch (error) {
        console.error('Error fetching ingredient details:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchIngredient();
  }, [ingredientId, language]);

  const styles = getStyles(colors, fontSize);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  if (!ingredient) {
    return (
      <View style={styles.container}>
        <CustomText style={styles.notFoundText}>
          Ingredient not found.
        </CustomText>
      </View>
    );
  }

  const { name, description } = ingredient.fields;

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.contentContainer}>
        {imageUrl ? (
          <Image
            source={{ uri: imageUrl }}
            style={styles.image}
            resizeMode="cover"
            onError={(error) => {
              console.error('Failed to load image:', error.nativeEvent.error);
              setImageUrl(null); // 이미지 로딩 실패 시 기본 이미지로 전환
            }}
          />
        ) : (
          <Image
            source={require('../../assets/images/default.png')}
            style={styles.image}
            resizeMode="cover"
          />
        )}
        <CustomText style={styles.title}>{name}</CustomText>
        {description ? (
          <RichTextRenderer content={description} style={styles.description} />
        ) : (
          <CustomText style={styles.description}>
            No description available.
          </CustomText>
        )}
      </View>
    </ScrollView>
  );
};

const getStyles = (colors: any, fontSize: number) =>
  StyleSheet.create({
    scrollContainer: {
      flexGrow: 1,
      padding: 20,
      backgroundColor: colors.background,
    },
    contentContainer: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'flex-start', // 위에서부터 시작하도록 변경
    },
    loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    notFoundText: {
      fontSize,
      color: '#ff0000',
      textAlign: 'center',
    },
    title: {
      fontWeight: 'bold',
      fontSize: fontSize + 4,
      color: colors.text,
      marginVertical: 10,
      textAlign: 'center',
    },
    description: {
      fontSize,
      color: colors.text,
      textAlign: 'left', // 왼쪽 정렬로 변경
    },
    image: {
      width: '100%',
      height: 200,
      borderRadius: 8,
      marginBottom: 10,
    },
  });

export default IngredientDetailScreen;
