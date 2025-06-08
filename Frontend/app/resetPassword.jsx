import React, { useState } from "react";
import { View, TextInput, StyleSheet, Alert, Text } from "react-native";
import { useThemeColor } from "@/hooks/useThemeColor";
import { ThemedButton } from "@/components/ThemedButton";
import { router, useLocalSearchParams } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage"; // ✅ Import AsyncStorage

export default function ResetPasswordScreen() {
  const { email } = useLocalSearchParams();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const background = useThemeColor({}, "background");
  const text = useThemeColor({}, "text");
  const border = useThemeColor({}, "primary");

  const handleResetPassword = async () => {
    if (!password || !confirmPassword) {
      Alert.alert("Error", "Please fill in all fields.");
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match.");
      return;
    }

    try {
      const token = await AsyncStorage.getItem("resetToken"); // ✅ Get token
      if (!token) {
        Alert.alert("Error", "Session expired. Please request a new OTP.");
        return;
      }

      const response = await fetch("http://10.0.2.2:5000/api/v1/auth/reset-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // ✅ Send token in header
        },
        body: JSON.stringify({ email, password, confirmPassword }), // ✅ Include email
      });

      const data = await response.json();

      if (!response.ok) {
        Alert.alert("Error", data.message || "Reset failed.");
        return;
      }

      await AsyncStorage.removeItem("resetToken"); // ✅ Clean up
      Alert.alert("Success", "Password has been reset. Please log in.");
      router.replace("/login");
    } catch (error) {
      console.error("Reset Password Error:", error);
      Alert.alert("Error", "Something went wrong. Please try again.");
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: background }]}>
      <Text style={[styles.title, { color: text }]}>Reset Password</Text>
      <TextInput
        style={[styles.input, { borderColor: border, color: text }]}
        placeholder="New Password"
        placeholderTextColor={border}
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      <TextInput
        style={[styles.input, { borderColor: border, color: text }]}
        placeholder="Confirm Password"
        placeholderTextColor={border}
        secureTextEntry
        value={confirmPassword}
        onChangeText={setConfirmPassword}
      />
      <ThemedButton title="Reset Password" onPress={handleResetPassword} />
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
    fontSize: 24,
    textAlign: "center",
    marginBottom: 30,
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 16,
    marginBottom: 20,
    backgroundColor: "#FBE6DAa",
  },
});
