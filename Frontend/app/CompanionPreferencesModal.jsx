import React, { useState } from "react";
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
  const [transport, setTransport] = useState("walk");
  const [genderPreference, setGenderPreference] = useState("any");
  const [isLoading, setIsLoading] = useState(false);

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
        console.log(
          `Raw coordinates from Google Places API - ${isStart ? "Start" : "End"}:`,
          { lat, lng }
        );

        // Show coordinates in alert for debugging
        Alert.alert(
          `${isStart ? "Start" : "End"} Location Coordinates`,
          `Raw coordinates:\nLatitude: ${lat}\nLongitude: ${lng}`
        );

        const validCoords = validateCoordinates(lat, lng);
        console.log(
          `Validated coordinates - ${isStart ? "Start" : "End"}:`,
          validCoords
        );

        if (validCoords) {
          if (isStart) {
            setStartCoordinates(validCoords);
            console.log("Start coordinates set to:", validCoords);
          } else {
            setDestinationCoordinates(validCoords);
            console.log("Destination coordinates set to:", validCoords);
          }
        } else {
          Alert.alert(
            "Invalid Location",
            "The selected location coordinates are invalid. Please try selecting a different location."
          );
        }
      } else {
        console.log("Invalid response from Google Places API:", data);
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

    console.log("Submitting coordinates:");
    console.log("Start:", startCoordinates);
    console.log("Destination:", destinationCoordinates);

    // Show final coordinates in alert for debugging
    Alert.alert(
      "Final Coordinates",
      `Start:\nLat: ${startCoordinates.latitude}\nLng: ${startCoordinates.longitude}\n\nDestination:\nLat: ${destinationCoordinates.latitude}\nLng: ${destinationCoordinates.longitude}`
    );

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

          <PlacesAutocomplete
            placeholder="Starting point"
            value={startLocation}
            onChangeText={setStartLocation}
            onSelect={handleStartLocationSelect}
            style={styles.input}
            disabled={isLoading}
          />

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
            selectedValue={transport}
            style={styles.picker}
            onValueChange={(itemValue) => setTransport(itemValue)}
            enabled={!isLoading}
          >
            <Picker.Item label="Walk" value="walk" />
            <Picker.Item label="Train" value="train" />
            <Picker.Item label="Tram" value="tram" />
            <Picker.Item label="Bus" value="bus" />
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
