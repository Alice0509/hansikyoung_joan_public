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
  const { theme } = useTheme();

  return (
    <Text
      style={[{ fontSize, color: theme === "dark" ? "#fff" : "#000" }, style]}
      {...props}
    >
      {children}
    </Text>
  );
};

export default CustomText;
