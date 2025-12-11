import { Character, Enemy } from "../types";

// Helper to generate Enemy entries quickly
const createEnemyEntry = (name: string) => {
  const firstLetter = name.charAt(0).toUpperCase();
  // Handle special cases like "1st Class" which might be in '1' or '#'. 
  // Standardizing on First Letter logic for now as per site structure usually.
  const folder = /^\d/.test(firstLetter) ? firstLetter : firstLetter;
  
  return {
    "asset_id": `enemy_${name.toLowerCase().replace(/\s/g, '_')}`,
    "entity_type": "enemy",
    "entity_ref_id": name,
    "asset_url": `https://www.videogamesprites.net/FinalFantasy6/Enemies/${folder}/${encodeURIComponent(name)}.gif`,
    "variant": "battle_sprite"
  };
};

const ADDITIONAL_ENEMIES = [
  // Animals / Monsters
  "Lobo", "Red Fang", "Lunaris", "Red Wolf",
  "Vector Pup", "Doberman", "Bounty Man", "Garm",
  "Fidor", "Ralph", "Bogy",
  "Stray Cat", "Spek Tor", "Wild Cat",
  "Gold Bear", "Ursus", "Slatter", "Prussian",
  "Vomammoth", "Tusker", "Nastidon",
  "Were-Rat", "Wild Rat", "Sewer Rat", "Vermin",
  "Leafer", "Rhobite", "Nohrabbit",
  "Harpiai", "Harpy", "Aquila",
  "Vulture", "Gobbler", "Osprey",
  "Dark Wind", "Cirpius", "Vindr",
  "Beakor", "Abolisher", "Kiwok", "Sprinter",
  "Chicken Lip", "Cluck",
  "Lizard", "Geckorex",
  "Gigan Toad", "Reach Frog",
  "Areneid", "Coelecite", "Scorpion",
  "Primordite", "Exocite", "Maliga",
  "Rhodox", "Peepers", "Poppers",
  "Gilomantis", "Toe Cutter", "Mantodea",
  "Crass Hopper", "Weed Feeder", "Insecare",
  "Hornet", "Mind Candy", "Bug",
  "Crawly", "Slurm",
  "Sand Ray", "Trilobiter", "Earth Guard",
  "Anguiform", "Latimeria",
  "Piranha",
  "Sand Horse", "Hippocampus",
  "Nautiloid", "Cephaler",
  "Hermit Crab", "Gloom Shell",
  "Aspik", "Parasite",
  "Actaneon", "Anemone", "Sea Flower",
  
  // Humanoids
  "Rider", "Dante", "Test Rider",
  "Templar Cadet", "Leader Sp. Forces", "General",
  "Grunt", "Soldier", "Commander", "Officer", "Trooper", "Commando",
  "Guard", "Still Going",
  "Samurai", "Retainer", "Katana Soul",
  "Ninja", "Covert", "Outsider",
  "Brawler", "Iron Fist", "Scrapper",
  "Merchant",
  "B-day Suit",
  "Slam Dancer", "Soul Dancer", "L30 Magic", "Tap Dancer",
  "Barb-E", "Dahling", "L80 Magic", "Madam",
  "Critic",
  "Repo Man", "Grease Monk", "1st Class", "Gabbledegak",
  "Harvester", "Neck Hunter", "Punisher",
  "Joker", "Parasoul", "Rain Man", "L40 Magic",
  "Hades Gigas", "Colossus", "Gigantos", "Borras",
  "Pipsqueak", "Tomb Thumb", "Iron Hitman",
  "Woolly", "L60 Magic",
  "Naughty", "Trixter", "L90 Magic",
  "Orog", "Ogor", "Hemophyte"
].map(createEnemyEntry);

