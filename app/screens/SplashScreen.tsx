// app/screens/SplashScreen.tsx

import React, { useEffect } from "react";
import { View, Image, StyleSheet } from "react-native";
import splashImage from "../../assets/images/splash.png"; // 실제 splash 이미지 경로
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../navigation/types";

type SplashScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "Splash"
>;

interface SplashScreenProps {
  navigation: SplashScreenNavigationProp;
}

const SplashScreen: React.FC<SplashScreenProps> = ({ navigation }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.replace("Home"); // Splash 후 Home으로 이동
    }, 2000); // 2초 후 이동

    return () => clearTimeout(timer);
  }, [navigation]);

  return (
    <View style={styles.container}>
      <Image source={splashImage} style={styles.image} resizeMode="contain" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff", // 스플래시 화면 배경색
  },
  image: {
    width: 200,
    height: 200,
  },
});

export default SplashScreen;
