import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Dimensions,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import MapView, { Marker } from "react-native-maps";

const { width } = Dimensions.get("window");

export default function HomeScreen() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [menuVisible, setMenuVisible] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    const focusListener = router.addListener("focus", async () => {
      const stored = await AsyncStorage.getItem("user");
      if (stored) {
        setUser(JSON.parse(stored));
      } else {
        router.replace("/login"); // if no user, go to login
      }
    });
  
    return () => {
      focusListener.remove();
    };
  }, [router]);
  

  const handleLogout = async () => {
    await AsyncStorage.removeItem("user");
    router.replace("/login");
  };

  const handleCompanion = () => {
    if (user?.isVerified) {
      setModalVisible(true); // Can show success modal later if needed
    } else {
      setModalVisible(true); // Show verification modal
    }
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
            <TouchableOpacity style={styles.menuItem} onPress={() => {}}>
              <Text style={styles.menuText}>Account</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.menuItem} onPress={handleLogout}>
              <Text style={[styles.menuText, { color: "red" }]}>Logout</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Custom Pop-up Modal */}
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
        <MapView
          style={styles.map}
          initialRegion={{
            latitude: -37.8136,
            longitude: 144.9631,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          }}
        >
          <Marker
            coordinate={{ latitude: -37.8136, longitude: 144.9631 }}
            title="You are here"
            pinColor="#9B5377"
          />
        </MapView>
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
    backgroundColor: "#fff",
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
    fontSize: 24,
    fontWeight: "bold",
    color: "#9B5377",
  },
  menuIcon: {
    fontSize: 26,
    color: "#9B5377",
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
    backgroundColor: "#fff",
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
    fontSize: 16,
    color: "#333",
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
    backgroundColor: "#9B5377",
    paddingVertical: 14,
    borderRadius: 25,
    alignItems: "center",
    marginBottom: 30,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  popupContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  popupBox: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 25,
    alignItems: "center",
    width: width * 0.8,
  },
  popupTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#9B5377",
    marginBottom: 10,
  },
  popupMessage: {
    fontSize: 16,
    color: "#333",
    textAlign: "center",
    marginBottom: 20,
  },
  verifyButton: {
    backgroundColor: "#9B5377",
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 20,
  },
  verifyButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});