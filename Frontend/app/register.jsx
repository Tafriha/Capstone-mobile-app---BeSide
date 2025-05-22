import React, { useState } from "react";
import {
  View,
  TextInput,
  StyleSheet,
  ScrollView,
  Platform,
  KeyboardAvoidingView,
  Alert,
} from "react-native";
import { router } from "expo-router";
import CountryPicker from "react-native-country-picker-modal";

import { useThemeColor } from "@/hooks/useThemeColor";
import { ThemedText } from "@/components/ThemedText";
import { ThemedButton } from "@/components/ThemedButton";

export default function RegisterScreen() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [mobileNo, setMobileNo] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [street, setStreet] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [countryCode, setCountryCode] = useState("AU");
  const [country, setCountry] = useState("Australia");

  const background = useThemeColor({}, "background");
  const text = useThemeColor({}, "text");
  const border = useThemeColor({}, "primary");

  const handleRegister = async () => {
    if (
      !username || !email || !mobileNo || !password ||
      !firstName || !lastName || !country || !countryCode
    ) {
      alert("Please fill out all required fields");
      return;
    }

    try {
      // Step 1: Register the user
      const registerResponse = await fetch("http://10.0.2.2:5000/api/v1/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userName: username,
          email,
          mobileNo,
          password,
          firstName,
          lastName,
          address: {
            street,
            city,
            state,
            postalCode,
            country,
            countryCode,
          },
        }),
      });

      const registerData = await registerResponse.json();

      if (!registerResponse.ok) {
        alert(registerData.message || "Registration failed");
        return;
      }

      // Step 2: Send verification email
      const verifyResponse = await fetch("http://10.0.2.2:5000/api/v1/auth/send-verification-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const verifyData = await verifyResponse.json();

      if (!verifyResponse.ok) {
        alert(verifyData.message || "User registered but email verification failed");
        return;
      }

      Alert.alert(
        "Registration Successful",
        "A verification email has been sent. Please verify your email before logging in.",
        [
          {
            text: "OK",
            onPress: () =>
              router.push({
                pathname: "/verifyEmail",
                params: { email },
              }),
          },
        ]
      );
    } catch (err) {
      console.error(err);
      Alert.alert("Error", "Something went wrong during registration.");
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView contentContainerStyle={[styles.scrollContainer, { backgroundColor: background }]}>
        <ThemedText type="title" style={styles.title}>Register</ThemedText>

        <TextInput style={[styles.input, { borderColor: border, color: text }]} placeholder="Username" value={username} onChangeText={setUsername} autoCapitalize="none" placeholderTextColor={border} />
        <TextInput style={[styles.input, { borderColor: border, color: text }]} placeholder="Email" value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" placeholderTextColor={border} />

        <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 20 }}>
          <CountryPicker
            withFlag
            withCallingCode
            withFilter
            withCountryNameButton
            countryCode={countryCode}
            onSelect={(country) => {
              setCountryCode(country.cca2);
              setCountry(country.name?.common || country.name);
            }}
            containerButtonStyle={{
              borderWidth: 1,
              borderColor: border,
              borderRadius: 8,
              padding: 12,
              backgroundColor: "transparent",
            }}
          />
          <TextInput
            style={[styles.input, { flex: 1, marginLeft: 10, borderColor: border, color: text }]}
            placeholder="Mobile Number"
            value={mobileNo}
            onChangeText={setMobileNo}
            keyboardType="phone-pad"
            placeholderTextColor={border}
          />
        </View>

        <TextInput style={[styles.input, { borderColor: border, color: text }]} placeholder="Password" value={password} onChangeText={setPassword} secureTextEntry placeholderTextColor={border} />
        <TextInput style={[styles.input, { borderColor: border, color: text }]} placeholder="First Name" value={firstName} onChangeText={setFirstName} placeholderTextColor={border} />
        <TextInput style={[styles.input, { borderColor: border, color: text }]} placeholder="Last Name" value={lastName} onChangeText={setLastName} placeholderTextColor={border} />
        <TextInput style={[styles.input, { borderColor: border, color: text }]} placeholder="Street Address" value={street} onChangeText={setStreet} placeholderTextColor={border} />
        <TextInput style={[styles.input, { borderColor: border, color: text }]} placeholder="City" value={city} onChangeText={setCity} placeholderTextColor={border} />
        <TextInput style={[styles.input, { borderColor: border, color: text }]} placeholder="State" value={state} onChangeText={setState} placeholderTextColor={border} />
        <TextInput style={[styles.input, { borderColor: border, color: text }]} placeholder="Postal Code" value={postalCode} onChangeText={setPostalCode} keyboardType="numeric" placeholderTextColor={border} />

        <ThemedButton title="Register" onPress={handleRegister} />

        <View style={styles.footerTextContainer}>
          <ThemedText type="default">
            Already have an account?{" "}
            <ThemedText type="link" onPress={() => router.push("/login")}>Login</ThemedText>
          </ThemedText>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    paddingBottom: 30,
    paddingHorizontal: 20,
    paddingTop: Platform.OS === "android" ? 60 : 80,
    flexGrow: 1,
  },
  title: { textAlign: "center", marginBottom: 30 },
  input: {
    height: 50,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 16,
    fontSize: 16,
    marginBottom: 20,
  },
  footerTextContainer: { marginTop: 24, alignItems: "center" },
});
