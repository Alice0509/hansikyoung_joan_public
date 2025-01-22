// app/screens/SettingsScreen.tsx

import React from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Linking,
  ScrollView,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTranslation } from 'react-i18next';
import Ionicons from '@expo/vector-icons/Ionicons'; // 아이콘 사용
import Constants from 'expo-constants'; // 앱 버전 정보 가져오기
import { useLanguage } from '../contexts/LanguageContext';
import { useTheme } from '../contexts/ThemeContext';
import { useFontSize } from '../contexts/FontSizeContext';
import CustomText from '../components/CustomText';
import { useShoppingList } from '../contexts/ShoppingListContext';
import { useFavorites } from '../contexts/FavoritesContext';

const SettingsScreen: React.FC = () => {
  const { t } = useTranslation();
  const { language, setLanguage } = useLanguage();
  const { theme, toggleTheme, colors } = useTheme();
  const { fontSize, setFontSize } = useFontSize();
  const { clearList } = useShoppingList();
  const { clearFavorites } = useFavorites();

  // 웹사이트 주소
  const websiteURL = 'https://www.leckere-koreanische-rezepte.de/';

  const changeLanguage = async (lang: string) => {
    await setLanguage(lang);
  };

  const increaseFontSize = () => {
    setFontSize(Math.min(fontSize + 2, 30)); // 최대 30
  };

  const decreaseFontSize = () => {
    setFontSize(Math.max(fontSize - 2, 12)); // 최소 12
  };

  const openWebsite = () => {
    Linking.openURL(websiteURL).catch((err) =>
      console.error('Failed to open URL:', err),
    );
  };

  const sendFeedback = () => {
    Linking.openURL(
      'mailto:joan.korean.rezepte@gmail.com?subject=Feedback&body=Your feedback here',
    ).catch((err) => console.error('Failed to send feedback:', err));
  };

  const openPrivacyPolicy = () => {
    Linking.openURL(
      'https://www.leckere-koreanische-rezepte.de/privacy-policy',
    ).catch((err) => console.error('Failed to open privacy policy:', err));
  };
  const resetData = async () => {
    try {
      await AsyncStorage.clear();
      clearList();
      clearFavorites();
      Alert.alert(t('Reset Successful'), t('All local data has been cleared.'));
    } catch (error) {
      console.error('Error resetting data:', error);
      Alert.alert(
        t('Reset Failed'),
        t('There was an error clearing local data.'),
      );
    }
  };
  const confirmReset = () => {
    Alert.alert(
      t('Confirm Reset'), // 제목
      t('Are you sure you want to reset all local data?'), // 메시지
      [
        {
          text: t('Cancel'),
          style: 'cancel',
        },
        {
          text: t('OK'),
          onPress: resetData,
          style: 'destructive', // iOS에서 붉은색 버튼 스타일
        },
      ],
      { cancelable: true },
    );
  };

  // 앱 버전 정보 가져오기
  const appVersion = Constants.manifest?.version || '1.0.0';

  // 현재 테마와 글꼴 크기를 기반으로 동적으로 스타일 생성
  const styles = getStyles(colors, fontSize);

  return (
    <ScrollView style={styles.scrollContainer}>
      <View style={styles.container}>
        <CustomText style={styles.title}>{t('settings')}</CustomText>

        {/* 언어 설정 섹션 */}
        <View style={styles.section}>
          <CustomText style={styles.sectionTitle}>
            <Ionicons name="language-outline" size={20} color={colors.text} />{' '}
            {t('language')}
          </CustomText>
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[
                styles.button,
                language === 'en' ? styles.activeButton : null,
              ]}
              onPress={() => changeLanguage('en')}
            >
              <CustomText style={styles.buttonText}>{t('english')}</CustomText>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.button,
                language === 'de' ? styles.activeButton : null,
              ]}
              onPress={() => changeLanguage('de')}
            >
              <CustomText style={styles.buttonText}>{t('german')}</CustomText>
            </TouchableOpacity>
          </View>
        </View>

        {/* 테마 설정 섹션 */}
        <View style={styles.section}>
          <CustomText style={styles.sectionTitle}>
            <Ionicons
              name="color-palette-outline"
              size={20}
              color={colors.text}
            />{' '}
            {t('theme')}
          </CustomText>
          <TouchableOpacity style={styles.button} onPress={toggleTheme}>
            <CustomText style={styles.buttonText}>
              {theme === 'light' ? t('dark_mode') : t('light_mode')}
            </CustomText>
          </TouchableOpacity>
        </View>

        {/* 글꼴 크기 조절 섹션 */}
        <View style={styles.section}>
          <CustomText style={styles.sectionTitle}>
            <Ionicons name="text-outline" size={20} color={colors.text} />{' '}
            {t('font_size')}
          </CustomText>
          <View style={styles.fontSizeContainer}>
            <TouchableOpacity
              style={styles.smallButton}
              onPress={decreaseFontSize}
            >
              <Ionicons name="remove-outline" size={20} color="#fff" />
            </TouchableOpacity>
            <CustomText style={styles.fontSizeText}>{fontSize}px</CustomText>
            <TouchableOpacity
              style={styles.smallButton}
              onPress={increaseFontSize}
            >
              <Ionicons name="add-outline" size={20} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>

        {/* 데이터 초기화 섹션 추가 */}
        <View style={styles.section}>
          <CustomText style={styles.sectionTitle}>{t('data_reset')}</CustomText>
          <TouchableOpacity style={styles.button} onPress={confirmReset}>
            <CustomText style={styles.buttonText}>{t('reset_data')}</CustomText>
          </TouchableOpacity>
        </View>

        {/* 피드백 섹션 */}
        <View style={styles.section}>
          <CustomText style={styles.sectionTitle}>
            <Ionicons
              name="chatbubble-ellipses-outline"
              size={20}
              color={colors.text}
            />{' '}
            {t('feedback')}
          </CustomText>
          <TouchableOpacity style={styles.button} onPress={sendFeedback}>
            <CustomText style={styles.buttonText}>
              {t('send_feedback')}
            </CustomText>
          </TouchableOpacity>
        </View>

        {/* 개인정보 보호 정책 섹션 */}
        <View style={styles.section}>
          <CustomText style={styles.sectionTitle}>
            <Ionicons
              name="lock-closed-outline"
              size={20}
              color={colors.text}
            />{' '}
            {t('privacy_policy')}
          </CustomText>
          <TouchableOpacity style={styles.button} onPress={openPrivacyPolicy}>
            <CustomText style={styles.buttonText}>
              https://www.leckere-koreanische-rezepte.de/privacy-policy
            </CustomText>
          </TouchableOpacity>
        </View>

        {/* 앱 정보 섹션 */}
        <View style={styles.section}>
          <CustomText style={styles.sectionTitle}>
            <Ionicons
              name="information-circle-outline"
              size={20}
              color={colors.text}
            />{' '}
            {t('app_info')}
          </CustomText>
          <TouchableOpacity style={styles.button} onPress={openWebsite}>
            <CustomText style={styles.buttonText}>
              https://www.leckere-koreanische-rezepte.de/
            </CustomText>
          </TouchableOpacity>
          {/* 앱 버전 정보 추가 */}
          <CustomText style={styles.appVersion}>
            {t('app_version')}: {appVersion}
          </CustomText>
        </View>

        {/* 푸터 섹션 */}
        <View style={styles.footer}>
          <CustomText style={styles.footerText}>
            © 2024 Hansik Young Recipes.{' '}
            <TouchableOpacity onPress={openImpressum}>
              <CustomText style={styles.footerLink}>Impressum</CustomText>
            </TouchableOpacity>
          </CustomText>
        </View>
      </View>
    </ScrollView>
  );
};

