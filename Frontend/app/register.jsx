import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import { router } from "expo-router";

export default function RegisterScreen() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [mobileNo, setMobileNo] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = async () => {
    if (!username || !email || !mobileNo || !password) {
      alert("Please fill out all fields");
      return;
    }

    try {
      const response = await fetch("http://192.168.1.107:5000/api/v1/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userName: username,
          email,
          mobileNo,
          password,
        }),
      });

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
    <View style={styles.container}>
      <Text style={styles.title}>Register</Text>

      <TextInput
        style={styles.input}
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
        autoCapitalize="none"
        placeholderTextColor="#ccc"
      />

      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        placeholderTextColor="#ccc"
      />

      <TextInput
        style={styles.input}
        placeholder="Mobile Number"
        value={mobileNo}
        onChangeText={setMobileNo}
        keyboardType="phone-pad"
        placeholderTextColor="#ccc"
      />

      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        placeholderTextColor="#ccc"
      />

      <TouchableOpacity style={styles.button} onPress={handleRegister}>
        <Text style={styles.buttonText}>Register</Text>
      </TouchableOpacity>

      <View style={styles.footerTextContainer}>
        <Text style={styles.footerText}>
          Already have an account?{" "}
          <Text
            style={styles.footerLink}
            onPress={() => router.push("/login")}
          >
            Login
          </Text>
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 24,
    justifyContent: "center",
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#9B5377",
    textAlign: "center",
    marginBottom: 30,
  },
  input: {
    height: 50,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 16,
    fontSize: 16,
    marginBottom: 20,
    color: "#333",
  },
  button: {
    backgroundColor: "#9B5377",
    paddingVertical: 14,
    borderRadius: 25,
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  footerTextContainer: {
    marginTop: 24,
    alignItems: "center",
  },
  footerText: {
    color: "#9B5377",
  },
  footerLink: {
    fontWeight: "bold",
    textDecorationLine: "underline",
  },
});
