// app/components/IngredientsChecklist.tsx

import React from 'react';
import { View, StyleSheet, TouchableOpacity, Linking } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import CustomText from './CustomText';

interface Ingredient {
  name: string;
  quantity: string;
  id?: string;
  image?: string;
}

interface IngredientsChecklistProps {
  ingredients: Ingredient[];
  checkedIngredients: boolean[];
  onToggleCheck: (index: number) => void;
  colors: {
    text: string;
    linkText: string;
    linkedRowBackground: string;
    tableHeaderBackground: string;
  };
  fontSize: number;
}

type NavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'IngredientDetail'
>;

const IngredientsChecklist: React.FC<IngredientsChecklistProps> = ({
  ingredients,
  checkedIngredients,
  onToggleCheck,
  colors,
  fontSize,
}) => {
  const navigation = useNavigation<NavigationProp>();

  // checkedIngredients 배열이 ingredients 배열과 동일한 길이를 가지도록 조정
  const adjustedCheckedIngredients = ingredients.map(
    (_, index) => checkedIngredients[index] || false,
  );

  const handleIngredientPress = (ingredient: Ingredient) => {
    if (ingredient.id) {
      navigation.navigate('IngredientDetail', { ingredientId: ingredient.id });
    } else {
      // Ingredient ID가 없을 경우, 다른 동작을 정의할 수 있습니다.
      Linking.openURL(`https://example.com/ingredients/${ingredient.name}`);
    }
  };

  return (
    <View style={styles.tableContainer}>
      {/* 테이블 헤더 */}
      <View
        style={[
          styles.tableRow,
          styles.tableHeader,
          { backgroundColor: colors.tableHeaderBackground },
        ]}
      >
        <CustomText
          style={[
            styles.headerText,
            { fontSize: fontSize + 2, color: colors.text, flex: 3 },
          ]}
        >
          Ingredient
        </CustomText>
        <CustomText
          style={[
            styles.headerText,
            {
              fontSize: fontSize + 2,
              color: colors.text,
              flex: 1,
              textAlign: 'right',
            },
          ]}
        >
          Quantity
        </CustomText>
      </View>
      {/* 테이블 본문 */}
      {ingredients.map((ingredient, index) => (
        <TouchableOpacity
          key={ingredient.id || index} // 가능하다면 고유한 id 사용
          style={[
            styles.tableRow,
            ingredient.image
              ? { backgroundColor: colors.linkedRowBackground }
              : null,
          ]}
          onPress={() => {
            if (ingredient.image) {
              handleIngredientPress(ingredient);
            }
          }}
          disabled={!ingredient.image} // 이미지가 없으면 터치 비활성화
          accessible
          accessibilityRole="button"
          accessibilityLabel={
            ingredient.image
              ? `View details for ${ingredient.name}`
              : `${ingredient.name} ingredient`
          }
          accessibilityHint={
            ingredient.image
              ? `Navigates to detailed information about ${ingredient.name}`
              : `Ingredient ${ingredient.name}`
          }
        >
          {/* Ingredient Name Cell */}
          <View style={styles.tableCell}>
            <TouchableOpacity
              onPress={() => onToggleCheck(index)}
              style={styles.checkboxContainer}
              accessible
              accessibilityRole="checkbox"
              accessibilityLabel={`${ingredient.name} checkbox`}
              accessibilityState={{
                checked: adjustedCheckedIngredients[index],
              }}
              accessibilityHint={`Toggle selection for ${ingredient.name}`}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }} // 터치 영역 확장
            >
              <MaterialIcons
                name={
                  adjustedCheckedIngredients[index]
                    ? 'check-box'
                    : 'check-box-outline-blank'
                }
                size={fontSize * 1.5} // fontSize에 비례하여 체크박스 크기 조정
                color={colors.text}
              />
            </TouchableOpacity>
            <CustomText
              style={[
                styles.ingredientText,
                {
                  fontSize,
                  color: ingredient.image ? colors.linkText : colors.text,
                  textDecorationLine: ingredient.image ? 'underline' : 'none',
                },
              ]}
            >
              {ingredient.name}
            </CustomText>
            {ingredient.image && (
              <MaterialIcons
                name="link"
                size={fontSize * 1.2} // fontSize에 비례하여 아이콘 크기 조정
                color={colors.linkText}
                style={styles.linkIcon}
                accessibilityLabel={`${ingredient.name} details`}
              />
            )}
          </View>
          {/* Quantity Cell */}
          <CustomText
            style={[styles.quantityText, { fontSize, color: colors.text }]}
          >
            {ingredient.quantity}
          </CustomText>
        </TouchableOpacity>
      ))}
    </View>
  );
};

// 스타일 정의
const styles = StyleSheet.create({
  tableContainer: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    overflow: 'hidden',
  },
  tableRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  tableHeader: {
    // backgroundColor는 props를 통해 동적으로 설정
  },
  headerText: {
    fontWeight: 'bold',
  },
  tableCell: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 3, // Ingredient 열에 더 많은 공간 할당
  },
  checkboxContainer: {
    marginRight: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  ingredientText: {
    flexShrink: 1, // 텍스트가 길어질 경우 줄바꿈을 허용
  },
  quantityText: {
    flex: 1,
    textAlign: 'right',
    marginRight: 10,
  },
  linkIcon: {
    marginLeft: 5,
  },
  orderedList: {
    marginVertical: 5,
    paddingLeft: 10,
  },
  unorderedList: {
    marginVertical: 5,
    paddingLeft: 10,
  },
  orderedListItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginVertical: 2,
  },
  orderedListNumber: {
    marginRight: 5,
    color: '#000',
  },
  unorderedListItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginVertical: 2,
  },
  unorderedListBullet: {
    marginRight: 5,
    color: '#000',
  },
  listItemTextContainer: {
    flex: 1,
  },
  listItemText: {
    flex: 1,
    color: '#000',
  },
  blockquote: {
    fontStyle: 'italic',
    borderLeftWidth: 4,
    borderLeftColor: '#ccc',
    paddingLeft: 10,
    marginVertical: 10,
  },
  hr: {
    height: 1,
    backgroundColor: '#ddd',
    marginVertical: 10,
  },
});

export default IngredientsChecklist;
