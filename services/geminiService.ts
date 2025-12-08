import { GoogleGenAI, Type, Schema } from "@google/genai";
import { StorySegment, Character } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const MODEL_NAME = "gemini-2.5-flash";

// Helper to sanitize JSON strings if the model returns markdown code blocks
const cleanJson = (text: string): string => {
  return text.replace(/```json\n?|\n?```/g, '').trim();
};

const SYSTEM_INSTRUCTION = `
Você é o "Mestre de Jogo" narrando a história oficial de **Final Fantasy VI** (SNES).
Seu objetivo é guiar o jogador fielmente pelo roteiro do jogo original, mantendo a atmosfera sombria e misteriosa.

**Contexto Inicial:**
O jogo começa com Terra (controlada pela Coroa de Escravos), Biggs e Wedge em Armaduras Magitek marchando pelos campos de neve em direção à cidade mineira de Narshe. O objetivo é encontrar um Esper congelado encontrado nas minas.

**Regras de Narrativa:**
1. Siga os eventos do jogo: Narshe (Neve) -> Guardas -> Minas -> Chefe Whelk (Ymir) -> O Esper Congelado -> A reação de Terra -> A queda no penhasco -> O despertar na casa de Arvis.
2. Mantenha os diálogos fiéis às personalidades (Terra confusa/controlada, Biggs e Wedge profissionais mas arrogantes, Locke galante, Kefka insano).
3. Suas respostas DEVEM ser SEMPRE em formato JSON.

**Combate:**
Se o jogador encontrar inimigos, use os nomes clássicos: Narshe Guard, Lobo (Silver Lobo), Megalodoth, e o chefe Whelk.
`;

const STORY_SCHEMA: Schema = {
  type: Type.OBJECT,
  properties: {
    text: { type: Type.STRING, description: "A narrativa do que está acontecendo." },
    choices: { 
      type: Type.ARRAY, 
      items: { type: Type.STRING },
      description: "2 a 3 escolhas curtas para o jogador." 
    },
    type: { 
      type: Type.STRING, 
      enum: ["NARRATIVE", "COMBAT_ENCOUNTER", "LOOT"],
      description: "O tipo de evento." 
    },
    enemyData: {
      type: Type.OBJECT,
      description: "Dados do inimigo se for combate.",
      nullable: true,
      properties: {
        name: { type: Type.STRING },
        description: { type: Type.STRING },
        hp: { type: Type.INTEGER },
        maxHp: { type: Type.INTEGER },
        attack: { type: Type.INTEGER },
        xp: { type: Type.INTEGER }
      }
    }
  },
  required: ["text", "choices", "type"]
};

export const startNewGame = async (): Promise<StorySegment> => {
  try {
    const prompt = `
      Inicie o jogo.
      Cenário: Campos de neve fora de Narshe. Noite. Tempestade de neve.
      Personagens: Terra (em Magitek Armor), Biggs, Wedge.
      Ação: Eles olham para a cidade ao longe.
      Gere a introdução clássica onde Biggs e Wedge comentam sobre a missão e o Esper.
    `;
    
    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: prompt,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        responseMimeType: "application/json",
        responseSchema: STORY_SCHEMA
      }
    });

    return JSON.parse(cleanJson(response.text || "{}"));
  } catch (error) {
    console.error("Gemini Start Error:", error);
    return {
      text: "Erro de comunicação neural... (Falha na API). Tente recarregar.",
      choices: ["Tentar Novamente"],
      type: "NARRATIVE"
    };
  }
};

export const advanceStory = async (
  history: string, 
  choice: string, 
  partyStatus: Character[]
): Promise<StorySegment> => {
  try {
    const partySummary = partyStatus.map(c => `${c.name} (${c.hp}HP)`).join(", ");
    const prompt = `
    Histórico recente: ${history.slice(-1000)}
    Estado do grupo: ${partySummary}
    
    Ação do jogador: "${choice}".
    
    Gere a próxima parte da história seguindo o roteiro de Final Fantasy VI.
    Se a ação for agressiva ou o roteiro pedir (ex: Guardas de Narshe atacando), gere COMBAT_ENCOUNTER.
    Se for exploração nas minas, chance de LOOT (Potion, Phoenix Down).
    `;

    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: prompt,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        responseMimeType: "application/json",
        responseSchema: STORY_SCHEMA
      }
    });

    return JSON.parse(cleanJson(response.text || "{}"));
  } catch (error) {
    console.error("Gemini Advance Error:", error);
    return {
      text: "O destino parece incerto... (Erro na API)",
      choices: ["Continuar"],
      type: "NARRATIVE"
    };
  }
};