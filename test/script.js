// script.js

document.getElementById('send-btn').addEventListener('click', function() {
    const userInput = document.getElementById('user-input').value;
    
    if (userInput.trim()) {
        // Exibe a mensagem do usuário
        appendMessage(userInput, 'user');
        
        // Limpa o campo de entrada
        document.getElementById('user-input').value = '';
        
        // Simula a resposta da IA após um curto delay
        setTimeout(() => {
            const aiResponse = "Resposta da IA: " + userInput;  // Simulando a IA respondendo
            appendMessage(aiResponse, 'ai');
        }, 1000);
    }
});

// Função para adicionar mensagens ao chat
function appendMessage(message, sender) {
    const chatBox = document.getElementById('chat-box');
    
    const messageDiv = document.createElement('div');
    messageDiv.classList.add('message');
    
    if (sender === 'user') {
        messageDiv.classList.add('user-message');
    } else {
        messageDiv.classList.add('ai-message');
    }

    messageDiv.textContent = message;
    chatBox.appendChild(messageDiv);
    
    // Rola para o fim do chat
    chatBox.scrollTop = chatBox.scrollHeight;
}
