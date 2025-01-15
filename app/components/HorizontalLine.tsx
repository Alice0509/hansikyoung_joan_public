// app/components/HorizontalLine.tsx

import React from 'react';
import { View, StyleSheet } from 'react-native';

interface HorizontalLineProps {
  color?: string;
  thickness?: number;
  marginVertical?: number;
}

const HorizontalLine: React.FC<HorizontalLineProps> = ({
  color = '#000',
  thickness = 1,
  marginVertical = 10,
}) => {
  return (
    <View
      style={[
        styles.line,
        {
          borderBottomColor: color,
          borderBottomWidth: thickness,
          marginVertical,
        },
      ]}
    />
  );
};

const styles = StyleSheet.create({
  line: {
    borderBottomWidth: 1,
    borderBottomColor: '#000', // 기본 색상
    marginVertical: 10,
    alignSelf: 'stretch',
  },
});

export default HorizontalLine;
