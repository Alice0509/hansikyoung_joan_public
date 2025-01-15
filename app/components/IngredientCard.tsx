// app/components/IngredientCard.tsx

import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Entry } from 'contentful'; // Contentful Entry 타입 임포트
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Ingredient } from '../types/Recipe'; // Ingredient 타입 임포트
import { RootStackParamList } from '../navigation/types';

type IngredientCardNavigationProp = StackNavigationProp<
  RootStackParamList,
  'IngredientDetail' // "IngredientDetail"으로 변경
>;

interface IngredientCardProps {
  ingredient: Entry<Ingredient>;
}

const IngredientCard: React.FC<IngredientCardProps> = ({ ingredient }) => {
  const navigation = useNavigation<IngredientCardNavigationProp>();
  const { name, bild } = ingredient.fields;

  // 이미지가 없는 경우 카드 표시하지 않음
  if (!bild || !bild.fields.file.url) {
    return null;
  }

  const imageUrl = `https:${bild.fields.file.url}`;

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() =>
        navigation.navigate('IngredientDetail', {
          // "Ingredient"에서 "IngredientDetail"로 변경
          ingredientId: ingredient.sys.id,
          locale: 'en', // 필요한 locale을 전달
        })
      }
      accessible
      accessibilityLabel={`Ingredient: ${name}`}
    >
      {/* 이미지 렌더링 */}
      <Image
        source={{ uri: imageUrl }}
        style={styles.image}
        resizeMode="cover"
      />
      {/* 이름 표시 */}
      <View style={styles.infoContainer}>
        <Text style={styles.name}>{name}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    marginBottom: 15,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 2,
  },
  image: {
    width: '100%',
    height: 150,
  },
  infoContainer: {
    padding: 10,
  },
  name: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
    textAlign: 'center',
  },
});

export default IngredientCard;
