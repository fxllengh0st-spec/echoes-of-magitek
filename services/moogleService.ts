import { Character, Enemy } from "../types";

// The asset database provided by the user
const ASSET_DB = [
  {
    "asset_id": "asset_5",
    "entity_type": "character",
    "entity_ref_id": "Terra",
    "asset_url": "https://www.videogamesprites.net/FinalFantasy6/Party/Terra/Terra%20-%20Battle.gif",
    "variant": "battle_sprite"
  },
  {
    "asset_id": "asset_6",
    "entity_type": "character",
    "entity_ref_id": "Terra",
    "asset_url": "https://www.videogamesprites.net/FinalFantasy6/Party/Terra/Terra%20-%20World.gif",
    "variant": "world_sprite"
  },
  {
    "asset_id": "asset_7",
    "entity_type": "character",
    "entity_ref_id": "Locke",
    "asset_url": "https://www.videogamesprites.net/FinalFantasy6/Party/Locke/Locke%20-%20Battle.gif",
    "variant": "battle_sprite"
  },
  {
    "asset_id": "asset_9",
    "entity_type": "character",
    "entity_ref_id": "Edgar",
    "asset_url": "https://www.videogamesprites.net/FinalFantasy6/Party/Edgar/Edgar%20-%20Battle.gif",
    "variant": "battle_sprite"
  },
  {
    "asset_id": "asset_11",
    "entity_type": "character",
    "entity_ref_id": "Sabin",
    "asset_url": "https://www.videogamesprites.net/FinalFantasy6/Party/Sabin/Sabin%20-%20Battle.gif",
    "variant": "battle_sprite"
  },
  {
    "asset_id": "asset_13",
    "entity_type": "character",
    "entity_ref_id": "Celes",
    "asset_url": "https://www.videogamesprites.net/FinalFantasy6/Party/Celes/Celes%20-%20Battle.gif",
    "variant": "battle_sprite"
  },
  {
    "asset_id": "asset_15",
    "entity_type": "character",
    "entity_ref_id": "Shadow",
    "asset_url": "https://www.videogamesprites.net/FinalFantasy6/Party/Shadow/Shadow%20-%20Battle.gif",
    "variant": "battle_sprite"
  },
  {
    "asset_id": "asset_17",
    "entity_type": "character",
    "entity_ref_id": "Cyan",
    "asset_url": "https://www.videogamesprites.net/FinalFantasy6/Party/Cyan/Cyan%20-%20Battle.gif",
    "variant": "battle_sprite"
  },
  {
    "asset_id": "asset_19",
    "entity_type": "character",
    "entity_ref_id": "Gau",
    "asset_url": "https://www.videogamesprites.net/FinalFantasy6/Party/Gau/Gau%20-%20Battle.gif",
    "variant": "battle_sprite"
  },
  {
    "asset_id": "asset_21",
    "entity_type": "character",
    "entity_ref_id": "Setzer",
    "asset_url": "https://www.videogamesprites.net/FinalFantasy6/Party/Setzer/Setzer%20-%20Battle.gif",
    "variant": "battle_sprite"
  },
  {
    "asset_id": "asset_23",
    "entity_type": "character",
    "entity_ref_id": "Mog",
    "asset_url": "https://www.videogamesprites.net/FinalFantasy6/Party/Mog/Mog%20-%20Battle.gif",
    "variant": "battle_sprite"
  },
  {
    "asset_id": "asset_25",
    "entity_type": "character",
    "entity_ref_id": "Strago",
    "asset_url": "https://www.videogamesprites.net/FinalFantasy6/Party/Strago/Strago%20-%20Battle.gif",
    "variant": "battle_sprite"
  },
  {
    "asset_id": "asset_27",
    "entity_type": "character",
    "entity_ref_id": "Relm",
    "asset_url": "https://www.videogamesprites.net/FinalFantasy6/Party/Relm/Relm%20-%20Battle.gif",
    "variant": "battle_sprite"
  },
  {
    "asset_id": "asset_29",
    "entity_type": "character",
    "entity_ref_id": "Gogo",
    "asset_url": "https://www.videogamesprites.net/FinalFantasy6/Party/Gogo/Gogo%20-%20Battle.gif",
    "variant": "battle_sprite"
  },
  {
    "asset_id": "asset_31",
    "entity_type": "character",
    "entity_ref_id": "Umaro",
    "asset_url": "https://www.videogamesprites.net/FinalFantasy6/Party/Umaro/Umaro%20-%20Battle.gif",
    "variant": "battle_sprite"
  },
  {
    "asset_id": "asset_67",
    "entity_type": "boss",
    "entity_ref_id": "Whelk Head",
    "asset_url": "https://www.videogamesprites.net/FinalFantasy6/Bosses/01%20-%20Whelk%20Head.gif",
    "variant": "main_sprite"
  },
  {
    "asset_id": "asset_68",
    "entity_type": "boss",
    "entity_ref_id": "Whelk Shell",
    "asset_url": "https://www.videogamesprites.net/FinalFantasy6/Bosses/01%20-%20Whelk1.gif",
    "variant": "main_sprite"
  },
  {
    "asset_id": "asset_70",
    "entity_type": "boss",
    "entity_ref_id": "Marshal",
    "asset_url": "https://www.videogamesprites.net/FinalFantasy6/Bosses/02%20-%20Marshal.gif",
    "variant": "main_sprite"
  },
  {
    "asset_id": "asset_78",
    "entity_type": "boss",
    "entity_ref_id": "Kefka (Imperial Camp)",
    "asset_url": "https://www.videogamesprites.net/FinalFantasy6/Bosses/09%20-%20Kefka.gif",
    "variant": "main_sprite"
  },
  {
    "asset_id": "asset_102",
    "entity_type": "boss",
    "entity_ref_id": "Atma Weapon",
    "asset_url": "https://www.videogamesprites.net/FinalFantasy6/Bosses/19%20-%20Atma%20Weapon.gif",
    "variant": "main_sprite"
  }
];

