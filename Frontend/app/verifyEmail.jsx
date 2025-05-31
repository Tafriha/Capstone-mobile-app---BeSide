import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { ThemedText } from "@/components/ThemedText";
import { ThemedButton } from "@/components/ThemedButton";

export default function VerifyEmailScreen() {
  const router = useRouter();
  const { email } = useLocalSearchParams();

  return (
    <View style={styles.container}>
      <ThemedText type="title" style={styles.title}>
        Email Verification Sent
      </ThemedText>

      <ThemedText type="default" style={styles.message}>
        A verification link has been sent to:
      </ThemedText>
      <ThemedText type="defaultSemiBold" style={styles.email}>
        {email}
      </ThemedText>

      <ThemedText type="default" style={styles.note}>
        Please check your inbox and click the link to verify your email.
      </ThemedText>

      <ThemedButton
        title="Go to Login"
        onPress={() => router.replace("/login")}
        style={styles.button}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 24,
    backgroundColor: "#FFF0EB",
  },
  title: {
    textAlign: "center",
    marginBottom: 20,
  },
  message: {
    textAlign: "center",
    marginBottom: 8,
  },
  email: {
    textAlign: "center",
    fontSize: 16,
    color: "#9B5377",
    marginBottom: 16,
  },
  note: {
    textAlign: "center",
    marginBottom: 30,
    fontStyle: "italic",
  },
  button: {
    alignSelf: "center",
    width: "60%",
  },
});
