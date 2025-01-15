// app/components/LanguageSwitcher.tsx

import React from 'react';
import { View, Button, StyleSheet } from 'react-native';
import { useLanguage } from '../contexts/LanguageContext';

const LanguageSwitcher: React.FC = () => {
  const { language, setLanguage } = useLanguage();

  return (
    <View style={styles.container}>
      <Button
        title="EN"
        onPress={() => setLanguage('en')}
        disabled={language === 'en'}
      />
      <View style={styles.separator} />
      <Button
        title="DE"
        onPress={() => setLanguage('de')}
        disabled={language === 'de'}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 10,
  },
  separator: {
    width: 10,
  },
});

export default LanguageSwitcher;
