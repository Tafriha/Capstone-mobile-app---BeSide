import React, { useState } from "react";
import { Picker } from "@react-native-picker/picker";
import {
  View,
  Text,
  Modal,
  TextInput,
  Pressable,
  StyleSheet,
  Switch,
  Platform,
} from "react-native";
import { ThemedButton } from "@/components/ThemedButton";

export default function CompanionPreferencesModal({ visible, onClose, onSubmit }) {
  const [chatPreference, setChatPreference] = useState(false);
  const [startLocation, setStartLocation] = useState("");
  const [destination, setDestination] = useState("");
  const [transport, setTransport] = useState("walk");
  const [genderPreference, setGenderPreference] = useState("any");

  const handleSubmit = () => {
    const preferences = {
      chat: chatPreference,
      startLocation,
      destination,
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

          <TextInput
            style={styles.input}
            placeholder="Starting point"
            value={startLocation}
            onChangeText={setStartLocation}
          />

          <TextInput
            style={styles.input}
            placeholder="Destination"
            value={destination}
            onChangeText={setDestination}
          />

          <Text style={styles.label}>Choose Transport:</Text>
          <Picker
            selectedValue={transport}
            style={styles.picker}
            onValueChange={(itemValue) => setTransport(itemValue)}
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
          >
            <Picker.Item label="Any" value="any" />
            <Picker.Item label="Male" value="male" />
            <Picker.Item label="Female" value="female" />
            <Picker.Item label="Non-binary" value="nonbinary" />
          </Picker>

          <ThemedButton title="Confirm" onPress={handleSubmit} />

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
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    marginVertical: 6,
    borderRadius: 6,
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