// app/screens/StepsScreen.tsx

import React from 'react';
import { View, StyleSheet } from 'react-native';
import StepByStepGuide from '../components/StepByStepGuide';
import { useTheme } from '../contexts/ThemeContext';
import { useFontSize } from '../contexts/FontSizeContext';
import { RecipeStep } from '../types/Recipe';

interface StepsScreenProps {
  steps: RecipeStep[];
}

const StepsScreen: React.FC<StepsScreenProps> = ({ steps }) => {
  const { colors } = useTheme();
  const { fontSize } = useFontSize();

  return (
    <View style={styles.container}>
      <StepByStepGuide
        steps={steps}
        colors={colors}
        fontSize={fontSize}
        fixedColor={colors.primary}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#fff',
  },
});

export default StepsScreen;
