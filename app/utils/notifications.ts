// app/utils/notifications.ts

import * as Notifications from "expo-notifications";
import { Platform, Alert } from "react-native";

// 알림 핸들러 설정
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

// 알림 권한 요청 및 설정
export const registerForPushNotificationsAsync = async (): Promise<
  string | undefined
> => {
  try {
    if (Platform.OS === "android") {
      await Notifications.setNotificationChannelAsync("default", {
        name: "default",
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: "#FF231F7C",
      });
    }

    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== "granted") {
      Alert.alert(
        "알림 권한이 거부되었습니다.",
        "앱의 일부 기능이 제한될 수 있습니다.",
      );
      return;
    }

    const tokenData = await Notifications.getExpoPushTokenAsync();
    const token = tokenData.data;
    console.log("Expo Push Token:", token);
    return token;
  } catch (error) {
    console.error("알림 권한 요청 중 오류 발생:", error);
    return;
  }
};

// 로컬 알림 보내기
export const sendLocalNotification = async (title: string, body: string) => {
  try {
    await Notifications.scheduleNotificationAsync({
      content: {
        title,
        body,
        sound: true,
      },
      trigger: null, // 즉시 발송
    });
  } catch (error) {
    console.error("로컬 알림 전송 실패:", error);
  }
};
