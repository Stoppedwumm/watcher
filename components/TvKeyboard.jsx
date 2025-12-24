import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const KEYS = [
  'a', 'b', 'c', 'd', 'e', 'f',
  'g', 'h', 'i', 'j', 'k', 'l',
  'm', 'n', 'o', 'p', 'q', 'r',
  's', 't', 'u', 'v', 'w', 'x',
  'y', 'z', '1', '2', '3', '4',
  '5', '6', '7', '8', '9', '0'
];

export default function TvKeyboard({ value, onUpdate }) {
  const handlePress = (char) => onUpdate(value + char);
  const handleBackspace = () => onUpdate(value.slice(0, -1));
  const handleClear = () => onUpdate('');

  return (
    <View style={styles.container}>
      <Text style={styles.previewText}>{value || ' '}</Text>
      
      {/* Top Special Row */}
      <View style={styles.row}>
        <TouchableOpacity style={[styles.key, styles.wideKey]} onPress={() => handlePress(' ')}>
          <Text style={styles.keyText}>[___]</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.key} onPress={handleBackspace}>
          <Text style={styles.keyText}>⌫</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.key} onPress={handleClear}>
          <Text style={styles.keyText}>X</Text>
        </TouchableOpacity>
      </View>

      {/* Alpha-Numeric Grid */}
      <View style={styles.grid}>
        {KEYS.map((key) => (
          <TouchableOpacity 
            key={key} 
            style={[styles.key, value.endsWith(key) && styles.activeKey]} 
            onPress={() => handlePress(key)}
          >
            <Text style={[styles.keyText, value.endsWith(key) && styles.activeKeyText]}>{key}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Suggestions (Static placeholders like in image) */}
      <View style={styles.suggestions}>
        {['Ryan Gosling', 'Russell Crowe', 'Robert Carlyle'].map(name => (
          <Text key={name} style={styles.suggestionText}>{name}</Text>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { width: '100%' },
  previewText: { color: 'white', fontSize: 32, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
  row: { flexDirection: 'row', justifyContent: 'center', marginBottom: 5 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center' },
  key: { width: 45, height: 45, backgroundColor: '#1a1a1a', margin: 2, justifyContent: 'center', alignItems: 'center', borderRadius: 2 },
  wideKey: { width: 94 },
  activeKey: { backgroundColor: 'white' },
  keyText: { color: 'gray', fontSize: 18, fontWeight: 'bold' },
  activeKeyText: { color: 'black' },
  suggestions: { marginTop: 30, paddingLeft: 10 },
  suggestionText: { color: '#666', fontSize: 16, marginVertical: 8 }
});