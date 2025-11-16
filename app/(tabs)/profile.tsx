import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, ActivityIndicator } from 'react-native';

const API_URL = 'http://localhost:4000'; 
// If you test on a physical phone with Expo Go, you’ll later change this to your computer's IP.

export default function ProfileScreen() {
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [goal, setGoal] = useState('');
  const [loading, setLoading] = useState(false);

  // Load profile from backend when screen opens
  useEffect(() => {
    const loadProfile = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${API_URL}/profile`);
        const data = await res.json();
        setName(data.name ?? '');
        setAge(data.age ? String(data.age) : '');
        setGoal(data.goal ?? '');
      } catch (err) {
        console.log('Error loading profile', err);
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, []);

  const handleSave = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_URL}/profile`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          age: Number(age),
          goal,
        }),
      });

      const data = await res.json();
      console.log('Saved profile:', data);
      alert('Profile saved to backend!');
    } catch (err) {
      console.log('Error saving profile', err);
      alert('Error saving profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Your Profile</Text>

      {loading && (
        <View style={{ marginBottom: 12 }}>
          <ActivityIndicator />
          <Text style={{ marginTop: 6, fontSize: 12 }}>Syncing with server...</Text>
        </View>
      )}

      <Text style={styles.label}>Name</Text>
      <TextInput
        style={styles.input}
        placeholder="e.g. Ali"
        value={name}
        onChangeText={setName}
      />

      <Text style={styles.label}>Age</Text>
      <TextInput
        style={styles.input}
        placeholder="e.g. 25"
        value={age}
        onChangeText={setAge}
        keyboardType="numeric"
      />

      <Text style={styles.label}>Main fitness goal</Text>
      <TextInput
        style={styles.input}
        placeholder="Lose fat, build muscle, etc."
        value={goal}
        onChangeText={setGoal}
      />

      <View style={{ marginTop: 24 }}>
        <Button title="Save Profile" onPress={handleSave} disabled={loading} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 22,
    fontWeight: '600',
    marginBottom: 24,
  },
  label: {
    fontSize: 14,
    marginBottom: 4,
    marginTop: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    padding: 8,
    fontSize: 14,
  },
});
