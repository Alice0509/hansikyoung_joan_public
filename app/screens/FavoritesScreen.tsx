// app/screens/FavoritesScreen.tsx

import React from "react";
import { Button, View, StyleSheet } from "react-native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../navigation/types";
import { useNavigation } from "@react-navigation/native";

type FavoritesScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "Favorites"
>;

const FavoritesScreen: React.FC = () => {
  const navigation = useNavigation<FavoritesScreenNavigationProp>();

  return (
    <View style={styles.container}>
      <Button
        title="Go to Settings"
        onPress={() => navigation.navigate("Settings")}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default FavoritesScreen;
