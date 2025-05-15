import React, { useEffect, useState } from "react";
import { View, TextInput, StyleSheet, Alert, Platform } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Picker } from "@react-native-picker/picker";
import { router } from "expo-router";
import { useThemeColor } from "@/hooks/useThemeColor";
import { ThemedText } from "@/components/ThemedText";
import { ThemedButton } from "@/components/ThemedButton";

export default function VerifyScreen() {
  const [userName, setUserName] = useState(null);
  const [verificationIdType, setVerificationIdType] = useState("wwcc");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [number, setNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [dob, setDob] = useState("");

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

  const handleVerify = async () => {
    if (!userName) {
      Alert.alert("Error", "User is not logged in.");
      return;
    }

    const payload = {
      userName,
      verificationIdType,
      firstName,
      lastName,
      number,
      expiry,
      dob,
    };

    try {
      const res = await fetch("http://10.0.2.2:5001/api/v1/auth/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (res.ok && data?.data?.user) {
        const updatedUser = data.data.user;
        updatedUser.isVerified = true;
        await AsyncStorage.setItem("user", JSON.stringify(updatedUser));
        Alert.alert("Success", "Verification completed!");
        router.replace("/home");
      } else {
        Alert.alert("Error", data.message || "Verification failed");
      }
    } catch (err) {
      Alert.alert("Error", "Something went wrong. Please try again.");
      console.error(err);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: background }]}>
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
        },
        {
          placeholder: "Date of Birth (DD-MM-YYYY)",
          value: dob,
          setValue: setDob,
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
        />
      ))}

      <ThemedButton title="Verify" onPress={handleVerify} />
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
