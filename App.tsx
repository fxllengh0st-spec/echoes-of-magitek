import React, { useState, useEffect, useRef } from 'react';
import { getStartNode, getStoryNode } from './services/storyEngine';
import { GamePhase, Character, CharacterClass, Enemy, StoryNode } from './types';
import { FFWindow, RetroButton, RetroLoading } from './components/RetroUI';
import { CombatScreen } from './components/CombatScreen';

// Initial Hero State - FF6 Intro Style
// Names updated to match MoogleAPI search queries where possible
const INITIAL_PARTY: Character[] = [
  {
    id: 'terra_magitek',
    name: 'Terra Branford',
    role: CharacterClass.MAGE,
    hp: 250,
    maxHp: 250,
    mp: 100,
    maxMp: 100,
    lvl: 3,
    skills: ['Bio Blast', 'Confuser', 'Magitek Missile']
  },
  {
    id: 'biggs_magitek',
    name: 'Biggs',
    role: CharacterClass.KNIGHT,
    hp: 300,
    maxHp: 300,
    mp: 40,
    maxMp: 40,
    lvl: 3,
    skills: ['Fire Beam', 'Thunder Beam']
  },
  {
    id: 'wedge_magitek',
    name: 'Wedge',
    role: CharacterClass.KNIGHT,
    hp: 280,
    maxHp: 280,
    mp: 40,
    maxMp: 40,
    lvl: 3,
    skills: ['Ice Beam', 'Heal Force']
  }
];

