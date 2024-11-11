const editNomeButton = document.getElementById('editNome');
const confirmButton = document.getElementById('confirmButton');
const editEmailButton = document.getElementById('editEmail');
const confirmButton1 = document.getElementById('confirmButton1');
const saveButton = document.querySelector('.saver .btn');

if (editNomeButton) {
    editNomeButton.addEventListener('click', function () {
        document.getElementById('nomeDisplay').style.display = 'none';
        document.getElementById('nomeInput').style.display = 'block';
        document.getElementById('nomeInput').value = document.getElementById('nomeDisplay').textContent;
        editNomeButton.style.display = 'none';
        confirmButton.style.display = 'inline-block';
    });
}

if (confirmButton) {
    confirmButton.addEventListener('click', function () {
        const novoNome = document.getElementById('nomeInput').value;
        document.getElementById('nomeDisplay').textContent = novoNome;
        document.getElementById('nomeDisplay').style.display = 'inline-block';
        document.getElementById('nomeInput').style.display = 'none';
        confirmButton.style.display = 'none';
        editNomeButton.style.display = 'inline-block';
    });
}
//opcoes avancadas (Mudar texto)
document.addEventListener('DOMContentLoaded', function () {
    const avancadoLink = document.querySelector('.m');
    const avancadoContent = document.getElementById('avancado');

    avancadoLink.textContent = 'Mostrar opções avançadas';

    avancadoLink.addEventListener('click', function () {
        const isExpanded = avancadoContent.classList.contains('show');

        if (isExpanded) {
            avancadoLink.textContent = 'Mostrar opções avançadas';
        } else {
            avancadoLink.textContent = 'Fechar opções avançadas';
        }
    });

    avancadoContent.addEventListener('shown.bs.collapse', function () {
        avancadoLink.textContent = 'Fechar opções avançadas';
    });

    avancadoContent.addEventListener('hidden.bs.collapse', function () {
        avancadoLink.textContent = 'Mostrar opções avançadas';
    });
});


// Repita o mesmo padrão para os outros botões...

if (saveButton) {
    saveButton.addEventListener('click', function () {
        const genero = document.querySelector('input[name="flexRadioDefault"]:checked').nextElementSibling.textContent.trim();
        const alergiaA = document.getElementById('alergiaA').value;
        const condicaoS = document.getElementById('condicaoS').value;
        const atividadeFisica = document.querySelector('.form-select').value;
        const objetivo = document.querySelectorAll('.form-select')[1].value;
        const prefAlimentar = document.getElementById('prefAlimentar').value;
        const histLesao = document.getElementById('histLesao').value;
        const supAtual = document.getElementById('supAtual').value;

        const dadosUsuario = {
            genero: genero,
            alergiaA: alergiaA,
            condicaoS: condicaoS,
            atividadeFisica: atividadeFisica,
            objetivo: objetivo,
            prefAlimentar: prefAlimentar,
            histLesao: histLesao,
            supAtual: supAtual
        };

        console.log('Dados salvos:', dadosUsuario);

        localStorage.setItem('dadosUsuario', JSON.stringify(dadosUsuario));
        document.getElementById('saveButton').addEventListener('click', function () {
            var toastElement = document.getElementById('liveToast');
            var toast = new bootstrap.Toast(toastElement);
            toast.show();
        });
    });
}

function carregarDadosUsuario() {
    const dadosUsuario = JSON.parse(localStorage.getItem('dadosUsuario'));

    if (dadosUsuario) {
        document.getElementById('alergiaA').value = dadosUsuario.alergiaA || '';
        document.getElementById('condicaoS').value = dadosUsuario.condicaoS || '';
        document.querySelector('.form-select').value = dadosUsuario.atividadeFisica || '';
        document.querySelectorAll('.form-select')[1].value = dadosUsuario.objetivo || '';
        document.getElementById('prefAlimentar').value = dadosUsuario.prefAlimentar || '';
        document.getElementById('histLesao').value = dadosUsuario.histLesao || '';
        document.getElementById('supAtual').value = dadosUsuario.supAtual || '';

        const generoRadios = document.querySelectorAll('input[name="flexRadioDefault"]');
        generoRadios.forEach(radio => {
            if (radio.nextElementSibling.textContent.trim() === dadosUsuario.genero) {
                radio.checked = true;
            }
        });
    }
}

window.addEventListener('load', carregarDadosUsuario);

let selectedImageSrc = '';

// Captura a imagem selecionada
document.querySelectorAll('.profile-option').forEach(image => {
    image.addEventListener('click', () => {
        selectedImageSrc = image.src;
        document.querySelectorAll('.profile-option').forEach(img => img.classList.remove('selected'));
        image.classList.add('selected'); 
    });
});

// Ao clicar no botão "Salvar mudanças"
document.querySelector('.modal-footer .btn-primary').addEventListener('click', () => {
    if (selectedImageSrc) {
        // Atualiza a imagem de perfil na página
        const profileImage = document.getElementById('profileImage');
        profileImage.src = selectedImageSrc;
        
        // Envia a imagem selecionada para o servidor
        fetch('/conta/save-image', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ imageUrl: selectedImageSrc })
        })
        .then(response => response.json())
        .then(data => {
            console.log('Imagem salva com sucesso:', data);
            // Fechar o modal
            const modal = bootstrap.Modal.getInstance(document.getElementById('profileImageModal'));
            modal.hide();
        })
        .catch(error => {
            console.error('Erro ao salvar a imagem:', error);
        });
    }
});

// Carrega a imagem de perfil salva ao carregar a página
window.addEventListener('load', () => {
    const savedImageSrc = localStorage.getItem('profileImageSrc');
    if (savedImageSrc) {
        document.getElementById('profileImage').src = savedImageSrc;
    }
});
