import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, ActivityIndicator, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons, FontAwesome } from '@expo/vector-icons';
import Sidebar from '../../components/Sidebar';

const IMG_BASE = "https://image.tmdb.org/t/p/original";

export default function MovieDetail() {
  const { id } = useLocalSearchParams();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('OVERVIEW');

  useEffect(() => {
    fetch(`https://movie2k.ch/data/watch/?_id=${id}`)
      .then(res => res.json())
      .then(data => {
        setMovie(data.movie);
        setLoading(false);
      })
      .catch(err => console.error(err));
  }, [id]);

  if (loading) return (
    <View style={styles.centered}><ActivityIndicator size="large" color="#E50914" /></View>
  );

  return (
    <View style={styles.container}>
      <Sidebar />
      
      <View style={styles.mainContent}>
        {/* TOP NAVIGATION BAR */}
        <View style={styles.topNav}>
          <View style={styles.navLeft}>
            <Text style={styles.netflixLogo}>NETFLIX</Text>
            <Text style={styles.navLink}>Browse</Text>
            <TouchableOpacity style={styles.searchLink}>
              <Ionicons name="search" size={18} color="gray" />
              <Text style={styles.navLink}>Search</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.navRight}>
            <Ionicons name="notifications" size={20} color="white" style={{ marginRight: 20 }} />
            <View style={styles.profilePic} />
          </View>
        </View>

        <ScrollView contentContainerStyle={styles.scrollBody}>
          <View style={styles.detailLayout}>
            
            {/* LEFT SIDE: POSTER */}
            <View style={styles.posterContainer}>
              <Image 
                source={{ uri: `${IMG_BASE}${movie.poster_path}` }} 
                style={styles.mainPoster} 
              />
              <TouchableOpacity style={styles.playButton}>
                <Ionicons name="play" size={30} color="white" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.volumeButton}>
                <Ionicons name="volume-medium" size={20} color="white" />
              </TouchableOpacity>
            </View>

            {/* RIGHT SIDE: INFO */}
            <View style={styles.infoContainer}>
              <View style={styles.titleRow}>
                <Text style={styles.title}>{movie.title}</Text>
                <View style={styles.ratingBox}>
                  <Text style={styles.ratingText}>{movie.rating?.toFixed(1) || "9.0"}</Text>
                  <FontAwesome name="star" size={16} color="#FFD700" />
                </View>
              </View>

              <View style={styles.metaRow}>
                <Text style={styles.metaItem}>{movie.year}</Text>
                <Text style={styles.metaItem}> | </Text>
                <Text style={styles.metaItem}>2h 23min</Text>
                <Text style={styles.metaItem}> | </Text>
                <View style={styles.ageBadge}><Text style={styles.ageText}>16+</Text></View>
              </View>

              {/* TABS */}
              <View style={styles.tabBar}>
                {['OVERVIEW', 'TRAILERS & MORE', 'MORE LIKE THIS', 'DETAILS'].map(tab => (
                  <TouchableOpacity key={tab} onPress={() => setActiveTab(tab)}>
                    <Text style={[styles.tabText, activeTab === tab && styles.activeTabText]}>{tab}</Text>
                    {activeTab === tab && <View style={styles.tabIndicator} />}
                  </TouchableOpacity>
                ))}
              </View>

              <Text style={styles.description}>{movie.overview}</Text>

              <View style={styles.castBox}>
                <Text style={styles.castItem}><Text style={styles.label}>Starring:  </Text>{movie.cast?.join(', ')}</Text>
                <Text style={styles.castItem}><Text style={styles.label}>Created by:  </Text>{movie.directors?.join(', ')}</Text>
                <Text style={styles.castItem}><Text style={styles.label}>Genre:  </Text>{movie.genres?.join(', ')}</Text>
              </View>

              {/* RELATED MOVIES (Horizontal placeholders) */}
              <Text style={styles.sectionTitle}>Related Movies</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {/* Normally you'd fetch real related movies here */}
                {[1, 2, 3].map((i) => (
                  <View key={i} style={styles.relatedCard}>
                    <Image source={{ uri: `${IMG_BASE}${movie.backdrop_path}` }} style={styles.relatedImg} />
                  </View>
                ))}
              </ScrollView>
            </View>

          </View>
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000', flexDirection: 'row' },
  centered: { flex: 1, backgroundColor: '#000', justifyContent: 'center', alignItems: 'center' },
  mainContent: { flex: 1 },
  topNav: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    paddingHorizontal: 40, 
    height: 80,
    backgroundColor: 'transparent'
  },
  navLeft: { flexDirection: 'row', alignItems: 'center' },
  netflixLogo: { color: '#E50914', fontSize: 24, fontWeight: '900', marginRight: 40 },
  navLink: { color: '#ccc', fontSize: 14, marginRight: 25, fontWeight: '500' },
  searchLink: { flexDirection: 'row', alignItems: 'center' },
  profilePic: { width: 30, height: 30, backgroundColor: '#444', borderRadius: 4 },
  
  scrollBody: { paddingBottom: 50 },
  detailLayout: { flexDirection: 'row', paddingHorizontal: 60, marginTop: 20 },
  
  posterContainer: { width: 320, height: 480, position: 'relative' },
  mainPoster: { width: '100%', height: '100%', borderRadius: 12 },
  playButton: { 
    position: 'absolute', bottom: -25, right: -25, 
    backgroundColor: '#E50914', width: 70, height: 70, 
    borderRadius: 5, justifyContent: 'center', alignItems: 'center',
    shadowColor: "#000", shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.5, shadowRadius: 10,
  },
  volumeButton: { position: 'absolute', bottom: -15, right: 60, width: 40, height: 40, borderRadius: 20, borderWidth: 1, borderColor: '#444', justifyContent: 'center', alignItems: 'center' },

  infoContainer: { flex: 1, marginLeft: 80 },
  titleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  title: { color: 'white', fontSize: 42, fontWeight: 'bold' },
  ratingBox: { flexDirection: 'row', alignItems: 'center' },
  ratingText: { color: 'white', fontSize: 24, fontWeight: '300', marginRight: 10 },

  metaRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 30 },
  metaItem: { color: '#666', fontSize: 16, marginRight: 10 },
  ageBadge: { borderWidth: 1, borderColor: '#666', paddingHorizontal: 5, borderRadius: 3 },
  ageText: { color: '#666', fontSize: 12 },

  tabBar: { flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: '#222', marginBottom: 25 },
  tabText: { color: '#666', fontSize: 14, fontWeight: 'bold', marginRight: 40, paddingBottom: 15 },
  activeTabText: { color: 'white' },
  tabIndicator: { position: 'absolute', bottom: 0, left: 0, right: 40, height: 3, backgroundColor: '#E50914' },

  description: { color: '#eee', fontSize: 15, lineHeight: 24, marginBottom: 30 },
  castBox: { marginBottom: 40 },
  castItem: { color: '#eee', fontSize: 14, marginBottom: 8 },
  label: { color: '#666' },

  sectionTitle: { color: 'white', fontSize: 18, fontWeight: 'bold', marginBottom: 20 },
  relatedCard: { width: 220, height: 120, marginRight: 15 },
  relatedImg: { width: '100%', height: '100%', borderRadius: 4, backgroundColor: '#222' }
});