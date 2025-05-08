import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
  ActivityIndicator,
  ScrollView,
  Platform,
  KeyboardAvoidingView,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
const API_BASE_URL = "http://10.0.2.2:5001/api/v1/user";

export default function ProfileScreen() {
  const [profile, setProfile] = useState(null);
  const [email, setEmail] = useState("");
  const [mobileNo, setMobileNo] = useState("");
  const [photo, setPhoto] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    const token = await AsyncStorage.getItem("token");
    console.log("Token fetched:", token);

    if (!token) {
      Alert.alert("Error", "No token found. Please login again.");
      router.replace("/login");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/profile`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const text = await res.text();
      console.log("Response Status:", res.status);
      console.log("Response Body:", text);

      const data = JSON.parse(text);

      if (res.ok) {
        const user = data.data.user;
        setProfile(user);
        setEmail(user.email);
        setMobileNo(user.mobileNo);
        setPhoto(user.profilePhoto?.url);
      } else {
        Alert.alert("Error", data.message || "Failed to load profile.");
      }
    } catch (error) {
      console.error("Fetch error:", error);
      Alert.alert("Error", "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: [ImagePicker.MediaType.Image],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5,
    });

    if (!result.cancelled) {
      const token = await AsyncStorage.getItem("token");
      const formData = new FormData();
      formData.append("file", {
        uri: result.assets[0].uri,
        name: "profile.jpg",
        type: "image/jpeg",
      });

      try {
        const response = await fetch(`${API_BASE_URL}/upload-profile-photo`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
          body: formData,
        });

        const data = await response.json();
        if (response.ok) {
          setPhoto(data.data.user.profilePhoto.url);
          Alert.alert("Success", "Photo updated!");
        } else {
          console.error("Upload failed:", data);
          Alert.alert("Error", data.message || "Upload failed.");
        }
      } catch (error) {
        console.error("Upload error:", error);
        Alert.alert("Error", "Upload failed.");
      }
    }
  };

  const handleSave = async () => {
    if (!email || !mobileNo) {
      Alert.alert(
        "Validation Error",
        "Email and Mobile Number cannot be empty."
      );
      return;
    }

    const token = await AsyncStorage.getItem("token");

    try {
      const res = await fetch(`${API_BASE_URL}/profile`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, mobileNo }),
      });

      const data = await res.json();
      if (res.ok) {
        Alert.alert("Success", "Profile updated!");
        fetchProfile();
      } else {
        console.error("Update error:", data);
        Alert.alert("Error", data.message || "Update failed.");
      }
    } catch (error) {
      console.error("Save error:", error);
      Alert.alert("Error", "Update failed.");
    }
  };

  if (loading || !profile) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#9B5377" />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.container}>
          <TouchableOpacity onPress={pickImage}>
            <Image
              source={{ uri: photo || "https://via.placeholder.com/150" }}
              style={styles.avatar}
            />
            <Text style={styles.uploadText}>Change Photo</Text>
          </TouchableOpacity>

          <Text style={styles.label}>Username</Text>
          <TextInput
            style={styles.input}
            value={profile.userName}
            editable={false}
          />

          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            value={email}
            onChangeText={setEmail}
          />

          <Text style={styles.label}>Mobile Number</Text>
          <TextInput
            style={styles.input}
            value={mobileNo}
            onChangeText={setMobileNo}
          />

          <Text style={styles.label}>User ID</Text>
          <TextInput
            style={styles.input}
            value={profile._id}
            editable={false}
          />

          <Text style={styles.label}>Account Status</Text>
          <TextInput
            style={styles.input}
            value={profile.accountStatus}
            editable={false}
          />

          <Text style={styles.label}>Verified?</Text>
          <TextInput
            style={styles.input}
            value={profile.isVerified ? "Yes" : "No"}
            editable={false}
          />

          <Text style={styles.label}>Consent Given?</Text>
          <TextInput
            style={styles.input}
            value={profile.consentGiven ? "Yes" : "No"}
            editable={false}
          />

          <Text style={styles.label}>Availability</Text>
          <TextInput
            style={styles.input}
            value={profile.availability ? "Yes" : "No"}
            editable={false}
          />

          <Text style={styles.label}>Registered On</Text>
          <TextInput
            style={styles.input}
            value={new Date(profile.createdDate).toLocaleDateString()}
            editable={false}
          />

          <TouchableOpacity style={styles.button} onPress={handleSave}>
            <Text style={styles.buttonText}>Save Changes</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    flexGrow: 1,
  },
  container: {
    padding: 20,
    backgroundColor: "#fff",
    flexGrow: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    alignSelf: "center",
    marginBottom: 10,
  },
  uploadText: {
    textAlign: "center",
    color: "#9B5377",
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 6,
    color: "#333",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 12,
    borderRadius: 8,
    marginBottom: 20,
    color: "#333",
  },
  button: {
    backgroundColor: "#9B5377",
    paddingVertical: 14,
    borderRadius: 25,
    alignItems: "center",
    marginTop: 10,
    marginBottom: 30,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});
