// app/screens/SplashScreen.tsx

import React, { useEffect } from 'react';
import { View, Image, StyleSheet } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '../navigation/types';

type SplashScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'Splash'
>;

const SplashScreen: React.FC = () => {
  const navigation = useNavigation<SplashScreenNavigationProp>();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.replace('Main'); // Splash 후 Main으로 이동
    }, 2000); // 2초 후 이동

    return () => clearTimeout(timer);
  }, [navigation]);

  return (
    <View style={styles.container}>
      <Image
        source={require('../../assets/images/splash.png')} // 스플래쉬 이미지 경로
        style={styles.image}
        resizeMode="contain" // 필요에 따라 'cover' 또는 'stretch'로 변경 가능
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff', // 스플래쉬 배경색
  },
  image: {
    width: 200, // 필요에 따라 조정
    height: 200, // 필요에 따라 조정
  },
});

export default SplashScreen;
