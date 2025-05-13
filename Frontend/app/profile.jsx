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
  Modal,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { ThemedText } from "@/components/ThemedText";
import { ThemedButton } from "@/components/ThemedButton";
import { useThemeColor } from "@/hooks/useThemeColor";

const API_BASE_URL = "http://10.0.2.2:5001/api/v1/user";

export default function ProfileScreen() {
  const [profile, setProfile] = useState(null);
  const [email, setEmail] = useState("");
  const [mobileNo, setMobileNo] = useState("");
  const [photo, setPhoto] = useState(null);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  const border = useThemeColor({}, "primary");
  const background = useThemeColor({}, "background");
  const text = useThemeColor({}, "text");
  const accent = useThemeColor({}, "secondary");
  const surface = useThemeColor({}, "surface");

  const resolvedPhoto =
    photo && photo.startsWith("http")
      ? photo
      : require("/Users/nameranayat/Documents/GitHub/BeSide-App/Frontend/assets/images/placeholder2.jpg");

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    console.log("Fetching profile data...");

    const token = await AsyncStorage.getItem("token");
    if (!token) {
      Alert.alert("Error", "No token found. Please login again.");
      console.warn("No token found, redirecting to login...");
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
        console.log("Profile loaded successfully");
        console.log("Username:", user.userName);
        console.log("Loaded profile photo URL:", user.profilePhoto?.url);

        setProfile(user);
        setEmail(user.email);
        setMobileNo(user.mobileNo);
        setPhoto(user.profilePhoto?.url);
      } else {
        console.error("Failed to load profile:", data.message);
        Alert.alert("Error", data.message || "Failed to load profile.");
      }
    } catch (error) {
      console.error("Exception while fetching profile:", error);
      Alert.alert("Error", "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const pickImage = async () => {
    console.log("Requesting camera and gallery access...");
    const cameraPerm = await ImagePicker.requestCameraPermissionsAsync();
    const galleryPerm = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (cameraPerm.status !== "granted" || galleryPerm.status !== "granted") {
      console.warn("Permissions denied");
      Alert.alert(
        "Permission Required",
        "We need access to your camera and gallery to update your profile photo."
      );
      return;
    }

    Alert.alert("Select Image Source", "Choose an option", [
      {
        text: "Camera",
        onPress: async () => {
          const result = await ImagePicker.launchCameraAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.5,
          });
          handleImageResult(result);
        },
      },
      {
        text: "Gallery",
        onPress: async () => {
          const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.5,
          });
          handleImageResult(result);
        },
      },
      { text: "Cancel", style: "cancel" },
    ]);
  };

  const handleImageResult = async (result) => {
    if (!result.canceled && result.assets && result.assets.length > 0) {
      const selected = result.assets[0];
      console.log("Selected image URI:", selected.uri);

      const token = await AsyncStorage.getItem("token");
      const formData = new FormData();
      formData.append("photo", {
        uri: selected.uri,
        name: "profile.jpg",
        type: "image/jpeg",
      });

      try {
        const response = await fetch(`${API_BASE_URL}/profile-photo`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
          body: formData,
        });

        const data = await response.json();
        if (response.ok) {
          console.log(
            "Upload successful. New photo URL:",
            data.data.user.profilePhoto.url
          );
          setPhoto(data.data.user.profilePhoto.url);
          Alert.alert("Success", "Photo updated!");
        } else {
          console.error("Upload failed:", data.message);
          Alert.alert("Error", data.message || "Upload failed.");
        }
      } catch (error) {
        console.error("Upload exception:", error);
        Alert.alert("Error", "Upload failed.");
      }
    } else {
      console.log("Image picker canceled or returned no assets.");
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
      behavior={Platform.OS === "android" ? "padding" : undefined}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={[styles.card, { backgroundColor: surface }]}>
          <TouchableOpacity
            onPress={() => {
              console.log("DEBUG: Avatar clicked");
              console.log("DEBUG: Current photo URL:", resolvedPhoto);
              setModalVisible(true);
            }}
          >
            <Image
              source={{ uri: resolvedPhoto }}
              style={styles.avatar}
              onLoad={() => console.log("DEBUG: Avatar image loaded")}
              onError={(e) =>
                console.log(
                  "DEBUG: Avatar image failed to load",
                  e.nativeEvent.error
                )
              }
            />
          </TouchableOpacity>
          <ThemedText type="link" style={styles.uploadText} onPress={pickImage}>
            Change Photo
          </ThemedText>

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

        <Modal
          visible={modalVisible}
          transparent={true}
          animationType="fade"
          onRequestClose={() => {
            console.log("DEBUG: Modal closed");
            setModalVisible(false);
          }}
        >
          <TouchableOpacity
            style={styles.modalBackground}
            onPress={() => {
              console.log("DEBUG: Modal background clicked");
              setModalVisible(false);
            }}
          >
            <Image
              source={{ uri: resolvedPhoto }}
              style={styles.fullImage}
              resizeMode="contain"
              onLoad={() => console.log("DEBUG: Full-size image loaded")}
              onError={(e) =>
                console.log(
                  "DEBUG: Full-size image failed to load",
                  e.nativeEvent.error
                )
              }
            />
          </TouchableOpacity>
        </Modal>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  scrollContent: { flexGrow: 1, padding: 16 },
  loadingContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  card: {
    borderRadius: 16,
    padding: 20,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    alignSelf: "center",
    marginBottom: 10,
  },
  fullImage: {
    width: "100%",
    height: "100%",
  },
  modalBackground: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.9)",
    justifyContent: "center",
    alignItems: "center",
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
