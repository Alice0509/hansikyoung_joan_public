// app/screens/LocalNotificationTestScreen.tsx

import React, { useEffect } from "react";
import { View, Button, Alert, StyleSheet } from "react-native";
import {
  requestPermissionsAsync,
  scheduleLocalNotification,
} from "../utils/localNotifications";

const LocalNotificationTestScreen: React.FC = () => {
  useEffect(() => {
    const setupNotifications = async () => {
      const granted = await requestPermissionsAsync();
      if (!granted) {
        Alert.alert("알림 권한을 허용해주세요.");
      }
    };
    setupNotifications();
  }, []);

  const handleSendNotification = async () => {
    await scheduleLocalNotification(
      "테스트 알림",
      "이것은 로컬 알림입니다.",
      5,
    ); // 5초 후 알림
    Alert.alert("알림 예약됨", "5초 후에 알림이 표시됩니다.");
  };

  return (
    <View style={styles.container}>
      <Button title="로컬 알림 보내기" onPress={handleSendNotification} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default LocalNotificationTestScreen;
