import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, ActivityIndicator, Text, Platform, useWindowDimensions, TouchableOpacity } from 'react-native';
import { Video, ResizeMode } from 'expo-av';
import * as ScreenOrientation from 'expo-screen-orientation';
import { StatusBar } from 'expo-status-bar';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

import NetflixIntro from '../../components/NetflixIntro';
import PlayerControls from '../../components/PlayerControls';
import { Storage } from '../../utils/storage';

export default function WatchScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const videoRef = useRef(null);
  const { width: windowWidth, height: windowHeight } = useWindowDimensions();

  const [loading, setLoading] = useState(true);
  const [loadingStatus, setLoadingStatus] = useState("INITIALIZING...");
  const [hlsUrl, setHlsUrl] = useState(null);
  const [movieData, setMovieData] = useState(null);
  const [showIntro, setShowIntro] = useState(false);
  const [status, setStatus] = useState({});
  const [controlsVisible, setControlsVisible] = useState(true);
  const [savedPosition, setSavedPosition] = useState(0);
  const [showResumePrompt, setShowResumePrompt] = useState(false);

  useEffect(() => {
    if (Platform.OS !== 'web') {
      ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE);
    }
    if (id) prepareStream();
    return () => {
      if (Platform.OS !== 'web') ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT);
    };
  }, [id]);

  const prepareStream = async () => {
    try {
      setLoadingStatus("FETCHING MOVIE INFO...");
      const res = await fetch(`https://movie2k.ch/data/watch/?_id=${id}`);
      const data = await res.json();
      const movie = data.movie || data;
      setMovieData(movie);

      const lastPos = await Storage.getPlaybackPosition(id);
      if (lastPos > 15000) setSavedPosition(lastPos);

      const rawStreams = movie.streams || [];
      if (rawStreams.length === 0) throw new Error("No streams available.");

      const prioritizedStreams = [
        ...rawStreams.filter(s => s.stream.toLowerCase().includes('savefiles.com')),
        ...rawStreams.filter(s => !s.stream.toLowerCase().includes('savefiles.com'))
      ];

      for (const streamObj of prioritizedStreams) {
        const sourceUrl = streamObj.stream;
        setLoadingStatus(`TRYING SOURCE: ${new URL(sourceUrl).hostname}...`);

        const scrapedHls = await scrapeStreamPage(sourceUrl);
        if (scrapedHls) {
          setHlsUrl(scrapedHls);
          finalizeLoad(movie);
          return;
        }
      }
      throw new Error("Failed to load any playable streams.");
    } catch (err) {
      setLoadingStatus(err.message);
    }
  };

  const scrapeStreamPage = async (url) => {
    try {
      const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(url)}`;
      const res = await fetch(proxyUrl);
      const data = await res.json();
      const html = data.contents;
      const m3u8Regex = /["'](https?:\/\/[^"']+\.m3u8[^"']*)["']/g;
      let match;
      const foundLinks = [];
      while ((match = m3u8Regex.exec(html)) !== null) {
        foundLinks.push(match[1]);
      }
      return foundLinks.find(l => l.includes('master')) || foundLinks[0] || null;
    } catch (e) { return null; }
  };

  const finalizeLoad = async (movie) => {
    await Storage.saveToItemToList('history', movie);
    setLoading(false);
    setShowIntro(true);
  };

  const onPlaybackStatusUpdate = (s) => {
    setStatus(s);
    if (s.isLoaded && !s.isBuffering) {
      if (Math.floor(s.positionMillis / 1000) % 10 === 0) {
        Storage.savePlaybackPosition(id, s.positionMillis);
      }
      if ((s.positionMillis / s.durationMillis) > 0.85) {
        Storage.removeFromList('watchlist', id);
      }
      if (s.didJustFinish) Storage.savePlaybackPosition(id, 0);
    }
  };

  if (loading) {
    return (
      <View style={[styles.centered, { width: windowWidth, height: windowHeight }]}>
        <ActivityIndicator size="large" color="#E50914" />
        <Text style={styles.loadingText}>{loadingStatus}</Text>
      </View>
    );
  }

  // Define dynamic sizes to ensure centering
  const videoSize = { width: windowWidth, height: windowHeight };

  return (
    <SafeAreaProvider>
      <View style={[styles.container, videoSize]}>
        <Stack.Screen options={{ headerShown: false }} />
        <StatusBar hidden />
        
        {showIntro ? (
          <NetflixIntro logoText="N" onFinished={() => { setShowIntro(false); if(savedPosition > 0) setShowResumePrompt(true); }} />
        ) : (
          <View style={[styles.videoWrapper, videoSize]}>
            <Video
              ref={videoRef}
              source={{ uri: hlsUrl }}
              shouldPlay
              resizeMode={ResizeMode.CONTAIN} 
              style={videoSize}
              videoStyle={videoSize} // Forces the internal video element to center/fill
              onPlaybackStatusUpdate={onPlaybackStatusUpdate}
            />

            {showResumePrompt && (
              <View style={styles.resumeOverlay}>
                <Text style={styles.resumeTitle}>Pick up where you left off?</Text>
                <View style={styles.resumeButtons}>
                  <TouchableOpacity style={styles.resBtn} onPress={() => { videoRef.current.setPositionAsync(savedPosition); setShowResumePrompt(false); }}>
                    <Text style={styles.resText}>RESUME</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={[styles.resBtn, {backgroundColor: '#333'}]} onPress={() => setShowResumePrompt(false)}>
                    <Text style={styles.resText}>RESTART</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}

            <SafeAreaView style={styles.controlsOverlay} pointerEvents="box-none">
              <PlayerControls 
                visible={controlsVisible && !showResumePrompt}
                onToggleVisibility={() => setControlsVisible(!controlsVisible)}
                title={movieData?.title}
                playing={status.isPlaying}
                buffering={status.isBuffering || (status.shouldPlay && !status.isLoaded)}
                progress={status.positionMillis || 0}
                duration={status.durationMillis || 1}
                onPlayPause={() => status.isPlaying ? videoRef.current.pauseAsync() : videoRef.current.playAsync()}
                onSeekBack={() => videoRef.current.setPositionAsync(status.positionMillis - 10000)}
                onSeekForward={() => videoRef.current.setPositionAsync(status.positionMillis + 10000)}
                onSeek={(m) => videoRef.current.setPositionAsync(m)}
                onBack={() => router.back()}
              />
            </SafeAreaView>
          </View>
        )}
      </View>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: { backgroundColor: 'black', flex: 1, overflow: 'hidden' },
  videoWrapper: { 
    position: 'absolute',
    top: 0,
    left: 0,
    justifyContent: 'center', 
    alignItems: 'center',
    backgroundColor: 'black'
  },
  controlsOverlay: { ...StyleSheet.absoluteFillObject, zIndex: 10 },
  centered: { backgroundColor: 'black', flex: 1, justifyContent: 'center', alignItems: 'center' },
  loadingText: { color: 'white', marginTop: 20, fontSize: 12, letterSpacing: 1 },
  resumeOverlay: { 
    position: 'absolute', 
    zIndex: 99, 
    backgroundColor: 'rgba(0,0,0,0.95)', 
    padding: 40, 
    borderRadius: 10, 
    alignItems: 'center', 
    borderWidth: 1, 
    borderColor: '#333' 
  },
  resumeTitle: { color: 'white', fontSize: 20, fontWeight: 'bold', marginBottom: 20 },
  resumeButtons: { flexDirection: 'row', gap: 20 },
  resBtn: { backgroundColor: '#E50914', paddingHorizontal: 25, paddingVertical: 12, borderRadius: 5 },
  resText: { color: 'white', fontWeight: 'bold' }
});