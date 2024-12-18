// app/components/CustomText.tsx

import React from "react";
import { Text, TextProps } from "react-native";
import { useFontSize } from "../contexts/FontSizeContext";
import { useTheme } from "../contexts/ThemeContext";

interface CustomTextProps extends TextProps {
  children: React.ReactNode;
  style?: any;
}

const CustomText: React.FC<CustomTextProps> = ({
  children,
  style,
  ...props
}) => {
  const { fontSize } = useFontSize();
  const { colors } = useTheme();

  return (
    <Text
      style={[{ fontSize, color: colors.text }, style]} // 테마 색상 및 글꼴 크기 적용
      {...props}
    >
      {children}
    </Text>
  );
};

export default CustomText;
