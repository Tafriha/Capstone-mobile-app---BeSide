import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Button, Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";

export default function HomeScreen() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const loadUser = async () => {
      const stored = await AsyncStorage.getItem("user");
      if (stored) setUser(JSON.parse(stored));
    };
    loadUser();
  }, []);

  const handleTripStart = () => {
    if (user?.isVerified) {
      Alert.alert("Trip Started!");
      // Add navigation or logic here
    } else {
      Alert.alert("Please verify before starting the trip", "", [
        {
          text: "Go to Verification",
          onPress: () => router.push("/verify"),
        },
      ]);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Home Screen</Text>
      <Button title="Start Trip" onPress={handleTripStart} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    fontWeight: "bold",
  },
});
