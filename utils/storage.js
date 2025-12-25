import AsyncStorage from '@react-native-async-storage/async-storage';

export const Storage = {
  // Save to List (Watchlist, History, Favorites)
  saveToItemToList: async (key, item) => {
    try {
      if (!item || !item._id) return;
      const existingData = await AsyncStorage.getItem(key);
      let list = existingData ? JSON.parse(existingData) : [];
      
      // Remove duplicate if it exists
      list = list.filter(i => i._id !== item._id);
      
      // History: Add to top, limit to 50 items
      if (key === 'history') {
        list.unshift(item);
        if (list.length > 50) list.pop();
      } else {
        list.push(item);
      }
      
      await AsyncStorage.setItem(key, JSON.stringify(list));
    } catch (e) {
      console.error("Storage Error:", e);
    }
  },

  getList: async (key) => {
    try {
      const data = await AsyncStorage.getItem(key);
      return data ? JSON.parse(data) : [];
    } catch (e) { return []; }
  },

  removeFromList: async (key, itemId) => {
    try {
      const data = await AsyncStorage.getItem(key);
      if (!data) return [];
      let list = JSON.parse(data);
      const newList = list.filter(item => item._id !== itemId);
      await AsyncStorage.setItem(key, JSON.stringify(newList));
      return newList;
    } catch (e) { return []; }
  },

  // Playback Positions
  savePlaybackPosition: async (movieId, positionMillis) => {
    try {
      await AsyncStorage.setItem(`pos_${movieId}`, positionMillis.toString());
    } catch (e) {}
  },

  getPlaybackPosition: async (movieId) => {
    try {
      const pos = await AsyncStorage.getItem(`pos_${movieId}`);
      return pos ? parseInt(pos, 10) : 0;
    } catch (e) { return 0; }
  }
};