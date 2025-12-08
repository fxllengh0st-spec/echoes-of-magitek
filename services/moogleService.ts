import { Character, Enemy } from "../types";

const API_BASE = "https://www.moogleapi.com/api/v1";

// Cache to prevent hitting the API repeatedly for the same entity
const imageCache: Record<string, string> = {};

// Using reliable GitHub Raw links for sprites instead of Wikia (which blocks hotlinking)
const SNES_SPRITE_OVERRIDES: Record<string, string> = {
  'Terra Branford': 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/dream-world/151.svg', // Placeholder reliable
  // Using a consistent pixel art style fallback or specific assets if hosted. 
  // Since we can't guarantee a persistent FF6 host, we default to the API or reliable fallbacks.
  // We will rely on the UI onError to fallback to DiceBear if these fail or if API fails.
};

export const fetchEntityImage = async (name: string, type: 'HERO' | 'ENEMY'): Promise<string> => {
  // 1. Check Cache
  if (imageCache[name]) return imageCache[name];

  try {
    let url = "";
    
    // 2. Query MoogleAPI
    // We prioritize the API now as requested, but we need to handle the fact that it might return Amano art.
    // However, it's better than broken links.
    if (type === 'HERO') {
      const response = await fetch(`${API_BASE}/characters/search?name=${encodeURIComponent(name)}`);
      if (response.ok) {
        const data = await response.json();
        // MoogleAPI returns an array. We take the first match.
        if (Array.isArray(data) && data.length > 0 && data[0].picture) {
          url = data[0].picture;
        }
      }
    } else {
      const response = await fetch(`${API_BASE}/monsters/search?name=${encodeURIComponent(name)}`);
      if (response.ok) {
        const data = await response.json();
        if (Array.isArray(data) && data.length > 0 && data[0].picture) {
          url = data[0].picture;
        }
      }
    }

    if (url) {
      imageCache[name] = url;
      return url;
    }
  } catch (error) {
    console.warn(`MoogleAPI fetch failed for ${name}`, error);
  }

  // 3. Fallback to DiceBear (Reliable Generation)
  // This guarantees an image always loads if the API fails.
  const fallback = `https://api.dicebear.com/9.x/pixel-art/svg?seed=${encodeURIComponent(name)}`;
  imageCache[name] = fallback;
  return fallback;
};