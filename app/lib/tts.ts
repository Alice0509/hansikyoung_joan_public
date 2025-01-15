// app/lib/tts.ts

import * as Speech from 'expo-speech';

// 텍스트 읽기 함수
export const speak = (text: string) => {
  Speech.stop(); // 현재 읽기 중지
  Speech.speak(text, {
    language: 'en-US', // 영어 (미국식)
    pitch: 1.0, // 목소리 톤 (1.0이 기본값)
    rate: 1.0, // 말하기 속도 (1.0이 기본값)
  });
};

// 텍스트 읽기 중지 함수
export const stopSpeaking = () => {
  Speech.stop();
};
