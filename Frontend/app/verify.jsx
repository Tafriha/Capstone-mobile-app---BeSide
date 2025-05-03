import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Platform,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Picker } from "@react-native-picker/picker";
import { router } from "expo-router";

export default function VerifyScreen() {
  const [userName, setUserName] = useState(null); // ✅ dynamic userName
  const [verificationIdType, setVerificationIdType] = useState("wwcc");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [number, setNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [dob, setDob] = useState("");

  useEffect(() => {
    const loadUser = async () => {
      try {
        const storedUser = await AsyncStorage.getItem("user");
        if (storedUser) {
          const parsedUser = JSON.parse(storedUser);
          setUserName(parsedUser.userName); // ✅ grab from stored object
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
      const res = await fetch("http://10.0.2.2:5000/api/v1/auth/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (res.ok) {
        // Update stored user with isVerified = true
        const storedUser = await AsyncStorage.getItem("user");
        const parsedUser = JSON.parse(storedUser);
        parsedUser.isVerified = true;
        await AsyncStorage.setItem("user", JSON.stringify(data.data.user));
      
        Alert.alert("Success", "Verification completed!");
        router.replace("/home");
      }
      
       else {
        Alert.alert("Error", data.message || "Verification failed");
      }
    } catch (err) {
      Alert.alert("Error", "Something went wrong. Please try again.");
      console.error(err);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Verify Identity</Text>

      <Text style={styles.label}>ID Type</Text>
      <View style={styles.pickerWrapper}>
        <Picker
          selectedValue={verificationIdType}
          onValueChange={(itemValue) => setVerificationIdType(itemValue)}
          style={styles.picker}
        >
          <Picker.Item label="WWCC" value="wwcc" />
          <Picker.Item label="License" value="license" />
        </Picker>
      </View>

      <TextInput
        style={styles.input}
        placeholder="First Name"
        value={firstName}
        onChangeText={setFirstName}
        placeholderTextColor="#aaa"
      />
      <TextInput
        style={styles.input}
        placeholder="Last Name"
        value={lastName}
        onChangeText={setLastName}
        placeholderTextColor="#aaa"
      />
      <TextInput
        style={styles.input}
        placeholder="ID Number"
        value={number}
        onChangeText={setNumber}
        placeholderTextColor="#aaa"
      />
      <TextInput
        style={styles.input}
        placeholder="Expiry Date (DD-MM-YYYY)"
        value={expiry}
        onChangeText={setExpiry}
        placeholderTextColor="#aaa"
      />
      <TextInput
        style={styles.input}
        placeholder="Date of Birth (DD-MM-YYYY)"
        value={dob}
        onChangeText={setDob}
        placeholderTextColor="#aaa"
      />

      <TouchableOpacity style={styles.button} onPress={handleVerify}>
        <Text style={styles.buttonText}>Verify</Text>
      </TouchableOpacity>
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
    fontSize: 28,
    fontWeight: "bold",
    color: "#9B5377",
    marginBottom: 20,
    textAlign: "center",
  },
  label: {
    color: "#9B5377",
    fontWeight: "bold",
    marginBottom: 5,
  },
  pickerWrapper: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    marginBottom: 15,
    backgroundColor: "#f9f9f9",
    overflow: "hidden",
    zIndex: Platform.OS === "ios" ? 999 : 1,
  },
  picker: {
    height: 50,
    width: "100%",
    color: "#333",
  },
  input: {
    height: 50,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 16,
    fontSize: 16,
    marginBottom: 15,
    color: "#333",
    backgroundColor: "#f9f9f9",
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
});