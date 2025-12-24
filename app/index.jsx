import React, { useState, useEffect } from 'react';
import { StyleSheet, View, ScrollView, ActivityIndicator } from 'react-native';
import Sidebar from '../components/Sidebar';
import Hero from '../components/Hero';
import MovieRow from '../components/MovieRow';

export default function Index() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('https://movie2k.ch/data/browse/?lang=2&order_by=trending&page=1&limit=20')
      .then(res => res.json())
      .then(data => {
        setMovies(data.movies || []);
        setLoading(false);
      })
      .catch(err => console.error(err));
  }, []);

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: 'center' }]}>
        <ActivityIndicator size="large" color="#E50914" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Sidebar />
      <ScrollView style={styles.mainContent} bounces={false}>
        {/* The first movie (index 0) is the Hero */}
        <Hero movie={movies[0]} />
        
        <View style={styles.rowsContainer}>
          <MovieRow title="Trending Now" data={movies.slice(1, 10)} />
          <MovieRow title="New Releases" data={movies.slice(10, 20)} />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'black', flexDirection: 'row' },
  mainContent: { flex: 1 },
  rowsContainer: { marginTop: -60, paddingBottom: 50 },
});