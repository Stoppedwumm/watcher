import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Pressable, Platform, ActivityIndicator } from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';

export default function PlayerControls({ 
  playing, buffering, progress, duration, title, onBack, visible, onToggleVisibility, onSeek, 
  onPlayPause, onSeekBack, onSeekForward, isFullscreen, onToggleFullscreen 
}) {
  const [hoverTime, setHoverTime] = useState(null);
  const [hoverX, setHoverX] = useState(0);
  const [barWidth, setBarWidth] = useState(0);

  const formatTime = (ms) => {
    const totalSecs = Math.max(0, ms / 1000);
    const m = Math.floor(totalSecs / 60);
    const s = Math.floor(totalSecs % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  if (!visible) return <Pressable style={styles.touchLayer} onPress={onToggleVisibility} />;

  return (
    <Pressable style={styles.overlay} onPress={onToggleVisibility}>
      <View style={styles.topBar}>
        <TouchableOpacity onPress={onBack} style={styles.btn}>
          <Ionicons name="arrow-back" size={28} color="white" />
        </TouchableOpacity>
        <Text style={styles.title} numberOfLines={1}>{title}</Text>
        <View style={{ width: 40 }} />
      </View>

      <View style={styles.midControls}>
        <TouchableOpacity onPress={onSeekBack}>
          <MaterialIcons name="replay-10" size={50} color="white" />
        </TouchableOpacity>

        {/* Updated Play/Pause Button with Spinner logic */}
        <TouchableOpacity 
          onPress={onPlayPause} 
          style={styles.playCircle}
          disabled={buffering} // Prevent clicks while loading
        >
          {buffering ? (
            <ActivityIndicator size="large" color="#E50914" /> 
          ) : (
            <Ionicons 
              name={playing ? "pause" : "play"} 
              size={45} 
              color="white" 
              style={{ marginLeft: playing ? 0 : 5 }} // Optical centering for play icon
            />
          )}
        </TouchableOpacity>

        <TouchableOpacity onPress={onSeekForward}>
          <MaterialIcons name="forward-10" size={50} color="white" />
        </TouchableOpacity>
      </View>

      <View style={styles.bottomBar}>
        <View style={styles.timeInfo}>
          <Text style={styles.timeText}>{formatTime(progress)}</Text>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Text style={styles.timeText}>{formatTime(duration)}</Text>
            {Platform.OS === 'web' && (
              <TouchableOpacity onPress={onToggleFullscreen} style={{marginLeft: 15}}>
                <Ionicons name={isFullscreen ? "contract" : "expand"} size={22} color="white" />
              </TouchableOpacity>
            )}
          </View>
        </View>

        {hoverTime && <View style={[styles.tooltip, { left: hoverX - 25 }]}><Text style={styles.tooltipText}>{hoverTime}</Text></View>}

        <Pressable 
          style={styles.progressContainer}
          onLayout={e => setBarWidth(e.nativeEvent.layout.width)}
          onPointerMove={e => {
            if (Platform.OS === 'web') {
              setHoverX(e.nativeEvent.offsetX);
              setHoverTime(formatTime((e.nativeEvent.offsetX / barWidth) * duration));
            }
          }}
          onPointerLeave={() => setHoverTime(null)}
          onPress={e => {
            const x = e.nativeEvent.offsetX || e.nativeEvent.locationX;
            onSeek((x / barWidth) * duration);
          }}
        >
          <View style={styles.progressTrack}>
            <View style={[styles.progressFill, { width: `${(progress / duration) * 100}%` }]} />
          </View>
        </Pressable>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  touchLayer: { ...StyleSheet.absoluteFillObject },
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', paddingHorizontal: 40, paddingVertical: 20, justifyContent: 'space-between' },
  topBar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  title: { color: 'white', fontSize: 20, fontWeight: 'bold', flex: 1, textAlign: 'center' },
  midControls: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 60 },
  playCircle: { 
    width: 80, 
    height: 80, 
    borderRadius: 40, 
    borderWidth: 2, 
    borderColor: 'white', 
    justifyContent: 'center', 
    alignItems: 'center', 
    backgroundColor: 'rgba(255,255,255,0.1)' 
  },
  bottomBar: { width: '100%', position: 'relative', paddingBottom: 10 },
  timeInfo: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8, alignItems: 'center' },
  timeText: { color: 'white', fontSize: 14, fontWeight: '500' },
  progressContainer: { width: '100%', height: 20, justifyContent: 'center' },
  progressTrack: { width: '100%', height: 4, backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 2, overflow: 'hidden' },
  progressFill: { height: '100%', backgroundColor: '#E50914' },
  tooltip: { position: 'absolute', bottom: 35, backgroundColor: 'rgba(0,0,0,0.8)', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 4, width: 50, alignItems: 'center' },
  tooltipText: { color: 'white', fontSize: 12, fontWeight: 'bold' },
  btn: { padding: 5 }
});