import { Character, Enemy } from "../types";

const API_BASE = "https://www.moogleapi.com/api/v1";

// Cache to prevent hitting the API repeatedly for the same entity
const imageCache: Record<string, string> = {};

// Fallback authentic SNES sprites in case API returns Amano art that doesn't fit, or fails
const SNES_SPRITE_OVERRIDES: Record<string, string> = {
  'Terra Branford': 'https://static.wikia.nocookie.net/finalfantasy/images/6/68/FFVI_Terra_Magitek_Armor_Sprite.png',
  'Biggs': 'https://static.wikia.nocookie.net/finalfantasy/images/8/85/FFVI_Magitek_Armor_Sprite.png',
  'Wedge': 'https://static.wikia.nocookie.net/finalfantasy/images/9/9e/FFVI_Magitek_Armor_Sprite_2.png',
  'Narshe Guard': 'https://static.wikia.nocookie.net/finalfantasy/images/e/e3/FFVI_Guard_Sprite.png',
  'Silver Lobo': 'https://static.wikia.nocookie.net/finalfantasy/images/7/78/FFVI_Silver_Lobo_Sprite.png',
  'Whelk': 'https://static.wikia.nocookie.net/finalfantasy/images/a/a2/FFVI_Whelk_Sprite.png',
  'Whelk Head': 'https://static.wikia.nocookie.net/finalfantasy/images/6/67/FFVI_Whelk_Head_Sprite.png'
};

export const fetchEntityImage = async (name: string, type: 'HERO' | 'ENEMY'): Promise<string> => {
  // 1. Check Cache
  if (imageCache[name]) return imageCache[name];

  // 2. Check Manual Overrides (For Authentic SNES feel)
  // We prefer these for the specific intro sequence characters to ensure they look like sprites
  if (SNES_SPRITE_OVERRIDES[name]) {
    imageCache[name] = SNES_SPRITE_OVERRIDES[name];
    return SNES_SPRITE_OVERRIDES[name];
  }

  try {
    let url = "";
    
    // 3. Query MoogleAPI
    if (type === 'HERO') {
      const response = await fetch(`${API_BASE}/characters/search?name=${encodeURIComponent(name)}`);
      const data = await response.json();
      // MoogleAPI returns an array. We take the first match.
      if (Array.isArray(data) && data.length > 0 && data[0].picture) {
        url = data[0].picture;
      }
    } else {
      const response = await fetch(`${API_BASE}/monsters/search?name=${encodeURIComponent(name)}`);
      const data = await response.json();
      if (Array.isArray(data) && data.length > 0 && data[0].picture) {
        url = data[0].picture;
      }
    }

    if (url) {
      imageCache[name] = url;
      return url;
    }
  } catch (error) {
    console.warn(`MoogleAPI fetch failed for ${name}`, error);
  }

  // 4. Fallback if API fails
  const fallback = `https://api.dicebear.com/9.x/pixel-art/svg?seed=${name}`;
  imageCache[name] = fallback;
  return fallback;
};
