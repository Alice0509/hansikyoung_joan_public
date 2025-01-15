// app/components/RecipeCard.tsx

import React from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons'; // Expo 벡터 아이콘 사용
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useFavorites } from '../contexts/FavoritesContext';
import { Recipe } from '../types/Recipe';
import { getThumbnailFromEmbedUrl } from '../lib/getYouTubeThumbnail';
import { RootStackParamList } from '../navigation/types';

type RecipeCardNavigationProp = StackNavigationProp<
  RootStackParamList,
  'RecipeDetail'
>;

interface RecipeCardProps {
  recipe: Recipe; // 올바른 타입
  onPress: () => void;
  fullWidth?: boolean; // 전체 너비을 사용할지 여부
  showCategory?: boolean; // 카테고리 정보를 표시할지 여부
}

const RecipeCard: React.FC<RecipeCardProps> = ({
  recipe,
  onPress,
  fullWidth = false,
  showCategory = false,
}) => {
  const navigation = useNavigation<RecipeCardNavigationProp>();
  const { addFavorite, removeFavorite, isFavorite } = useFavorites();
  const recipeId = recipe.sys.id;
  const favorite = isFavorite(recipeId);

  // 유튜브 썸네일 추출
  const youTubeThumbnail = recipe.fields?.youTubeUrl
    ? getThumbnailFromEmbedUrl(recipe.fields.youTubeUrl)
    : null;

  // 이미지 우선순위 처리: 레시피 이미지 > 유튜브 썸네일 > 기본 이미지
  let imageUrl: string | null = null;
  if (
    recipe.fields?.image &&
    recipe.fields.image.length > 0 &&
    recipe.fields.image[0].fields.file.url
  ) {
    imageUrl = `https:${recipe.fields.image[0].fields.file.url}`;
  } else if (youTubeThumbnail) {
    imageUrl = youTubeThumbnail;
  }

  const handleFavoriteToggle = () => {
    favorite ? removeFavorite(recipeId) : addFavorite(recipeId);
  };

  // 카테고리 이름 가져오기 (모든 카테고리 표시)
  const categoryNames =
    recipe.fields?.categories && recipe.fields.categories.length > 0
      ? recipe.fields.categories.map((cat) => cat.fields.name).join(', ')
      : null; // "No Category" 대신 null로 설정

  return (
    <TouchableOpacity
      style={[
        styles.card,
        fullWidth ? styles.fullWidthCard : styles.defaultCard,
      ]}
      onPress={onPress}
      accessible
      accessibilityLabel={`Recipe: ${recipe.fields?.titel || 'Untitled Recipe'}`}
    >
      {/* 이미지 렌더링 */}
      {imageUrl ? (
        <Image
          source={{ uri: imageUrl }}
          style={styles.image}
          resizeMode="cover"
        />
      ) : (
        <Image
          source={require('../../assets/images/default.png')}
          style={styles.image}
          resizeMode="cover"
        />
      )}
      {/* 제목 및 카테고리 */}
      <View style={styles.content}>
        <Text style={styles.title}>
          {recipe.fields?.titel || 'Untitled Recipe'}
        </Text>
        {showCategory && categoryNames && (
          <Text style={styles.category}>{categoryNames}</Text>
        )}
      </View>
      {/* 즐겨찾기 버튼 */}
      <TouchableOpacity
        style={styles.favoriteButton}
        onPress={handleFavoriteToggle}
        accessible
        accessibilityLabel={
          favorite ? 'Remove from favorites' : 'Add to favorites'
        }
      >
        <Ionicons
          name={favorite ? 'heart' : 'heart-outline'}
          size={24}
          color={favorite ? 'red' : 'gray'}
        />
      </TouchableOpacity>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 8,
    overflow: 'hidden',
    // 그림자 스타일 플랫폼별로 적용
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
      },
      android: {
        elevation: 5,
      },
      web: {
        boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)', // 웹 전용 그림자
      },
    }),
    position: 'relative',
    marginBottom: 20, // 카드 간 간격 확보
  },
  defaultCard: {
    width: 250, // 홈 스크린에서 사용할 고정 너비
    marginRight: 15, // 홈 스크린에서 사용할 오른쪽 마진
  },
  fullWidthCard: {
    width: '100%', // 레시피 리스트에서 전체 너비 사용
    marginRight: 0, // 레시피 리스트에서는 오른쪽 마진 제거
  },
  image: {
    width: '100%',
    height: 200, // 고정 높이 또는 비율에 따라 조정
  },
  content: {
    padding: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#000',
  },
  category: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginTop: 5,
  },
  favoriteButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 20,
    padding: 5,
  },
});

export default RecipeCard;