// Impressum 열기 함수
const openImpressum = () => {
  const impressumURL = 'https://www.leckere-koreanische-rezepte.de/impressum';
  Linking.openURL(impressumURL).catch((err) =>
    console.error('Failed to open Impressum URL:', err),
  );
};

// 테마와 글꼴 크기에 따라 동적으로 스타일 생성
const getStyles = (colors: any, fontSize: number) =>
  StyleSheet.create({
    scrollContainer: {
      flex: 1,
      backgroundColor: colors.background,
    },
    container: {
      flex: 1,
      padding: 20,
    },
    title: {
      fontWeight: 'bold',
      marginBottom: 20,
      color: colors.text,
      fontSize: fontSize + 4,
      textAlign: 'center',
    },
    section: {
      marginBottom: 30,
    },
    sectionTitle: {
      flexDirection: 'row',
      alignItems: 'center',
      fontSize: fontSize + 2,
      color: colors.text,
      marginBottom: 10,
      fontWeight: '600',
    },
    buttonContainer: {
      flexDirection: 'row',
      justifyContent: 'space-around',
    },
    button: {
      flex: 1,
      paddingVertical: 12,
      paddingHorizontal: 10,
      backgroundColor: colors.buttonBackground,
      borderRadius: 8,
      marginHorizontal: 5,
      alignItems: 'center',
    },
    activeButton: {
      backgroundColor: colors.activeButtonBackground,
    },
    buttonText: {
      color: colors.buttonText,
      fontSize,
      fontWeight: '500',
    },
    fontSizeContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      marginVertical: 10,
    },
    smallButton: {
      padding: 10,
      backgroundColor: colors.buttonBackground,
      borderRadius: 5,
      marginHorizontal: 20,
    },
    fontSizeButtonText: {
      color: '#fff',
      fontSize: 20,
    },
    fontSizeText: {
      fontSize: 16,
      color: colors.text,
    },
    appVersion: {
      marginTop: 10,
      fontSize: 12,
      color: colors.secondary,
      textAlign: 'center',
    },
    footer: {
      marginTop: 20,
      alignItems: 'center',
      paddingVertical: 10,
      borderTopWidth: 1,
      borderTopColor: '#ddd',
    },
    footerText: {
      fontSize: 12,
      color: '#555',
    },
    footerLink: {
      fontSize: 12,
      color: '#555',
      textDecorationLine: 'none',
      fontWeight: 'bold',
    },
  });

export default SettingsScreen;
