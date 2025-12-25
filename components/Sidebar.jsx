import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { useRouter, usePathname } from 'expo-router';

export default function Sidebar() {
  const router = useRouter();
  const pathname = usePathname();

  const NavButton = ({ iconName, iconType, path }) => {
    const isActive = pathname === path;
    const IconComponent = iconType === 'material' ? MaterialIcons : Ionicons;

    return (
      <TouchableOpacity 
        onPress={() => router.push(path)} 
        style={styles.navButtonContainer}
      >
        {/* The Red Line */}
        {isActive && <View style={styles.activeIndicator} />}
        
        <IconComponent 
          name={iconName} 
          size={22} 
          color={isActive ? "white" : "gray"} 
          style={styles.sideIcon} 
        />
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.sideBar}>
      <NavButton iconName="search" path="/search" />
      <NavButton iconName="home" path="/" />
      <NavButton iconName="video-library" iconType="material" path="/library" />
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
    borderRightColor: '#111',
    height: '100%'
  },
  navButtonContainer: { 
    width: '100%', 
    alignItems: 'center', 
    justifyContent: 'center',
    height: 50, // Fixed height for consistent spacing
    marginVertical: 5,
    position: 'relative' // Vital for absolute positioning of indicator
  },
  sideIcon: { 
    // Removed marginVertical because container handles height
  },
  activeIndicator: { 
    position: 'absolute', 
    left: 0, 
    width: 3, 
    height: 24, // Matches icon height roughly
    backgroundColor: '#E50914',
    borderTopRightRadius: 2,
    borderBottomRightRadius: 2
  },
});