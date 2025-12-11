import React, { useState, useEffect } from 'react';
import { Character, Enemy } from '../types';
import { FFWindow, RetroButton } from './RetroUI';
import { fetchEntityImage } from '../services/moogleService';

interface CombatScreenProps {
  party: Character[];
  enemy: Enemy;
  onVictory: (xp: number) => void;
  onDefeat: () => void;
  updateParty: (newParty: Character[]) => void;
}

export const CombatScreen: React.FC<CombatScreenProps> = ({ 
  party, enemy: initialEnemy, onVictory, onDefeat, updateParty 
}) => {
  const [enemy, setEnemy] = useState<Enemy>({ ...initialEnemy });
  const [activeCharIndex, setActiveCharIndex] = useState(0);
  const [turn, setTurn] = useState<'PLAYER' | 'ENEMY'>('PLAYER');
  const [actionMenu, setActionMenu] = useState<'MAIN' | 'SKILLS' | 'ITEMS'>('MAIN');
  
  // Image State
  const [heroImages, setHeroImages] = useState<Record<string, string>>({});
  const [enemyImage, setEnemyImage] = useState<string>('');

  // Animation States
  const [activeAnimId, setActiveAnimId] = useState<string | null>(null); 
  const [activeAnimClass, setActiveAnimClass] = useState('');
  const [enemyAnim, setEnemyAnim] = useState('');
  const [damageNumber, setDamageNumber] = useState<{ val: string, x: number, y: number, color: string } | null>(null);

  // Load Images via Service on Mount
  useEffect(() => {
    const loadImages = async () => {
      // Load Enemy
      const eImg = await fetchEntityImage(enemy.name, 'ENEMY');
      setEnemyImage(eImg);

      // Load Heroes
      const hImgs: Record<string, string> = {};
      for (const char of party) {
        hImgs[char.id] = await fetchEntityImage(char.name, 'HERO');
      }
      setHeroImages(hImgs);
    };
    loadImages();
  }, [enemy.name, party]); // Re-run if enemy changes

  const getNextLivingCharIndex = (startIndex: number): number | null => {
    let next = startIndex + 1;
    let loopCount = 0;
    while (loopCount < party.length) {
       if (next >= party.length) return null; 
       if (party[next].hp > 0) return next;
       next++;
       loopCount++;
    }
    return null;
  };

  const activeChar = party[activeCharIndex];

  const advanceTurn = () => {
    const nextIndex = getNextLivingCharIndex(activeCharIndex);
    
    if (nextIndex !== null) {
        setActiveCharIndex(nextIndex);
        setActionMenu('MAIN');
    } else {
        setTurn('ENEMY');
    }
  };

  const showDamage = (val: string, targetType: 'HERO' | 'ENEMY', targetIndex: number = 0, type: 'damage' | 'heal' = 'damage') => {
    const isHero = targetType === 'HERO';
    const x = isHero ? 65 + (targetIndex * 5) : 25; 
    const y = isHero ? 30 + (targetIndex * 15) : 40;
    
    setDamageNumber({ 
      val, 
      x, 
      y, 
      color: type === 'heal' ? 'text-green-400' : 'text-white' 
    });
    
    setTimeout(() => setDamageNumber(null), 1000);
  };

  const handleAttack = () => {
    if (turn !== 'PLAYER') return;
    
    setActiveAnimId(activeChar.id);
    setActiveAnimClass('attack-anim');
    setActionMenu('MAIN'); 

    setTimeout(() => {
      setActiveAnimClass('');
      setActiveAnimId(null);
      setEnemyAnim('shake brightness-150 sepia');
      
      const baseDmg = activeChar.lvl * 10;
      const variance = Math.floor(Math.random() * (baseDmg * 0.2));
      const damage = baseDmg + variance;
      
      showDamage(damage.toString(), 'ENEMY');

      setTimeout(() => {
        setEnemyAnim('');
        const newHp = Math.max(0, enemy.hp - damage);
        setEnemy(prev => ({ ...prev, hp: newHp }));
        
        if (newHp <= 0) {
          setTimeout(() => onVictory(enemy.xp), 1500);
        } else {
          advanceTurn();
        }
      }, 400);
    }, 300);
  };

  const handleSkill = (skillName: string) => {
    if (turn !== 'PLAYER') return;
    const cost = 12;

    if (activeChar.mp < cost) {
       showDamage("Sem MP", 'HERO', activeCharIndex);
       return;
    }

    const newParty = [...party];
    newParty[activeCharIndex] = { ...activeChar, mp: activeChar.mp - cost };
    updateParty(newParty);

    setActiveAnimId(activeChar.id);
    setActiveAnimClass('animate-pulse filter hue-rotate-90');
    setActionMenu('MAIN'); 

    setTimeout(() => {
      setActiveAnimClass('');
      setActiveAnimId(null);
      
      if (skillName.includes('Heal')) {
        const heal = activeChar.lvl * 20;
        const newHp = Math.min(activeChar.maxHp, activeChar.hp + heal);
        
        newParty[activeCharIndex] = { ...newParty[activeCharIndex], hp: newHp };
        updateParty(newParty);
        
        showDamage(heal.toString(), 'HERO', activeCharIndex, 'heal');
        advanceTurn();
      } else {
        setEnemyAnim('shake invert');
        const dmg = activeChar.lvl * 25; 
        showDamage(dmg.toString(), 'ENEMY', 0, 'damage');

        setTimeout(() => {
            setEnemyAnim('');
            const newHp = Math.max(0, enemy.hp - dmg);
            setEnemy(prev => ({ ...prev, hp: newHp }));

            if (newHp <= 0) {
                setTimeout(() => onVictory(enemy.xp), 1500);
            } else {
                advanceTurn();
            }
        }, 500);
      }
    }, 600);
  };

  useEffect(() => {
    if (turn === 'ENEMY' && enemy.hp > 0) {
      setTimeout(() => {
        setEnemyAnim('attack-anim');
        
        setTimeout(() => {
            setEnemyAnim('');
            
            const livingIndices = party.map((c, i) => c.hp > 0 ? i : -1).filter(i => i !== -1);
            if (livingIndices.length === 0) return; 
            
            const targetIndex = livingIndices[Math.floor(Math.random() * livingIndices.length)];
            
            setActiveAnimId(party[targetIndex].id);
            setActiveAnimClass('shake bg-red-900/50'); 
            
            const damage = Math.max(1, enemy.attack - Math.floor(party[targetIndex].lvl / 2));
            showDamage(damage.toString(), 'HERO', targetIndex);

            setTimeout(() => {
                setActiveAnimClass('');
                setActiveAnimId(null);
                
                const newParty = [...party];
                newParty[targetIndex] = { 
                    ...newParty[targetIndex], 
                    hp: Math.max(0, newParty[targetIndex].hp - damage) 
                };
                updateParty(newParty);

                const anyoneAlive = newParty.some(c => c.hp > 0);
                if (!anyoneAlive) {
                    setTimeout(onDefeat, 1000);
                } else {
                    setTurn('PLAYER');
                    const firstAlive = newParty.findIndex(c => c.hp > 0);
                    setActiveCharIndex(firstAlive);
                }
            }, 500);
        }, 300);
      }, 1200);
    }
  }, [turn, enemy.hp]);

  // Fallback if image fails to load (likely due to 403 Forbidden on hotlink)
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>, name: string) => {
    const target = e.currentTarget;
    const fallbackUrl = `https://api.dicebear.com/9.x/pixel-art/svg?seed=${encodeURIComponent(name)}`;
    
    // Prevent infinite loop if fallback also fails
    if (target.src !== fallbackUrl) {
      console.warn(`Failed to load image for ${name}, switching to fallback.`);
      target.src = fallbackUrl;
    }
  };

  return (
    <div className="flex flex-col h-full w-full">
      
      {/* --- BATTLEFIELD (Top 65%) --- */}
      <div className="relative flex-grow bg-gray-900 overflow-hidden perspective-1000">
        
        <div className="absolute inset-0 z-0 bg-cover bg-bottom opacity-50"
             style={{ 
               backgroundImage: `url('https://drive.google.com/uc?export=view&id=1rsZuiTZZRI37DeJS_weJvjxgn9Qih6wn')`,
               filter: 'blur(1px) contrast(1.2) brightness(0.7)'
             }} 
        />
        
        {damageNumber && (
          <div 
            className={`damage-number ${damageNumber.color}`}
            style={{ left: `${damageNumber.x}%`, top: `${damageNumber.y}%` }}
          >
            {damageNumber.val}
          </div>
        )}

        {/* --- ENEMY (Left) --- */}
        <div className={`absolute top-1/3 left-[5%] md:left-[15%] z-10 transition-all duration-500 ${enemy.hp <= 0 ? 'opacity-0 scale-50 blur-sm' : 'opacity-100'}`}>
          <div className={`w-32 h-32 md:w-56 md:h-56 transition-transform duration-100 ${enemyAnim} flex items-center justify-center`}>
             {enemyImage ? (
               <img 
                 src={enemyImage} 
                 alt={enemy.name}
                 onError={(e) => handleImageError(e, enemy.name)}
                 className="max-w-full max-h-full object-contain drop-shadow-[0_10px_10px_rgba(0,0,0,0.8)] filter contrast-110 image-pixelated"
               />
             ) : (
               <div className="w-16 h-16 animate-spin rounded-full border-4 border-red-500 border-t-transparent"></div>
             )}
          </div>
        </div>

        {/* --- HERO PARTY (Right Stacked) --- */}
        {party.map((char, index) => {
            if (char.hp <= 0) return null; 
            
            const rightPos = 15 - (index * 5); 
            const topPos = 30 + (index * 15);
            const isActive = turn === 'PLAYER' && activeCharIndex === index;
            const animClass = activeAnimId === char.id ? activeAnimClass : '';
            const imgUrl = heroImages[char.id];
            
            // Logic to determine if we flip the sprite.
            // 1. Hero Sprites (e.g., Terra Battle) usually face LEFT (Correct for right-side placement).
            // 2. Enemy Sprites (e.g., Magitek Armor) usually face RIGHT. If used by Heroes, they must be flipped.
            const isEnemySprite = imgUrl && imgUrl.includes('Enemies');
            const flipClass = isEnemySprite ? 'transform scale-x-[-1]' : '';

            return (
                <div 
                    key={char.id}
                    className={`absolute z-10 transition-all duration-300 ${animClass}`}
                    style={{ right: `${rightPos}%`, top: `${topPos}%` }}
                >
                    <div className="w-24 h-24 md:w-32 md:h-32 drop-shadow-[0_10px_5px_rgba(0,0,0,0.8)] relative flex items-center justify-center">
                        {isActive && actionMenu === 'MAIN' && (
                             <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-yellow-300 animate-bounce text-2xl">▼</div>
                        )}
                        {imgUrl ? (
                          <img 
                              src={imgUrl}
                              alt={char.name}
                              onError={(e) => handleImageError(e, char.name)}
                              className={`max-w-full max-h-full object-contain image-pixelated ${flipClass}`}
                          />
                        ) : (
                          <div className="w-full h-full animate-pulse bg-white/10 rounded-lg"></div>
                        )}
                    </div>
                </div>
            );
        })}

      </div>

      {/* --- BATTLE UI (Bottom 35%) --- */}
      <div className="h-[35%] min-h-[180px] bg-black p-1 md:p-2 border-t-4 border-gray-600 grid grid-cols-12 gap-1 md:gap-2 font-vt323 text-lg md:text-2xl">
        
        {/* Left: Stats Block */}
        <div className="col-span-7 md:col-span-8 h-full">
            <FFWindow className="h-full flex flex-col justify-start relative px-1 md:px-3">
                <div className="flex justify-between border-b border-gray-500 pb-1 mb-1 text-gray-400 text-sm md:text-xl uppercase">
                    <span className="w-1/3">Nome</span>
                    <span className="w-1/3 text-center">HP</span>
                    <span className="w-1/3 text-right">MP</span>
                </div>
                
                <div className="flex flex-col gap-0 md:gap-1 overflow-y-auto max-h-[120px]">
                    {party.map((char, index) => (
                        <div key={char.id} className={`flex justify-between items-center ${activeCharIndex === index && turn === 'PLAYER' ? 'bg-white/10' : ''}`}>
                            <span className="w-1/3 text-white truncate drop-shadow-md flex items-center">
                                {activeCharIndex === index && turn === 'PLAYER' && <span className="mr-1 text-yellow-400">▶</span>}
                                {char.name}
                            </span>
                            <span className={`w-1/3 text-center ${char.hp < char.maxHp * 0.3 ? 'text-yellow-400 animate-pulse' : 'text-white'}`}>
                                {char.hp}
                            </span>
                            <span className="w-1/3 text-right text-white">{char.mp}</span>
                        </div>
                    ))}
                </div>
            </FFWindow>
        </div>

        {/* Right: Command Menu */}
        <div className="col-span-5 md:col-span-4 h-full relative">
          <FFWindow className="h-full overflow-y-auto">
             {turn === 'PLAYER' ? (
                actionMenu === 'MAIN' ? (
                    <div className="flex flex-col gap-1">
                        <RetroButton onClick={handleAttack} selected>Atacar</RetroButton>
                        <RetroButton onClick={() => setActionMenu('SKILLS')}>Magia</RetroButton>
                        <RetroButton onClick={() => setActionMenu('ITEMS')} disabled>Item</RetroButton>
                    </div>
                ) : actionMenu === 'SKILLS' ? (
                    <div className="flex flex-col gap-1">
                        <button onClick={() => setActionMenu('MAIN')} className="text-gray-400 mb-1 hover:text-white text-left px-2">◀ Voltar</button>
                        {activeChar.skills.map(skill => (
                            <RetroButton key={skill} onClick={() => handleSkill(skill)}>
                                {skill} <span className="text-xs ml-1 text-blue-300">12</span>
                            </RetroButton>
                        ))}
                    </div>
                ) : (
                    <div className="text-gray-400 p-2">Vazio</div>
                )
             ) : (
                 <div className="h-full flex items-center justify-center text-gray-500 animate-pulse">
                     {enemy.name} Turno...
                 </div>
             )}
          </FFWindow>
          
          {turn === 'PLAYER' && (
              <div className="absolute -left-4 top-6 hidden md:block animate-point">
                  <img src="https://upload.wikimedia.org/wikipedia/commons/1/13/Hand_cursor_ghost.png" className="w-8 rotate-90 filter invert" alt="" />
              </div>
          )}
        </div>

      </div>
    </div>
  );
};