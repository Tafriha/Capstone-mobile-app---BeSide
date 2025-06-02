import React, { useState } from "react";
import {
  View,
  TextInput,
  StyleSheet,
  ScrollView,
  Platform,
  KeyboardAvoidingView,
  Alert,
  TouchableOpacity,
  Text,
} from "react-native";
import { router } from "expo-router";
import CountryPicker from "react-native-country-picker-modal";
import RNPickerSelect from "react-native-picker-select";

import { useThemeColor } from "@/hooks/useThemeColor";
import { ThemedText } from "@/components/ThemedText";
import { ThemedButton } from "@/components/ThemedButton";

export default function RegisterScreen() {
  // Form states
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [mobileNo, setMobileNo] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [gender, setGender] = useState(null);
  const [street, setStreet] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [countryCode, setCountryCode] = useState("AU");
  const [country, setCountry] = useState("Australia");

  // Terms agreement states
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);

  const background = useThemeColor({}, "background");
  const text = useThemeColor({}, "text");
  const border = useThemeColor({}, "primary");

  const handleRegister = async () => {
    if (
      !username || !email || !mobileNo || !password ||
      !firstName || !lastName || !gender || !country || !countryCode
    ) {
      alert("Please fill out all required fields");
      return;
    }

    try {
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
          gender,
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

        {/* Input fields */}
        <TextInput style={[styles.input, { borderColor: border, color: text }]} placeholder="Username" value={username} onChangeText={setUsername} autoCapitalize="none" placeholderTextColor={border} />
        <TextInput style={[styles.input, { borderColor: border, color: text }]} placeholder="Email" value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" placeholderTextColor={border} />

        {/* Country Picker & Mobile Number */}
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

        {/* Remaining fields */}
        <TextInput style={[styles.input, { borderColor: border, color: text }]} placeholder="Password" value={password} onChangeText={setPassword} secureTextEntry placeholderTextColor={border} />
        <TextInput style={[styles.input, { borderColor: border, color: text }]} placeholder="First Name" value={firstName} onChangeText={setFirstName} placeholderTextColor={border} />
        <TextInput style={[styles.input, { borderColor: border, color: text }]} placeholder="Last Name" value={lastName} onChangeText={setLastName} placeholderTextColor={border} />

        {/* Gender Picker */}
        <View style={{ marginBottom: 20 }}>
          <ThemedText type="default" style={{ marginBottom: 8, color: text }}>Gender</ThemedText>
          <RNPickerSelect
            onValueChange={setGender}
            value={gender}
            placeholder={{ label: "Select Gender", value: null }}
            items={[
              { label: "Male", value: "male" },
              { label: "Female", value: "female" },
              { label: "Non-binary", value: "non-binary" },
              { label: "Prefer not to say", value: "prefer-not-to-say" },
              { label: "Other", value: "other" },
            ]}
            style={{
              inputIOS: {
                height: 50,
                paddingHorizontal: 16,
                borderWidth: 1,
                borderColor: border,
                borderRadius: 8,
                color: text,
                fontSize: 16,
              },
              inputAndroid: {
                height: 50,
                paddingHorizontal: 16,
                borderWidth: 1,
                borderColor: border,
                borderRadius: 8,
                color: text,
                fontSize: 16,
              },
            }}
          />
        </View>

        <TextInput style={[styles.input, { borderColor: border, color: text }]} placeholder="Street Address" value={street} onChangeText={setStreet} placeholderTextColor={border} />
        <TextInput style={[styles.input, { borderColor: border, color: text }]} placeholder="City" value={city} onChangeText={setCity} placeholderTextColor={border} />
        <TextInput style={[styles.input, { borderColor: border, color: text }]} placeholder="State" value={state} onChangeText={setState} placeholderTextColor={border} />
        <TextInput style={[styles.input, { borderColor: border, color: text }]} placeholder="Postal Code" value={postalCode} onChangeText={setPostalCode} keyboardType="numeric" placeholderTextColor={border} />

        {/* Terms & Conditions checkbox */}
        <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 16 }}>
          <TouchableOpacity onPress={() => setTermsAccepted(!termsAccepted)} style={{
            height: 20,
            width: 20,
            borderRadius: 4,
            borderWidth: 1,
            borderColor: border,
            alignItems: "center",
            justifyContent: "center",
            marginRight: 10,
          }}>
            {termsAccepted && (
              <View style={{
                height: 10,
                width: 10,
                backgroundColor: border,
              }} />
            )}
          </TouchableOpacity>
          <Text style={{ color: text }}>
            I agree to the{' '}
            <Text style={{ color: border, textDecorationLine: 'underline' }} onPress={() => setShowTermsModal(true)}>
              Terms & Conditions
            </Text>
          </Text>
        </View>

        {/* Register Button (disabled if T&C not accepted) */}
        <ThemedButton title="Register" onPress={handleRegister} disabled={!termsAccepted} />

        {/* Navigation to Login */}
        <View style={styles.footerTextContainer}>
          <ThemedText type="default">
            Already have an account?{" "}
            <ThemedText type="link" onPress={() => router.push("/login")}>Login</ThemedText>
          </ThemedText>
        </View>

        {/* Modal for Terms & Conditions */}
        {showTermsModal && (
          <View style={{
            position: "absolute", top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: "rgba(0,0,0,0.6)",
            justifyContent: "center", alignItems: "center",
            padding: 20,
          }}>
            <View style={{
              backgroundColor: "#fff", padding: 20,
              borderRadius: 10, maxHeight: "80%",
              width: "100%",
            }}>
              <ScrollView>
                <Text style={{ color: "#000", fontSize: 16 }}>
                  These are the Terms and Conditions of using the BeSide app. By agreeing, you confirm that you understand the privacy practices and your responsibilities as a user. You must adhere to community guidelines and consent to our use of data per the Privacy Policy.
                </Text>
              </ScrollView>
              <ThemedButton title="Close" onPress={() => setShowTermsModal(false)} />
            </View>
          </View>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

// Styles
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
