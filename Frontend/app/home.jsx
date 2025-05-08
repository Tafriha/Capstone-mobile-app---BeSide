import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Dimensions,
  Platform,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import MapView, { Marker, Callout } from "react-native-maps";
import { useFocusEffect } from "@react-navigation/native";
import { Typography } from "../constants/Typography";
import { Colors } from "../constants/Colors";
import * as Location from "expo-location";

const { width } = Dimensions.get("window");

const customMapStyle = [
  {
    elementType: "geometry",
    stylers: [{ color: "#f5f5f5" }],
  },
  {
    elementType: "labels.text.fill",
    stylers: [{ color: "#616161" }],
  },
  {
    featureType: "water",
    stylers: [{ color: "#c9c9c9" }],
  },
];

export default function HomeScreen() {
  const router = useRouter();
  
  const [user, setUser] = useState(null);
  const [menuVisible, setMenuVisible] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [currentLocation, setCurrentLocation] = useState(null);

  useFocusEffect(
    useCallback(() => {
      const checkUserAndLocation = async () => {
        const stored = await AsyncStorage.getItem("user");
        if (stored) {
          setUser(JSON.parse(stored));
        } else {
          router.replace("/login");
        }

        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
          alert("Permission to access location was denied");
          return;
        }

        try {
          const location = await Location.getCurrentPositionAsync({
            accuracy: Location.Accuracy.Highest,
          });

          const coords = {
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          };

          setCurrentLocation(coords);
        } catch (error) {
          setCurrentLocation({
            latitude: -37.8136,
            longitude: 144.9631,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          });
        }
      };

      checkUserAndLocation();
    }, [])
  );

  const handleLogout = async () => {
    await AsyncStorage.removeItem("user");
    router.replace("/login");
  };

  const handleCompanion = () => {
    setModalVisible(true);
  };

  const handleVerifyRedirect = () => {
    setModalVisible(false);
    router.push("/verify");
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Image
          source={require("../assets/images/logo.png")}
          style={styles.logo}
        />
        <Text style={styles.headerTitle}>Home</Text>
        <TouchableOpacity onPress={() => setMenuVisible(true)}>
          <Text style={styles.menuIcon}>☰</Text>
        </TouchableOpacity>
      </View>

      {/* Menu Modal */}
      <Modal
        transparent
        animationType="fade"
        visible={menuVisible}
        onRequestClose={() => setMenuVisible(false)}
      >
        <TouchableOpacity
          style={styles.menuOverlay}
          onPress={() => setMenuVisible(false)}
        >
          <View style={styles.menuContainer}>
            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => {
                setMenuVisible(false);
                router.push("/profile");
              }}
            >
              <Text style={styles.menuText}>Account</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.menuItem} onPress={handleLogout}>
              <Text style={[styles.menuText, { color: Colors.light.danger }]}>
                Logout
              </Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Verification Modal */}
      <Modal
        animationType="slide"
        transparent
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.popupContainer}>
          <View style={styles.popupBox}>
            <Text style={styles.popupTitle}>Oops!</Text>
            <Text style={styles.popupMessage}>
              It looks like you're not verified yet.
            </Text>
            <TouchableOpacity
              style={styles.verifyButton}
              onPress={handleVerifyRedirect}
            >
              <Text style={styles.verifyButtonText}>Verify Now</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Map View */}
      <View style={styles.mapContainer}>
        {currentLocation && (
          <MapView
            customMapStyle={customMapStyle}
            mapType="standard"
            style={styles.map}
            showsUserLocation={true}
            followsUserLocation={true}
            region={currentLocation}
          >
            <Marker coordinate={currentLocation}>
              <Callout>
                <View style={{ width: 150 }}>
                  <Text style={{ fontWeight: "bold" }}>You are here</Text>
                  <Text>Live location from device</Text>
                </View>
              </Callout>
            </Marker>
          </MapView>
        )}
      </View>

      {/* Find Companion Button */}
      <TouchableOpacity style={styles.button} onPress={handleCompanion}>
        <Text style={styles.buttonText}>Find a Companion</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
    paddingTop: 50,
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  logo: {
    width: 40,
    height: 40,
  },
  headerTitle: {
    ...Typography.heading,
    color: Colors.light.primary,
  },
  menuIcon: {
    fontSize: 26,
    color: Colors.light.text,
  },
  menuOverlay: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "flex-end",
    paddingTop: 60,
    paddingRight: 20,
    backgroundColor: "rgba(0,0,0,0.2)",
  },
  menuContainer: {
    width: 150,
    backgroundColor: Colors.light.surface,
    borderRadius: 10,
    paddingVertical: 10,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 5,
  },
  menuItem: {
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  menuText: {
    ...Typography.body,
    color: Colors.light.text,
  },
  mapContainer: {
    flex: 1,
    borderRadius: 15,
    overflow: "hidden",
    marginBottom: 20,
  },
  map: {
    width: "100%",
    height: "100%",
  },
  button: {
    backgroundColor: Colors.light.primary,
    paddingVertical: 14,
    borderRadius: 25,
    alignItems: "center",
    marginBottom: 30,
  },
  buttonText: {
    ...Typography.body,
    color: "#fff",
    fontWeight: "bold",
  },
  popupContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  popupBox: {
    backgroundColor: Colors.light.surface,
    borderRadius: 10,
    padding: 25,
    alignItems: "center",
    width: width * 0.8,
  },
  popupTitle: {
    ...Typography.subheading,
    color: Colors.light.primary,
    marginBottom: 10,
  },
  popupMessage: {
    ...Typography.body,
    color: Colors.light.text,
    textAlign: "center",
    marginBottom: 20,
  },
  verifyButton: {
    backgroundColor: Colors.light.accent,
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 20,
  },
  verifyButtonText: {
    ...Typography.body,
    color: "#fff",
    fontWeight: "bold",
  },
});
