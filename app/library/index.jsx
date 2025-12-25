import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  TouchableOpacity, 
  ActivityIndicator, 
  Platform 
} from 'react-native';
import { useIsFocused } from '@react-navigation/native';

// Updated paths to use ../../
import Sidebar from '../../components/Sidebar';
import SearchResultItem from '../../components/SearchResultItem';
import { Storage } from '../../utils/storage';

const TABS = [
  { id: 'watchlist', label: 'Watchlist' },
  { id: 'history', label: 'History' },
  { id: 'favorites', label: 'Favorites' },
];

export default function LibraryScreen() {
  const [activeTab, setActiveTab] = useState('watchlist');
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const isFocused = useIsFocused();
  const isTV = Platform.isTV || Platform.OS === 'web';

  const loadLibraryData = async () => {
    setLoading(true);
    try {
      const data = await Storage.getList(activeTab);
      console.log(`Loaded ${activeTab}:`, data); // Debug log to see if data exists
      setItems(data || []);
    } catch (error) {
      console.error("Library Load Error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isFocused) {
      loadLibraryData();
    }
  }, [activeTab, isFocused]);

  return (
    <View style={styles.container}>
      <Sidebar />

      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>My Library</Text>
          
          <View style={styles.tabBar}>
            {TABS.map((tab) => (
              <TouchableOpacity
                key={tab.id}
                onPress={() => setActiveTab(tab.id)}
                style={[styles.tab, activeTab === tab.id && styles.activeTab]}
              >
                <Text style={[styles.tabText, activeTab === tab.id && styles.activeTabText]}>
                  {tab.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.resultsArea}>
          {loading ? (
            <ActivityIndicator size="large" color="#E50914" style={{ marginTop: 50 }} />
          ) : (
            <FlatList
              // CRITICAL: Changing the 'key' based on numColumns prevents the list from failing to render
              key={isTV ? 'tv-grid' : 'mobile-grid'} 
              data={items}
              keyExtractor={(item) => item._id?.toString() || Math.random().toString()}
              numColumns={isTV ? 4 : 2}
              renderItem={({ item }) => (
                <View style={styles.itemWrapper}>
                   <SearchResultItem movie={item} />
                </View>
              )}
              ListEmptyComponent={() => (
                <View style={styles.emptyContainer}>
                  <Text style={styles.emptyText}>
                    Your {activeTab} is currently empty.
                  </Text>
                </View>
              )}
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
  content: { flex: 1, paddingHorizontal: 30, paddingTop: 40 },
  header: { marginBottom: 20 },
  title: { color: 'white', fontSize: 32, fontWeight: 'bold', marginBottom: 25 },
  tabBar: { flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: '#222' },
  tab: { paddingVertical: 12, marginRight: 30, borderBottomWidth: 3, borderBottomColor: 'transparent' },
  activeTab: { borderBottomColor: '#E50914' },
  tabText: { color: 'gray', fontSize: 16, fontWeight: '600' },
  activeTabText: { color: 'white' },
  resultsArea: { flex: 1, marginTop: 10 },
  itemWrapper: { 
    flex: 1/2, // Ensures even sizing on mobile (change to 1/4 for TV specifically if needed)
    padding: 5 
  },
  listContent: { paddingBottom: 100 },
  emptyContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', marginTop: 100 },
  emptyText: { color: 'gray', fontSize: 18 },
});