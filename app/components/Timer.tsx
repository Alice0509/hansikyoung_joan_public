// app/components/Timer.tsx

import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Alert,
  TouchableOpacity,
  Animated,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import {
  sendLocalNotification,
  registerForPushNotificationsAsync,
} from '../utils/notifications';

interface TimerProps {
  duration: number; // 초 단위
  onFinish?: () => void; // 타이머 완료 시 호출되는 함수
  stepNumber: number; // 조리 단계 번호
}

const Timer: React.FC<TimerProps> = ({ duration, onFinish, stepNumber }) => {
  const { t } = useTranslation();
  const [secondsLeft, setSecondsLeft] = useState<number>(duration);
  const [isActive, setIsActive] = useState<boolean>(false);
  const hasFinishedRef = useRef<boolean>(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    registerForPushNotificationsAsync();
  }, []);

  useEffect(() => {
    // 컴포넌트 마운트 시 페이드 인 애니메이션 실행
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim]);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isActive && secondsLeft > 0) {
      interval = setInterval(() => {
        setSecondsLeft((prev) => prev - 1);
      }, 1000);
    } else if (secondsLeft === 0 && isActive && !hasFinishedRef.current) {
      // 타이머 완료 시 알림 전송
      const message = t('timerFinishedMessage', { stepNumber });
      Alert.alert(t('timerFinished'), message);
      sendLocalNotification(t('timerFinished'), message);
      setIsActive(false);
      hasFinishedRef.current = true;
      if (onFinish) {
        onFinish();
      }

      // 페이드 아웃 애니메이션 실행
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }).start();
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, secondsLeft, onFinish, fadeAnim, t, stepNumber]);

  const minutes = Math.floor(secondsLeft / 60);
  const seconds = secondsLeft % 60;

  const toggleTimer = () => {
    setIsActive(!isActive);
    if (!isActive) {
      hasFinishedRef.current = false;
    }
  };

  const resetTimer = () => {
    setIsActive(false);
    setSecondsLeft(duration);
    hasFinishedRef.current = false;
    // 페이드 인 애니메이션 초기화
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  };

  return (
    <Animated.View
      style={[styles.timerContainer, { opacity: fadeAnim }]}
      accessible
      accessibilityLabel={t('timerAccessibilityLabel', { minutes, seconds })}
    >
      <Text style={styles.timerText}>
        {minutes}:{seconds < 10 ? `0${seconds}` : seconds}
      </Text>
      <View style={styles.buttonsContainer}>
        <TouchableOpacity
          onPress={toggleTimer}
          style={styles.button}
          accessible
          accessibilityLabel={isActive ? t('pause') : t('start')}
        >
          <Text style={styles.toggleText}>
            {isActive ? t('pause') : t('start')}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={resetTimer}
          style={styles.button}
          accessible
          accessibilityLabel={t('reset')}
        >
          <Text style={styles.resetText}>{t('reset')}</Text>
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  timerContainer: {
    backgroundColor: '#e0f7fa',
    padding: 15,
    borderRadius: 10,
    marginTop: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5, // 안드로이드 그림자
  },
  timerText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#00796b',
  },
  buttonsContainer: {
    flexDirection: 'row',
    marginTop: 10,
  },
  button: {
    marginHorizontal: 10,
  },
  toggleText: {
    color: '#00796b',
    textDecorationLine: 'underline',
    fontSize: 16,
  },
  resetText: {
    color: '#d32f2f',
    textDecorationLine: 'underline',
    fontSize: 16,
  },
});

export default Timer;
