// app/components/IngredientsChecklist.tsx

import React from "react";
import { View, StyleSheet, TouchableOpacity, Linking } from "react-native";
import CustomText from "./CustomText";
import { MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { RootStackParamList } from "../navigation/types";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

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
  "IngredientDetail"
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
      navigation.navigate("IngredientDetail", { ingredientId: ingredient.id });
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
              textAlign: "right",
            },
          ]}
        >
          Quantity
        </CustomText>
      </View>
      {/* 테이블 본문 */}
      {ingredients.map((ingredient, index) => (
        <TouchableOpacity
          key={index}
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
        >
          {/* Ingredient Name Cell */}
          <View style={styles.tableCell}>
            <TouchableOpacity
              onPress={() => onToggleCheck(index)}
              style={styles.checkboxContainer}
            >
              <MaterialIcons
                name={
                  adjustedCheckedIngredients[index]
                    ? "check-box"
                    : "check-box-outline-blank"
                }
                size={24}
                color={colors.text}
              />
            </TouchableOpacity>
            <CustomText
              style={[
                styles.ingredientText,
                {
                  fontSize,
                  color: ingredient.image ? colors.linkText : colors.text,
                  textDecorationLine: ingredient.image ? "underline" : "none",
                },
              ]}
            >
              {ingredient.name}
            </CustomText>
            {ingredient.image && (
              <MaterialIcons
                name="link"
                size={16}
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
    borderColor: "#ddd",
    borderRadius: 8,
    overflow: "hidden",
  },
  tableRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  tableHeader: {
    // backgroundColor는 props를 통해 동적으로 설정
  },
  headerText: {
    fontWeight: "bold",
  },
  tableCell: {
    flexDirection: "row",
    alignItems: "center",
    flex: 3, // Ingredient 열에 더 많은 공간 할당
  },
  checkboxContainer: {
    marginRight: 10,
  },
  ingredientText: {
    flexShrink: 1, // 텍스트가 길어질 경우 줄바꿈을 허용
  },
  quantityText: {
    flex: 1,
    textAlign: "right",
    marginRight: 10,
  },
  linkIcon: {
    marginLeft: 5,
  },
});

export default IngredientsChecklist;
