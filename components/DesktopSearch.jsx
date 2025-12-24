import React from 'react';
import { TextInput, StyleSheet, View } from 'react-native';

export default function DesktopSearch({ value, onUpdate }) {
  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Search movies, actors, directors..."
        placeholderTextColor="#666"
        value={value}
        onChangeText={onUpdate}
        autoFocus
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { width: '100%' },
  input: {
    backgroundColor: '#1a1a1a',
    color: 'white',
    padding: 15,
    borderRadius: 8,
    fontSize: 18,
    borderWidth: 1,
    borderColor: '#333'
  }
});