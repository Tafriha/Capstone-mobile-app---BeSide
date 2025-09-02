import React, { useEffect, useState } from "react";
import {
  View,
  TextInput,
  StyleSheet,
  Alert,
  Platform,
  KeyboardAvoidingView,
  ScrollView,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Picker } from "@react-native-picker/picker";
import { router } from "expo-router";
import { useThemeColor } from "@/hooks/useThemeColor";
import { ThemedText } from "@/components/ThemedText";
import { ThemedButton } from "@/components/ThemedButton";
import { BASE_URL } from "../config"; // <— point to your Frontend/config.js

export default function VerifyScreen() {
  const [userName, setUserName] = useState(null);
  const [verificationIdType, setVerificationIdType] = useState("wwcc");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [number, setNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [dob, setDob] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const background = useThemeColor({}, "background");
  const border = useThemeColor({}, "primary");
  const text = useThemeColor({}, "text");

  useEffect(() => {
    const loadUser = async () => {
      try {
        const storedUser = await AsyncStorage.getItem("user");
        if (storedUser) {
          const parsedUser = JSON.parse(storedUser);
          setUserName(parsedUser.userName);
        } else {
          Alert.alert("Error", "No user is logged in.");
          router.replace("/login");
        }
      } catch (error) {
        console.error("Error loading user from storage:", error);
      }
    };
    loadUser();
  }, []);

  const validate = () => {
    const required = [
      ["First Name", firstName],
      ["Last Name", lastName],
      ["ID Number", number],
      ["Expiry Date (DD-MM-YYYY)", expiry],
      ["Date of Birth (DD-MM-YYYY)", dob],
    ];
    const missing = required.find(([, v]) => !String(v || "").trim());
    if (missing) {
      Alert.alert("Missing field", `Please fill: ${missing[0]}`);
      return false;
    }
    const ddmmyyyy = /^\d{2}-\d{2}-\d{4}$/;
    if (!ddmmyyyy.test(expiry) || !ddmmyyyy.test(dob)) {
      Alert.alert("Invalid date", "Use DD-MM-YYYY for Expiry and DOB.");
      return false;
    }
    return true;
  };

  const handleVerify = async () => {
  Alert.alert("Tapped", "Verify button pressed"); // 👈 ADD THIS

  if (!userName) {
    Alert.alert("Error", "User is not logged in.");
    return;
  }

    if (!validate()) return;

    const payload = {
      userName,
      verificationIdType,
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      number: number.trim(),
      expiry: expiry.trim(),
      dob: dob.trim(),
    };

    try {
      setSubmitting(true);
      const res = await fetch(`${BASE_URL}/api/v1/auth/verify`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      let data = {};
      try {
        data = await res.json();
      } catch (_) {}

      if (res.ok && data && data.data && data.data.user) {
        const updatedUser = data.data.user;
        updatedUser.isVerified = true;
        await AsyncStorage.setItem("user", JSON.stringify(updatedUser));
        Alert.alert("Success", "Verification completed!");
        router.replace("/home");
      } else {
        Alert.alert("Error", (data && data.message) || "Verification failed");
      }
    } catch (err) {
      Alert.alert("Error", "Something went wrong. Please try again.");
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: background }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      keyboardVerticalOffset={Platform.select({ ios: 90, android: 0 })}
    >
      <ScrollView contentContainerStyle={styles.container}>
        <ThemedText type="title" style={styles.title}>
          Verify Identity
        </ThemedText>

        <ThemedText type="defaultSemiBold" style={styles.label}>
          ID Type
        </ThemedText>

        <View
          style={[
            styles.pickerWrapper,
            { borderColor: border, backgroundColor: background },
          ]}
        >
          <Picker
            selectedValue={verificationIdType}
            onValueChange={(itemValue) => setVerificationIdType(itemValue)}
            style={[styles.picker, { color: text, backgroundColor: background }]}
          >
            <Picker.Item label="WWCC" value="wwcc" />
            <Picker.Item label="License" value="license" />
          </Picker>
        </View>

        {[
          { placeholder: "First Name", value: firstName, setValue: setFirstName },
          { placeholder: "Last Name", value: lastName, setValue: setLastName },
          { placeholder: "ID Number", value: number, setValue: setNumber },
          {
            placeholder: "Expiry Date (DD-MM-YYYY)",
            value: expiry,
            setValue: setExpiry,
            keyboardType: "numbers-and-punctuation",
          },
          {
            placeholder: "Date of Birth (DD-MM-YYYY)",
            value: dob,
            setValue: setDob,
            keyboardType: "numbers-and-punctuation",
          },
        ].map((field, index) => (
          <TextInput
            key={index}
            style={[
              styles.input,
              {
                borderColor: border,
                color: text,
                backgroundColor: background,
              },
            ]}
            placeholder={field.placeholder}
            value={field.value}
            onChangeText={field.setValue}
            placeholderTextColor={border}
            autoCapitalize="none"
            autoCorrect={false}
            keyboardType={field.keyboardType || "default"}
            returnKeyType="done"
          />
        ))}

        <ThemedButton
          title={submitting ? "Verifying..." : "Verify"}
          onPress={submitting ? undefined : handleVerify}
          disabled={submitting}
          testID="verify-button"
        />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
    paddingBottom: 40,
  },
  title: {
    textAlign: "center",
    marginBottom: 20,
  },
  label: {
    marginBottom: 5,
  },
  pickerWrapper: {
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 15,
    overflow: "hidden",
    zIndex: Platform.OS === "ios" ? 999 : 1,
  },
  picker: {
    height: 50,
    width: "100%",
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 16,
    fontSize: 16,
    marginBottom: 15,
  },
});
