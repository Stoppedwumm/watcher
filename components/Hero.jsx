import React from 'react';
import { View, Text, StyleSheet, ImageBackground, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

const IMG_BASE = "https://image.tmdb.org/t/p/original";

export default function Hero({ movie }) {
  if (!movie) return null;

  return (
    <ImageBackground 
      source={{ uri: `${IMG_BASE}${movie.backdrop_path}` }} 
      style={styles.heroImage}
    >
      <LinearGradient colors={['transparent', 'rgba(0,0,0,0.6)', 'black']} style={styles.gradient} />
      
      <View style={styles.container}>
        <View style={styles.nRow}>
          <Text style={styles.nLogo}>N</Text>
          <Text style={styles.seriesText}>S E R I E S</Text>
        </View>

        <Text style={styles.title} numberOfLines={2}>
          {movie.title.toUpperCase()}
        </Text>

        <View style={styles.metaRow}>
          <Text style={styles.metaText}>{movie.year}</Text>
          <View style={styles.ratingBadge}>
            <Text style={styles.ratingText}>{movie.rating}</Text>
          </View>
          <Text style={styles.metaText}>{movie.genres}</Text>
        </View>

        <View style={styles.buttonRow}>
          <TouchableOpacity style={styles.playBtn}>
            <Ionicons name="play" size={20} color="black" />
            <Text style={styles.playText}>Play</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.infoBtn}>
            <Text style={styles.infoText}>More Info</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  heroImage: { width: '100%', height: 550, justifyContent: 'flex-end' },
  gradient: { ...StyleSheet.absoluteFillObject },
  container: { paddingHorizontal: 30, marginBottom: 80 },
  nRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 5 },
  nLogo: { color: '#E50914', fontSize: 24, fontWeight: 'bold', marginRight: 8 },
  seriesText: { color: 'white', letterSpacing: 4, fontSize: 12, fontWeight: '600' },
  title: { color: 'white', fontSize: 42, fontWeight: '900', marginBottom: 10, maxWidth: '70%' },
  metaRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
  metaText: { color: '#aaa', marginRight: 15, fontSize: 14 },
  ratingBadge: { borderWidth: 1, borderColor: '#aaa', paddingHorizontal: 4, borderRadius: 2, marginRight: 15 },
  ratingText: { color: '#aaa', fontSize: 12 },
  buttonRow: { flexDirection: 'row' },
  playBtn: { backgroundColor: 'white', flexDirection: 'row', paddingHorizontal: 25, paddingVertical: 10, borderRadius: 4, marginRight: 12, alignItems: 'center' },
  playText: { fontWeight: 'bold', fontSize: 16 },
  infoBtn: { backgroundColor: 'rgba(109, 109, 110, 0.7)', paddingHorizontal: 25, paddingVertical: 10, borderRadius: 4 },
  infoText: { color: 'white', fontWeight: 'bold', fontSize: 16 }
});