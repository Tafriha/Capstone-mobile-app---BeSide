import React from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";

export default function WelcomeScreen() {
  const router = useRouter();

  return (
    <View style={styles.mainContainer}>
      <View style={styles.container}>
        <Image
          source={require("../assets/images/logo.png")}
          style={styles.logo}
        />
        <Text style={styles.title}>Beside</Text>
        <Text style={styles.subtitle}>With You Every Mile, Every Moment</Text>

        <View style={styles.buttonWrapper}>
          <TouchableOpacity
            style={[styles.button, styles.loginButton]}
            onPress={() => router.push("/login")}
          >
            <Text style={[styles.buttonText, styles.loginText]}>Login</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.registerButton]}
            onPress={() => router.push("/register")}
          >
            <Text style={[styles.buttonText, styles.registerText]}>Register</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: "#fff",
  },
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#9B5377",
    borderBottomLeftRadius: 100,
    borderBottomRightRadius: 100,
    paddingHorizontal: 20,
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 20,
  },
  title: {
    fontSize: 36,
    color: "#fff",
    fontWeight: "bold",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: "white",
    textAlign: "center",
    marginBottom: 40,
  },
  buttonWrapper: {
    width: "100%",
    alignItems: "center",
  },
  button: {
    width: 260,
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 10,
  },
  loginButton: {
    backgroundColor: "#fff",
    borderWidth: 2,
    borderColor: "#9B5377",
  },
  registerButton: {
    backgroundColor: "#73475b",
  },
  buttonText: {
    fontSize: 18,
    fontWeight: "bold",
  },
  loginText: {
    color: "#9B5377",
  },
  registerText: {
    color: "#fff",
  },
});
