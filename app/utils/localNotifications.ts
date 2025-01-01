// app/utils/localNotifications.ts

import * as Notifications from "expo-notifications"; // 필요함
import { Alert } from "react-native";
import Constants from "expo-constants";

/**
 * 알림 권한 요청 함수
 */
export const requestPermissionsAsync = async () => {
  const { status } = await Notifications.getPermissionsAsync();
  let finalStatus = status;
  if (status !== "granted") {
    const { status: newStatus } = await Notifications.requestPermissionsAsync();
    finalStatus = newStatus;
  }
  if (finalStatus !== "granted") {
    Alert.alert("알림 권한이 필요합니다!");
    return false;
  }
  return true;
};

/**
 * 로컬 알림 스케줄링 함수
 */
export const scheduleLocalNotification = async (
  title: string,
  body: string,
  seconds: number,
) => {
  await Notifications.scheduleNotificationAsync({
    content: {
      title,
      body,
    },
    trigger: { seconds },
  });
};
