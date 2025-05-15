import React, { useState, useEffect } from "react";
import {
  View,
  TextInput,
  StyleSheet,
  Image,
  Alert,
  ActivityIndicator,
  ScrollView,
  Platform,
  KeyboardAvoidingView,
  TouchableOpacity,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { ThemedText } from "@/components/ThemedText";
import { ThemedButton } from "@/components/ThemedButton";
import { useThemeColor } from "@/hooks/useThemeColor";
import { Typography } from "@/constants/Typography";
const API_BASE_URL = "http://10.0.2.2:5000/api/v1/user";

export default function ProfileScreen() {
  const [profile, setProfile] = useState(null);
  const [email, setEmail] = useState("");
  const [mobileNo, setMobileNo] = useState("");
  const [photo, setPhoto] = useState(null);
  const [loading, setLoading] = useState(false);

  const border = useThemeColor({}, "primary");
  const background = useThemeColor({}, "background");
  const text = useThemeColor({}, "text");
  const accent = useThemeColor({}, "secondary");

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    const token = await AsyncStorage.getItem("token");
    if (!token) {
      Alert.alert("Error", "No token found. Please login again.");
      router.replace("/login");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
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
    if (!result.canceled) {
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
          Alert.alert("Error", data.message || "Upload failed.");
        }
      } catch (error) {
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
        Alert.alert("Error", data.message || "Update failed.");
      }
    } catch (error) {
      Alert.alert("Error", "Update failed.");
    }
  };

  if (loading || !profile) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={accent} />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={[styles.container, { background }]}>
          <TouchableOpacity onPress={pickImage}>
            <Image
              source={{ uri: photo || "https://via.placeholder.com/150" }}
              style={styles.avatar}
            />
            <ThemedText type="link" style={styles.uploadText}>
              Change Photo
            </ThemedText>
          </TouchableOpacity>

          {[
            { label: "Username", value: profile.userName, editable: false },
            { label: "Email", value: email, onChangeText: setEmail },
            {
              label: "Mobile Number",
              value: mobileNo,
              onChangeText: setMobileNo,
            },
            { label: "User ID", value: profile._id, editable: false },
            {
              label: "Account Status",
              value: profile.accountStatus,
              editable: false,
            },
            {
              label: "Verified?",
              value: profile.isVerified ? "Yes" : "No",
              editable: false,
            },
            {
              label: "Consent Given?",
              value: profile.consentGiven ? "Yes" : "No",
              editable: false,
            },
            {
              label: "Availability",
              value: profile.availability ? "Yes" : "No",
              editable: false,
            },
            {
              label: "Registered On",
              value: new Date(profile.createdDate).toLocaleDateString(),
              editable: false,
            },
          ].map((field, idx) => (
            <View key={idx}>
              <ThemedText type="defaultSemiBold" style={styles.label}>
                {field.label}
              </ThemedText>
              <TextInput
                style={[styles.input, { borderColor: border, color: text }]}
                value={field.value}
                onChangeText={field.onChangeText}
                editable={field.editable !== false}
              />
            </View>
          ))}

          <ThemedButton
            title="Save Changes"
            onPress={handleSave}
            style={styles.saveBtn}
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  scrollContent: { flexGrow: 1 },
  container: { flexGrow: 1, padding: 20 },
  loadingContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    alignSelf: "center",
    marginBottom: 10,
  },
  uploadText: {
    textAlign: "center",
    fontFamily: "SpaceMono",
    marginBottom: 20,
  },
  label: {
    marginBottom: 6,
    marginTop: 12,
  },
  input: {
    borderWidth: 1,
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
  },
  saveBtn: {
    marginTop: 20,
    marginBottom: 30,
  },
});
