export enum GamePhase {
  START_SCREEN = 'START_SCREEN',
  EXPLORING = 'EXPLORING',
  COMBAT = 'COMBAT',
  GAME_OVER = 'GAME_OVER',
  LOADING = 'LOADING',
  VICTORY = 'VICTORY'
}

export enum CharacterClass {
  KNIGHT = 'Cavaleiro', 
  MAGE = 'Mago',       
  ENGINEER = 'Engenheiro' 
}

export interface Character {
  id: string;
  name: string;
  role: CharacterClass;
  hp: number;
  maxHp: number;
  mp: number;
  maxMp: number;
  lvl: number;
  skills: string[];
}

export interface Enemy {
  id: string;
  name: string;
  description: string;
  hp: number;
  maxHp: number;
  attack: number;
  xp: number;
  imageUrl?: string;
}

export interface StoryChoice {
  text: string;
  nextNodeId: string;
}

export interface StoryNode {
  id: string;
  text: string;
  choices: StoryChoice[];
  type: 'NARRATIVE' | 'COMBAT_ENCOUNTER' | 'LOOT' | 'ENDING';
  enemyData?: Enemy; // Only if type is COMBAT_ENCOUNTER
  winNodeId?: string; // Where to go after winning combat
  background?: string; // Optional background override
}

export interface CombatLog {
  message: string;
  type: 'info' | 'damage' | 'heal' | 'crit';
}

export interface StorySegment {
  text: string;
  choices: string[];
  type: 'NARRATIVE' | 'COMBAT_ENCOUNTER' | 'LOOT';
  enemyData?: {
    name: string;
    description: string;
    hp: number;
    maxHp: number;
    attack: number;
    xp: number;
  };
}