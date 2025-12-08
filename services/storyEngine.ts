import { StoryNode, Enemy } from "../types";

// --- ENEMIES ---

const COMMANDO: Enemy = {
  id: 'narshe_guard', // Keeping ID for compatibility
  name: 'Command', // Updated to Command
  description: 'Um soldado de elite do Império.',
  hp: 120,
  maxHp: 120,
  attack: 25,
  xp: 50
};

const SILVER_LOBO: Enemy = {
  id: 'silver_lobo',
  name: 'Silver Lobo',
  description: 'Lobos das neves que caçam em matilhas.',
  hp: 80,
  maxHp: 80,
  attack: 20,
  xp: 30
};

const BOSS_WHELK: Enemy = {
  id: 'whelk_boss', 
  name: 'Whelk',
  description: 'Um molusco gigante guardando a entrada das minas.',
  hp: 800,
  maxHp: 800,
  attack: 45,
  xp: 500
};

// --- STORY TREE ---

const STORY_NODES: Record<string, StoryNode> = {
  'start': {
    id: 'start',
    type: 'NARRATIVE',
    text: "O vento uiva através dos picos congelados...\n\nTrês figuras em Armaduras Magitek marcham em direção à cidade mineira de Narshe sob a proteção da escuridão.\n\nVicks (Biggs): \"Então essa é Narshe...\"",
    background: 'https://picsum.photos/seed/narshesnow/1024/768',
    choices: [
      { text: "Continuar marcha", nextNodeId: 'dialogue_wedge' }
    ]
  },
  'dialogue_wedge': {
    id: 'dialogue_wedge',
    type: 'NARRATIVE',
    text: "Wedge: \"Ouvi dizer que encontraram algo incrível nas minas. Um 'Esper' congelado...\"\n\nVicks: \"Silêncio! Estamos aqui para confirmar isso e trazê-lo para o Império. Não falhe agora.\"\n\nTerra (Você) permanece em silêncio, sua mente nublada pela Coroa de Escravos.",
    // background: inherited from previous
    choices: [
      { text: "Entrar na cidade", nextNodeId: 'city_entrance' }
    ]
  },
  'city_entrance': {
    id: 'city_entrance',
    type: 'NARRATIVE',
    text: "Vocês invadem as ruas da cidade. Os cães latem. Luzes se acendem.\n\nCommand: \"O Império?! Armaduras Magitek?! Parem imediatamente!\"\n\nVicks: \"Não temos tempo para isso. Abram caminho!\"",
    background: 'https://picsum.photos/seed/narshegate/1024/768',
    choices: [
      { text: "Atacar Guarda", nextNodeId: 'combat_guard_1' }
    ]
  },
  'combat_guard_1': {
    id: 'combat_guard_1',
    type: 'COMBAT_ENCOUNTER',
    text: "Um esquadrão de Commands bloqueia o caminho!",
    enemyData: COMMANDO,
    winNodeId: 'mines_approach',
    choices: []
  },
  'mines_approach': {
    id: 'mines_approach',
    type: 'NARRATIVE',
    text: "Com os soldados derrotados, o caminho para as montanhas ao norte está livre.\n\nWedge: \"Essa armadura é incrível... eles não tiveram chance.\"\n\nVocês se aproximam da entrada da mina. O ar fica mais denso.",
    background: 'https://picsum.photos/seed/narshemines_ext/1024/768',
    choices: [
      { text: "Entrar nas Minas", nextNodeId: 'mines_interior_1' },
      { text: "Verificar Radar", nextNodeId: 'mines_radar' }
    ]
  },
  'mines_radar': {
    id: 'mines_radar',
    type: 'NARRATIVE',
    text: "O radar da Magitek Armor aponta uma forte assinatura de energia mágica vindo das profundezas.\n\nVicks: \"O sinal é forte. Definitivamente é o Esper.\"",
    background: 'https://picsum.photos/seed/magitek_hud/1024/768',
    choices: [
      { text: "Entrar nas Minas", nextNodeId: 'mines_interior_1' }
    ]
  },
  'mines_interior_1': {
    id: 'mines_interior_1',
    type: 'NARRATIVE',
    text: "Dentro das minas, trilhos de vagonetas cruzam o abismo. O cheiro de enxofre e gelo antigo permeia o ar.\n\nDe repente, sombras se movem nas vigas acima.",
    background: 'https://picsum.photos/seed/narshemines_int/1024/768',
    choices: [
      { text: "Preparar armas", nextNodeId: 'combat_lobo' }
    ]
  },
  'combat_lobo': {
    id: 'combat_lobo',
    type: 'COMBAT_ENCOUNTER',
    text: "Lobos selvagens saltam das sombras!",
    enemyData: SILVER_LOBO,
    winNodeId: 'mines_deep',
    choices: []
  },
  'mines_deep': {
    id: 'mines_deep',
    type: 'NARRATIVE',
    text: "Vocês chegam a uma grande câmara circular. No centro, uma passarela estreita leva à escuridão.\n\nWedge: \"Estou sentindo algo... um arrepio na espinha.\"\n\nO chão treme. Algo gigantesco emerge do abismo.",
    background: 'https://picsum.photos/seed/whelk_cave/1024/768',
    choices: [
      { text: "Olhar para cima", nextNodeId: 'boss_intro' }
    ]
  },
  'boss_intro': {
    id: 'boss_intro',
    type: 'NARRATIVE',
    text: "Um caracol gigante com uma concha brilhante bloqueia o caminho!\n\nVicks: \"É o Whelk! Cuidado, quando ele se esconder na concha, não ataquem ou ele vai contra-atacar com Mega Volt!\"",
    background: 'https://picsum.photos/seed/whelk_boss/1024/768',
    choices: [
      { text: "Iniciar Combate", nextNodeId: 'combat_boss' }
    ]
  },
  'combat_boss': {
    id: 'combat_boss',
    type: 'COMBAT_ENCOUNTER',
    text: "WHELK bloqueia o caminho!",
    enemyData: BOSS_WHELK,
    winNodeId: 'esper_chamber',
    choices: []
  },
  'esper_chamber': {
    id: 'esper_chamber',
    type: 'NARRATIVE',
    text: "O monstro cai, desaparecendo na névoa abaixo.\n\nVocês avançam para a câmara final. Lá está ele. Um bloco de gelo emitindo uma luz etérea.\n\nO ESPER CONGELADO.",
    background: 'https://picsum.photos/seed/frozen_esper/1024/768',
    choices: [
      { text: "Aproximar-se", nextNodeId: 'esper_reaction' }
    ]
  },
  'esper_reaction': {
    id: 'esper_reaction',
    type: 'NARRATIVE',
    text: "Wedge: \"Olhem! Está reagindo à Terra!\"\n\nA Armadura Magitek de Terra começa a brilhar em ressonância com o Esper. Um som agudo perfura suas mentes.\n\nVicks e Wedge são jogados para longe, desaparecendo num flash de luz.",
    background: 'https://picsum.photos/seed/valigarmanda/1024/768',
    choices: [
      { text: "Gritar", nextNodeId: 'cliff_fall' }
    ]
  },
  'cliff_fall': {
    id: 'cliff_fall',
    type: 'ENDING',
    text: "Sua mente se estilhaça.\n\nA Coroa de Escravos quebra.\n\nTudo fica branco...\n\n(Fim da Introdução - Final Fantasy VI)",
    background: 'https://picsum.photos/seed/white_fade/1024/768',
    choices: [
      { text: "Reiniciar Jogo", nextNodeId: 'start' }
    ]
  }
};

export const getStoryNode = (id: string): StoryNode => {
  return STORY_NODES[id] || STORY_NODES['start'];
};

export const getStartNode = (): StoryNode => {
  return STORY_NODES['start'];
};