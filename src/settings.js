/**
 * src/settings.js – Browser-storage settings manager.
 * All keys are stored ONLY in chrome.storage.local (browser-side).
 * Nothing is sent to external servers.
 * @module settings
 */

const STORAGE_KEY = 'ta_settings_v1';

/** Default settings */
const DEFAULTS = {
  provider:       'mock',
  libreEndpoint:  'http://localhost:5000',
  libreApiKey:    '',
  customEndpoint: '',
};

/**
 * Load settings from chrome.storage.local.
 * Falls back to localStorage in non-extension contexts (e.g., tests).
 * @returns {Promise<typeof DEFAULTS>}
 */
export async function loadSettings() {
  try {
    if (typeof chrome !== 'undefined' && chrome?.storage?.local) {
      return new Promise((resolve) => {
        chrome.storage.local.get(STORAGE_KEY, (result) => {
          resolve({ ...DEFAULTS, ...(result[STORAGE_KEY] ?? {}) });
        });
      });
    }
    const raw = localStorage.getItem(STORAGE_KEY);
    return { ...DEFAULTS, ...(raw ? JSON.parse(raw) : {}) };
  } catch {
    return { ...DEFAULTS };
  }
}

/**
 * Save settings to chrome.storage.local.
 * @param {Partial<typeof DEFAULTS>} settings
 * @returns {Promise<void>}
 */
export async function saveSettings(settings) {
  const toStore = { ...DEFAULTS, ...settings };
  const safe = {
    provider:       String(toStore.provider       || 'mock').slice(0, 64),
    libreEndpoint:  String(toStore.libreEndpoint  || '').slice(0, 512),
    libreApiKey:    String(toStore.libreApiKey    || '').slice(0, 256),
    customEndpoint: String(toStore.customEndpoint || '').slice(0, 512),
  };
  try {
    if (typeof chrome !== 'undefined' && chrome?.storage?.local) {
      return new Promise((resolve) => {
        chrome.storage.local.set({ [STORAGE_KEY]: safe }, resolve);
      });
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(safe));
  } catch (err) {
    console.error('[settings] save failed', err);
  }
}

/**
 * Clear all saved settings and reset to defaults.
 * @returns {Promise<void>}
 */
export async function clearSettings() {
  try {
    if (typeof chrome !== 'undefined' && chrome?.storage?.local) {
      return new Promise((resolve) => {
        chrome.storage.local.remove(STORAGE_KEY, resolve);
      });
    }
    localStorage.removeItem(STORAGE_KEY);
  } catch (err) {
    console.error('[settings] clear failed', err);
  }
}
