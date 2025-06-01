/**
 * Clears all RainbowKit and Wagmi related cache from localStorage and sessionStorage
 */
export const clearRainbowKitCache = () => {
  // Clear all RainbowKit related items from localStorage
  Object.keys(localStorage).forEach(key => {
    if (key.startsWith('rk-') || key.includes('rainbow') || key.includes('wagmi')) {
      localStorage.removeItem(key);
    }
  });
  
  // Clear sessionStorage as well
  Object.keys(sessionStorage).forEach(key => {
    if (key.startsWith('rk-') || key.includes('rainbow') || key.includes('wagmi')) {
      sessionStorage.removeItem(key);
    }
  });
}; 