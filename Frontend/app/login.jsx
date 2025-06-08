import React, { useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { View, TextInput, StyleSheet } from "react-native";
import { router } from "expo-router";
import { useThemeColor } from "@/hooks/useThemeColor";
import { ThemedText } from "@/components/ThemedText";
import { ThemedButton } from "@/components/ThemedButton";

export default function LoginScreen() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const background = useThemeColor({}, "background");
  const text = useThemeColor({}, "text");
  const border = useThemeColor({}, "primary");

  const handleLogin = async () => {
    if (!username || !password) {
      alert("Please enter both username and password");
      return;
    }

    try {
      const response = await fetch("http://10.0.2.2:5000/api/v1/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userName: username, password }),
      });

      const data = await response.json();

      if (response.ok && data?.data?.user) {
        const user = data.data.user;
        await AsyncStorage.setItem("user", JSON.stringify(user));
        await AsyncStorage.setItem("token", data.token);
        router.replace("/home");
      } else {
        alert(data.message || "Login failed");
      }
    } catch (err) {
      alert("Something went wrong. Please try again.");
      console.error("Login error:", err);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: background }]}>
      <ThemedText type="title" style={styles.title}>Login</ThemedText>

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
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        placeholderTextColor={border}
      />

      <ThemedText type="link" onPress={() => router.push("/forgotPassword")} style={{ textAlign: "right", marginBottom: 20 }}>
        Forgot Password?
      </ThemedText>

      <ThemedButton title="Login" onPress={handleLogin} />

      <View style={styles.footerTextContainer}>
        <ThemedText type="default">
          Don't have an account? <ThemedText type="link" onPress={() => router.push("/register")}>Register</ThemedText>
        </ThemedText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, justifyContent: "center" },
  title: { textAlign: "center", marginBottom: 30 },
  input: {
    height: 50,
    borderWidth: 1.5,
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    marginBottom: 20,
    backgroundColor: "#FBE6DAa",
  },
  footerTextContainer: { marginTop: 24, alignItems: "center" },
});
