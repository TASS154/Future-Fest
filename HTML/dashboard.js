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
    $('#sendMessageBtnMA').click(function (event) {
        const userInput = $('#chatMessageInputMA').val().trim();
        console.log(userInput);
 
        // Verifique se há input
        if (userInput) {
            // Adicionar a mensagem do usuário no chat
            $('#chatMessagesMA').append(`<div class="message user-message"><p>${userInput}</p></div>`);
 
            // Enviar a mensagem do usuário para o servidor
            $.ajax({
                type: 'POST',
                url: '/marcar-aula',
                data: { chatMessageInputMA: userInput },
                success: function(response) {
                    // Adicionar a resposta da IA após 1 segundo
                    setTimeout(function () {
                        $('#chatMessagesMA').append(`<div class="message ai-message"><p id="ia-m">${response.aiResponse}</p></div>`);
 
                        // Rolar para a última mensagem
                        $('#chatMessagesMA').scrollTop($('#chatMessagesMA')[0].scrollHeight);
                    }, 1000); // Atraso de 1 segundo para simular o processamento da IA
 
                    // Limpar o campo de entrada após a resposta da IA
                    $('#chatMessageInputMA').val('');
                },
                error: function() {
                    console.log("Erro ao enviar a mensagem.");
                }
            });
 
            // Rolar o chat para baixo após enviar a mensagem do usuário
            $('#chatMessagesMA').scrollTop($('#chatMessagesMA')[0].scrollHeight);
        }
    });
});

document.getElementById('offcanvasMA').addEventListener('shown.bs.offcanvas', function () {
    // Adiciona a mensagem do FitBot ao chat
    $('#chatMessagesMA').append(`<div class="message ai-message"><p class="cpa">Olá sou o FitBot!<br>Como posso ajudar?</p></div>`);
    $('#chatMessagesMA').scrollTop($('#chatMessagesMA')[0].scrollHeight); // Rolar para a última mensagem

    // Definindo o valor do textarea quando o offcanvas for aberto
    document.getElementById('chatMessageInputMA').value = "Eu gostaria de marcar uma aula, poderia me mandar os horários disponíveis?";
});

//Fim do Marcar Aula
//Inicio do indicar suplementos
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
//AI IS
$(document).ready(function () {
    $('#sendMessageBtnIS').click(function () {
        const userInput = $('#chatMessageInputIS').val().trim();

        if (userInput) {
            $('#chatMessagesIS').append(`<div class="message user-message"><p>${userInput}</p></div>`);

            setTimeout(function () {
                $('#chatMessagesIS').append(`<div class="message ai-message"><p id="ia-m">Como posso ajudar mais?</p></div>`);
                $('#chatMessagesIS').scrollTop($('#chatMessagesIS')[0].scrollHeight); // Rolar para a última mensagem
            }, 1000);

            $('#chatMessageInputIS').val('');
        }

        // Rolar o chat para baixo após enviar
        $('#chatMessagesIS').scrollTop($('#chatMessagesIS')[0].scrollHeight);
    });
});

document.getElementById('offcanvasIS').addEventListener('shown.bs.offcanvas', function () {
    $('#chatMessagesIS').append(`<div class="message ai-message"><p class="cpa">Olá sou o FitBot!<br>Como posso ajudar?</p></div>`);
    $('#chatMessagesIS').scrollTop($('#chatMessagesIS')[0].scrollHeight); // Rolar para a última mensagem

    document.getElementById('chatMessageInputIS').value = "Eu queria algumas indicações de Suplementos para eu usar, você poderia me mandar?";
});
//APAGAR MENSAGENS de MA
$(document).ready(function () {
    // Controle para exibir o modal ao tentar fechar o offcanvas
    $('#offcanvasMA').on('hide.bs.offcanvas', function (e) {
        // Impede o fechamento do offcanvas e exibe o modal de confirmação
        e.preventDefault();
        $('#confirmCloseModal').modal('show');
    });

    // Evento de clique para o botão de "Fechar" no modal
    $('#confirmCloseButton').click(function () {
        // Fecha o modal e o offcanvas, e limpa o chat
        $('#confirmCloseModal').modal('hide');
        $('#offcanvasMA').off('hide.bs.offcanvas'); // Remove o bloqueio temporariamente
        $('#offcanvasMA').offcanvas('hide'); // Fecha o offcanvas
        $('#chatMessagesMA').empty(); // Limpa as mensagens do chat
        setTimeout(() => {
            $('#offcanvasMA').on('hide.bs.offcanvas', function (e) {
                e.preventDefault();
                $('#confirmCloseModal').modal('show');
            });
        }, 300);
    });
});

