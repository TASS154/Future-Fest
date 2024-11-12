window.addEventListener('load', () => {
    // Recupera a imagem do perfil armazenada no localStorage
    const savedImageSrc = localStorage.getItem('profileImageSrc');

    if (savedImageSrc) {
        // Atualiza a imagem de perfil na barra de navegação da loja
        const profileImageNav = document.getElementById('profileImageNav');
        profileImageNav.src = savedImageSrc;
    }
});

window.addEventListener('load', () => {
    // Recupera o usuário logado e a imagem do perfil armazenada no localStorage
    const usuarioLogado = JSON.parse(localStorage.getItem('usuarioLogado'));
    const savedImageSrc = localStorage.getItem('profileImageSrc');

    const profileImageNav = document.getElementById('profileImageNav');
    const entrarButton = document.getElementById('entrarButton');  // Certifique-se de adicionar um id ao botão Entrar

    if (usuarioLogado) {
        // Se o usuário estiver logado, exibe a imagem de perfil
        if (savedImageSrc) {
            profileImageNav.src = savedImageSrc;
        }

        // Oculta o botão "Entrar" (caso exista) se o usuário estiver logado
        if (entrarButton) {
            entrarButton.style.display = 'none';
        }
    } else {
        // Se o usuário não estiver logado, exibe o botão "Entrar"
        if (entrarButton) {
            entrarButton.style.display = 'inline-block';
        }

        // Também pode ocultar a imagem de perfil, caso exista
        if (profileImageNav) {
            profileImageNav.style.display = 'none';
        }
    }
});
