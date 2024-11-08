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

function appendIaMessage(message) {
    const chatBox = document.getElementById('chat-box');
    const messageBubble = document.createElement('div');
    messageBubble.classList.add('ia-response'); // Classe para a cor preta
    messageBubble.textContent = message;
    chatBox.appendChild(messageBubble);

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
            $('#chatMessagesMA').append(`<div class="message user-message"><p>${userInput}</p></div>`);

            setTimeout(function () {
                $('#chatMessagesMA').append(`<div class="message ai-message"><p id="ia-m">Como posso ajudar mais?</p></div>`);
                $('#chatMessagesMA').scrollTop($('#chatMessagesMA')[0].scrollHeight); // Rolar para a última mensagem
            }, 1000);

            $('#chatMessageInputMA').val('');
        }

        // Rolar o chat para baixo após enviar
        $('#chatMessagesMA').scrollTop($('#chatMessagesMA')[0].scrollHeight);
    });
});

document.getElementById('offcanvasMA').addEventListener('shown.bs.offcanvas', function () {
    // Adiciona a mensagem do FitBot ao chat
    $('#chatMessagesMA').append(`<div class="message ai-message"><p class="cpa">Olá sou o FitBot!<br>Como posso ajudar?</p></div>`);
    $('#chatMessagesMA').scrollTop($('#chatMessagesMA')[0].scrollHeight); // Rolar para a última mensagem

    // Definindo o valor do textarea quando o offcanvas for aberto
    document.getElementById('chatMessageInputMA').value = "Eu gostaria de marcar uma aula, poderia me mandar os horários disponíveis?";
});
