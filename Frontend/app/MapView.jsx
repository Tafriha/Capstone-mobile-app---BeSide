import React from "react";
import { StyleSheet, View, Dimensions } from "react-native";
import MapView, { PROVIDER_GOOGLE } from "react-native-maps";

const MapComponent = () => {
  return (
    <View style={styles.container}>
      <MapView
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        initialRegion={{
          latitude: 37.78825,
          longitude: -122.4324,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
        apiKey="AIzaSyDFwWtCQPY8KaiHVahvSr5jldGGFzbMDVw" // Replace with your actual API key
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  map: {
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height,
  },
});

export default MapComponent;
