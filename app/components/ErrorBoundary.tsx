// app/components/ErrorBoundary.tsx

import React, { Component, ReactNode } from "react";
import { View, Text, StyleSheet } from "react-native";
import { safeStringify } from "../utils/safeStringify"; // safeStringify 임포트

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  info: any;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null, info: null };
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: any) {
    console.error("ErrorBoundary caught an error:", error, info);
    this.setState({ info });
  }

  render() {
    if (this.state.hasError && this.state.error) {
      let errorMessage = this.state.error.toString();
      let errorDetails = "";

      if (this.state.info?.componentStack) {
        try {
          errorDetails = safeStringify(this.state.info.componentStack);
        } catch (error) {
          console.error(
            "ErrorBoundary: Failed to stringify componentStack.",
            error,
          );
          errorDetails = "Unable to display error details.";
        }
      }

      return (
        <View style={styles.container}>
          <Text style={styles.errorText}>Something went wrong.</Text>
          <Text style={styles.errorMessage}>{errorMessage}</Text>
          <Text style={styles.errorDetails}>{errorDetails}</Text>
        </View>
      );
    }

    return this.props.children;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  errorText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#FF3B30",
    marginBottom: 10,
  },
  errorMessage: {
    fontSize: 16,
    color: "#555",
  },
  errorDetails: {
    fontSize: 14,
    color: "#999",
    marginTop: 10,
  },
});

export default ErrorBoundary;
