import React, { useEffect } from "react";
import { View, Image, StyleSheet } from "react-native";
import splashImage from "../../assets/images/splash.png"; // 이미 가져옴

export default function SplashScreen({ navigation }) {
  useEffect(() => {
    setTimeout(() => {
      navigation.replace("RecipeList");
    }, 2000);
  }, [navigation]);

  return (
    <View style={styles.container}>
      {/* 중복 경로 제거 */}
      <Image source={splashImage} style={styles.image} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  image: {
    width: 200,
    height: 200,
  },
});
