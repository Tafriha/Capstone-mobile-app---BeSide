import React, { useState, useEffect } from "react";
import { Picker } from "@react-native-picker/picker";
import {
  View,
  Text,
  Modal,
  Pressable,
  StyleSheet,
  Switch,
  Platform,
  Alert,
} from "react-native";
import { ThemedButton } from "@/components/ThemedButton";
import PlacesAutocomplete from "@/app/PlacesAutocomplete";
import * as Location from "expo-location";

export default function CompanionPreferencesModal({
  visible,
  onClose,
  onSubmit,
}) {
  const [chatPreference, setChatPreference] = useState(false);
  const [startLocation, setStartLocation] = useState("");
  const [destination, setDestination] = useState("");
  const [startCoordinates, setStartCoordinates] = useState(null);
  const [destinationCoordinates, setDestinationCoordinates] = useState(null);
  const [transport, setTransport] = useState({ mode: "walking" });
  const [genderPreference, setGenderPreference] = useState("any");
  const [isLoading, setIsLoading] = useState(false);
  const [useCurrentLocation, setUseCurrentLocation] = useState(false);

  useEffect(() => {
    if (useCurrentLocation) {
      (async () => {
        setIsLoading(true);
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
          Alert.alert("Permission Denied", "Location permission is required.");
          setIsLoading(false);
          setUseCurrentLocation(false);
          return;
        }
        const location = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Highest });
        setStartCoordinates({ latitude: location.coords.latitude, longitude: location.coords.longitude });
        setStartLocation("Current Location");
        setIsLoading(false);
      })();
    } else {
      setStartCoordinates(null);
      setStartLocation("");
    }
  }, [useCurrentLocation]);

  const validateCoordinates = (lat, lng) => {
    // Ensure coordinates are within valid ranges and have proper precision
    const validLat = parseFloat(lat.toFixed(6));
    const validLng = parseFloat(lng.toFixed(6));

    if (isNaN(validLat) || isNaN(validLng)) return null;
    if (validLat < -90 || validLat > 90) return null;
    if (validLng < -180 || validLng > 180) return null;

    return { latitude: validLat, longitude: validLng };
  };

  const handleStartLocationSelect = (place) => {
    setUseCurrentLocation(false);
    setStartLocation(place.description);
    setIsLoading(true);
    fetchPlaceDetails(place.place_id, true);
  };

  const handleDestinationSelect = (place) => {
    setDestination(place.description);
    setIsLoading(true);
    fetchPlaceDetails(place.place_id, false);
  };

  const fetchPlaceDetails = async (placeId, isStart) => {
    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=geometry&key=AIzaSyDFwWtCQPY8KaiHVahvSr5jldGGFzbMDVw`
      );
      const data = await response.json();

      if (
        data.result &&
        data.result.geometry &&
        data.result.geometry.location
      ) {
        const { lat, lng } = data.result.geometry.location;
        const validCoords = validateCoordinates(lat, lng);

        if (validCoords) {
          if (isStart) {
            setStartCoordinates(validCoords);
          } else {
            setDestinationCoordinates(validCoords);
          }
        } else {
          Alert.alert(
            "Invalid Location",
            "The selected location coordinates are invalid. Please try selecting a different location."
          );
        }
      } else {
        Alert.alert(
          "Error",
          "Could not get location details. Please try again."
        );
      }
    } catch (error) {
      console.error("Error fetching place details:", error);
      Alert.alert(
        "Error",
        "Failed to fetch location details. Please check your internet connection and try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = () => {
    if (!startCoordinates || !destinationCoordinates) {
      Alert.alert(
        "Error",
        "Please select both start and destination locations"
      );
      return;
    }

    // Additional validation before submission
    if (
      !validateCoordinates(
        startCoordinates.latitude,
        startCoordinates.longitude
      ) ||
      !validateCoordinates(
        destinationCoordinates.latitude,
        destinationCoordinates.longitude
      )
    ) {
      Alert.alert(
        "Error",
        "Invalid coordinates detected. Please reselect your locations."
      );
      return;
    }

    const preferences = {
      chat: chatPreference,
      startLocation,
      destination,
      startCoordinates,
      destinationCoordinates,
      transport,
      gender: genderPreference,
      useCurrentLocation,
    };
    onSubmit(preferences);
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.overlay}>
        <View style={styles.box}>
          <Text style={styles.title}>Companion Preferences</Text>

          <View style={styles.row}>
            <Switch value={chatPreference} onValueChange={setChatPreference} />
            <Text style={styles.label}>Would you like to talk?</Text>
          </View>

          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
            <Switch value={useCurrentLocation} onValueChange={setUseCurrentLocation} />
            <Text style={styles.label}>Use Current Location</Text>
          </View>

          {!useCurrentLocation && (
            <PlacesAutocomplete
              placeholder="Starting point"
              value={startLocation}
              onChangeText={setStartLocation}
              onSelect={handleStartLocationSelect}
              style={styles.input}
              disabled={isLoading}
            />
          )}

          <PlacesAutocomplete
            placeholder="Destination"
            value={destination}
            onChangeText={setDestination}
            onSelect={handleDestinationSelect}
            style={styles.input}
            disabled={isLoading}
          />

          <Text style={styles.label}>Choose Transport:</Text>
          <Picker
            selectedValue={transport.mode + (transport.transit_mode ? (":" + transport.transit_mode) : "")}
            style={styles.picker}
            onValueChange={(itemValue) => {
              // itemValue is like "walking" or "transit:bus"
              if (itemValue.startsWith("transit:")) {
                const submode = itemValue.split(":")[1];
                setTransport({ mode: "transit", transit_mode: submode });
              } else {
                setTransport({ mode: itemValue });
              }
            }}
            enabled={!isLoading}
          >
            <Picker.Item label="Walk" value="walking" />
            <Picker.Item label="Drive" value="driving" />
            <Picker.Item label="Bicycle" value="bicycling" />
            <Picker.Item label="Bus" value="transit:bus" />
            <Picker.Item label="Train" value="transit:train" />
            <Picker.Item label="Subway" value="transit:subway" />
            <Picker.Item label="Tram" value="transit:tram" />
          </Picker>

          <Text style={styles.label}>Preferred Gender:</Text>
          <Picker
            selectedValue={genderPreference}
            style={styles.picker}
            onValueChange={(itemValue) => setGenderPreference(itemValue)}
            enabled={!isLoading}
          >
            <Picker.Item label="Any" value="any" />
            <Picker.Item label="Male" value="male" />
            <Picker.Item label="Female" value="female" />
            <Picker.Item label="Non-binary" value="nonbinary" />
          </Picker>

          <ThemedButton
            title={isLoading ? "Loading..." : "Confirm"}
            onPress={handleSubmit}
            disabled={isLoading}
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
    maxHeight: "80%",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 12,
    textAlign: "center",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  label: {
    fontSize: 16,
    marginLeft: 10,
    marginTop: 10,
  },
  input: {
    marginVertical: 6,
  },
  picker: {
    ...Platform.select({
      ios: {
        height: 100,
      },
      android: {
        height: 50,
      },
    }),
    width: "100%",
    marginBottom: 16,
  },
});
