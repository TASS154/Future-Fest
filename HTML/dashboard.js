$(document).ready(function () {
    let percentage = 70; // Porcentagem que você deseja atingir
    let circle = $('.progress-ring__circle');
    let radius = circle.attr('r');
    let circumference = 2 * Math.PI * radius;

    circle.css('stroke-dasharray', circumference);
    circle.css('stroke-dashoffset', circumference);

    function setProgress(percent) {
        let offset = circumference - (percent / 100) * circumference;
        circle.css('stroke-dashoffset', offset);
        $('.percentage').text(`${percent}%`);
    }

    // Animação do progresso
    $({ countNum: 0 }).animate({ countNum: percentage }, {
        duration: 2000,
        easing: 'swing',
        step: function () {
            setProgress(Math.floor(this.countNum));
        }
    });

    // Função para enviar e exibir mensagens do usuário e IA
    function handleMessage(sendButtonId, inputId, chatBoxId) {
        document.getElementById(sendButtonId).addEventListener('click', function () {
            const userInput = document.getElementById(inputId).value;

            if (userInput.trim()) {
                // Exibe a mensagem do usuário
                appendMessage(userInput, 'user', chatBoxId);

                // Limpa o campo de entrada
                document.getElementById(inputId).value = '';

                // Simula a resposta da IA após um curto delay
                setTimeout(() => {
                    const aiResponse = "Resposta da IA: " + userInput;  // Simulando a IA respondendo
                    appendMessage(aiResponse, 'ai', chatBoxId);
                }, 1000);
            }
        });
    }

    // Função para adicionar mensagens ao chat
    function appendMessage(message, sender, chatBoxId) {
        const chatBox = document.getElementById(chatBoxId);

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

    // Inicializando os bots nos diferentes offcanvases
    handleMessage('sendMessageBtnMA', 'chatMessageInputMA', 'chatMessagesMA');
    handleMessage('sendMessageBtnIS', 'chatMessageInputIS', 'chatMessagesIS');
    handleMessage('sendMessageBtnLista', 'chatMessageInputLista', 'chatMessagesLista');

});