// Importação de módulos com sintaxe ES6
import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from '@google/generative-ai';

// Chave da API
const API_KEY = "AIzaSyDYM4cBcxxogkms0PvjnV2dUcRyGYnbm2I";

// Configurações de geração de resposta
const GENERATION_CONFIG = {
    temperature: 0.9,
    topK: 1,
    topP: 1,
    maxOutputTokens: 2048,
};

// Configurações de segurança para filtragem de conteúdo prejudicial
const SAFETY_SETTINGS = [
    {
        category: HarmCategory.HARM_CATEGORY_HARASSMENT,
        threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
    },
    {
        category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
        threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
    },
    {
        category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
        threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
    },
    {
        category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
        threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
    },
];

// Função assíncrona para enviar mensagem à IA
export async function sendMessageToAI(userInput) {
    try {
        const genAI = new GoogleGenerativeAI(API_KEY);
        const model = await genAI.getGenerativeModel({ model: "gemini-1.0-pro" });
        const chat = await model.startChat({
            generationConfig: GENERATION_CONFIG,
            safetySettings: SAFETY_SETTINGS,
            history: [],
        });

        const result = await chat.sendMessage(userInput);

        if (result.error) {
            throw new Error(result.error.message);
        }

        return result.response.text();
    } catch (error) {
        throw new Error('Erro ao gerar resposta da IA: ' + error.message);
    }
}