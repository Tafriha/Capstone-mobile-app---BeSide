// login.jsx
import React, { useState } from "react";
import {
  View,
  TextInput,
  StyleSheet,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { useThemeColor } from "@/hooks/useThemeColor";
import { ThemedText } from "@/components/ThemedText";
import { ThemedButton } from "@/components/ThemedButton";
import { BASE_URL } from "@/config"; // <- uses your config.js

// Adjust if your backend path differs:
const LOGIN_PATH = "/api/v1/auth/login";

export default function LoginScreen() {
  const [username, setUsername] = useState(""); // email or username
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const background = useThemeColor({}, "background");
  const text = useThemeColor({}, "text");
  const border = useThemeColor({}, "primary");

  const saveAuth = async (payload) => {
    // Supports multiple response shapes:
    // { token, user } OR { data: { token?, user } }
    const token =
      payload?.token ||
      payload?.accessToken ||
      payload?.data?.token ||
      payload?.data?.accessToken ||
      null;

    const user =
      payload?.user ||
      payload?.data?.user ||
      null;

    if (user) {
      await AsyncStorage.setItem("user", JSON.stringify(user));
    }
    if (token) {
      await AsyncStorage.setItem("token", String(token));
    }
  };

  const handleLogin = async () => {
    console.log("Login pressed");
    if (!username || !password) {
      Alert.alert("Missing info", "Please enter both username/email and password.");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch(`${BASE_URL}${LOGIN_PATH}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // Send both 'email' and 'userName' so your API can accept either
        body: JSON.stringify({ email: username, userName: username, password }),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        const msg =
          data?.message ||
          data?.error ||
          `Login failed (status ${res.status})`;
        throw new Error(msg);
      }

      await saveAuth(data);

      // Navigate to your home route (change if different)
      router.replace("/home");
    } catch (err) {
      console.error("Login error:", err?.message || err);
      Alert.alert("Login error", String(err?.message || "Something went wrong"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: background }]}>
      <ThemedText type="title" style={styles.title}>
        Login
      </ThemedText>

      <TextInput
        style={[styles.input, { borderColor: border, color: text }]}
        placeholder="Username or Email"
        value={username}
        onChangeText={setUsername}
        autoCapitalize="none"
        autoCorrect={false}
        placeholderTextColor={border}
        returnKeyType="next"
      />

      <TextInput
        style={[styles.input, { borderColor: border, color: text }]}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        placeholderTextColor={border}
        returnKeyType="done"
        onSubmitEditing={handleLogin}
      />

      <ThemedText
        type="link"
        onPress={() => router.push("/forgotPassword")}
        style={{ textAlign: "right", marginBottom: 20 }}
      >
        Forgot Password?
      </ThemedText>

      <ThemedButton
        title={loading ? "Signing in…" : "Login"}
        onPress={handleLogin}
        disabled={loading}
      />

      <View style={styles.footerTextContainer}>
        <ThemedText type="default">
          Don't have an account?{" "}
          <ThemedText type="link" onPress={() => router.push("/register")}>
            Register
          </ThemedText>
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
    backgroundColor: "#FBE6DA", // fixed stray alpha from earlier
  },
  footerTextContainer: { marginTop: 24, alignItems: "center" },
});
