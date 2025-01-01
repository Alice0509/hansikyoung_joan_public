// app/components/StepItem.tsx

import React, { useState } from "react";
import { View, Image, StyleSheet, TouchableOpacity } from "react-native";
import { RecipeStep } from "../types/Recipe";
import CustomText from "./CustomText";
import RichTextRenderer from "./RichTextRenderer";
import Timer from "./Timer";
import { useTranslation } from "react-i18next";
import Icon from "react-native-vector-icons/FontAwesome";

interface StepItemProps {
  step: RecipeStep;
  colors: {
    text: string;
    primary: string;
    buttonText: string;
    stepBackground: string;
    currentStepBorder: string;
  };
  fontSize: number;
  fixedColor: string;
}

const StepItem: React.FC<StepItemProps> = ({
  step,
  colors,
  fontSize,
  fixedColor,
}) => {
  const { t } = useTranslation();
  const [showTimer, setShowTimer] = useState<boolean>(false);

  const handleStartTimer = () => {
    setShowTimer(true);
  };

  const handleTimerFinish = () => {
    setShowTimer(false);
    // 필요한 경우 추가 로직
  };

  return (
    <View
      style={[
        styles.stepContainer,
        { backgroundColor: colors.stepBackground },
        showTimer ? { borderColor: colors.currentStepBorder } : null,
      ]}
    >
      <CustomText
        style={[styles.stepNumber, { color: colors.text, fontSize: fontSize }]}
      >
        {step.stepNumber}. {/* 단계 번호 */}
      </CustomText>
      <RichTextRenderer
        content={step.description}
        style={{ fontSize, color: colors.text }}
      />
      {step.image && (
        <Image
          source={{ uri: step.image }}
          style={styles.stepImage}
          resizeMode="cover"
          onError={(error) =>
            console.error(
              `Failed to load step image at step ${step.stepNumber}:`,
              error.nativeEvent.error,
            )
          }
        />
      )}
      {step.timerDuration && !showTimer && (
        <TouchableOpacity
          style={[styles.startButton, { backgroundColor: colors.primary }]} // 테마에 따른 배경색 적용
          onPress={handleStartTimer}
          accessible={true}
          accessibilityLabel={t("startTimer")}
        >
          <CustomText
            style={[styles.startButtonText, { color: colors.buttonText }]}
          >
            {t("startTimer")}
          </CustomText>
        </TouchableOpacity>
      )}
      {step.timerDuration && showTimer && (
        <Timer
          duration={step.timerDuration}
          stepNumber={step.stepNumber} // stepNumber 전달
          onFinish={handleTimerFinish}
        />
      )}
      {!showTimer && step.timerDuration && (
        <View style={styles.statusContainer}>
          <CustomText style={[styles.statusText, { color: colors.text }]}>
            {t("completed")}
          </CustomText>
          <Icon name="check-circle" size={20} color="green" />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  stepContainer: {
    marginBottom: 20,
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ddd", // 기본 테두리 색상
  },
  currentStepBorder: {
    borderColor: "#007AFF", // 현재 단계의 테두리 색상
  },
  stepNumber: {
    fontWeight: "bold",
    fontSize: 18,
    marginBottom: 5,
  },
  stepImage: {
    width: "100%",
    height: 200,
    borderRadius: 8,
    marginTop: 10,
  },
  startButton: {
    marginTop: 10,
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
  },
  startButtonText: {
    fontSize: 16,
  },
  statusContainer: {
    marginTop: 10,
    flexDirection: "row",
    alignItems: "center",
  },
  statusText: {
    fontSize: 14,
    marginRight: 5,
  },
});

export default StepItem;