//Apagar Mensagens de IS

$(document).ready(function () {
    // Controle para exibir o modal ao tentar fechar o offcanvas
    $('#offcanvasIS').on('hide.bs.offcanvas', function (e) {
        // Impede o fechamento do offcanvas e exibe o modal de confirmação
        e.preventDefault();
        $('#confirmCloseModal').modal('show');
    });

    // Evento de clique para o botão de "Fechar" no modal
    $('#confirmCloseButton').click(function () {
        // Fecha o modal e o offcanvas, e limpa o chat
        $('#confirmCloseModal').modal('hide');
        $('#offcanvasIS').off('hide.bs.offcanvas'); // Remove o bloqueio temporariamente
        $('#offcanvasIS').offcanvas('hide'); // Fecha o offcanvas
        $('#chatMessagesIS').empty(); // Limpa as mensagens do chat
        setTimeout(() => {
            $('#offcanvasIS').on('hide.bs.offcanvas', function (e) {
                e.preventDefault();
                $('#confirmCloseModal').modal('show');
            });
        }, 300);
    });
});
//Apagar mensagens de Lista
$(document).ready(function () {
    $('#offcanvasLista').on('hide.bs.offcanvas', function (e) {
        e.preventDefault();
        $('#confirmCloseModal').modal('show');
    });

    // Evento de clique para o botão de "Fechar" no modal
    $('#confirmCloseButton').click(function () {
        // Fecha o modal e o offcanvas, e limpa o chat
        $('#confirmCloseModal').modal('hide');
        $('#offcanvasLista').off('hide.bs.offcanvas'); // Remove o bloqueio temporariamente
        $('#offcanvasLista').offcanvas('hide'); // Fecha o offcanvas
        $('#chatMessagesLista').empty(); // Limpa as mensagens do chat
        setTimeout(() => {
            $('#offcanvasLista').on('hide.bs.offcanvas', function (e) {
                e.preventDefault();
                $('#confirmCloseModal').modal('show');
            });
        }, 300);
    });
});

//INICIO DA LISTA
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
    $('#sendMessageBtnLista').click(function () {
        const userInput = $('#chatMessageInputLista').val().trim();
        console.log(userInput)

        if (userInput) {
            $('#chatMessagesLista').append(`<div class="message user-message"><p>${userInput}</p></div>`);

            setTimeout(function () {
                $('#chatMessagesLista').append(`<div class="message ai-message"><p id="ia-m">Como posso ajudar mais?</p></div>`);
                $('#chatMessagesLista').scrollTop($('#chatMessagesLista')[0].scrollHeight); // Rolar para a última mensagem
            }, 1000);

            $('#chatMessageInputLista').val('');
        }

        // Rolar o chat para baixo após enviar
        $('#chatMessagesLista').scrollTop($('#chatMessagesLista')[0].scrollHeight);
    });
});

document.getElementById('offcanvasLista').addEventListener('shown.bs.offcanvas', function () {
    // Adiciona a mensagem do FitBot ao chat
    $('#chatMessagesLista').append(`<div class="message ai-message"><p class="cpa">Olá sou o FitBot!<br>Como posso ajudar?</p></div>`);
    $('#chatMessagesLista').scrollTop($('#chatMessagesLista')[0].scrollHeight); // Rolar para a última mensagem

    document.getElementById('chatMessageInputLista').value = "Eu quero uma lista de exercicios para eu fazer em casa";
});

$(document).ready(function () {
    $('#showPlanosBtn').click(function () {
        $('.planos').show(); // Torna a div 'planos' visível
    });
});
$(document).ready(function () {
    $('#showPlanosBtn').click(function () {
        $('.planos').toggle(); // Alterna a visibilidade da div 'planos'
    });
});
$(document).ready(function () {
    $('#showPlanosBtn').click(function () {
        $('.planos').css('display', 'block'); // Altera o display para 'block' e torna visível
    });
});
