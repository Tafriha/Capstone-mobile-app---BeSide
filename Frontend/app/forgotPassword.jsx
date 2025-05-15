import React, { useState } from "react";
import { View, TextInput, StyleSheet, Alert } from "react-native";
import { router } from "expo-router";
import { ThemedText } from "@/components/ThemedText";
import { ThemedButton } from "@/components/ThemedButton";
import { useThemeColor } from "@/hooks/useThemeColor";

export default function ForgotPasswordScreen() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const background = useThemeColor({}, "background");
  const text = useThemeColor({}, "text");
  const border = useThemeColor({}, "primary");

  const handleReset = async () => {
    if (!email) {
      Alert.alert("Error", "Please enter your email.");
      return;
    }

    console.log("Sending password reset request for:", email);
    setLoading(true);

    try {
      const response = await fetch("http://10.0.2.2:5000/api/v1/auth/forgotPassword", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();
      console.log("Response status:", response.status);
      console.log("Response data:", data);

      if (response.ok) {
        Alert.alert("Success", "A reset link has been sent to your email.");
        router.replace("/login");
      } else {
        Alert.alert("Error", data.message || "Something went wrong.");
      }
    } catch (error) {
      console.error("Forgot Password Error:", error);
      Alert.alert("Error", "Unable to send reset email. Please try again.");
    } finally {
      setLoading(false); // 🔒 Always reset loading
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: background }]}>
      <ThemedText type="title" style={styles.title}>
        Forgot Password
      </ThemedText>

      <TextInput
        style={[styles.input, { borderColor: border, color: text }]}
        placeholder="Enter your registered email"
        placeholderTextColor={border}
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <ThemedButton
        title="Send Reset Link"
        onPress={handleReset}
        disabled={loading}
      />

      <View style={styles.footerTextContainer}>
        <ThemedText type="link" onPress={() => router.replace("/login")}>
          Back to Login
        </ThemedText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: "center",
  },
  title: {
    textAlign: "center",
    marginBottom: 30,
  },
  input: {
    height: 50,
    borderWidth: 1.5,
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    marginBottom: 20,
    backgroundColor: "#FBE6DAa",
  },
  footerTextContainer: {
    marginTop: 20,
    alignItems: "center",
  },
});