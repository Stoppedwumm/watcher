import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, ActivityIndicator, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons, FontAwesome, MaterialIcons } from '@expo/vector-icons';
import Sidebar from '../../components/Sidebar';
// 1. Import the Storage utility
import { Storage } from '../../utils/storage'; 

const IMG_BASE = "https://image.tmdb.org/t/p/w500";

export default function MovieDetail() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  
  const [movie, setMovie] = useState(null);
  const [relatedMovies, setRelatedMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('OVERVIEW');
  
  // 2. Track if movie is in watchlist
  const [isInWatchlist, setIsInWatchlist] = useState(false);

  useEffect(() => {
    setLoading(true);
    const fetchMain = fetch(`https://movie2k.ch/data/watch/?_id=${id}`).then(res => res.json());
    const fetchRelated = fetch(`https://movie2k.ch/data/related_movies/?lang=2&cat=movie&_id=${id}&server=0`).then(res => res.json());

    Promise.all([fetchMain, fetchRelated])
      .then(async ([mainData, relatedData]) => {
        const movieData = mainData.movie || mainData;
        setMovie(movieData);
        setRelatedMovies(relatedData.movies || []);
        
        // 3. Check if this movie is already saved
        const watchlist = await Storage.getList('watchlist');
        setIsInWatchlist(watchlist.some(item => item._id === id));
        
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [id]);

  // 4. Toggle function for the button
  const toggleWatchlist = async () => {
    if (isInWatchlist) {
      await Storage.removeFromList('watchlist', movie._id);
      setIsInWatchlist(false);
    } else {
      await Storage.saveToItemToList('watchlist', movie);
      setIsInWatchlist(true);
    }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'OVERVIEW':
        return (
          <View>
            <Text style={styles.description}>{movie.storyline || movie.overview}</Text>
            <View style={styles.detailsGrid}>
              <Text style={styles.detailLine}><Text style={styles.label}>Starring: </Text>{movie.cast?.filter(n => n !== "").slice(0, 3).join(', ')}...</Text>
              <Text style={styles.detailLine}><Text style={styles.label}>Genre: </Text>{movie.genres}</Text>
            </View>
          </View>
        );
      case 'TRAILERS & MORE':
        return (
          <View style={styles.placeholderTab}>
            <Ionicons name="videocam-outline" size={50} color="#333" />
            <Text style={styles.placeholderText}>No trailers available for this server.</Text>
          </View>
        );
      case 'MORE LIKE THIS':
        return (
          <View style={styles.relatedGrid}>
            {relatedMovies.map((item) => (
              <TouchableOpacity 
                key={item._id} 
                style={styles.relatedCard}
                onPress={() => router.push(`/movie/${item._id}`)}
              >
                <Image 
                  source={{ uri: `${IMG_BASE}${item.backdrop_path || item.poster_path}` }} 
                  style={styles.relatedImg} 
                />
                <Text style={styles.relatedName} numberOfLines={1}>{item.title}</Text>
              </TouchableOpacity>
            ))}
          </View>
        );
      case 'DETAILS':
        return (
          <View style={styles.detailsList}>
            <Text style={styles.detailLine}><Text style={styles.label}>Full Cast: </Text>{movie.cast?.filter(n => n !== "").join(', ')}</Text>
            <Text style={styles.detailLine}><Text style={styles.label}>Directors: </Text>{movie.directors?.join(', ')}</Text>
            <Text style={styles.detailLine}><Text style={styles.label}>Runtime: </Text>{movie.runtime} minutes</Text>
            <Text style={styles.detailLine}><Text style={styles.label}>Release Year: </Text>{movie.year}</Text>
            <Text style={styles.detailLine}><Text style={styles.label}>Language: </Text>{movie.language?.toUpperCase()}</Text>
          </View>
        );
      default:
        return null;
    }
  };

  if (loading) return <View style={styles.centered}><ActivityIndicator size="large" color="#E50914" /></View>;
  if (!movie) return null;

  return (
    <View style={styles.container}>
      <Sidebar />
      <View style={styles.mainContent}>
        <ScrollView contentContainerStyle={styles.scrollBody}>
          <View style={styles.detailLayout}>
            
            {/* POSTER & ACTION BUTTONS */}
            <View style={styles.posterContainer}>
              <Image source={{ uri: `https://image.tmdb.org/t/p/original${movie.poster_path}` }} style={styles.mainPoster} />
              
              <View style={styles.actionButtonsRow}>
                {/* PLAY BUTTON */}
                <TouchableOpacity style={styles.playButton} onPress={() => {
                  router.push(`/watch/${movie._id}`);
                }}>
                  <Ionicons name="play" size={30} color="white" />
                </TouchableOpacity>

                {/* 5. WATCHLIST BUTTON */}
                <TouchableOpacity 
                  style={[styles.saveButton, isInWatchlist && styles.savedButton]} 
                  onPress={toggleWatchlist}
                >
                  <Ionicons 
                    name={isInWatchlist ? "checkmark" : "add"} 
                    size={30} 
                    color="white" 
                  />
                </TouchableOpacity>
              </View>
            </View>

            {/* INFO */}
            <View style={styles.infoContainer}>
              <View style={styles.titleRow}>
                <Text style={styles.title}>{movie.title}</Text>
                <View style={styles.ratingBox}>
                  <Text style={styles.ratingValue}>{movie.rating}</Text>
                  <FontAwesome name="star" size={20} color="#FFD700" />
                </View>
              </View>

              <View style={styles.metaRow}>
                <Text style={styles.metaText}>{movie.year}  |  {movie.runtime} min  |  </Text>
                <View style={styles.ageBadge}><Text style={styles.ageText}>16+</Text></View>
              </View>

              {/* TABS HEADER */}
              <View style={styles.tabBar}>
                {['OVERVIEW', 'TRAILERS & MORE', 'MORE LIKE THIS', 'DETAILS'].map(tab => (
                  <TouchableOpacity key={tab} onPress={() => setActiveTab(tab)} style={styles.tabItem}>
                    <Text style={[styles.tabText, activeTab === tab && styles.activeTabText]}>{tab}</Text>
                    {activeTab === tab && <View style={styles.tabIndicator} />}
                  </TouchableOpacity>
                ))}
              </View>

              {/* DYNAMIC TAB CONTENT */}
              <View style={styles.contentArea}>
                {renderTabContent()}
              </View>

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
  scrollBody: { paddingVertical: 60, paddingHorizontal: 40 },
  detailLayout: { flexDirection: 'row' },
  posterContainer: { width: 300, height: 450 },
  mainPoster: { width: '100%', height: '100%', borderRadius: 10, backgroundColor: '#111' },
  
  // Button Row Styling
  actionButtonsRow: {
    flexDirection: 'row',
    position: 'absolute',
    bottom: -30,
    right: -20,
  },
  playButton: { 
    backgroundColor: '#E50914', 
    width: 60, 
    height: 60, 
    borderRadius: 8, 
    justifyContent: 'center', 
    alignItems: 'center',
    marginRight: 10,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
  },
  saveButton: {
    backgroundColor: '#333', 
    width: 60, 
    height: 60, 
    borderRadius: 8, 
    justifyContent: 'center', 
    alignItems: 'center',
    elevation: 5,
  },
  savedButton: {
    backgroundColor: '#2e7d32', // Green when saved
  },

  infoContainer: { flex: 1, marginLeft: 60 },
  titleRow: { flexDirection: 'row', justifyContent: 'space-between' },
  title: { color: 'white', fontSize: 44, fontWeight: 'bold', flex: 1 },
  ratingBox: { flexDirection: 'row', alignItems: 'center' },
  ratingValue: { color: 'white', fontSize: 24, marginRight: 8 },
  metaRow: { flexDirection: 'row', alignItems: 'center', marginVertical: 20 },
  metaText: { color: '#888', fontSize: 16 },
  ageBadge: { borderWidth: 1, borderColor: '#555', paddingHorizontal: 6, borderRadius: 3 },
  ageText: { color: '#888', fontSize: 12 },
  tabBar: { flexDirection: 'row', marginTop: 20, borderBottomWidth: 1, borderBottomColor: '#222' },
  tabItem: { marginRight: 30, paddingBottom: 15 },
  tabText: { color: '#666', fontSize: 13, fontWeight: 'bold' },
  activeTabText: { color: 'white' },
  tabIndicator: { position: 'absolute', bottom: 0, left: 0, right: 0, height: 3, backgroundColor: '#E50914' },
  contentArea: { marginTop: 30 },
  description: { color: '#bbb', fontSize: 15, lineHeight: 24, marginBottom: 20 },
  detailsGrid: { marginTop: 10 },
  detailLine: { color: 'white', fontSize: 14, marginBottom: 12, lineHeight: 20 },
  label: { color: '#666' },
  placeholderTab: { height: 200, justifyContent: 'center', alignItems: 'center' },
  placeholderText: { color: '#444', marginTop: 10 },
  relatedGrid: { flexDirection: 'row', flexWrap: 'wrap' },
  relatedCard: { width: '31%', marginRight: '2%', marginBottom: 20 },
  relatedImg: { width: '100%', height: 110, borderRadius: 4, backgroundColor: '#111' },
  relatedName: { color: '#888', fontSize: 11, marginTop: 8 },
  detailsList: { paddingRight: 40 }
});