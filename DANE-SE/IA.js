const readline = require('readline');
const { GoogleGenerativeAI, HarmBlockThreshold, HarmCategory } = require('@google/generative-ai');
const userInput = "olá, pode me responder uma curiosidade curta aleatória?"
// Configuração de geração para o modelo
const GENERATION_CONFIG = {
    temperature: 0.9,
    topK: 1,
    topP: 1,
    maxOutputTokens: 2048,
};

// Configuração de segurança para filtrar conteúdo prejudicial
const SAFETY_SETTINGS = [{
    category: HarmCategory.HARM_CATEGORY_HARASSMENT,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE
}, {
    category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE
}, {
    category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE
}, {
    category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE
}];

// Configurações do modelo e API
const MODEL_NAME = "gemini-1.0-pro";
const API_KEY = "AIzaSyDYM4cBcxxogkms0PvjnV2dUcRyGYnbm2I";

// Criação de uma interface de leitura de entrada (para capturar o input do usuário)
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

// Função assíncrona para rodar o chat com a IA
async function runChat(userInput) {
    try {
        // Inicializando o modelo de IA com a chave da API
        const genAI = new GoogleGenerativeAI(API_KEY);
        const model = genAI.getGenerativeModel({ model: MODEL_NAME });

        const chat = model.startChat({
            generationConfig: GENERATION_CONFIG,
            safetySettings: SAFETY_SETTINGS,
            history: [],
        });

        // Função para capturar a entrada do usuário e processar a resposta
            const result = await chat.sendMessage(userInput);
            
            if (result.error) {
                console.error('Erro AI:', result.error.message);
            } else {
                // Obtendo apenas o texto da resposta da IA
                const response = result.response.text();
                console.log('AI:', response);
            }

            // Fechar a interface de leitura após a interação
            rl.close();
        }
        catch (error) {
            console.error('Erro encontrado:', error.message);
        }

    };
runChat(userInput)
module.exports = {runChat};

