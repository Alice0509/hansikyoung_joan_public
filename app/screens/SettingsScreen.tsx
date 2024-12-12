// app/screens/SettingsScreen.tsx

import React from "react";
import { View, Button, StyleSheet } from "react-native";
import { useLocale } from "../contexts/LocaleContext";

const SettingsScreen = () => {
  const { setLocale } = useLocale();

  return (
    <View style={styles.container}>
      <Button title="English" onPress={() => setLocale("en")} />
      <Button title="Deutsch" onPress={() => setLocale("de")} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default SettingsScreen;