const App: React.FC = () => {
  const [phase, setPhase] = useState<GamePhase>(GamePhase.START_SCREEN);
  const [party, setParty] = useState<Character[]>(INITIAL_PARTY);
  const [currentNode, setCurrentNode] = useState<StoryNode | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [currentEnemy, setCurrentEnemy] = useState<Enemy | null>(null);
  // Default to the snowy intro shot
  const [currentBackground, setCurrentBackground] = useState<string>('https://static.wikia.nocookie.net/finalfantasy/images/e/e9/FFVI_Pixel_Remaster_Raid_on_Narshe_1.png/revision/latest/thumbnail/width/360/height/450?cb=20221226140444');
  
  const textScrollRef = useRef<HTMLDivElement>(null);

  // Scroll to top whenever text changes or phase switches (e.g. back from combat)
  useEffect(() => {
    if (textScrollRef.current) {
      textScrollRef.current.scrollTop = 0;
    }
  }, [currentNode?.id, currentNode?.text, phase]);

  const handleStartGame = () => {
    setPhase(GamePhase.LOADING);
    setTimeout(() => {
      const startNode = getStartNode();
      updateStoryState(startNode);
      setPhase(GamePhase.EXPLORING);
    }, 1500); 
  };

  const updateStoryState = (node: StoryNode) => {
    setCurrentNode(node);
    // Only update background if the node explicitly provides one
    if (node.background) {
      setCurrentBackground(node.background);
    }
  };

  const handleChoice = (nextId: string) => {
    setIsLoading(true);
    
    // Simulate travel time
    setTimeout(() => {
      const nextNode = getStoryNode(nextId);
      updateStoryState(nextNode);
      
      if (nextNode.type === 'COMBAT_ENCOUNTER' && nextNode.enemyData) {
        setCurrentEnemy(nextNode.enemyData);
      } else if (nextNode.type === 'LOOT') {
        const newParty = party.map(c => ({
            ...c,
            hp: Math.min(c.maxHp, c.hp + 50)
        }));
        setParty(newParty);
      }
      
      setIsLoading(false);
    }, 800);
  };

  const startCombat = () => {
    setPhase(GamePhase.COMBAT);
  };

  const handleVictory = (xp: number) => {
    // Level Up Logic Simplified
    const newParty = party.map(char => {
        if (char.hp <= 0) return { ...char, hp: 1 }; // Revive with 1 HP
        return {
            ...char,
            lvl: char.lvl + 1,
            maxHp: char.maxHp + 20,
            hp: char.maxHp + 20, // Full heal on level up
            maxMp: char.maxMp + 10,
            mp: char.maxMp + 10
        };
    });
    
    setParty(newParty);
    setPhase(GamePhase.EXPLORING);
    setCurrentEnemy(null);
    
    // Advance to the win node defined in the current combat node
    if (currentNode?.winNodeId) {
       const winNode = getStoryNode(currentNode.winNodeId);
       updateStoryState(winNode);
    }
  };

  const handleGameOver = () => {
    setPhase(GamePhase.GAME_OVER);
  };

  const resetGame = () => {
    setParty(INITIAL_PARTY);
    setPhase(GamePhase.START_SCREEN);
    setCurrentNode(null);
  };

  // --- Render Views ---

  if (phase === GamePhase.START_SCREEN) {
    return (
      <div className="h-dvh w-full flex flex-col items-center justify-center bg-black relative overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-50 bg-[url('https://static.wikia.nocookie.net/finalfantasy/images/e/e9/FFVI_Pixel_Remaster_Raid_on_Narshe_1.png/revision/latest/thumbnail/width/360/height/450?cb=20221226140444')] bg-cover bg-center filter grayscale contrast-125" />
        <div className="z-10 text-center max-w-2xl px-4 flex flex-col items-center">
          <h1 className="text-6xl md:text-9xl mb-4 text-transparent bg-clip-text bg-gradient-to-t from-red-700 via-red-500 to-white font-bold tracking-tighter drop-shadow-[4px_4px_0_rgba(0,0,0,1)]" style={{ fontFamily: 'VT323' }}>
            FINAL FANTASY VI
          </h1>
          <FFWindow className="p-8 w-full max-w-md animate-in slide-in-from-bottom-10 fade-in duration-1000 bg-gradient-to-b from-blue-900 to-black">
             <p className="text-xl md:text-2xl text-gray-200 mb-8 text-shadow leading-relaxed italic">
               "Não deixe que estas luzes te enganem..."
             </p>
             <RetroButton onClick={handleStartGame} selected>INICIAR MISSÃO</RetroButton>
             <div className="h-2"></div>
             <RetroButton onClick={() => {}} disabled>CARREGAR</RetroButton>
          </FFWindow>
          
          <div className="mt-8 text-sm text-gray-500 font-mono">
            Remake Conceitual (Script Fixo)
          </div>
        </div>
      </div>
    );
  }

  if (phase === GamePhase.LOADING) {
    return (
      <div className="h-dvh w-full flex items-center justify-center bg-black">
         <RetroLoading />
      </div>
    );
  }

  if (phase === GamePhase.GAME_OVER) {
    return (
      <div className="h-dvh w-full flex flex-col items-center justify-center bg-red-950 text-white z-50 animate-in zoom-in duration-1000">
        <h1 className="text-8xl text-red-600 mb-4 text-shadow font-bold">ANNIHILATED</h1>
        <FFWindow className="w-64 text-center">
            <p className="mb-4 text-xl text-gray-300">A missão falhou.</p>
            <RetroButton onClick={resetGame} selected>Reiniciar</RetroButton>
        </FFWindow>
      </div>
    );
  }

  // --- MAIN LAYOUT (Exploring & Combat) ---
  return (
    <div className="h-dvh w-full bg-black flex flex-col mx-auto max-w-6xl relative shadow-2xl overflow-hidden">
      
      {/* Header Bar */}
      {phase !== GamePhase.COMBAT && (
          <div className="absolute top-0 left-0 right-0 z-20 flex justify-between items-center p-2 bg-gradient-to-b from-black/80 to-transparent">
            <div className="text-gray-200 text-2xl font-bold drop-shadow-md pl-2">
                 {party[0].name.split(' ')[0]} <span className="text-xs text-gray-400 align-middle ml-2">(Líder)</span>
            </div>
            <div className="flex gap-4 text-sm text-blue-200 font-mono pr-2">
                {party.map(c => (
                    <span key={c.id} className={c.hp < c.maxHp * 0.3 ? "text-yellow-400 animate-pulse" : ""}>
                        {c.name.split(' ')[0]} {c.hp}
                    </span>
                ))}
            </div>
          </div>
      )}

      {/* Content Area */}
      <div className="flex-grow flex flex-col h-full relative">
        
        {phase === GamePhase.COMBAT && currentEnemy ? (
          <CombatScreen 
            party={party} 
            enemy={currentEnemy} 
            onVictory={handleVictory} 
            onDefeat={handleGameOver}
            updateParty={setParty}
          />
        ) : (
          /* EXPLORATION MODE */
          <>
            {/* Visual Scene */}
            <div className="relative h-[65%] md:h-[60%] w-full bg-gray-900 overflow-hidden">
                 <div className="absolute inset-0 bg-cover bg-center transition-all duration-1000 ease-in-out"
                      style={{ 
                          backgroundImage: `url('${currentBackground}')`, 
                          filter: isLoading ? 'grayscale(0.8) blur(2px)' : 'sepia(0.3) contrast(1.1)' 
                      }}
                 ></div>
                 
                 {/* Snow Effect Overlay */}
                 <div className="absolute inset-0 bg-[url('https://cdnjs.cloudflare.com/ajax/libs/animate.css/4.1.1/animate.min.css')] opacity-10 pointer-events-none"></div>

                 {/* Text Window (Moved from absolute overlay to flex child to allow better sizing/scroll) */}
                 <div className="absolute bottom-0 w-full bg-[#000044] bg-opacity-70 p-4 md:p-8 h-[40%] flex flex-col border-t-4 border-gray-600 shadow-xl">
                    <div 
                      ref={textScrollRef}
                      className="overflow-y-auto h-full pr-2 custom-scrollbar"
                    >
                        <p className="text-3xl md:text-5xl leading-tight text-gray-100 font-vt323 whitespace-pre-line drop-shadow-md">
                           {currentNode?.text}
                        </p>
                    </div>
                 </div>
            </div>

            {/* Interaction / Menu Area (Adjusted height) */}
            <div className="h-[35%] md:h-[40%] bg-[#000022] p-2 md:p-4 flex items-center justify-center border-t-4 border-gray-500">
               <FFWindow className="w-full h-full max-w-4xl flex flex-col justify-center relative bg-gradient-to-br from-blue-900/50 to-transparent">
                  {isLoading ? (
                      <div className="absolute inset-0 flex items-center justify-center bg-black/60 z-10 backdrop-blur-sm rounded">
                         <RetroLoading />
                      </div>
                  ) : (
                      <div className="grid grid-cols-1 gap-3">
                          {/* Special Pre-Combat Button */}
                          {currentNode?.type === 'COMBAT_ENCOUNTER' ? (
                            <div className="flex flex-col items-center animate-pulse">
                               <p className="text-red-400 text-lg mb-2 uppercase tracking-widest">Inimigo à frente!</p>
                               <RetroButton onClick={startCombat} selected>
                                  ⚔️ INICIAR COMBATE
                               </RetroButton>
                            </div>
                          ) : (
                              /* Standard Choices */
                              currentNode?.choices.map((choice, idx) => (
                                  <RetroButton key={idx} onClick={() => handleChoice(choice.nextNodeId)} selected={idx === 0}>
                                      {choice.text}
                                  </RetroButton>
                              ))
                          )}
                      </div>
                  )}
               </FFWindow>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default App;