import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Platform, ScrollView, Text, ActivityIndicator, FlatList } from 'react-native';
import Sidebar from '../components/Sidebar';
import TvKeyboard from '../components/TvKeyboard';
import DesktopSearch from '../components/DesktopSearch';
import SearchResultItem from '../components/SearchResultItem';

export default function SearchScreen() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  // Determine if we should show TV UI
  // Note: Platform.isTV works for Apple TV/Android TV. 
  // For testing on a browser, you can manually toggle this.
  const isTV = Platform.isTV || Platform.OS != 'web'; // Assuming web behaves like Desktop for this demo

  console.log(Platform.isTV, Platform.OS)

  useEffect(() => {
    if (query.length === 0) {
      setResults([]);
      return;
    }

    const fetchResults = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `https://movie2k.ch/data/browse/?lang=2&keyword=${encodeURIComponent(query)}&page=1&limit=20`
        );
        const data = await response.json();
        setResults(data.movies || []);
      } catch (error) {
        console.error("Search Error:", error);
      } finally {
        setLoading(false);
      }
    };

    // Simple debounce to prevent over-fetching
    const timeoutId = setTimeout(fetchResults, 500);
    return () => clearTimeout(timeoutId);
  }, [query]);

  return (
    <View style={styles.container}>
      <Sidebar />

      <View style={styles.content}>
        {/* LEFT SIDE: Search Controls */}
        <View style={isTV ? styles.leftSideTv : styles.topSideDesktop}>
          {isTV ? (
            <TvKeyboard value={query} onUpdate={setQuery} />
          ) : (
            <DesktopSearch value={query} onUpdate={setQuery} />
          )}
        </View>

        {/* RIGHT SIDE / BOTTOM: Results */}
        <View style={styles.resultsArea}>
          {loading ? (
            <ActivityIndicator size="large" color="white" style={{ marginTop: 50 }} />
          ) : (
            <FlatList
              data={results}
              keyExtractor={(item) => item._id}
              numColumns={isTV ? 3 : 2} // Grid layout matching your image
              renderItem={({ item }) => <SearchResultItem movie={item} />}
              ListEmptyHeader={() => query && !loading && <Text style={styles.emptyText}>No results found</Text>}
              contentContainerStyle={styles.listContent}
            />
          )}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'black', flexDirection: 'row' },
  content: { flex: 1, flexDirection: Platform.isTV ? 'row' : 'column' },
  leftSideTv: { width: 350, padding: 20, borderRightWidth: 1, borderRightColor: '#222' },
  topSideDesktop: { width: '100%', padding: 20 },
  resultsArea: { flex: 1, padding: 10 },
  listContent: { paddingBottom: 100 },
  emptyText: { color: 'gray', textAlign: 'center', marginTop: 50 },
});