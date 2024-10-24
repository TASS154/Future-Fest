const express = require('express');
const bodyParser = require('body-parser');

async function minhaFuncao(userInput, res) {
    try {
        // Usando o import dinâmico dentro de uma função async
        const { sendMessageToAI } = await import('./IA.mjs');
        
        // Agora você pode usar sendMessageToAI como uma função normal
        const resposta = await sendMessageToAI(userInput);
        // Enviando a resposta da IA para o cliente
        res.json({ response: resposta });
    } catch (error) {
        // Tratamento de erro, enviando erro para o cliente
        res.status(500).json({ error: error.message });
    }
}

const app = express();
const PORT = 3001;

// Middleware para processar dados JSON no corpo da requisição
app.use(bodyParser.json());

app.get('/', (req, res) =>
    res.sendFile(__dirname + '/index.html')
);

// Rota API para enviar mensagens para a IA
app.post('/api/chat', async (req, res) => {
    const { userInput } = req.body;
    // Chamando a função minhaFuncao passando userInput e res
    await minhaFuncao(userInput, res);
});

// Iniciar o servidor
app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});
