$(document).ready(function () {
    let percentage = 70; // Porcentagem que você deseja atingir
    let circle = $('.progress-ring__circle');
    let radius = circle.attr('r');
    let circumference = 2 * Math.PI * radius;

    // Define as propriedades do círculo de progresso
    circle.css({
        'stroke-dasharray': circumference,
        'stroke-dashoffset': circumference
    });

    // Função para atualizar o progresso
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

    // Evento do botão de envio de mensagem
    $('#send-btn').click(function () {
        const userInput = $('#user-input').val();

        if (userInput.trim()) {
            console.log('Mensagem do usuário:', userInput); // Verifica o valor de entrada

            appendMessage(userInput, 'user');
            $('#user-input').val(''); // Limpa o campo de entrada
            setTimeout(() => {
                const aiResponse = "Resposta da IA: " + userInput;
                console.log('Resposta da IA:', aiResponse); // Verifica a resposta da IA
                appendMessage(aiResponse, 'ai');
            }, 1000);
        }
    });
});

// Função para adicionar mensagem no chat
function appendMessage(message, sender) {
    const chatBox = $('#chat-box');
    const messageDiv = $('<div>').addClass('message');

    // Verifica se a mensagem é do usuário ou da IA
    if (sender === 'user') {
        messageDiv.addClass('user-message');
    } else {
        messageDiv.addClass('ai-message');
    }

    messageDiv.text(message);
    chatBox.append(messageDiv); // Adiciona a mensagem ao chat
    chatBox.scrollTop(chatBox[0].scrollHeight); // Rolagem para a última mensagem

    console.log('Mensagem adicionada:', message); // Verifica se a mensagem foi realmente adicionada
}

$(document).ready(function () {
    $('#sendMessageBtnMA').click(function () {
        const userInput = $('#chatMessageInputMA').val().trim();

        if (userInput) {
            // Adicionar mensagem do usuário
            $('#chatMessagesMA').append(`<div class="message user-message"><p>${userInput}</p></div>`);

            // Simulação de resposta da IA (substitua com lógica real)
            setTimeout(function () {
                $('#chatMessagesMA').append(`<div class="message ai-message"><p>Como posso ajudar mais?</p></div>`);
                $('#chatMessagesMA').scrollTop($('#chatMessagesMA')[0].scrollHeight); // Rolar para a última mensagem
            }, 1000); // Espera 1 segundo para simular a resposta da IA

            // Limpar campo de entrada
            $('#chatMessageInputMA').val('');
        }

        // Rolar o chat para baixo após enviar
        $('#chatMessagesMA').scrollTop($('#chatMessagesMA')[0].scrollHeight);
    });
});
