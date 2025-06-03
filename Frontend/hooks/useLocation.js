import { useState, useEffect } from 'react';
import * as Location from 'expo-location';

export const useLocation = () => {
  const [currentLocation, setCurrentLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          setErrorMsg('Permission to access location was denied');
          setLoading(false);
          return;
        }

        const location = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Highest,
        });

        setCurrentLocation({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        });
      } catch (error) {
        setErrorMsg('Error getting location');
        // Set default location (Melbourne)
        setCurrentLocation({
          latitude: -37.8136,
          longitude: 144.9631,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        });
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const sendLocationToAPI = async () => {
    if (!currentLocation) return null;

    try {
      // This is a placeholder for your actual API call
      const response = await fetch('YOUR_API_ENDPOINT', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          latitude: currentLocation.latitude,
          longitude: currentLocation.longitude,
          // Add any other data you want to send
        }),
      });

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error sending location to API:', error);
      throw error;
    }
  };

  return {
    currentLocation,
    errorMsg,
    loading,
    sendLocationToAPI,
  };
}; 