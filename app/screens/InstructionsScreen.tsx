// app/screens/InstructionsScreen.tsx

import React from 'react';
import { View, StyleSheet } from 'react-native';
import RichTextRenderer from '../components/RichTextRenderer';
import { useTheme } from '../contexts/ThemeContext';
import { useFontSize } from '../contexts/FontSizeContext';

interface InstructionsScreenProps {
  instructions: any; // Rich Text 객체
}

const InstructionsScreen: React.FC<InstructionsScreenProps> = ({
  instructions,
}) => {
  const { colors } = useTheme();
  const { fontSize } = useFontSize();

  return (
    <View style={styles.container}>
      {instructions ? (
        <RichTextRenderer
          content={instructions}
          style={{ fontSize, color: colors.text }}
        />
      ) : (
        <Text style={{ color: colors.text, fontSize }}>
          No Instructions Available
        </Text>
      )}
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

export default InstructionsScreen;
