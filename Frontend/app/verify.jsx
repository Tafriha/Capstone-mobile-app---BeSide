import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import axios from 'axios';

export default function VerificationScreen() {
  const [data, setData] = useState({
    userName: '',
    verificationIdType: '', // e.g., 'license' or 'wwcc'
    firstName: '',
    lastName: '',
    number: '',
    expiry: '',
    dob: '',
  });

  const handleVerify = async () => {
    try {
      const res = await axios.post('http://localhost:5000/api/auth/verify', data);
      Alert.alert('Success', res.data.message || 'Verification successful');
    } catch (err) {
      Alert.alert('Error', err.response?.data?.message || 'Verification failed');
    }
  };

  return (
    <View style={styles.container}>
      {Object.keys(data).map((key) => (
        <TextInput
          key={key}
          placeholder={key}
          style={styles.input}
          onChangeText={(val) => setData({ ...data, [key]: val })}
        />
      ))}
      <Button title="Verify User" onPress={handleVerify} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20 },
  input: { borderWidth: 1, marginVertical: 10, padding: 8 }
});
