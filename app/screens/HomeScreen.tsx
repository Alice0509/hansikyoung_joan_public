// app/screens/HomeScreen.tsx

import React from "react";
import { View, Button, StyleSheet } from "react-native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../navigation/types";
import { useNavigation } from "@react-navigation/native";

type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, "Home">;

const HomeScreen: React.FC = () => {
  const navigation = useNavigation<HomeScreenNavigationProp>();

  return (
    <View style={styles.container}>
      <Button
        title="Go to Recipe List"
        onPress={() => navigation.navigate("RecipeList")}
      />
      <Button
        title="Go to Settings"
        onPress={() => navigation.navigate("Settings")}
      />
      <Button
        title="Go to Ingredients"
        onPress={() =>
          navigation.navigate("Ingredient", {
            ingredientId: "exampleId",
            locale: "en",
          })
        }
      />
      {/* Home 버튼은 현재 화면이 Home이므로 별도의 동작이 필요 없을 수 있습니다 */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#fff",
  },
});

export default HomeScreen;
