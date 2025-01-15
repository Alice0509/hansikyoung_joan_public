// app/components/AccordionSection.tsx

import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface AccordionSectionProps {
  title: string;
  children: React.ReactNode;
  colors: {
    text: string;
    primary: string;
    accordionBackground: string;
    accordionBodyBackground: string;
  };
  fontSize: number;
}

const AccordionSection: React.FC<AccordionSectionProps> = ({
  title,
  children,
  colors,
  fontSize,
}) => {
  const [expanded, setExpanded] = useState<boolean>(false);

  const toggleExpand = () => {
    setExpanded(!expanded);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={toggleExpand}
        style={[
          styles.header,
          { backgroundColor: colors.primary, borderColor: colors.primary },
        ]}
        accessible
        accessibilityRole="button"
        accessibilityLabel={expanded ? `Collapse ${title}` : `Expand ${title}`}
        accessibilityHint={`Toggles the ${title} section`}
      >
        <Text style={[styles.headerText, { color: colors.text, fontSize }]}>
          {title}
        </Text>
        <Ionicons
          name={expanded ? 'chevron-up' : 'chevron-down'}
          size={24}
          color={colors.text}
        />
      </TouchableOpacity>
      {expanded && (
        <View
          style={[
            styles.body,
            { backgroundColor: colors.accordionBodyBackground },
          ]}
        >
          {children}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
    borderRadius: 8,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#ddd', // 기본 테두리 색상 (theme에 따라 동적으로 변경 가능)
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
  },
  headerText: {
    fontWeight: 'bold',
  },
  body: {
    padding: 15,
  },
});

export default AccordionSection;
