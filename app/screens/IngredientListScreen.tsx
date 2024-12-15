// app/screens/IngredientListScreen.tsx

import React from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../navigation/types";
import { Entry } from "contentful";
import { Ingredient } from "../types/Recipe";

type IngredientListScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "Main"
>;

const mockIngredients: Entry<Ingredient>[] = [
  // 실제 데이터 또는 mock 데이터 추가
  {
    sys: {
      id: "28LenbD52G2ppPaFPToO0h",
      type: "Entry",
      createdAt: "2024-11-18T18:45:30.555Z",
      updatedAt: "2024-11-19T21:18:33.157Z",
      environment: {
        sys: { id: "master", type: "Link", linkType: "Environment" },
      },
      publishedVersion: 11,
      revision: 3,
      space: {
        sys: { type: "Link", linkType: "Space", id: "9o76sn8xew7r" },
      },
      contentType: {
        sys: { type: "Link", linkType: "ContentType", id: "ingredient" },
      },
      locale: "en",
    },
    fields: {
      name: "Spam",
      slug: "spam",
      bild: {
        sys: {
          space: {
            sys: { type: "Link", linkType: "Space", id: "9o76sn8xew7r" },
          },
          id: "55NxMMpuSA7DJLGCCwWS5f",
          type: "Asset",
          createdAt: "2024-11-19T21:13:27.125Z",
          updatedAt: "2024-11-19T21:13:27.125Z",
          environment: {
            sys: { id: "master", type: "Link", linkType: "Environment" },
          },
          publishedVersion: 6,
          revision: 1,
          locale: "en",
        },
        fields: {
          title: "Tulip Frühstücksfleisch",
          description: "",
          file: {
            url: "//images.ctfassets.net/9o76sn8xew7r/55NxMMpuSA7DJLGCCwWS5f/b611b89018e46eb27d0704448f522e75/Tulip_Fru_hstu_cksfleisch.jpg",
            details: {
              size: 66498,
              image: {
                width: 782,
                height: 854,
              },
            },
            fileName: "Tulip Frühstücksfleisch.jpg",
            contentType: "image/jpeg",
          },
        },
      },
      description: {
        data: {},
        content: [
          {
            data: {},
            content: [
              {
                data: {},
                marks: [],
                value:
                  'In Korea, spam is mainly produced by CJ in partnership with the American company Hormel and is sold under the name "Spam." In Germany, I use "Tulip Frühstücksfleisch," which I find similar to spam, though slightly less salty in my opinion. It works well for all Korean spam recipes.',
                nodeType: "text",
              },
            ],
            nodeType: "paragraph",
          },
        ],
        nodeType: "document",
      },
    },
  },
  // 추가적인 mock 데이터
];

const IngredientListScreen: React.FC = () => {
  const navigation = useNavigation<IngredientListScreenNavigationProp>();

  const renderItem = ({ item }: { item: Entry<Ingredient> }) => (
    <TouchableOpacity
      style={styles.item}
      onPress={() =>
        navigation.navigate("Ingredient", {
          ingredientId: item.sys.id,
          locale: "en",
        })
      }
    >
      <Text style={styles.title}>{item.fields.name}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={mockIngredients}
        keyExtractor={(item) => item.sys.id}
        renderItem={renderItem}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  item: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  title: {
    fontSize: 18,
  },
});

export default IngredientListScreen;
