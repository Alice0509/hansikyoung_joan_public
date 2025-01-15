// app/components/CustomText.tsx

import React from 'react';
import { Text, TextProps, StyleSheet } from 'react-native';

interface CustomTextProps extends TextProps {
  children: string; // React.ReactNode에서 string으로 변경
}

const CustomText: React.FC<CustomTextProps> = ({
  children,
  style,
  ...props
}) => {
  return (
    <Text style={[styles.text, style]} {...props}>
      {children}
    </Text>
  );
};

const styles = StyleSheet.create({
  text: {
    fontSize: 16,
    // color: "#000", // 기본 색상 제거
  },
});

export default CustomText;