// Cache to prevent hitting the logic repeatedly
const imageCache: Record<string, string> = {};

// Manual Overrides for generic enemies or special intro states (Magitek) not in the JSON provided
const SPRITE_MAP_MANUAL: Record<string, string> = {
  // Intro Magitek Armor (Biggs & Wedge use Enemy Sprite in Intro)
  'Biggs': 'https://www.videogamesprites.net/FinalFantasy6/Enemies/M/Magitek%20Armor.gif',
  'Wedge': 'https://www.videogamesprites.net/FinalFantasy6/Enemies/M/Magitek%20Armor.gif',
  
  // Generic Enemies
  'Narshe Guard': 'https://www.videogamesprites.net/FinalFantasy6/Enemies/G/Guard.gif',
  'Silver Lobo': 'https://www.videogamesprites.net/FinalFantasy6/Enemies/S/Silver%20Lobo.gif',
  
  // Bosses if not using JSON parts or if JSON name mismatch
  'Whelk': 'https://www.videogamesprites.net/FinalFantasy6/Enemies/W/Whelk.gif', // Using combined sprite for simplicity
  'Megalodoth': 'https://www.videogamesprites.net/FinalFantasy6/Enemies/M/Megalodoth.gif'
};

export const fetchEntityImage = async (name: string, type: 'HERO' | 'ENEMY'): Promise<string> => {
  // 1. Check Memory Cache
  if (imageCache[name]) return imageCache[name];

  let foundUrl = '';

  // 2. Try to find in the provided ASSET_DB (Priority)
  // Clean the name (e.g. "Terra Branford" -> "Terra") to match DB keys
  const cleanName = name.split(' ')[0]; 

  const dbAsset = ASSET_DB.find(asset => 
    (asset.entity_ref_id === cleanName || asset.entity_ref_id === name) &&
    (asset.variant === 'battle_sprite' || asset.variant === 'main_sprite')
  );

  if (dbAsset) {
    foundUrl = dbAsset.asset_url;
  }

  // 3. If not in DB, check Manual Overrides (Enemies/Magitek)
  if (!foundUrl) {
    if (SPRITE_MAP_MANUAL[name]) foundUrl = SPRITE_MAP_MANUAL[name];
    else if (SPRITE_MAP_MANUAL[cleanName]) foundUrl = SPRITE_MAP_MANUAL[cleanName];
  }

  // 4. Fallback to DiceBear
  if (!foundUrl) {
    foundUrl = `https://api.dicebear.com/9.x/pixel-art/svg?seed=${encodeURIComponent(name)}`;
  }

  // Save to cache
  imageCache[name] = foundUrl;
  return foundUrl;
};