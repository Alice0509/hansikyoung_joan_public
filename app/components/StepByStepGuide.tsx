// app/components/StepByStepGuide.tsx

import React from "react";
import { View, StyleSheet, Alert } from "react-native";
import { RecipeStep } from "../types/Recipe";
import StepItem from "./StepItem";
import { useTranslation } from "react-i18next";

interface StepByStepGuideProps {
  steps: RecipeStep[];
  colors: any; // Theme colors
  fontSize: number;
  fixedColor?: string; // 추가: 고정 색상 프로퍼티
}

const StepByStepGuide: React.FC<StepByStepGuideProps> = ({
  steps,
  colors,
  fontSize,
  fixedColor, // 추가: 고정 색상 사용
}) => {
  const { t } = useTranslation();

  if (!steps || !Array.isArray(steps)) {
    console.warn("StepByStepGuide received invalid steps:", steps);
    return null;
  }

  const handleTimerFinish = (stepNumber: number) => {
    console.log(`타이머 완료: 단계 ${stepNumber}`);

    // 모든 단계가 완료되었는지 확인
    const allCompleted = steps.every(
      (step) => !step.timerDuration || step.stepNumber <= stepNumber,
    );
    if (allCompleted) {
      Alert.alert(t("allStepsCompleted"), t("allStepsCompletedMessage"));
      // 필요 시 추가적인 동작 구현 (예: 완료 페이지로 이동)
    }
  };

  return (
    <View style={styles.container}>
      {steps.map((item, index) => (
        <StepItem
          key={
            item.stepNumber !== undefined
              ? item.stepNumber.toString()
              : index.toString()
          }
          step={item}
          colors={fixedColor ? { text: fixedColor } : colors} // 수정: 고정 색상 적용
          fontSize={fontSize}
          onTimerFinish={() => handleTimerFinish(item.stepNumber)}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 10,
  },
});

export default StepByStepGuide;
