import { useState, useCallback, useRef, useEffect } from "react";
import {
  View,
  StyleSheet,
  Modal,
  Dimensions,
  TouchableOpacity,
  Platform,
  Alert,
  Image,
  Animated,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import MapView, {
  Marker,
  Callout,
  PROVIDER_GOOGLE,
  Circle,
  Polyline,
} from "react-native-maps";
import { useFocusEffect } from "@react-navigation/native";
import * as Location from "expo-location";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import polyline from "@mapbox/polyline";
import { Colors } from "@/constants/Colors";
import { ThemedText } from "@/components/ThemedText";
import { ThemedButton } from "@/components/ThemedButton";
import ConsentModal from "./ConsentModal";
import CompanionPreferencesModal from "./CompanionPreferencesModal";
import PhotoUploadModal from "./PhotoUploadModal";

const { width } = Dimensions.get("window");

// Import the placeholder image
const placeholderImage = require("../assets/images/placeholder2.jpg");

const customMapStyle = [
  {
    featureType: "all",
    elementType: "geometry",
    stylers: [{ visibility: "on" }],
  },
  {
    featureType: "all",
    elementType: "labels.text.fill",
  },
  {
    featureType: "all",
    elementType: "labels.text.stroke",
    stylers: [{ lightness: "-37" }],
  },
  {
    featureType: "all",
    elementType: "labels.icon",
    stylers: [{ visibility: "on" }],
  },
  {
    featureType: "administrative",
    elementType: "geometry.fill",
    stylers: [{ color: "#fefefe" }, { lightness: "20" }],
  },
  {
    featureType: "administrative",
    elementType: "geometry.stroke",
    stylers: [{ color: "#fefefe" }, { lightness: "17" }, { weight: "1.2" }],
  },
  {
    featureType: "landscape",
    elementType: "geometry",
    stylers: [{ color: "#f5f5f5" }, { lightness: "20" }],
  },
  {
    featureType: "poi",
    elementType: "geometry",
    stylers: [{ color: "#f5f5f5" }, { lightness: "21" }],
  },
  {
    featureType: "poi.park",
    elementType: "geometry",
    stylers: [{ color: "#dedede" }, { lightness: "21" }],
  },
  {
    featureType: "road.highway",
    elementType: "geometry.fill",
    stylers: [{ color: "#ffffff" }, { lightness: "17" }],
  },
  {
    featureType: "road.highway",
    elementType: "geometry.stroke",
    stylers: [{ color: "#ffffff" }, { lightness: "29" }, { weight: "0.2" }],
  },
  {
    featureType: "road.arterial",
    elementType: "geometry",
    stylers: [{ color: "#ffffff" }, { lightness: "18" }],
  },
  {
    featureType: "road.local",
    elementType: "geometry",
    stylers: [{ color: "#ffffff" }, { lightness: "16" }],
  },
  {
    featureType: "transit",
    elementType: "geometry",
    stylers: [{ color: "#f2f2f2" }, { lightness: "19" }],
  },
  {
    featureType: "water",
    elementType: "geometry",
    stylers: [{ color: "#e9e9e9" }, { lightness: "17" }],
  },
];

// Hardcoded users for testing (from your code)
const hardcodedUsers = [
  {
    userName: "AliceSmith",
    latitude: -33.8688,
    longitude: 151.2093,
    userImage: placeholderImage,
    genderPreference: "Woman",
  },
  {
    userName: "BobJohnson",
    latitude: -33.865,
    longitude: 151.205,
    userImage: placeholderImage,
    genderPreference: "Man",
  },
  {
    userName: "CharlieNonbinary",
    latitude: -33.872,
    longitude: 151.215,
    userImage: placeholderImage,
    genderPreference: "LGBTQ+",
  },
  {
    userName: "DanaOther",
    latitude: -33.86,
    longitude: 151.2,
    userImage: placeholderImage,
    genderPreference: "Other",
  },
];

export default function HomeScreen() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [menuVisible, setMenuVisible] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [currentLocation, setCurrentLocation] = useState(null);
  const [photoUploadVisible, setPhotoUploadVisible] = useState(false);
  const [consentVisible, setConsentVisible] = useState(false);
  const [preferencesVisible, setPreferencesVisible] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [consent, setConsent] = useState({
    noTouch: false,
    respectful: false,
    safety: false,
  });
  const [photoUrl, setPhotoUrl] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [routeCoordinates, setRouteCoordinates] = useState([]);
  const [dummyUsers, setDummyUsers] = useState([]);
  const [startMarker, setStartMarker] = useState(null);
  const [endMarker, setEndMarker] = useState(null);
  const [nearbyUsers, setNearbyUsers] = useState(0);
  const [searchTimer, setSearchTimer] = useState(null);
  const loadingAnimation = useRef(new Animated.Value(0)).current;
  const mapRef = useRef(null);

  useFocusEffect(
    useCallback(() => {
      let locationSubscription;

      const load = async () => {
        const stored = await AsyncStorage.getItem("user");
        if (stored) {
          setUser(JSON.parse(stored));
        } else {
          router.replace("/login");
        }

        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
          console.log("Location permission denied. Using fallback location.");
          Alert.alert(
            "Location Permission Denied",
            "Please enable location services in your device settings."
          );
          setCurrentLocation({
            latitude: -33.8688,
            longitude: 151.2093,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          });
          return;
        }

        try {
          console.log("Attempting to fetch current location...");
          const location = await Location.getCurrentPositionAsync({
            accuracy: Location.Accuracy.Highest,
            timeout: 10000,
            mayShowUserSettingsDialog: true,
          });
          console.log("Initial location fetched:", location.coords);
          setCurrentLocation({
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          });

          locationSubscription = await Location.watchPositionAsync(
            {
              accuracy: Location.Accuracy.High,
              timeInterval: 5000,
              distanceInterval: 10,
            },
            (newLocation) => {
              console.log("Location updated:", newLocation.coords);
              setCurrentLocation({
                latitude: newLocation.coords.latitude,
                longitude: newLocation.coords.longitude,
                latitudeDelta: 0.01,
                longitudeDelta: 0.01,
              });
            }
          );
        } catch (error) {
          console.error("Error fetching location:", error.message);
          Alert.alert("Location Error", "Using fallback location.");
          setCurrentLocation({
            latitude: -33.8688,
            longitude: 151.2093,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          });
        }
      };

      load();

      return () => {
        if (locationSubscription) {
          locationSubscription.remove();
        }
      };
    }, [])
  );

  useEffect(() => {
    if (isSearching) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(loadingAnimation, {
            toValue: 1,
            duration: 2000,
            useNativeDriver: true,
          }),
          Animated.timing(loadingAnimation, {
            toValue: 0,
            duration: 0,
            useNativeDriver: true,
          }),
        ])
      ).start();
    } else {
      loadingAnimation.setValue(0);
    }
  }, [isSearching]);

  const handleLogout = async () => {
    await AsyncStorage.removeItem("user");
    router.replace("/login");
  };

  const handleFindCompanion = async () => {
    const storedUser = await AsyncStorage.getItem("user");
    if (!storedUser) {
      router.replace("/login");
      return;
    }
    const parsed = JSON.parse(storedUser);
    if (parsed.isVerified) {
      setConsentVisible(true);
    } else {
      setModalVisible(true);
    }
  };

  const handlePhotoSubmit = (url) => {
    setPhotoUrl(url);
    setPhotoUploadVisible(false);
    setPreferencesVisible(true);
  };

  const mapGenderPreference = (frontendPref) => {
    switch (frontendPref) {
      case "male":
        return "Man";
      case "female":
        return "Woman";
      case "nonbinary":
        return "LGBTQ+";
      case "any":
      default:
        return "Other";
    }
  };

  const handlePreferencesSubmit = async (preferences) => {
    console.log("User Preferences:", preferences);
    console.log("Photo URL:", photoUrl);
    setPreferencesVisible(false);

    if (!photoUrl) {
      Alert.alert("Error", "A selfie is required to create a trip.");
      return;
    }

    try {
      const storedUser = await AsyncStorage.getItem("user");
      if (!storedUser) {
        Alert.alert("Error", "User not logged in.");
        router.replace("/login");
        return;
      }

      const user = JSON.parse(storedUser);
      const API_URL =
        Platform.OS === "android"
          ? "http://10.0.2.2:5001"
          : "http://localhost:5001";

      const response = await fetch(
        `${API_URL}/api/v1/trip-request/createTripReq`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
          body: JSON.stringify({
            tripReqId: `REQ-${Date.now()}`,
            user: {
              userId: user._id,
              userName: user.userName,
              userImage: user.userImage || "default.jpg",
            },
            destination: "Placeholder",
            destinationType: "By Walk",
            date: new Date(),
            time: "12:00",
            genderPreference: mapGenderPreference(preferences.gender),
            photoUrl: photoUrl,
            imageVerification: !!photoUrl,
          }),
        }
      );

      const result = await response.json();
      if (result.status === "success") {
        Alert.alert("Success", "Trip created successfully!");
      } else {
        throw new Error(result.message || "Failed to create trip");
      }
    } catch (error) {
      Alert.alert("Error", error.message || "Failed to create trip.");
    }

    try {
      console.log("Received preferences in home screen:");
      console.log("Start coordinates:", preferences.startCoordinates);
      console.log(
        "Destination coordinates:",
        preferences.destinationCoordinates
      );

      setStartMarker(preferences.startCoordinates);
      setEndMarker(preferences.destinationCoordinates);

      const url = `https://maps.googleapis.com/maps/api/directions/json?origin=${preferences.startCoordinates.latitude},${preferences.startCoordinates.longitude}&destination=${preferences.destinationCoordinates.latitude},${preferences.destinationCoordinates.longitude}&mode=walking&key=AIzaSyDgeT00f6FE--jx1AqSBoVpxUB-5CPUX34`;
      const response = await fetch(url);
      const data = await response.json();

      if (data.routes && data.routes[0]) {
        const points = data.routes[0].overview_polyline.points;
        const coords = decodePolyline(points);

        const validCoords = coords.filter(
          (coord) =>
            coord.latitude >= -90 &&
            coord.latitude <= 90 &&
            coord.longitude >= -180 &&
            coord.longitude <= 180
        );
        setRouteCoordinates(validCoords);

        const users = generateDummyUsers(preferences.startCoordinates);
        setDummyUsers(users);
        setNearbyUsers(users.length);

        if (validCoords.length > 0) {
          mapRef.current?.fitToCoordinates(validCoords, {
            edgePadding: { top: 50, right: 50, bottom: 50, left: 50 },
            animated: true,
          });
        }

        startSearching();
      } else {
        Alert.alert("Error", "No route found between the selected locations");
      }
    } catch (error) {
      Alert.alert("Error", "Failed to fetch route information");
    }
  };

  const decodePolyline = (encoded) => {
    return polyline.decode(encoded).map(([latitude, longitude]) => ({
      latitude,
      longitude,
    }));
  };

  const generateDummyUsers = (centerLocation) => {
    const users = [];
    const numUsers = Math.floor(Math.random() * 3) + 2;
    const radius = 0.0045;

    for (let i = 0; i < numUsers; i++) {
      const angle = Math.random() * 2 * Math.PI;
      const distance = Math.random() * radius;
      users.push({
        id: i,
        coordinate: {
          latitude: centerLocation.latitude + distance * Math.cos(angle),
          longitude: centerLocation.longitude + distance * Math.sin(angle),
        },
        name: `User ${i + 1}`,
      });
    }
    return users;
  };

  const startSearching = () => {
    setIsSearching(true);
    const timer = setInterval(() => {
      const newCount = Math.floor(Math.random() * 3) + 2;
      setNearbyUsers(newCount);
    }, 3000);
    setSearchTimer(timer);
  };

  const cancelSearch = () => {
    if (searchTimer) {
      clearInterval(searchTimer);
    }
    setIsSearching(false);
    setNearbyUsers(0);
    setDummyUsers([]);
    setRouteCoordinates([]);
    setStartMarker(null);
    setEndMarker(null);
  };

  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371;
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  const handleSendRequest = async (selectedUser) => {
    if (!consent.noTouch || !consent.respectful || !consent.safety) {
      Alert.alert("Error", "Please complete the consent form first.");
      setConsentVisible(true);
      return;
    }
    if (!photoUrl) {
      Alert.alert("Error", "Please upload a selfie first.");
      setPhotoUploadVisible(true);
      return;
    }

    try {
      const storedUser = await AsyncStorage.getItem("user");
      if (!storedUser) {
        Alert.alert("Error", "User not logged in.");
        router.replace("/login");
        return;
      }

      const user = JSON.parse(storedUser);
      const API_URL =
        Platform.OS === "android"
          ? "http://10.0.2.2:5001"
          : "http://localhost:5001";

      const response = await fetch(
        `${API_URL}/api/v1/trip-request/sendRequest`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
          body: JSON.stringify({
            senderId: user._id,
            receiverId: selectedUser.userName,
            consent: consent,
            preferences: {
              gender: user.genderPreference || "any",
            },
            photoUrl: photoUrl,
          }),
        }
      );

      const result = await response.json();
      if (result.status === "success") {
        Alert.alert("Success", "Request sent to " + selectedUser.userName);
        setSelectedUser(null);
      } else {
        throw new Error(result.message || "Failed to send request");
      }
    } catch (error) {
      Alert.alert("Error", error.message || "Failed to send request.");
    }
  };

  const handleCurrentLocation = () => {
    if (currentLocation) {
      mapRef.current?.animateToRegion(currentLocation, 1000);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.topBar}>
        <ThemedText type="title">BeSide</ThemedText>
        <TouchableOpacity onPress={() => setMenuVisible(true)}>
          <ThemedText type="defaultSemiBold">☰</ThemedText>
        </TouchableOpacity>
      </View>

      <Modal transparent animationType="fade" visible={menuVisible}>
        <TouchableOpacity
          style={styles.menuOverlay}
          onPress={() => setMenuVisible(false)}
        >
          <View style={styles.menuBox}>
            <TouchableOpacity onPress={() => router.push("/profile")}>
              <ThemedText type="defaultSemiBold" style={styles.menuItem}>
                Account
              </ThemedText>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleLogout}>
              <ThemedText
                type="defaultSemiBold"
                style={[styles.menuItem, { color: Colors.light.danger }]}
              >
                Logout
              </ThemedText>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Map */}
      <View style={styles.mapContainer}>
        {currentLocation ? (
          <MapView
            ref={mapRef}
            provider={PROVIDER_GOOGLE}
            customMapStyle={customMapStyle}
            mapType="standard"
            style={styles.map}
            showsUserLocation
            followsUserLocation
            region={currentLocation}
            showsCompass={true}
            showsScale={true}
            showsTraffic={true}
            showsBuildings={true}
            showsIndoors={true}
            showsMyLocationButton={false}
            showsPointsOfInterest={true}
            zoomEnabled={true}
            zoomControlEnabled={true}
            rotateEnabled={true}
            scrollEnabled={true}
            pitchEnabled={true}
            toolbarEnabled={true}
          >
            <Marker coordinate={currentLocation}>
              <Callout>
                <View style={{ width: 140 }}>
                  <ThemedText type="defaultSemiBold">You are here</ThemedText>
                  <ThemedText type="caption">Live GPS location</ThemedText>
                </View>
              </Callout>
            </Marker>

            {/* Start Point Marker */}
            {startMarker && (
              <Marker coordinate={startMarker}>
                <View style={styles.markerContainer}>
                  <MaterialCommunityIcons
                    name="map-marker"
                    size={30}
                    color="#4CAF50"
                  />
                </View>
                <Callout>
                  <View style={{ width: 140 }}>
                    <ThemedText type="defaultSemiBold">Start Point</ThemedText>
                  </View>
                </Callout>
              </Marker>
            )}

            {/* End Point Marker */}
            {endMarker && (
              <Marker coordinate={endMarker}>
                <View style={styles.markerContainer}>
                  <MaterialCommunityIcons
                    name="map-marker"
                    size={30}
                    color="#F44336"
                  />
                </View>
                <Callout>
                  <View style={{ width: 140 }}>
                    <ThemedText type="defaultSemiBold">Destination</ThemedText>
                  </View>
                </Callout>
              </Marker>
            )}

            {/* Route Line */}
            {routeCoordinates.length > 0 && (
              <Polyline
                coordinates={routeCoordinates}
                strokeWidth={4}
                strokeColor="#2196F3"
              />
            )}

            {/* 500m Radius Circle */}
            {startMarker && (
              <Circle
                center={startMarker}
                radius={500}
                strokeColor="rgba(158, 158, 255, 0.5)"
                fillColor="rgba(158, 158, 255, 0.2)"
              />
            )}

            {/* Dummy Users (Team's generated users) */}
            {dummyUsers.map((user) => (
              <Marker key={user.id} coordinate={user.coordinate}>
                <View style={styles.userMarkerContainer}>
                  <MaterialCommunityIcons
                    name="account"
                    size={24}
                    color="#FF5722"
                  />
                </View>
                <Callout>
                  <View style={{ width: 140 }}>
                    <ThemedText type="defaultSemiBold">{user.name}</ThemedText>
                    <ThemedText type="caption">Potential companion</ThemedText>
                  </View>
                </Callout>
              </Marker>
            ))}

            {/* Hardcoded Users (Your existing users) */}
            {hardcodedUsers.map((user, index) => {
              const distance = calculateDistance(
                currentLocation.latitude,
                currentLocation.longitude,
                user.latitude,
                user.longitude
              );
              return (
                <Marker
                  key={index}
                  coordinate={{
                    latitude: user.latitude,
                    longitude: user.longitude,
                  }}
                  title={user.userName}
                  onPress={() => setSelectedUser({ ...user, distance })}
                >
                  <Callout>
                    <View style={{ width: 140 }}>
                      <ThemedText type="defaultSemiBold">
                        {user.userName}
                      </ThemedText>
                      <ThemedText type="caption">
                        Gender: {user.genderPreference}
                      </ThemedText>
                    </View>
                  </Callout>
                </Marker>
              );
            })}
          </MapView>
        ) : (
          <ThemedText type="default">Loading map...</ThemedText>
        )}
      </View>

      {/* Current Location Button (Team's addition) */}
      <TouchableOpacity
        style={styles.currentLocationButton}
        onPress={handleCurrentLocation}
      >
        <Ionicons name="locate" size={24} color={Colors.light.primary} />
      </TouchableOpacity>

      {/* Find Companion Button or Cancel Button (Team's searching UI) */}
      {!isSearching ? (
        <ThemedButton
          title="Find a Companion"
          onPress={handleFindCompanion}
          style={styles.actionButton}
        />
      ) : (
        <View style={styles.searchingContainer}>
          <View style={styles.loadingBarContainer}>
            <Animated.View
              style={[
                styles.loadingBar,
                {
                  transform: [
                    {
                      translateX: loadingAnimation.interpolate({
                        inputRange: [0, 1],
                        outputRange: ["-100%", "100%"],
                      }),
                    },
                  ],
                },
              ]}
            />
          </View>
          <View style={styles.searchingInfo}>
            <ThemedText type="defaultSemiBold">
              Searching for companions...
            </ThemedText>
            <ThemedText type="caption">
              {nearbyUsers > 0
                ? `${nearbyUsers} people found in your area`
                : "Looking for people nearby..."}
            </ThemedText>
          </View>
          <ThemedButton
            title="Cancel Search"
            onPress={cancelSearch}
            style={styles.cancelButton}
          />
        </View>
      )}

      {/* User Card Modal (Your existing feature) */}
      <Modal
        transparent
        animationType="slide"
        visible={!!selectedUser}
        onRequestClose={() => setSelectedUser(null)}
      >
        <View style={styles.popupOverlay}>
          <View style={styles.userCard}>
            {selectedUser?.userImage && (
              <Image
                source={selectedUser.userImage}
                style={styles.userImage}
                resizeMode="cover"
              />
            )}
            <ThemedText type="subtitle">{selectedUser?.userName}</ThemedText>
            <ThemedText type="caption">
              Distance: {(selectedUser?.distance || 0).toFixed(2)} km
            </ThemedText>
            <ThemedText type="caption">
              Gender Preference: {selectedUser?.genderPreference}
            </ThemedText>
            <ThemedButton
              title="View Profile"
              onPress={() =>
                router.push(`/profile?userName=${selectedUser?.userName}`)
              }
              style={styles.cardButton}
            />
            <ThemedButton
              title="Send Request"
              onPress={() => handleSendRequest(selectedUser)}
              style={styles.cardButton}
            />
            <ThemedButton
              title="Close"
              onPress={() => setSelectedUser(null)}
              style={[
                styles.cardButton,
                { backgroundColor: Colors.light.danger },
              ]}
            />
          </View>
        </View>
      </Modal>

      {/* Not Verified Popup */}
      <Modal transparent animationType="slide" visible={modalVisible}>
        <View style={styles.popupOverlay}>
          <View style={styles.popupBox}>
            <ThemedText type="subtitle">Oops!</ThemedText>
            <ThemedText type="default">You're not verified yet.</ThemedText>
            <ThemedButton
              title="Verify Now"
              type="primary"
              onPress={() => {
                setModalVisible(false);
                router.push("/verify");
              }}
              style={styles.verifyButton}
            />
          </View>
        </View>
      </Modal>

      {/* Consent Form Modal */}
      <ConsentModal
        visible={consentVisible}
        onClose={() => setConsentVisible(false)}
        consent={consent}
        setConsent={setConsent}
        onSubmit={() => {
          setConsentVisible(false);
          setPhotoUploadVisible(true);
        }}
      />

      {/* Preferences Modal */}
      <CompanionPreferencesModal
        visible={preferencesVisible}
        onClose={() => setPreferencesVisible(false)}
        onSubmit={handlePreferencesSubmit}
      />

      {/* Photo Upload Modal (Your existing feature) */}
      <PhotoUploadModal
        visible={photoUploadVisible}
        onClose={() => setPhotoUploadVisible(false)}
        onSubmit={handlePhotoSubmit}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  topBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: Colors.light.surface,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0,0,0,0.1)",
  },
  mapContainer: {
    flex: 1,
  },
  map: {
    width: "100%",
    height: "100%",
  },
  currentLocationButton: {
    position: "absolute",
    bottom: 100,
    right: 20,
    backgroundColor: Colors.light.surface,
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  actionButton: {
    position: "absolute",
    bottom: 20,
    left: 20,
    right: 20,
    width: "auto",
  },
  menuOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.3)",
    justifyContent: "flex-start",
    alignItems: "flex-end",
    padding: 20,
  },
  menuBox: {
    backgroundColor: Colors.light.surface,
    borderRadius: 10,
    padding: 12,
    width: 180,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 6,
  },
  menuItem: {
    paddingVertical: 10,
    paddingHorizontal: 10,
  },
  popupOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.4)",
  },
  popupBox: {
    backgroundColor: Colors.light.surface,
    padding: 24,
    borderRadius: 14,
    width: width * 0.8,
    alignItems: "center",
  },
  verifyButton: {
    marginTop: 20,
    width: "80%",
  },
  userCard: {
    backgroundColor: Colors.light.surface,
    padding: 20,
    borderRadius: 14,
    width: width * 0.8,
    alignItems: "center",
  },
  cardButton: {
    marginTop: 10,
    width: "80%",
  },
  userImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 10,
  },
  markerContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  userMarkerContainer: {
    backgroundColor: "white",
    borderRadius: 20,
    padding: 5,
    borderWidth: 2,
    borderColor: "#FF5722",
  },
  searchingContainer: {
    position: "absolute",
    bottom: 20,
    left: 20,
    right: 20,
    backgroundColor: Colors.light.surface,
    borderRadius: 10,
    padding: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  loadingBarContainer: {
    height: 4,
    backgroundColor: "#E0E0E0",
    borderRadius: 2,
    overflow: "hidden",
    marginBottom: 10,
  },
  loadingBar: {
    height: "100%",
    width: "100%",
    backgroundColor: "#4CAF50",
    borderRadius: 2,
  },
  searchingInfo: {
    alignItems: "center",
    marginBottom: 10,
  },
  cancelButton: {
    backgroundColor: Colors.light.danger,
  },
});
