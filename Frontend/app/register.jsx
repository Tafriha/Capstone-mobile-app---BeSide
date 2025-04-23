import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import axios from 'axios';

export default function RegisterScreen() {
  const [form, setForm] = useState({
    userName: '',
    password: '',
    role: 'user',
  });

  const handleRegister = async () => {
    try {
      const res = await axios.post('http://localhost:5000/api/users/register', form);
      Alert.alert('Success', res.data.message || 'Registered successfully');
    } catch (err) {
      Alert.alert('Error', err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <View style={styles.container}>
      <Text>Username</Text>
      <TextInput style={styles.input} onChangeText={(val) => setForm({ ...form, userName: val })} />

      <Text>Password</Text>
      <TextInput
        style={styles.input}
        secureTextEntry
        onChangeText={(val) => setForm({ ...form, password: val })}
      />

      <Button title="Register" onPress={handleRegister} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20 },
  input: { borderWidth: 1, marginVertical: 10, padding: 8 }
});
