import React, { useState } from "react";
import { View, TextInput, StyleSheet } from "react-native";
import { router } from "expo-router";
import { useThemeColor } from "@/hooks/useThemeColor";
import { ThemedText } from "@/components/ThemedText";
import { ThemedButton } from "@/components/ThemedButton";
import { Typography } from "@/constants/Typography";

export default function RegisterScreen() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [mobileNo, setMobileNo] = useState("");
  const [password, setPassword] = useState("");

  const background = useThemeColor({}, "background");
  const text = useThemeColor({}, "text");
  const border = useThemeColor({}, "primary");

  const handleRegister = async () => {
    if (!username || !email || !mobileNo || !password) {
      alert("Please fill out all fields");
      return;
    }

    try {
      const response = await fetch(
        "http://10.0.2.2:5001/api/v1/auth/register",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userName: username,
            email,
            mobileNo,
            password,
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        alert("Registration successful!");
        router.replace("/login");
      } else {
        alert(data.message || "Registration failed");
      }
    } catch (err) {
      alert("Something went wrong. Please try again.");
      console.error(err);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: background }]}>
      <ThemedText type="title" style={styles.title}>
        Register
      </ThemedText>

      <TextInput
        style={[styles.input, { borderColor: border, color: text }]}
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
        autoCapitalize="none"
        placeholderTextColor={border}
      />

      <TextInput
        style={[styles.input, { borderColor: border, color: text }]}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        placeholderTextColor={border}
      />

      <TextInput
        style={[styles.input, { borderColor: border, color: text }]}
        placeholder="Mobile Number"
        value={mobileNo}
        onChangeText={setMobileNo}
        keyboardType="phone-pad"
        placeholderTextColor={border}
      />

      <TextInput
        style={[styles.input, { borderColor: border, color: text }]}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        placeholderTextColor={border}
      />

      <ThemedButton title="Register" onPress={handleRegister} />

      <View style={styles.footerTextContainer}>
        <ThemedText type="default">
          Already have an account?{" "}
          <ThemedText type="link" onPress={() => router.push("/login")}>
            Login
          </ThemedText>
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
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 16,
    fontSize: 16,
    marginBottom: 20,
  },
  footerTextContainer: {
    marginTop: 24,
    alignItems: "center",
  },
});
