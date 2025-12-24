import React from 'react';
import { View, Text, ScrollView, Image, StyleSheet, TouchableOpacity } from 'react-native';

const IMG_BASE = "https://image.tmdb.org/t/p/w500";

export default function MovieRow({ title, data }) {
  return (
    <View style={styles.container}>
      <Text style={styles.rowTitle}>{title}</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {data.map((item) => (
          <TouchableOpacity key={item._id} style={styles.card}>
            <Image 
              source={{ uri: `${IMG_BASE}${item.poster_path}` }} 
              style={styles.image} 
              resizeMode="cover"
            />
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { paddingLeft: 30, marginVertical: 15 },
  rowTitle: { color: 'white', fontSize: 18, fontWeight: 'bold', marginBottom: 12 },
  card: { marginRight: 10 },
  image: { width: 150, height: 225, borderRadius: 4, backgroundColor: '#222' }
});