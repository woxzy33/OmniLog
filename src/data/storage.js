import localforage from 'localforage';

// Primary OmniLog storage instance
const omniStore = localforage.createInstance({
  name: 'OmniLog',
  version: 1.0,
  storeName: 'omnilog_data',
  description: 'OmniLog local persistence store'
});

// Legacy IronLog store for seamless migration
const legacyStore = localforage.createInstance({
  name: 'IronLog',
  version: 1.0,
  storeName: 'ironlog_data',
  description: 'IronLog local persistence store'
});

export const Storage = {
  async get(key) {
    try {
      let data = await omniStore.getItem(key);
      if (data === null || data === undefined) {
        // Check legacy IronLog store
        const legacyData = await legacyStore.getItem(key);
        if (legacyData !== null && legacyData !== undefined) {
          // Seamlessly migrate to OmniLog store
          await omniStore.setItem(key, legacyData);
          data = legacyData;
        }
      }
      return data;
    } catch (err) {
      console.error(`Error getting ${key} from storage:`, err);
      return null;
    }
  },

  async set(key, value) {
    try {
      await omniStore.setItem(key, value);
    } catch (err) {
      console.error(`Error setting ${key} in storage:`, err);
    }
  },

  async remove(key) {
    try {
      await omniStore.removeItem(key);
      await legacyStore.removeItem(key);
    } catch (err) {
      console.error(`Error removing ${key} from storage:`, err);
    }
  },

  async clear() {
    try {
      await omniStore.clear();
      await legacyStore.clear();
    } catch (err) {
      console.error('Error clearing storage:', err);
    }
  }
};
