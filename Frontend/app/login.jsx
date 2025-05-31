import React, { useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { View, TextInput, StyleSheet } from "react-native";
import { router } from "expo-router";
import { useThemeColor } from "@/hooks/useThemeColor";
import { ThemedText } from "@/components/ThemedText";
import { ThemedButton } from "@/components/ThemedButton";
<<<<<<< HEAD
import { Typography } from "@/constants/Typography";
=======
>>>>>>> 59d1139cb6dceb46b90ddd89debfd810c1b7abcf

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
<<<<<<< HEAD
      const response = await fetch("http://10.0.2.2:5001/api/v1/auth/login", {
=======
      const response = await fetch("http://10.0.2.2:5000/api/v1/auth/login", {
>>>>>>> 59d1139cb6dceb46b90ddd89debfd810c1b7abcf
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userName: username, password }),
      });

      const data = await response.json();

<<<<<<< HEAD
      if (response.ok) {
        const user = data.data.user;
        await AsyncStorage.setItem("user", JSON.stringify(user));
        await AsyncStorage.setItem("token", data.token);

        if (user.isVerified) {
          router.replace("/home");
        } else {
          router.replace("/verify");
        }
=======
      if (response.ok && data?.data?.user) {
        const user = data.data.user;
        await AsyncStorage.setItem("user", JSON.stringify(user));
        await AsyncStorage.setItem("token", data.token);
        router.replace("/home");
>>>>>>> 59d1139cb6dceb46b90ddd89debfd810c1b7abcf
      } else {
        alert(data.message || "Login failed");
      }
    } catch (err) {
      alert("Something went wrong. Please try again.");
<<<<<<< HEAD
      console.error(err);
=======
      console.error("Login error:", err);
>>>>>>> 59d1139cb6dceb46b90ddd89debfd810c1b7abcf
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: background }]}>
<<<<<<< HEAD
      <ThemedText type="title" style={styles.title}>
        Login
      </ThemedText>
=======
      <ThemedText type="title" style={styles.title}>Login</ThemedText>
>>>>>>> 59d1139cb6dceb46b90ddd89debfd810c1b7abcf

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

<<<<<<< HEAD
      {/* Forgot Password link */}
      <ThemedText
        type="link"
        onPress={() => router.push("/forgotPassword")}
        style={{ textAlign: "right", marginBottom: 20 }}
      >
=======
      <ThemedText type="link" onPress={() => router.push("/forgotPassword")} style={{ textAlign: "right", marginBottom: 20 }}>
>>>>>>> 59d1139cb6dceb46b90ddd89debfd810c1b7abcf
        Forgot Password?
      </ThemedText>

      <ThemedButton title="Login" onPress={handleLogin} />

      <View style={styles.footerTextContainer}>
        <ThemedText type="default">
<<<<<<< HEAD
          Don't have an account?{" "}
          <ThemedText type="link" onPress={() => router.push("/register")}>
            Register
          </ThemedText>
=======
          Don't have an account? <ThemedText type="link" onPress={() => router.push("/register")}>Register</ThemedText>
>>>>>>> 59d1139cb6dceb46b90ddd89debfd810c1b7abcf
        </ThemedText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
<<<<<<< HEAD
  container: {
    flex: 1,
    padding: 24,
    justifyContent: "center",
  },
  title: {
    textAlign: "center",
    marginBottom: 30,
  },
=======
  container: { flex: 1, padding: 24, justifyContent: "center" },
  title: { textAlign: "center", marginBottom: 30 },
>>>>>>> 59d1139cb6dceb46b90ddd89debfd810c1b7abcf
  input: {
    height: 50,
    borderWidth: 1.5,
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    marginBottom: 20,
    backgroundColor: "#FBE6DAa",
  },
<<<<<<< HEAD
  footerTextContainer: {
    marginTop: 24,
    alignItems: "center",
  },
=======
  footerTextContainer: { marginTop: 24, alignItems: "center" },
>>>>>>> 59d1139cb6dceb46b90ddd89debfd810c1b7abcf
});
