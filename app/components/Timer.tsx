// app/components/Timer.tsx
import React, { useState, useEffect } from "react";
import { View, Text, Button, StyleSheet } from "react-native";

type TimerProps = {
  initialTime: number; // 초기 타이머 시간 (초 단위)
  onComplete: () => void; // 타이머 종료 시 호출되는 함수
};

const Timer: React.FC<TimerProps> = ({ initialTime, onComplete }) => {
  const [timeLeft, setTimeLeft] = useState(initialTime);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;
    if (isRunning && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      onComplete();
      setIsRunning(false);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isRunning, timeLeft, onComplete]);

  const handleStart = () => setIsRunning(true);
  const handlePause = () => setIsRunning(false);
  const handleReset = () => {
    setIsRunning(false);
    setTimeLeft(initialTime);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.timerText}>{`${Math.floor(timeLeft / 60)}:${(
        "0" +
        (timeLeft % 60)
      ).slice(-2)}`}</Text>
      <View style={styles.buttonContainer}>
        <Button
          title={isRunning ? "Pause" : "Start"}
          onPress={isRunning ? handlePause : handleStart}
        />
        <Button title="Reset" onPress={handleReset} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    marginVertical: 16,
  },
  timerText: {
    fontSize: 48,
    fontWeight: "bold",
    marginBottom: 16,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "60%",
  },
});

export default Timer;
