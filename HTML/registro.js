let currentStep = 1;

function nextStep(step) {
    document.getElementById(`step-${currentStep}`).style.display = 'none';
    currentStep = step;
    document.getElementById(`step-${currentStep}`).style.display = 'block';
    updatePagination();
}

function prevStep(step) {
    document.getElementById(`step-${currentStep}`).style.display = 'none';
    currentStep = step;
    document.getElementById(`step-${currentStep}`).style.display = 'block';
    updatePagination();
}

function goToStep(step) {
    document.getElementById(`step-${currentStep}`).style.display = 'none';
    currentStep = step;
    document.getElementById(`step-${currentStep}`).style.display = 'block';
    updatePagination();
}

function updatePagination() {
    document.querySelectorAll('.page-item').forEach((item, index) => {
        item.classList.remove('active');
        if (index + 1 === currentStep) {
            item.classList.add('active');
        }
    });
}

document.addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
        event.preventDefault();

        if (document.getElementById('step-1').style.display !== 'none') {
            nextStep(2);
        } else if (document.getElementById('step-2').style.display !== 'none') {
            nextStep(3);
        }
    }
});


document.getElementById('birthday').setAttribute('min', '1940-01-01');
document.getElementById('birthday').setAttribute('max', '2024-12-31');

document.getElementById('birthday').addEventListener('input', function () {
    const dataNascimento = new Date(this.value);
    const minDate = new Date('1940-01-01');
    const maxDate = new Date('2024-12-31');
    const errorMessage = document.getElementById('date-error');

    if (dataNascimento < minDate || dataNascimento > maxDate) {
        errorMessage.style.display = 'block';
    } else {
        errorMessage.style.display = 'none';
    }
});

document.getElementById("registerForm").addEventListener("submit", function (event) {
    document.getElementById("spinner").classList.remove("d-none");
});

const dicas = [
    "Dica do dia: Sabia que 10 minutos de HIIT queimam calorias como 30 minutos de exercícios moderados?",
    "Dica do dia: A FitLab oferece planos personalizados para diferentes objetivos fitness. Conheça o seu!",
    "Dica do dia: A água é essencial no treino. Nós temos uma calculadora de água no nosso site, dê uma olhada.",
    "Dica do dia: Aumente seu metabolismo: treinos intensos mantêm seu corpo queimando calorias após o exercício.",
    "Dica do dia: Treinar com intensidade também melhora o humor e reduz o estresse!",
    "Dica do dia: A FitLab possui uma loja de suplementos com produtos de alta qualidade. Confira!",
    "Dica do dia: A música pode aumentar sua resistência durante o treino!",
    "Dica do dia: Sabia que alternar entre treinos de força e cardio ajuda na recuperação muscular?",
    "Dica do dia: A FitLab conta com chat de IA para tirar suas dúvidas sobre exercícios e suplementos.",
    "Dica do dia: Pequenas pausas no treino ajudam a manter a energia e evitar lesões.",
    "Dica do dia: Fazer aquecimento antes do treino reduz o risco de lesões e aumenta a performance.",
    "Dica do dia: A FitLab oferece planos B-Corp, comprometidos com a sustentabilidade e impacto positivo!",
    "Dica do dia: Após o treino, comer proteína ajuda na recuperação muscular.",
    "Dica do dia: Para ganhar massa, o ideal é consumir proteínas de qualidade como pós-treino.",
    "Dica do dia: Caminhar diariamente também ajuda a manter a saúde cardiovascular.",
    "Dica do dia: Sabia que o exercício melhora o sono e ajuda a manter uma rotina mais produtiva?",
    "Dica do dia: Na FitLab, você encontra aulas com especialistas e uma infraestrutura moderna.",
    "Dica do dia: A flexibilidade no treino melhora a postura e evita dores musculares.",
    "Dica do dia: Estudos mostram que treinos matinais aumentam a disposição ao longo do dia!",
    "Dica do Dia: Na FitLab, você pode registrar alergias e condições para um atendimento melhor da nossa IA."
  ];

  // Seleciona uma dica aleatória
  const dicaAleatoria = dicas[Math.floor(Math.random() * dicas.length)];
  document.getElementById('dica').innerText = dicaAleatoria;


