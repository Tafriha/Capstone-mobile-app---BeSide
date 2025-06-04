import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Modal,
  StyleSheet,
  Pressable,
  Alert,
  Platform,
  Image,
} from "react-native";
import { Camera } from "expo-camera";
import * as ImagePicker from "expo-image-picker";
import { ThemedButton } from "@/components/ThemedButton";

export default function PhotoUploadModal({ visible, onClose, onSubmit }) {
  const [hasPermission, setHasPermission] = useState(null);
  const [photo, setPhoto] = useState(null);

  useEffect(() => {
    (async () => {
      const cameraStatus = await Camera.requestCameraPermissionsAsync();
      setHasPermission(cameraStatus.status === "granted");
    })();
  }, []);

  const takePhoto = async () => {
    if (!hasPermission) {
      Alert.alert(
        "Permission Denied",
        "Camera access is required to take a photo."
      );
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: false,
      quality: 0.5,
    });

    if (!result.canceled && result.assets) {
      setPhoto(result.assets[0].uri);
    }
  };

  const handleSubmit = async () => {
    if (!photo) {
      Alert.alert("Error", "Please take a photo before proceeding.");
      return;
    }

    try {
      onSubmit(photo);
      setPhoto(null);
    } catch (error) {
      console.error("Error:", error);
      Alert.alert(
        "Error",
        "Failed to process photo. Please try again."
      );
    }
  };

  if (hasPermission === null) {
    return <View />;
  }
  if (hasPermission === false) {
    return (
      <Modal visible={visible} animationType="slide" transparent>
        <View style={styles.overlay}>
          <View style={styles.box}>
            <Text style={styles.title}>Camera Access Required</Text>
            <Text style={styles.label}>
              Please grant camera permissions in settings.
            </Text>
            <Pressable onPress={onClose} style={{ marginTop: 12 }}>
              <Text style={{ color: "#aaa", textAlign: "center" }}>Cancel</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    );
  }

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.overlay}>
        <View style={styles.box}>
          <Text style={styles.title}>Upload a Selfie</Text>
          <Text style={styles.label}>
            Take a real-time photo to verify your identity for this trip.
          </Text>

          {photo ? (
            <Image source={{ uri: photo }} style={styles.preview} />
          ) : (
            <View style={styles.placeholder}>
              <Text style={styles.placeholderText}>No photo taken</Text>
            </View>
          )}

          <ThemedButton
            title="Take Photo"
            onPress={takePhoto}
            style={styles.button}
          />
          <ThemedButton
            title="Upload & Continue"
            onPress={handleSubmit}
            disabled={!photo}
            style={styles.button}
          />

          <Pressable onPress={onClose} style={{ marginTop: 12 }}>
            <Text style={{ color: "#aaa", textAlign: "center" }}>Cancel</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.3)",
    justifyContent: "center",
    alignItems: "center",
  },
  box: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 12,
    width: "90%",
    alignItems: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 12,
    textAlign: "center",
  },
  label: {
    fontSize: 16,
    marginBottom: 16,
    textAlign: "center",
  },
  preview: {
    width: 200,
    height: 200,
    borderRadius: 10,
    marginBottom: 16,
  },
  placeholder: {
    width: 200,
    height: 200,
    borderRadius: 10,
    backgroundColor: "#eee",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  placeholderText: {
    color: "#666",
  },
  button: {
    marginVertical: 8,
    width: "80%",
  },
});
