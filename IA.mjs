
import {
    GoogleGenerativeAI, // Classe para interagir com o Google Generative AI HarmCategory, // Enum para categorias de conteúdo prejudicial
    HarmBlockThreshold,
    HarmCategory // Enum para os níveis de bloqueio de conteúdo prejudicial
    } from "@google/generative-ai";
    // Importa a biblioteca 'chalk' para estilização de texto no console
    import chalk from 'chalk';
    // Importa a biblioteca 'ora' para exibir uma mensagem de carregamento (spinner)
    import ora from 'ora';
    // Importa a biblioteca 'prompt-sync' para ler entradas do usuário sincronamente 
    import prompt from 'prompt-sync';
    // Cria uma instância da função prompt-sync para ler entradas do usuário 
    const promptSync = prompt();
    // Define o nome do modelo que será utilizado na geração de respostas 
    const MODEL_NAME = "gemini-1.0-pro";
    // Define a chave da API para autenticação com o Google Generative AI 
    const API_KEY = "AIzaSyDYM4cBcxxogkms0PvjnV2dUcRyGYnbm2I";
    
// Configuração de geração para o modelo, ajustando parâmetros como 
const GENERATION_CONFIG = {
    temperature: 0.9,
    topK: 1,
    topP: 1,
    maxOutputTokens: 2048,
};
 // Define a criatividade da resposta; valores , // Controla o número de palavras candidatas considerad , // Controla a probabilidade cumulativa das palavras ca  // Define o número máximo de tokens (pal
// Configuração de segurança para filtrar conteúdo prejudicial com 
const SAFETY_SETTINGS = [{
    category: HarmCategory.HARM_CATEGORY_HARASSMENT,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE
},
{
    category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE
},
{
    category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE
},
{
    category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE
}];


// Função assíncrona que inicializa e executa o chat com o modelo de IA 
export async function runChat() {
    const spinner = ora('Inicializando chat...').start();
    try {
        const genAI = new GoogleGenerativeAI(API_KEY);
        const model = genAI.getGenerativeModel({ model: MODEL_NAME });
        
        const chat = model.startChat({
            generationConfig: GENERATION_CONFIG,
            safetySettings: SAFETY_SETTINGS,
            history: [],
        });

        spinner.stop();
        
        // Aqui você pode lidar com uma única interação, em vez de um loop infinito
        const userInput = promptSync(chalk.green('Você: '));
        const result = await chat.sendMessage(userInput);
        
        if (result.error) {
            console.error(chalk.red('AI Erro:'), result.error.message);
        } else {
            const response = result.response.text();
            console.log(chalk.blue('AI:'), response);
        }
    } catch (error) {
        spinner.stop();
        console.error(chalk.red('Erro encontrado: '), error.message);
    }
}

