import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { useRouter, usePathname } from 'expo-router'; // Import these

export default function Sidebar() {
  const router = useRouter();
  const pathname = usePathname(); // Helps us highlight the "active" icon

  return (
    <View style={styles.sideBar}>
      {/* 1. SEARCH BUTTON */}
      <TouchableOpacity onPress={() => router.push('/search')}>
        <Ionicons 
          name="search" 
          size={22} 
          color={pathname === '/search' ? "white" : "gray"} 
          style={styles.sideIcon} 
        />
      </TouchableOpacity>

      {/* 2. HOME BUTTON */}
      <TouchableOpacity onPress={() => router.push('/')} style={styles.activeContainer}>
        {pathname === '/' && <View style={styles.activeIndicator} />}
        <Ionicons 
          name="home" 
          size={22} 
          color={pathname === '/' ? "white" : "gray"} 
          style={styles.sideIcon} 
        />
      </TouchableOpacity>

      <MaterialIcons name="compare-arrows" size={22} color="gray" style={styles.sideIcon} />
      <Ionicons name="trending-up" size={22} color="gray" style={styles.sideIcon} />
      <MaterialIcons name="tv" size={22} color="gray" style={styles.sideIcon} />
      <MaterialIcons name="movie" size={22} color="gray" style={styles.sideIcon} />
      <Ionicons name="add" size={22} color="gray" style={styles.sideIcon} />
    </View>
  );
}

const styles = StyleSheet.create({
  sideBar: { 
    width: 60, 
    alignItems: 'center', 
    paddingTop: 50, 
    backgroundColor: 'black',
    borderRightWidth: 1,
    borderRightColor: '#111'
  },
  sideIcon: { marginVertical: 15 },
  activeContainer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', width: '100%' },
  activeIndicator: { 
    position: 'absolute', 
    left: 0, 
    width: 3, 
    height: 25, 
    backgroundColor: '#E50914' 
  },
});