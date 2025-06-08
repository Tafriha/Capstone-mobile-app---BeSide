import React, { useState } from "react";
import { View, Text, TextInput, StyleSheet, Alert } from "react-native";
import { ThemedButton } from "@/components/ThemedButton";
import { useThemeColor } from "@/hooks/useThemeColor";
import { router, useLocalSearchParams } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage"; // ✅ Import AsyncStorage

export default function VerifyOTPScreen() {
  const { email } = useLocalSearchParams();
  const [otp, setOtp] = useState("");

  const background = useThemeColor({}, "background");
  const textColor = useThemeColor({}, "text");
  const borderColor = useThemeColor({}, "primary");

  const handleVerify = async () => {
    if (!otp) {
      Alert.alert("Error", "Please enter the OTP.");
      return;
    }

    try {
      const response = await fetch("http://10.0.2.2:5000/api/v1/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp }),
      });

      const data = await response.json();

      if (response.ok) {
        await AsyncStorage.setItem("resetToken", data.token); // ✅ Save token locally
        Alert.alert("Success", "OTP Verified! Now reset your password.");
        router.push({
          pathname: "/resetPassword",
          params: { email }, // No need to pass token
        });
      } else {
        Alert.alert("Invalid OTP", data.message || "Please try again.");
      }
    } catch (error) {
      console.error("Verify OTP Error:", error);
      Alert.alert("Error", "An error occurred. Please try again.");
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: background }]}>
      <Text style={[styles.title, { color: textColor }]}>Verify OTP</Text>
      <TextInput
        style={[styles.input, { borderColor: borderColor, color: textColor }]}
        placeholder="Enter OTP"
        placeholderTextColor={borderColor}
        keyboardType="numeric"
        value={otp}
        onChangeText={setOtp}
      />
      <ThemedButton title="Verify OTP" onPress={handleVerify} />
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
