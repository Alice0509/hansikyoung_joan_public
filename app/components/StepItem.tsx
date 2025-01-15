// app/components/StepItem.tsx

import React from 'react';
import { View, Image, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useTranslation } from 'react-i18next';
import Icon from 'react-native-vector-icons/FontAwesome';

import CustomText from './CustomText';
import RichTextRenderer from './RichTextRenderer';
import Timer from './Timer';
import { RecipeStep } from '../types/Recipe';

import { __DEV__ } from 'react-native';
import { useLanguage } from '../contexts/LanguageContext'; // Ensure this hook provides 'en' or 'de'

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
  onReadAloud: (text: string) => void; // Read aloud callback
  stepText: string; // step text constructed by parent
}

const StepItem: React.FC<StepItemProps> = ({
  step,
  colors,
  fontSize,
  fixedColor,
  onReadAloud,
  stepText,
}) => {
  const { t } = useTranslation();
  const { language } = useLanguage(); // Ensure this hook provides 'en' or 'de'

  const [showTimer, setShowTimer] = React.useState<boolean>(false);
  const [timerCompleted, setTimerCompleted] = React.useState<boolean>(false);

  const handleStartTimer = () => {
    setShowTimer(true);
  };
  const handleTimerFinish = () => {
    setShowTimer(false);
    setTimerCompleted(true);
    Alert.alert(
      t('timerFinishedTitle'),
      `${t('timerFinishedMessage')} ${t('step')} ${step.stepNumber}.`,
    );
  };

  let imageUrl: string | undefined;
  if (Array.isArray(step.image) && step.image.length > 0) {
    imageUrl = `https:${step.image[0]?.fields?.file?.url}`;
  } else if (typeof step.image === 'string' && step.image.length > 0) {
    imageUrl = step.image;
  }

  if (__DEV__) {
    // For debugging purposes, log the stepText
    console.log(`StepItem: stepText - ${stepText}`);
  }

  return (
    <View
      style={[
        styles.stepContainer,
        { backgroundColor: colors.stepBackground },
        timerCompleted ? { borderColor: colors.currentStepBorder } : null,
      ]}
    >
      <View style={styles.header}>
        <CustomText
          style={[
            styles.stepNumber,
            { color: colors.text, fontSize: fontSize * 0.9 },
          ]}
        >
          {language === 'de-DE'
            ? `Schritt ${step.stepNumber}. `
            : `${step.stepNumber}. `}
          {/* {stepText.split(':')[0]}:{/* "Schritt 1:" 또는 "Step 1:" */}
        </CustomText>
        <RichTextRenderer
          content={step.description}
          style={{ fontSize, color: colors.text, flex: 1 }}
        />
      </View>

      {imageUrl && (
        <TouchableOpacity
          onPress={() => {
            Alert.alert(
              language === 'de'
                ? `${t('step')} ${step.stepNumber} ${t('imageTitle')}`
                : `${t('step')} ${step.stepNumber} ${t('imageTitle')}`,
              t('imageClickedMessage'),
            );
          }}
          accessible={true}
          accessibilityRole="imagebutton"
          accessibilityLabel={`${t('imageForStep')} ${step.stepNumber}`}
          accessibilityHint={`${t('opensImageForStep')} ${step.stepNumber}`}
        >
          <Image
            source={{ uri: imageUrl }}
            style={styles.stepImage}
            resizeMode="cover"
          />
        </TouchableOpacity>
      )}

      {step.timerDuration && !showTimer && !timerCompleted && (
        <TouchableOpacity
          style={[styles.startButton, { backgroundColor: colors.primary }]}
          onPress={handleStartTimer}
          accessible={true}
          accessibilityLabel={t('startTimer')}
          accessibilityHint={t('startTimerHint')}
          accessibilityRole="button"
        >
          <CustomText
            style={[styles.startButtonText, { color: colors.buttonText }]}
          >
            {t('startTimer')}
          </CustomText>
        </TouchableOpacity>
      )}
      {step.timerDuration && showTimer && (
        <Timer
          duration={step.timerDuration}
          stepNumber={step.stepNumber}
          onFinish={handleTimerFinish}
          style={styles.timer}
        />
      )}
      {step.timerDuration && timerCompleted && (
        <View style={styles.statusContainer}>
          <CustomText style={[styles.statusText, { color: colors.text }]}>
            {t('completed')}
          </CustomText>
          <Icon name="check-circle" size={20} color="green" />
        </View>
      )}

      {/* Read aloud button */}
      <TouchableOpacity
        onPress={() => onReadAloud(stepText)}
        style={styles.readAloudButton}
        accessible={true}
        accessibilityLabel={t('readAloud')}
        accessibilityRole="button"
      >
        <CustomText style={[styles.readAloudText, { color: colors.primary }]}>
          {language === 'de' ? 'Vorlesen' : t('readAloud')}
        </CustomText>
      </TouchableOpacity>
    </View>
  );
};

export default StepItem;

const styles = StyleSheet.create({
  stepContainer: {
    marginBottom: 20,
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    flex: 1,
  },
  stepNumber: {
    fontWeight: 'bold',
    fontSize: 18,
    marginRight: 5,
  },
  stepImage: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    marginTop: 10,
  },
  startButton: {
    marginTop: 10,
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    elevation: 5,
    backgroundColor: '#00796b',
  },
  startButtonText: {
    fontSize: 16,
  },
  timer: {
    marginTop: 10,
  },
  statusContainer: {
    marginTop: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusText: {
    fontSize: 14,
    marginRight: 5,
  },
  readAloudButton: {
    marginTop: 10,
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 3,
    backgroundColor: '#e0f7fa',
  },
  readAloudText: {
    fontSize: 16,
    textDecorationLine: 'underline',
  },
});
