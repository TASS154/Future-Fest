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
});
document.getElementById('sendMessageBtn').addEventListener('click', function ()) {
    const messageInput = document.getElementById('chatMessageInput');
    const messageText = messageInput.value;

    if (messageText.trim()) {
        const messageContainer = document.createElement('div');
        messageContainer.classList.add('message', 'sent');
        messageContainer.innerHTML = `<p>${messageText}</p>`;

        document.querySelector('.messages').appendChild(messageContainer);
        messageInput.value = ''; // Limpa o campo de input
    }
}