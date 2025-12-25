import React from 'react';
import { View, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';

const IMG_BASE = "https://image.tmdb.org/t/p/w500";

export default function SearchResultItem({ movie }) {
  const router = useRouter();
  // Your API provides backdrop_path or poster_path. 
  // In the reference image, they use horizontal backdrops.
  const imageUri = movie.backdrop_path 
    ? `${IMG_BASE}${movie.backdrop_path}` 
    : `${IMG_BASE}${movie.poster_path}`;

  return (
    <TouchableOpacity style={styles.container} onPress={() => {
      router.push(`/movie/${movie._id}`);
    }}>
      <Image source={{ uri: imageUri }} style={styles.image} resizeMode="cover" />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, margin: 5, aspectRatio: 16 / 9 },
  image: { width: '100%', height: '100%', borderRadius: 2, backgroundColor: '#1a1a1a' }
});