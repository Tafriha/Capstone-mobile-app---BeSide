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
import { MaterialIcons } from "@expo/vector-icons";

const API_BASE_URL = "http://10.0.2.2:5000/api/v1/user";

export default function ProfileScreen() {
  const [profile, setProfile] = useState(null);
  const [email, setEmail] = useState("");
  const [mobileNo, setMobileNo] = useState("");
  const [photo, setPhoto] = useState(null);
  const [address, setAddress] = useState({});
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  const border = useThemeColor({}, "primary");
  const background = useThemeColor({}, "background");
  const text = useThemeColor({}, "text");
  const accent = useThemeColor({}, "secondary");
  const surface = useThemeColor({}, "surface");

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
        setAddress(user.address || {});
      } else {
        Alert.alert("Error", data.message || "Failed to load profile.");
      }
    } catch {
      Alert.alert("Error", "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const pickImage = async () => {
    const cameraPerm = await ImagePicker.requestCameraPermissionsAsync();
    const galleryPerm = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (cameraPerm.status !== "granted" || galleryPerm.status !== "granted") {
      Alert.alert("Permission Required", "Camera and gallery access required.");
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
    if (!result.canceled && result.assets.length > 0) {
      const selected = result.assets[0];
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
          setPhoto(data.data.user.profilePhoto.url);
          Alert.alert("Success", "Photo updated!");
        } else {
          Alert.alert("Error", data.message || "Upload failed.");
        }
      } catch {
        Alert.alert("Error", "Upload failed.");
      }
    }
  };

  const handleSave = async () => {
    if (!email || !mobileNo) {
      Alert.alert("Validation Error", "Email and Mobile Number cannot be empty.");
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
        body: JSON.stringify({ email, mobileNo, address }),
      });
      const data = await res.json();
      if (res.ok) {
        Alert.alert("Success", "Profile updated!", [
          { text: "OK", onPress: () => router.replace("/home") },
        ]);
      } else {
        Alert.alert("Error", data.message || "Update failed.");
      }
    } catch {
      Alert.alert("Error", "Something went wrong while updating profile.");
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
          <TouchableOpacity onPress={() => setModalVisible(true)}>
            <Image
              source={
                photo && photo.startsWith("http")
                  ? { uri: photo }
                  : require("@/assets/images/placeholder2.jpg")
              }
              style={styles.avatar}
            />
          </TouchableOpacity>
          <ThemedText type="link" style={styles.uploadText} onPress={pickImage}>
            Change Photo
          </ThemedText>

          {[{ label: "Username", value: profile.userName, editable: false },
            { label: "Email", value: email, onChangeText: setEmail },
            { label: "Mobile Number", value: mobileNo, onChangeText: setMobileNo },
            { label: "User ID", value: profile.userId || profile._id, editable: false },
            { label: "Registered On", value: new Date(profile.createdDate).toLocaleDateString(), editable: false },
          ].map((field, idx) => (
            <View key={idx}>
              <ThemedText type="defaultSemiBold" style={styles.label}>{field.label}</ThemedText>
              <TextInput
                style={[styles.input, { borderColor: border, color: text }]}
                value={field.value}
                onChangeText={field.onChangeText}
                editable={field.editable !== false}
              />
            </View>
          ))}

          <View style={styles.addressGroup}>
            <View style={styles.addressBox}>
              <ThemedText style={styles.label}>Country</ThemedText>
              <TextInput
                style={styles.input}
                value={address.country || ""}
                onChangeText={(text) => setAddress({ ...address, country: text })}
              />
            </View>
            <View style={styles.addressBox}>
              <ThemedText style={styles.label}>State</ThemedText>
              <TextInput
                style={styles.input}
                value={address.state || ""}
                onChangeText={(text) => setAddress({ ...address, state: text })}
              />
            </View>
          </View>

          <View style={styles.addressGroup}>
            <View style={styles.addressBox}>
              <ThemedText style={styles.label}>City</ThemedText>
              <TextInput
                style={styles.input}
                value={address.city || ""}
                onChangeText={(text) => setAddress({ ...address, city: text })}
              />
            </View>
            <View style={styles.addressBox}>
              <ThemedText style={styles.label}>Postal Code</ThemedText>
              <TextInput
                style={styles.input}
                value={address.postalCode || ""}
                onChangeText={(text) => setAddress({ ...address, postalCode: text })}
              />
            </View>
          </View>

          <View style={styles.addressGroup}>
            <View style={styles.addressBox}>
              <ThemedText style={styles.label}>Country Code</ThemedText>
              <TextInput
                style={styles.input}
                value={address.countryCode || ""}
                onChangeText={(text) => setAddress({ ...address, countryCode: text })}
              />
            </View>
          </View>

          <ThemedButton title="Save Changes" onPress={handleSave} style={styles.saveBtn} />
        </View>

        <Modal
          visible={modalVisible}
          transparent
          animationType="fade"
          onRequestClose={() => setModalVisible(false)}
        >
          <TouchableOpacity
            style={styles.modalBackground}
            onPress={() => setModalVisible(false)}
          >
            <Image
              source={{ uri: photo }}
              style={styles.fullImage}
              resizeMode="contain"
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
    color: "#000",
  },
  saveBtn: {
    marginTop: 20,
    marginBottom: 30,
  },
  addressGroup: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 8,
  },
  addressBox: {
    flex: 1,
  },
});