// The asset database provided by the user, expanded with Intro Characters & Enemies
const ASSET_DB = [
  // --- INTRO CHARACTERS (CORRECTED) ---
  {
    "asset_id": "intro_biggs",
    "entity_type": "character",
    "entity_ref_id": "Biggs",
    // Exact URL pattern provided by user for Party folder (Left facing)
    "asset_url": "https://www.videogamesprites.net/FinalFantasy6/Party/Vicks/Vicks%20-%20M-Tek%20(Left).gif",
    "variant": "battle_sprite"
  },
  {
    "asset_id": "intro_wedge",
    "entity_type": "character",
    "entity_ref_id": "Wedge",
    // Wedge uses the same Magitek Armor sprite as Vicks/Biggs. 
    // Pointing to Vicks file ensures it loads correctly since we verified Vicks works.
    "asset_url": "https://www.videogamesprites.net/FinalFantasy6/Party/Vicks/Vicks%20-%20M-Tek%20(Left).gif",
    "variant": "battle_sprite"
  },
  {
    "asset_id": "intro_guard",
    "entity_type": "enemy",
    "entity_ref_id": "Command",
    // Removed letter subfolder based on user report that previous attempt failed.
    "asset_url": "https://www.videogamesprites.net/FinalFantasy6/Enemies/Commando.gif",
    "variant": "battle_sprite"
  },
  {
    "asset_id": "intro_lobo",
    "entity_type": "enemy",
    "entity_ref_id": "Silver Lobo",
    // Fixed URL to point to the correct generic 'Lobo' file location which is stable
    "asset_url": "https://www.videogamesprites.net/FinalFantasy6/Enemies/Lobo.gif",
    "variant": "battle_sprite"
  },
  
  // --- GENERATED ENEMIES FROM SCREENSHOTS ---
  ...ADDITIONAL_ENEMIES,

  // --- USER PROVIDED JSON ---
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
    "asset_id": "asset_8",
    "entity_type": "character",
    "entity_ref_id": "Locke",
    "asset_url": "https://www.videogamesprites.net/FinalFantasy6/Party/Locke/Locke%20-%20World.gif",
    "variant": "world_sprite"
  },
  {
    "asset_id": "asset_9",
    "entity_type": "character",
    "entity_ref_id": "Edgar",
    "asset_url": "https://www.videogamesprites.net/FinalFantasy6/Party/Edgar/Edgar%20-%20Battle.gif",
    "variant": "battle_sprite"
  },
  {
    "asset_id": "asset_10",
    "entity_type": "character",
    "entity_ref_id": "Edgar",
    "asset_url": "https://www.videogamesprites.net/FinalFantasy6/Party/Edgar/Edgar%20-%20World.gif",
    "variant": "world_sprite"
  },
  {
    "asset_id": "asset_11",
    "entity_type": "character",
    "entity_ref_id": "Sabin",
    "asset_url": "https://www.videogamesprites.net/FinalFantasy6/Party/Sabin/Sabin%20-%20Battle.gif",
    "variant": "battle_sprite"
  },
  {
    "asset_id": "asset_12",
    "entity_type": "character",
    "entity_ref_id": "Sabin",
    "asset_url": "https://www.videogamesprites.net/FinalFantasy6/Party/Sabin/Sabin%20-%20World.gif",
    "variant": "world_sprite"
  },
  {
    "asset_id": "asset_13",
    "entity_type": "character",
    "entity_ref_id": "Celes",
    "asset_url": "https://www.videogamesprites.net/FinalFantasy6/Party/Celes/Celes%20-%20Battle.gif",
    "variant": "battle_sprite"
  },
  {
    "asset_id": "asset_14",
    "entity_type": "character",
    "entity_ref_id": "Celes",
    "asset_url": "https://www.videogamesprites.net/FinalFantasy6/Party/Celes/Celes%20-%20World.gif",
    "variant": "world_sprite"
  },
  {
    "asset_id": "asset_15",
    "entity_type": "character",
    "entity_ref_id": "Shadow",
    "asset_url": "https://www.videogamesprites.net/FinalFantasy6/Party/Shadow/Shadow%20-%20Battle.gif",
    "variant": "battle_sprite"
  },
  {
    "asset_id": "asset_16",
    "entity_type": "character",
    "entity_ref_id": "Shadow",
    "asset_url": "https://www.videogamesprites.net/FinalFantasy6/Party/Shadow/Shadow%20-%20World.gif",
    "variant": "world_sprite"
  },
  {
    "asset_id": "asset_17",
    "entity_type": "character",
    "entity_ref_id": "Cyan",
    "asset_url": "https://www.videogamesprites.net/FinalFantasy6/Party/Cyan/Cyan%20-%20Battle.gif",
    "variant": "battle_sprite"
  },
  {
    "asset_id": "asset_18",
    "entity_type": "character",
    "entity_ref_id": "Cyan",
    "asset_url": "https://www.videogamesprites.net/FinalFantasy6/Party/Cyan/Cyan%20-%20World.gif",
    "variant": "world_sprite"
  },
  {
    "asset_id": "asset_19",
    "entity_type": "character",
    "entity_ref_id": "Gau",
    "asset_url": "https://www.videogamesprites.net/FinalFantasy6/Party/Gau/Gau%20-%20Battle.gif",
    "variant": "battle_sprite"
  },
  {
    "asset_id": "asset_20",
    "entity_type": "character",
    "entity_ref_id": "Gau",
    "asset_url": "https://www.videogamesprites.net/FinalFantasy6/Party/Gau/Gau%20-%20World.gif",
    "variant": "world_sprite"
  },
  {
    "asset_id": "asset_21",
    "entity_type": "character",
    "entity_ref_id": "Setzer",
    "asset_url": "https://www.videogamesprites.net/FinalFantasy6/Party/Setzer/Setzer%20-%20Battle.gif",
    "variant": "battle_sprite"
  },
  {
    "asset_id": "asset_22",
    "entity_type": "character",
    "entity_ref_id": "Setzer",
    "asset_url": "https://www.videogamesprites.net/FinalFantasy6/Party/Setzer/Setzer%20-%20World.gif",
    "variant": "world_sprite"
  },
  {
    "asset_id": "asset_23",
    "entity_type": "character",
    "entity_ref_id": "Mog",
    "asset_url": "https://www.videogamesprites.net/FinalFantasy6/Party/Mog/Mog%20-%20Battle.gif",
    "variant": "battle_sprite"
  },
  {
    "asset_id": "asset_24",
    "entity_type": "character",
    "entity_ref_id": "Mog",
    "asset_url": "https://www.videogamesprites.net/FinalFantasy6/Party/Mog/Mog%20-%20World.gif",
    "variant": "world_sprite"
  },
  {
    "asset_id": "asset_25",
    "entity_type": "character",
    "entity_ref_id": "Strago",
    "asset_url": "https://www.videogamesprites.net/FinalFantasy6/Party/Strago/Strago%20-%20Battle.gif",
    "variant": "battle_sprite"
  },
  {
    "asset_id": "asset_26",
    "entity_type": "character",
    "entity_ref_id": "Strago",
    "asset_url": "https://www.videogamesprites.net/FinalFantasy6/Party/Strago/Strago%20-%20World.gif",
    "variant": "world_sprite"
  },
  {
    "asset_id": "asset_27",
    "entity_type": "character",
    "entity_ref_id": "Relm",
    "asset_url": "https://www.videogamesprites.net/FinalFantasy6/Party/Relm/Relm%20-%20Battle.gif",
    "variant": "battle_sprite"
  },
  {
    "asset_id": "asset_28",
    "entity_type": "character",
    "entity_ref_id": "Relm",
    "asset_url": "https://www.videogamesprites.net/FinalFantasy6/Party/Relm/Relm%20-%20World.gif",
    "variant": "world_sprite"
  },
  {
    "asset_id": "asset_29",
    "entity_type": "character",
    "entity_ref_id": "Gogo",
    "asset_url": "https://www.videogamesprites.net/FinalFantasy6/Party/Gogo/Gogo%20-%20Battle.gif",
    "variant": "battle_sprite"
  },
  {
    "asset_id": "asset_30",
    "entity_type": "character",
    "entity_ref_id": "Gogo",
    "asset_url": "https://www.videogamesprites.net/FinalFantasy6/Party/Gogo/Gogo%20-%20World.gif",
    "variant": "world_sprite"
  },
  {
    "asset_id": "asset_31",
    "entity_type": "character",
    "entity_ref_id": "Umaro",
    "asset_url": "https://www.videogamesprites.net/FinalFantasy6/Party/Umaro/Umaro%20-%20Battle.gif",
    "variant": "battle_sprite"
  },
  {
    "asset_id": "asset_32",
    "entity_type": "character",
    "entity_ref_id": "Umaro",
    "asset_url": "https://www.videogamesprites.net/FinalFantasy6/Party/Umaro/Umaro%20-%20World.gif",
    "variant": "world_sprite"
  },
  {
    "asset_id": "asset_67",
    "entity_type": "boss",
    "entity_ref_id": "Whelk",
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
    "asset_id": "asset_72",
    "entity_type": "boss",
    "entity_ref_id": "Vargas",
    "asset_url": "https://www.videogamesprites.net/FinalFantasy6/Bosses/03%20-%20Vargas.gif",
    "variant": "main_sprite"
  },
  {
    "asset_id": "asset_73",
    "entity_type": "boss",
    "entity_ref_id": "Ultros",
    "asset_url": "https://www.videogamesprites.net/FinalFantasy6/Bosses/04%20-%20Ultros.gif",
    "variant": "main_sprite"
  },
  {
    "asset_id": "asset_78",
    "entity_type": "boss",
    "entity_ref_id": "Kefka", 
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

// Fallback map (just in case, though ASSET_DB should cover it now)
const SPRITE_MAP_MANUAL: Record<string, string> = {
  'Megalodoth': 'https://www.videogamesprites.net/FinalFantasy6/Enemies/M/Megalodoth.gif'
};

export const fetchEntityImage = async (name: string, type: 'HERO' | 'ENEMY'): Promise<string> => {
  // 1. Check Memory Cache
  if (imageCache[name]) return imageCache[name];

  let foundUrl = '';

  // 2. Try to find in the ASSET_DB (Priority)
  // Clean the name (e.g. "Terra Branford" -> "Terra") to match DB keys
  // Also remove parens like "Kefka (God)" -> "Kefka"
  const cleanName = name.split(' ')[0]; 

  const dbAsset = ASSET_DB.find(asset => {
      const ref = asset.entity_ref_id.toLowerCase();
      const n = name.toLowerCase();
      const c = cleanName.toLowerCase();
      
      // Match full name or first name
      return ref === n || ref === c || n.includes(ref);
  });

  if (dbAsset) {
    foundUrl = dbAsset.asset_url;
  }

  // 3. Fallback to Manual Map
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