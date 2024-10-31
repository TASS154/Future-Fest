
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
async function runChat() {
// Cria e inicia um spinner para indicar que o chat está sendo inicializado 
const spinner = ora('Inicializando chat...').start();
try {
    // Cria uma instância da classe GoogleGenerativeAI com a chave da API 
    const genAI = new GoogleGenerativeAI (API_KEY);
    // Obtém o modelo generativo especificado usando o nome do modelo
    const model = genAI.getGenerativeModel({
        model: MODEL_NAME
    });

    // Inicia uma sessão de chat com as configurações de geração e segurança definidas 
    const chat = model.startChat({
        generationConfig: GENERATION_CONFIG, safetySettings: SAFETY_SETTINGS,
        history: [],
    });
 // Inicializa o histórico do chat como vazio
    // Para o spinner, pois a inicialização foi concluída 
    spinner.stop();
    // Loop infinito para ler entradas do usuário e gerar respostas 
    while (true) {
    // Lê a entrada do usuário, exibindo um prompt verde "Você: 
    const userInput = promptSync (chalk.green('Você: '));
    // Verifica se a entrada do usuário é 'exit' (ignora maiúsculas/minúsculas) 
    if (userInput.toLowerCase() === 'exit')
 {
    // Exibe uma mensagem de despedida e encerra o processo
    console.log(chalk.yellow('Até breve!'));
    process.exit(0); // Encerra o processo com código de saída e (sucesso)
    
}
// Envia a mensagem do usuário para o chat e aguarda a resposta 
const result = await chat.sendMessage(userInput);

// Verifica se houve um erro na resposta da IA
if (result.error) {
    // Exibe uma mensagem de erro em vermelho
console.error(chalk.red('AI Erro:'), result.error.message);
continue;
} 
// Continua o loop para permitir novas entradas do usuário
// Obtém o texto da resposta da IA
const response = result.response.text();
// Exibe a resposta da IA em azul
console.log(chalk.blue('AI:'), response);

}

} catch (error) {
// Para o spinner se ocorrer um erro
spinner.stop();
// Exibe uma mensagem de erro em vermelho
console.error(chalk.red('Erro encontrado: '), error.message);
// Encerra o processo com código de saída 1 (erro) process.exit(1);
}
}

