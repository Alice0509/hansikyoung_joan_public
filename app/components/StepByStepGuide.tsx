// app/components/StepByStepGuide.tsx

import React, { useState, useRef, useEffect } from 'react';
import { View, TouchableOpacity, Text, StyleSheet, Alert } from 'react-native';
import TTS from 'react-native-tts';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { useTranslation } from 'react-i18next';
import Slider from '@react-native-community/slider';
import * as Progress from 'react-native-progress';
import Animated, {
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';
import { TouchableWithoutFeedback } from 'react-native';

import StepItem from './StepItem';
import { RecipeStep } from '../types/Recipe';
import { useLanguage } from '../contexts/LanguageContext'; // LanguageContext 사용

interface StepByStepGuideProps {
  steps: RecipeStep[];
  colors: {
    text: string;
    primary: string;
    buttonText: string;
    stepBackground: string;
    currentStepBorder: string;
  };
  fontSize: number;
  fixedColor: string;
  // language prop 제거
}

const StepByStepGuide: React.FC<StepByStepGuideProps> = ({
  steps,
  colors,
  fontSize,
  fixedColor,
}) => {
  const { t } = useTranslation();
  const { language } = useLanguage(); // LanguageContext에서 language 가져오기 ('en' 또는 'de')

  // 읽기 상태 관리
  const [isReading, setIsReading] = useState(false);
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [showReadingCompleteOverlay, setShowReadingCompleteOverlay] =
    useState(false);
  const [rate, setRate] = useState<number>(0.5); // 읽기 속도

  // 참조 변수
  const isReadingRef = useRef<boolean>(false);
  const isStoppedRef = useRef<boolean>(false);

  // 애니메이션 상태
  const [pressed, setPressed] = useState(false);

  // 언어 코드 매핑 함수
  const getTtsLanguage = (lang: 'en' | 'de'): string => {
    const mapping: { [key: string]: string } = {
      en: 'en-US',
      de: 'de-DE',
    };
    return mapping[lang] || 'en-US';
  };
  const mappedLanguage = getTtsLanguage(language);

  useEffect(() => {
    console.log(`Current language prop: ${language}`);
    console.log(`Mapped TTS language: ${mappedLanguage}`);

    // TTS 초기 설정
    TTS.setDefaultLanguage(mappedLanguage);
    TTS.setDucking(true);
    TTS.setDefaultRate(rate);

    // 언어에 따른 명시적 목소리 설정
    if (language === 'de') {
      // 독일어 설정: 'com.apple.eloquence.de-DE.Shelley' (iOS 예시)
      // 안드로이드에서는 다른 ID를 사용할 수 있으므로, 필요 시 별도 처리
      TTS.setDefaultVoice('com.apple.eloquence.de-DE.Shelley');
      console.log('German voice set to Shelley');
    } else if (language === 'en') {
      // 영어 설정: 'com.apple.eloquence.en-US.Flo' (iOS 예시)
      TTS.setDefaultVoice('com.apple.eloquence.en-US.Flo');
      console.log('English voice set to Flo');
    }

    // TTS 이벤트 리스너 설정
    const finishSub = TTS.addEventListener('tts-finish', handleTtsFinish);
    const cancelSub = TTS.addEventListener('tts-cancel', handleTtsCancel);

    return () => {
      TTS.stop();
      finishSub.remove();
      cancelSub.remove();
    };
  }, [language, mappedLanguage, rate]);

  /** TTS가 끝났을 때 호출 */
  const handleTtsFinish = () => {
    console.log('TTS finished speaking');
    if (isReadingRef.current && !isStoppedRef.current) {
      setCurrentStep((prevStep) => {
        if (prevStep < steps.length - 1) {
          const nextStep = prevStep + 1;
          speakStep(nextStep);
          return nextStep;
        } else {
          TTS.speak(t('readingComplete'));
          setShowReadingCompleteOverlay(true);
          setTimeout(() => {
            setShowReadingCompleteOverlay(false);
          }, 2000);
          setIsReading(false);
          isReadingRef.current = false;
          return 0; // 초기 단계로 리셋
        }
      });
    }
  };

  /** TTS가 취소되었을 때 호출 */
  const handleTtsCancel = () => {
    console.log('TTS canceled');
    if (isReadingRef.current && !isStoppedRef.current) {
      setIsReading(false);
      isReadingRef.current = false;
    }
  };

  /** 특정 스텝 읽기 */
  const speakStep = (stepIndex: number) => {
    const stepText = buildStepText(steps[stepIndex]);
    console.log(`Speaking step ${stepIndex + 1}: ${stepText}`);
    TTS.speak(stepText);
  };

  /** 읽기 시작 */
  const handleStartReading = () => {
    if (isReading) return;
    try {
      setIsReading(true);
      isStoppedRef.current = false;
      isReadingRef.current = true;
      speakStep(currentStep);
    } catch (error) {
      console.error('Error starting reading:', error);
      setIsReading(false);
    }
  };

  /** 읽기 정지 */
  const handleStop = () => {
    if (isReading) {
      try {
        setIsReading(false);
        isStoppedRef.current = true;
        isReadingRef.current = false;
        setCurrentStep(0);
        TTS.stop();
        console.log('Reading stopped and reset to initial state');
      } catch (error) {
        console.error('Error stopping reading:', error);
      }
    }
  };

  /** 단일 스텝 읽기 */
  const handleSingleStepRead = async (text: string) => {
    if (!text) return;
    try {
      await TTS.stop();
      await speakAsync(text);
    } catch (err) {
      console.error('Error reading single step:', err);
    }
  };

  /** TTS Promise 래퍼 */
  const speakAsync = (text: string): Promise<void> => {
    return new Promise((resolve) => {
      console.log(`Speaking text: ${text}`);
      const finishSub = TTS.addEventListener('tts-finish', () => {
        finishSub.remove();
        cancelSub.remove();
        resolve();
      });
      const cancelSub = TTS.addEventListener('tts-cancel', () => {
        finishSub.remove();
        cancelSub.remove();
        resolve();
      });

      TTS.speak(text);
    });
  };

  /** 스텝 문구 구성 */
  const buildStepText = (step: RecipeStep) => {
    const prefix =
      language === 'de'
        ? `Schritt ${step.stepNumber}: `
        : `Step ${step.stepNumber}: `;
    const desc = extractText(step.description);
    if (!desc.trim()) {
      return language === 'de'
        ? `Schritt ${step.stepNumber}: Keine Beschreibung`
        : `Step ${step.stepNumber}: No description`;
    }
    return prefix + desc;
  };

  /** RichText -> 문자열 변환 */
  const extractText = (desc: any): string => {
    if (!desc?.content) return '';
    const recursion = (nodes: any[]): string =>
      nodes
        .map((node: any) => {
          if (node.nodeType === 'text') return node.value || '';
          if (node.content) return recursion(node.content);
          return '';
        })
        .join(' ');
    return recursion(desc.content) || '';
  };

  // 애니메이션 스타일
  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: pressed ? withTiming(0.9) : withTiming(1) }],
    };
  });

  // 버튼 프레스 핸들러
  const handlePressIn = () => setPressed(true);
  const handlePressOut = () => setPressed(false);

  return (
    <View style={styles.container}>
      {/* 읽기 속도 슬라이더 */}
      <View style={styles.sliderContainer}>
        <Text style={{ color: colors.text }}>{t('readingSpeed')}</Text>
        <Slider
          style={{ width: 200, height: 40 }}
          minimumValue={0.5} // 최소 속도 0.5x
          maximumValue={2.0} // 최대 속도 2.0x
          step={0.1}
          value={rate}
          onValueChange={(value) => setRate(value)}
          minimumTrackTintColor={colors.primary}
          maximumTrackTintColor="#000000"
          thumbTintColor={colors.primary}
        />
      </View>

      {/* 진행 바 */}
      <View style={styles.progressBarContainer}>
        <Progress.Bar
          progress={(currentStep + 1) / steps.length}
          width={200}
          color={colors.primary}
          unfilledColor="#e0e0e0"
          borderWidth={0}
          height={10}
        />
        <Text style={[styles.progressText, { color: colors.text }]}>
          {t('currentStep')}: {currentStep + 1} / {steps.length}
        </Text>
      </View>

      {/* 플레이 및 스탑 버튼 */}
      <View style={styles.controlsContainer}>
        {!isReading && (
          <Animated.View
            style={[
              styles.controlButton,
              animatedStyle,
              { backgroundColor: colors.primary },
            ]}
          >
            <TouchableWithoutFeedback
              onPressIn={handlePressIn}
              onPressOut={handlePressOut}
              onPress={handleStartReading}
            >
              <MaterialIcons
                name="play-arrow"
                size={28}
                color={colors.buttonText}
              />
            </TouchableWithoutFeedback>
          </Animated.View>
        )}

        {isReading && (
          <TouchableOpacity
            style={[styles.controlButton, { backgroundColor: 'red' }]}
            onPress={handleStop}
          >
            <MaterialIcons name="stop" size={28} color={colors.buttonText} />
          </TouchableOpacity>
        )}
      </View>

      {/* 스텝 목록 */}
      <View style={{ marginTop: 20 }}>
        {steps.map((step) => {
          const stepText = buildStepText(step);
          return (
            <StepItem
              key={step.stepNumber}
              step={step}
              colors={colors}
              fontSize={fontSize}
              fixedColor={fixedColor}
              onReadAloud={handleSingleStepRead}
              stepText={stepText}
            />
          );
        })}
      </View>

      {/* 읽기 완료 오버레이 */}
      {showReadingCompleteOverlay && (
        <View style={styles.overlayContainer}>
          <View style={styles.overlayContent}>
            <Text style={{ fontSize: 16, color: '#fff' }}>
              {t('readingComplete')}
            </Text>
          </View>
        </View>
      )}
    </View>
  );
};

export default StepByStepGuide;

/** ========== Styles ========== */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  sliderContainer: {
    alignItems: 'center',
    marginVertical: 10,
  },
  progressBarContainer: {
    alignItems: 'center',
    marginTop: 10,
  },
  progressText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 5,
  },
  controlsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  controlButton: {
    width: 60,
    height: 60,
    borderRadius: 30, // 원형 버튼
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 10,
    elevation: 3,
  },
  overlayContainer: {
    position: 'absolute',
    top: 80, // 원하는 위치
    left: 0,
    right: 0,
    zIndex: 9999,
    alignItems: 'center',
  },
  overlayContent: {
    backgroundColor: 'rgba(0,0,0,0.7)',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
});
