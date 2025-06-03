import React, { useState, useEffect } from "react";
import {
  View,
  TextInput,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Text,
} from "react-native";

const PlacesAutocomplete = ({
  placeholder,
  value,
  onChangeText,
  onSelect,
  style,
}) => {
  const [predictions, setPredictions] = useState([]);
  const [showPredictions, setShowPredictions] = useState(false);

  useEffect(() => {
    if (value.length > 2) {
      fetchPredictions(value);
    } else {
      setPredictions([]);
    }
  }, [value]);

  const fetchPredictions = async (text) => {
    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${text}&key=AIzaSyDFwWtCQPY8KaiHVahvSr5jldGGFzbMDVw`
      );
      const data = await response.json();
      if (data.predictions) {
        setPredictions(data.predictions);
      }
    } catch (error) {
      console.error("Error fetching predictions:", error);
    }
  };

  const handleSelect = (place) => {
    onSelect(place);
    setShowPredictions(false);
  };

  return (
    <View style={[styles.container, style]}>
      <TextInput
        style={styles.input}
        placeholder={placeholder}
        value={value}
        onChangeText={(text) => {
          onChangeText(text);
          setShowPredictions(true);
        }}
        onFocus={() => setShowPredictions(true)}
      />
      {showPredictions && predictions.length > 0 && (
        <FlatList
          style={styles.predictionsList}
          data={predictions}
          keyExtractor={(item) => item.place_id}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.predictionItem}
              onPress={() => handleSelect(item)}
            >
              <Text style={styles.predictionText}>{item.description}</Text>
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "relative",
    zIndex: 1,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    borderRadius: 6,
    backgroundColor: "#fff",
  },
  predictionsList: {
    position: "absolute",
    top: "100%",
    left: 0,
    right: 0,
    backgroundColor: "#fff",
    borderRadius: 6,
    maxHeight: 200,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    zIndex: 2,
  },
  predictionItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  predictionText: {
    fontSize: 14,
  },
});

export default PlacesAutocomplete;
