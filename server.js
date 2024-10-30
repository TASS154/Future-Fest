// Importa as dependências necessárias
const express = require('express'); // Framework para criação de servidores web
const session = require('express-session');
const { MongoClient, ObjectId } = require('mongodb'); // Cliente MongoDB para operações no banco de dados
const app = express(); // Cria uma instância do aplicativo Express
const path = require('path'); // Módulo para manipulação de caminhos de arquivos
const bcrypt = require('bcrypt'); // Módulo para criptografia de senhas
const port = 3000; // Porta em que o servidor irá escutar
const methodOverride = require('method-override'); // Middleware para permitir métodos HTTP que não são suportados pelo HTML
const fs = require('fs'); // Módulo para operações de sistema de arquivos
//const IA = require('./IA.mjs')

// Middleware para lidar com requisições JSON e URL-encoded
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method')); // Permite sobrepor métodos HTTP
app.use(express.static(path.join(__dirname, '/HTML'))); // Serve arquivos estáticos da pasta HTML

// Configuração do MongoDB
const url = 'mongodb://127.0.0.1:27017/'; // URL de conexão ao MongoDB
const dbName = 'academia'; // Nome do banco de dados
const collectionUser = 'usuarios'; // Nome da coleção de usuários
const collectionShop = 'loja'; // Nome da coleção de loja

app.use(session({
    secret: 'seu-segredo-aqui', // Você deve escolher um segredo forte
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // Mude para true se estiver usando HTTPS
}));

function criarCard(suplemento) {
    return `
    <link rel="stylesheet" href="loja.css">
<div class="card mb-3">
    <div class="card-body">
    <img src=${suplemento.img}>
    <h5 class="card-title">${suplemento.Nome}</h5>
    <h3 class="card-text">${suplemento.Preço}R$</h3>
    <p class="card-text"><strong>Usos:</strong> ${suplemento.uso}</p> <br>
    <p class="card-text"><strong>Ingreditentes:</strong> ${suplemento.ingredientes}</p> 
</div>
</div>
`
}

// Roteamento para as páginas HTML
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/HTML/home.html'); // Página inicial
});

app.get('/calculadora', (req, res) => {
    res.sendFile(__dirname + '/HTML/calculadora.html'); // Página calculadora
});

app.get('/voltar-home', (req, res) => {
    res.sendFile(__dirname + '/HTML/home.html'); // Página calculadora
});
app.get('/sobrenos', (req, res) => {
    res.sendFile(__dirname + '/HTML/sobrenos.html'); // Página "Sobre Nós"
});

app.get('/planos', (req, res) => {
    res.sendFile(__dirname + '/HTML/planos.html'); // Página de Planos
});

app.get('/time', (req, res) => {
    res.sendFile(__dirname + '/HTML/time.html');
})

// começo dos planos

app.get('/FitLab', (req, res) => {
    res.sendFile(__dirname + '/HTML/ComprarFitLab.html');
});

app.get('/Prata', (req, res) => {
    res.sendFile(__dirname + '/HTML/CartaoSilver.html');
});

app.get('/Gold', (req, res) => {
    res.sendFile(__dirname + '/HTML/gold.html');
});

app.get('/Diamond', (req, res) => {
    res.sendFile(__dirname + '/HTML/diamond.html');
});

//fim dos planos

app.get('/B-corp', (req, res) => {
    res.sendFile(__dirname + '/HTML/B-corp.html'); // Página B-corp
});

app.get('/login', (req, res) => {
    res.sendFile(__dirname + '/HTML/login.html'); // Página de Login
});

app.get('/cursos', (req, res) => {
    res.sendFile(__dirname + '/HTML/cursos.html'); // Página de Cursos
});

app.get('/Silver', (req, res) => {
    res.sendFile(__dirname + '/HTML/Silver.html');
});

app.get('/FitLab', (req, res) => {
    res.sendFile(__dirname + '/HTML/ComprarFitLab.html');
});

app.get('/Gold', (req, res) => {
    res.sendFile(__dirname + '/HTML/gold.html');
});

app.get('/Diamond', (req, res) => {
    res.sendFile(__dirname + '/HTML/diamond.html');
});

app.get('/pp', (req, res) => {
    res.sendFile(__dirname + '/HTML/pp.html'); // Página PP
});

app.get('/termos', (req, res) => {
    res.sendFile(__dirname + '/HTML/termos.html'); // Página de Termos
});
app.get('/comofunciona', (req, res) => {
    res.sendFile(__dirname + '/HTML/comofunciona.html'); // Página de Termos
});

app.get('/email', (req, res) => {
    res.sendFile(__dirname + '/HTML/email.html'); // Página de Email
});

app.get('/registro', (req, res) => {
    res.sendFile(__dirname + '/HTML/registro.html'); // Página de Registro
});

app.get('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            return res.status(500).send('Erro ao sair');
        }
        // página inicial após sair
        res.redirect('/');
    });
});


// sair da cona 

app.get('/dashboard', async (req, res) => {
    if (!req.session.userId) {
        return res.redirect('/login'); // Redireciona para login se não estiver logado
    }

    const client = new MongoClient(url); // Conecta ao MongoDB
    try {
        await client.connect();
        const db = client.db(dbName);
        const collection = db.collection(collectionUser);

        // Obtém o usuário logado pelo ID da sessão
        const usuario = await collection.findOne({ _id: new ObjectId(req.session.userId) });

        if (!usuario) {
            return res.status(404).send('Usuário não encontrado');
        }

        // HTML dinâmico gerado com base no usuário logado
        const conteudoDinamico = `
        <link rel="stylesheet" href="dashboard.css">
            <a href='/conta'>
            <div class="conteudo"> <!-- Adicione esta div como contêiner -->
            <div class="entrada">
                <a href='/conta'>
                    <img src="${usuario.foto}" alt="Foto de perfil" class="profile-image">
                </a>
                <h2>Bem-vindo, ${usuario.nome}!</h2>
                <p>Email: ${usuario.email}</p>
                <a href="/logout" class="btn btn-danger">Sair</a>
            </div>
            <div class="settingsa">
                <div class="container my-5">
                    <div class="row align-items-center">
                        <a href="/conta" class="d-flex align-items-center text-decoration-none">
                            <img src="https://i.ibb.co/jLBMHx3/settings.png" alt="Configurações" class="s me-3">
                            <div>
                                <h2 class="s1 mb-1">Configure seu Perfil!</h2>
                                <p class="s2">Para a IA dar resultados mais precisos!</p>
                            </div>
                        </a>
                    </div>
                </div>
            </div>
        </div>
        

            <div class="container">
            <div class="row text-center">
                <div class="col-md-4 col-sm-6">
                    <div class="progress red">
                        <span class="progress-left">
                            <span class="progress-bar"></span>
                        </span>
                        <span class="progress-right">
                            <span class="progress-bar"></span>
                        </span>
                        <div class="progress-value">90%</div>
                    </div>
                    <h1>Academia (Treinamento de Força)</h1>
                </div>
                <div class="col-md-4 col-sm-6">
                    <div class="progress orange">
                        <span class="progress-left">
                            <span class="progress-bar"></span>
                        </span>
                        <span class="progress-right">
                            <span class="progress-bar"></span>
                        </span>
                        <div class="progress-value">50%</div>
                    </div>
                    <h1>Pilates</h1>
                </div>
                <div class="col-md-4 col-sm-6">
                    <div class="progress green">
                        <span class="progress-left">
                            <span class="progress-bar"></span>
                        </span>
                        <span class="progress-right">
                            <span class="progress-bar"></span>
                        </span>
                        <div class="progress-value">75%</div>
                    </div>
                    <h1>Condicionamento Físico</h1>
                </div>
            </div>
        </div>
        <div class="container text-center mb-5">
        <img src="https://i.ibb.co/BcstXfr/FitBot.png" alt="FitBot" class="Img-FitBot1 mb-3">
        <h1>Falar com o FitBot</h1>
        <hr>
        <button type="button" class="btn btn-primary btn-lg my-2" data-bs-toggle="offcanvas"
            data-bs-target="#offcanvasMA" aria-controls="offcanvasMA">
            <img src="https://i.ibb.co/zRXNPxc/fitbotl.png" class="i-fitbot" alt="fitbot-icone"> Marcar Aula
        </button>
        <button type="button" class="btn btn-primary btn-lg my-2" data-bs-toggle="offcanvas"
            data-bs-target="#offcanvasIS" aria-controls="offcanvasIS"><img src="https://i.ibb.co/zRXNPxc/fitbotl.png"
                class="i-fitbot" alt="fitbot-icone"> Indicar
            Suplementos</button>
        <button type="button" class="btn btn-primary btn-lg my-2" data-bs-toggle="offcanvas"
            data-bs-target="#offcanvasLista" aria-controls="offcanvasLista"><img
                src="https://i.ibb.co/zRXNPxc/fitbotl.png" class="i-fitbot" alt="fitbot-icone"> Listar
            exercícios para fazer em casa</button>
    </div>
    <hr>
    <div class="container">
        <div class="assinaturas">
            <h1 class="assinatura-l">Sua assinatura</h1>
            <h1 class="assinatura-r">Aprimorar assinatura</h1>
        </div>
        <hr>
        <div class="row gy-4 align-items-start">
            <div class="col-md-4 d-flex justify-content-between align-items-start">
                <div class="card me-2 mb-3 bcorp-card" style="width: 18rem;">
                    <img src="https://i.ibb.co/dDBZJyj/fitlabandbcorp1.png" class="card-img-top"
                        alt="FitLab And B-Corp">
                    <div class="content">
                        <h4>R$: 0,00/m - Fitlab B-corp</h4>
                        <p><i class="ri-checkbox-circle-line"></i> Área de musculação</p>
                        <p><i class="ri-checkbox-circle-line"></i> Área de cardio</p>
                        <p><i class="ri-checkbox-circle-line"></i> Direito a 1 aula da sua escolha semanal</p>
                    </div>
                </div>
                <div class="vl"></div>
            </div>
            <div class="card me-2 mb-3 silver-card" style="width: 18rem;">
                <img src="https://i.ibb.co/2qsVjwY/fitlabsilver1.png" class="card-img-top" alt="FitLab Silver">
                <div class="content">
                    <h4>R$: 99,89/m - Fitlab Silver</h4>
                    <p><i class="ri-checkbox-circle-line"></i> Área de musculação</p>
                    <p><i class="ri-checkbox-circle-line"></i> Área de cardio</p>
                    <p><i class="ri-checkbox-circle-line"></i> Direito a 2 aulas da sua escolha semanal</p>
                </div>
                <button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#SilverModal">
                    MATRICULE-SE
                </button>
            </div>
            <div class="card me-2 mb-3 gold-card" style="width: 18rem;">
                <img src="https://i.ibb.co/LvFVbbZ/fit-Lab-Gold.png" class="card-img-top" alt="FitLab Gold">
                <div class="content">
                    <h4>R$: 150,00/m - Fitlab Gold</h4>
                    <p><i class="ri-checkbox-circle-line"></i> Área de musculação</p>
                    <p><i class="ri-checkbox-circle-line"></i> Área de cardio</p>
                    <p><i class="ri-checkbox-circle-line"></i> Direito a 3 aulas da sua escolha semanal</p>
                    <p><i class="ri-checkbox-circle-line"></i> Acesso a cadeira de massagem durante 1h por dia</p>
                    <p><i class="ri-checkbox-circle-line"></i> Acesso a sala de sauna</p>
                </div>
                <button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#GoldModal">
                    MATRICULE-SE
                </button>
            </div>
        </div>
        <div class="card me-2 mb-3 diamond-card" style="width: 18rem;">
            <img src="https://i.ibb.co/y574F4z/fitlabdiamond-1.png" class="card-img-top" alt="FitLab Diamond">
            <div class="content">
                <h4>R$: 200,00/m - Fitlab Diamond</h4>
                <p><i class="ri-checkbox-circle-line"></i> Área de musculação</p>
                <p><i class="ri-checkbox-circle-line"></i> Área de cardio</p>
                <p><i class="ri-checkbox-circle-line"></i> Direito a 4 aulas da sua escolha semanal</p>
                <p><i class="ri-checkbox-circle-line"></i> Acesso a cadeira de massagem durante 1h por dia</p>
                <p><i class="ri-checkbox-circle-line"></i> Acesso a sala de sauna</p>
                <p><i class="ri-checkbox-circle-line"></i> Acesso a consultas com nutricionista</p>
            </div>
            <button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#DiamondModal">
                MATRICULE-SE
            </button>
        </div>

    </div>


    </div>
    </div>

    </div>

    <!-- Offcanvas Marcar Aula -->
    <div class="offcanvas offcanvas-start text-bg-dark" tabindex="-1" id="offcanvasMA" aria-labelledby="offcanvasMA">
        <div class="offcanvas-header d-flex align-items-center">
            <img src="https://i.ibb.co/BcstXfr/FitBot.png" alt="FitBot" class="fitbot-img me-2">
            <h5 class="offcanvas-title mb-0">FitBot</h5>
            <div data-bs-theme="dark">
                <button type="button" class="btn-close ms-auto" data-bs-dismiss="offcanvas" aria-label="Close"></button>
            </div>
        </div>
        <hr class="linha-do-perfil">

        <div class="offcanvas-body">
            <div class="chat-container">
                <div class="messages">
                    <div class="message received">
                        <p>Olá! Como posso te ajudar hoje?</p>
                    </div>
                    <!-- Aqui as novas mensagens enviadas aparecerão -->
                </div>
                <div class="message-input d-flex mt-3">
                    <textarea class="form-control" id="chatMessageInput" rows="4" placeholder="Digite sua mensagem..."
                        name="MA">Eu quero marcar uma aula amanhã, me mande os horários disponíveis!</textarea>
                    <button class="btn btn-primary ms-2" id="sendMessageBtn">Enviar</button>
                </div>
            </div>
        </div>
    </div>

    <!-- Offcanvas Indicar Suplementos-->

    <div class="offcanvas offcanvas-start text-bg-dark" tabindex="-1" id="offcanvasIS" aria-labelledby="offcanvasIS">
        <div class="offcanvas-header d-flex align-items-center">
            <img src="https://i.ibb.co/BcstXfr/FitBot.png" alt="FitBot" class="fitbot-img me-2">
            <h5 class="offcanvas-title mb-0">FitBot</h5>
            <div data-bs-theme="dark">
                <button type="button" class="btn-close ms-auto" data-bs-dismiss="offcanvas" aria-label="Close"></button>
            </div>
        </div>
        <hr class="linha-do-perfil">

        <div class="offcanvas-body">
            <div class="chat-container">
                <div class="messages">
                    <div class="message received">
                        <p>Olá! Como posso te ajudar hoje?</p>
                    </div>
                    <!-- Aqui as novas mensagens enviadas aparecerão -->
                </div>
                <div class="message-input d-flex mt-3">
                    <textarea class="form-control" id="chatMessageInput" rows="4" placeholder="Digite sua mensagem..."
                        name="IS">Me indique suplementos para o meu treinamento!</textarea>
                    <button class="btn btn-primary ms-2" id="sendMessageBtn">Enviar</button>
                </div>
            </div>
        </div>
    </div>

    <!--Offcanvas de Listar-->

    <div class="offcanvas offcanvas-start text-bg-dark" tabindex="-1" id="offcanvasLista"
        aria-labelledby="offcanvasLista">
        <div class="offcanvas-header d-flex align-items-center">
            <img src="https://i.ibb.co/BcstXfr/FitBot.png" alt="FitBot" class="fitbot-img me-2">
            <h5 class="offcanvas-title mb-0">FitBot</h5>
            <div data-bs-theme="dark">
                <button type="button" class="btn-close ms-auto" data-bs-dismiss="offcanvas" aria-label="Close"></button>
            </div>
        </div>
        <hr class="linha-do-perfil">

        <div class="offcanvas-body">
            <div class="chat-container">
                <div class="messages">
                    <div class="message received">
                        <p>Olá! Como posso te ajudar hoje?</p>
                    </div>
                    <!-- Aqui as novas mensagens enviadas aparecerão -->
                </div>
                <div class="message-input d-flex mt-3">
                    <textarea class="form-control" id="chatMessageInput" rows="4" placeholder="Digite sua mensagem..."
                        name="IS">Liste exercícios para eu fazer na minha casa!</textarea>
                    <button class="btn btn-primary ms-2" id="sendMessageBtn">Enviar</button>
                </div>
            </div>
        </div>
    </div>
        `;

        // Lê o arquivo HTML base
        const caminhoHtmlBase = path.join(__dirname, 'HTML', 'dashboard.html');
        fs.readFile(caminhoHtmlBase, 'utf-8', (err, data) => {
            if (err) {
                console.error('Erro ao ler arquivo HTML base', err);
                return res.status(500).send('Erro ao carregar o dashboard');
            }

            // Substitui o placeholder pelo conteúdo dinâmico
            const paginaModificada = data.replace('<!-- PLACEHOLDER -->', conteudoDinamico);

            // Envia a página modificada como resposta
            res.send(paginaModificada);
        });

    } catch (err) {
        console.error('Erro ao acessar dashboard', err);
        res.status(500).send('Erro ao acessar o dashboard, por favor, tente novamente mais tarde.');
    } finally {
        client.close();
    }
});


app.get('/conta', async (req, res) => {
    if (!req.session.userId) {
        return res.redirect('/login'); // Redireciona para login se não estiver logado
    }

    const client = new MongoClient(url);
    try {
        await client.connect();
        const db = client.db(dbName);
        const collection = db.collection(collectionUser);

        // Obtém o usuário logado pelo ID da sessão
        const usuario = await collection.findOne({ _id: new ObjectId(req.session.userId) });

        if (!usuario) {
            return res.status(404).send('Usuário não encontrado');
        }

        // Gera o HTML com os dados do usuário
        const display = `
        <link rel="stylesheet" href="conta.css">
        <div class="profile-img text-center mb-4">
            <img src="${usuario.foto}" alt="Imagem de Perfil" class="img-thumbnail" id="profileImage" style="width: 200px; height: 200px;">
        </div>
        <div class="tc">
        <button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#profileImageModal">
        Trocar imagem de perfil
    </button>
      </div>
    <div class="modal fade" id="profileImageModal" tabindex="-1" aria-labelledby="profileImageModalLabel" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content" style="background-color: black; color: white;">
                <div class="modal-header">
                    <h5 class="modal-title" id="profileImageModalLabel" style="font-size: 2rem;">Selecione a sua imagem de perfil</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
    <div class="row">
        <div class="col-3">
            <img src="https://i.ibb.co/MNsgggy/Profile1.png" alt="Imagem 1" class="img-fluid profile-option" data-id="1">
        </div>
        <div class="col-3">
            <img src="https://i.ibb.co/j64bYRG/Profile2.png" alt="Imagem 2" class="img-fluid profile-option" data-id="2">
        </div>
        <div class="col-3">
            <img src="https://i.ibb.co/zNYZ3X7/Profile3.png" alt="Imagem 3" class="img-fluid profile-option" data-id="3">
        </div>
        <div class="col-3">
            <img src="https://i.ibb.co/rQ1MzrL/Profile4.png" alt="Imagem 4" class="img-fluid profile-option" data-id="4">
        </div>
    </div>
</div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Fechar</button>
                    <button type="button" class="btn btn-primary">Salvar mudanças</button>
                </div>
            </div>
        </div>
    </div>

        <div class="Seu-Perfil">
            <div class="form-container">

                <form method="POST" action='/conta/change'>
                    <div class="mb-3">
                        <label for="nomeUsuario" class="form-label">Nome de Usuário:</label>
                        <div class="nome-container d-flex align-items-center">
                            <span id="nomeDisplay" class="me-2">${usuario.nome}</span>
                            <img src="https://i.ibb.co/DkQS76X/edit.png" alt="Editar Nome" class="edit" id="editNome" style="cursor: pointer;" aria-label="Editar Nome" >
                        </div>
                        <input class="form-control" type="text" id="nomeInput" name="novoNome" placeholder="Seu nome de usuário" style="display: none;" aria-label="Novo Nome">
                        <button type="submit" id="confirmButton" class="btn btn-primary mt-3" style="display: none;" aria-label="Salvar Nome" >Salvar</button>
                    </div>
                    <div class="mb-3 row align-items-center">
                        <label for="staticEmail" class="col-auto col-form-label">Endereço de E-mail:</label>
                        <div class="col-auto">
                            <span>${usuario.email}</span>
                        </div>
                    </div>
                </form>
            </div>
        </div>
        <form method="POST" action='/conta/delete'>
        <button type="submit" class="btn btn-danger btn-apagar mt-3"> <!-- Aumentar margem superior -->
            <img src="https://i.ibb.co/Ss6dxLd/trashh.png" alt="Ícone de apagar Conta" class="i-apagar me-2" aria-hidden="true">
            <span class="btn-apagar-text">Apagar Conta</span>
        </button>
    </form>
    
    <div class="container mt-0"> 
        <a class="m" data-bs-toggle="collapse" href="#avancado" role="button" aria-expanded="false"
            aria-controls="avancado">
            Opções Avançadas..
        </a>
    
        <div class="collapse" id="avancado">
            <div class="card-title mt-3">
                <h3>Coloque mais informações</h3>
                <h4>Para o FitBot dar resultados mais precisos</h4>
                <p class="ne">Coloque "Nenhum", se não tiver algum dos campos específicos!</p>
            </div>
            <div class="mb-3">
                <div class="Generos">
                    <p>Qual o seu Gênero</p>
                    <div class="d-flex align-items-center justify-content-center gap-3">
                        <div class="form-check">
                            <input class="form-check-input" type="radio" name="flexRadioDefault" id="flexRadioDefault2" checked>
                            <label class="form-check-label" for="flexRadioDefault2">Prefiro não dizer...</label>
                        </div>
                        <div class="form-check">
                            <input class="form-check-input" type="radio" name="flexRadioDefault" id="flexRadioDefault1">
                            <label class="form-check-label" for="flexRadioDefault1">Homem</label>
                        </div>
                        <div class="form-check">
                            <input class="form-check-input" type="radio" name="flexRadioDefault" id="flexRadioDefault3">
                            <label class="form-check-label" for="flexRadioDefault3">Mulher</label>
                        </div>
                    </div>
                </div>
            </div>
    
            <div class="mb-3">
                <label for="AlergiaA" class="form-label">Você tem alguma Alergia Alimentar</label>
                <input type="text" class="form-control" id="alergiaA" placeholder="Exemplo: Glúten, nozes">
            </div>
            <div class="mb-3">
                <label for="condicaoS" class="form-label">Condições de Saúde:</label>
                <input type="text" class="form-control" id="condicaoS"
                    placeholder="Exemplo: Diabetes, Problemas cardíacos">
            </div>
            <div class="mb-3">
                <p>Nível de Atividade física</p>
                <select class="form-select" aria-label="Default select example">
                    <option selected>Prefiro não comentar</option>
                    <option value="1">Sedentário</option>
                    <option value="2">Moderadamente ativo</option>
                    <option value="3">Muito ativo</option>
                </select>
            </div>
            <div class="mb-3">
                <p>Objetivo</p>
                <select class="form-select" aria-label="Default select example">
                    <option selected>Prefiro não comentar</option>
                    <option value="1">Perda de peso</option>
                    <option value="2">Aumento de massa muscular</option>
                    <option value="3">Melhora de resistência</option>
                    <option value="4">Recuperação de lesões</option>
                </select>
            </div>
            <div class="mb-3">
                <label for="prefAlimentar" class="form-label">Preferências Alimentares:</label>
                <input type="text" class="form-control" id="prefAlimentar" placeholder="Exemplo: Vegetariano, vegano">
            </div>
            <div class="mb-3">
                <label for="histLesao" class="form-label">Histórico de Lesões:</label>
                <input type="text" class="form-control" id="histLesao"
                    placeholder="Exemplo: Lesões Musculares, Fraturas">
            </div>
            <div class="mb-3">
            <div>
            <label for="supAtual" class="form-label">Suplementos Atuais:</label>
            <input type="text" class="form-control" id="supAtual" placeholder="Exemplo: Creatina, vitamina D">
        </div>
        <div class="saver">
            <button type="button" class="btn btn-danger" id="saveButton">Salvar</button>
            <br><br>
            <div class="toast-container position-fixed bottom-0 end-0 p-3">
                <div id="liveToast" class="toast" role="alert" aria-live="assertive" aria-atomic="true">
                    <div class="toast-header">
                        <img src="https://i.ibb.co/BcstXfr/FitBot.png" class="rounded me-2" alt="FitBot" width="50px" height="50px">>
                        <strong class="me-auto">FitBot Agradece!</strong>
                        <small>Agora</small>
                        <button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
                    </div>
                    <div class="toast-body">
                        Informações salvas com sucesso!
                    </div>
                </div>
            </div>
        </div>
    
<script>
    document.getElementById('editNome').addEventListener('click', toggleEditNome);
    document.getElementById('confirmButton').addEventListener('click', salvarNome);

    function toggleEditNome() {
        const nomeDisplay = document.getElementById('nomeDisplay');
        const nomeInput = document.getElementById('nomeInput');
        const editNomeBtn = document.getElementById('editNome');
        const confirmBtn = document.getElementById('confirmButton');

        nomeDisplay.style.display = 'none';
        nomeInput.style.display = 'block';
        nomeInput.value = nomeDisplay.textContent;
        editNomeBtn.style.display = 'none';
        confirmBtn.style.display = 'inline-block';
        nomeInput.focus();
    }

    function salvarNome(event) {
        const nomeInput = document.getElementById('nomeInput');
        const nomeDisplay = document.getElementById('nomeDisplay');
        const editNomeBtn = document.getElementById('editNome');
        const confirmBtn = document.getElementById('confirmButton');

        nomeDisplay.textContent = nomeInput.value;
        nomeDisplay.style.display = 'inline-block';
        nomeInput.style.display = 'none';
        confirmBtn.style.display = 'none';
        editNomeBtn.style.display = 'inline-block';
    }
            // Email (caso necessário)
            // document.getElementById('editEmail').addEventListener('click', function () {
            //     document.getElementById('nomeDisplay1').style.display = 'none';
            //     document.getElementById('nomeInput1').style.display = 'block';
            //     document.getElementById('nomeInput1').value = document.getElementById('nomeDisplay').textContent;
            //     document.getElementById('editEmail').style.display = 'none';
            //     document.getElementById('confirmButton1').style.display = 'inline-block';
            // });
        
            // document.getElementById('confirmButton1').addEventListener('click', function () {
            //     const novoNome = document.getElementById('nomeInput1').value;
            //     document.getElementById('nomeDisplay1').textContent = novoNome;
            //     document.getElementById('nomeDisplay1').style.display = 'inline-block';
            //     document.getElementById('nomeInput1').style.display = 'none';
            //     document.getElementById('confirmButton1').style.display = 'none';
            //     document.getElementById('editEmail').style.display = 'inline-block';
            // });
        </script>
         
        `;

        // Lê o arquivo HTML base
        const caminhoHtmlBase = path.join(__dirname, 'HTML', 'conta.html');
        fs.readFile(caminhoHtmlBase, 'utf-8', (err, data) => {
            if (err) {
                console.error('Erro ao ler arquivo HTML base', err);
                return res.status(500).send('Erro ao carregar a página da conta');
            }

            // Substitui o placeholder pelo conteúdo dinâmico
            const paginaModificada = data.replace('<!-- PLACEHOLDER -->', display);

            // Envia a página modificada como resposta
            res.send(paginaModificada);
        });

    } catch (err) {
        console.error('Erro ao buscar usuário', err);
        res.status(500).send('Erro ao buscar usuário, por favor, tente novamente mais tarde.');
    } finally {
        client.close(); // Fecha a conexão com o banco de dados
    }
});

app.post('/conta/change', async (req, res) => {
    if (!req.session.userId) {
        return res.redirect('/login'); // Redireciona para login se não estiver logado
    }

    console.log("antes do try")

    const novonome = req.body.novoNome; // Obtém o novo nome do corpo da requisição
    const client = new MongoClient(url);

    try {
        await client.connect(); // Conecta ao MongoDB
        const db = client.db(dbName);
        const collection = db.collection(collectionUser);
        console.log("depois do try")
        // Atualiza o nome do usuário no banco de dados
        const result = await collection.updateOne(
            { _id: new ObjectId(req.session.userId) },
            { $set: { nome: novonome } }
        );
        console.log("depois do result")


        if (result.modifiedCount === 0) {
            return res.status(404).send('Usuário não encontrado ou o nome não foi atualizado');
        }
        console.log(result)
    } catch (err) {
        console.error('Erro ao atualizar nome do usuário', err);
        res.status(500).send('Erro ao atualizar nome, por favor, tente novamente mais tarde.');
    } finally {
        client.close(); // Fecha a conexão com o banco de dados
    }
});

app.post('/conta/upload', (req, res) => {
    if (!req.session.userId) {
        return res.redirect('/login');
    }

    // Aqui, precisamos ler o arquivo do request
    const file = req.body.file; // Aqui está o arquivo vindo do front-end

    // Verifique se o arquivo está presente
    if (!file) {
        return res.status(400).send('Nenhum arquivo recebido.');
    }

    const fileName = `${req.session.userId}_${Date.now()}${path.extname(file.name)}`;
    const uploadPath = path.join(__dirname, 'uploads', fileName);

    // Escreve o arquivo no sistema de arquivos
    fs.writeFile(uploadPath, file.data, (err) => {
        if (err) {
            console.error('Erro ao salvar o arquivo', err);
            return res.status(500).send('Erro ao salvar o arquivo.');
        }

        const imageUrl = `http://localhost:${port}/uploads/${fileName}`;

        const client = new MongoClient(url);
        client.connect()
            .then(() => {
                const db = client.db(dbName);
                const collection = db.collection(collectionUser);

                return collection.updateOne(
                    { _id: new ObjectId(req.session.userId) },
                    { $set: { foto: imageUrl } }
                );
            })
            .then(result => {
                if (result.modifiedCount === 0) {
                    return res.status(404).send('Usuário não encontrado ou a foto não foi atualizada');
                }

                res.redirect(`/conta/${req.session.userId}`);
            })
            .catch(err => {
                console.error('Erro ao atualizar a imagem no MongoDB', err);
                res.status(500).send('Erro ao atualizar a imagem no banco de dados');
            })
            .finally(() => client.close());
    });
});

app.post('/conta/delete', async (req, res) => {
    const id = req.params.id; // Obtém o ID da URL
    const client = new MongoClient(url);

    try {
        await client.connect(); // Conecta ao banco de dados
        const db = client.db(dbName);
        const collection = db.collection(collectionUser);

        // Exclui o usuário pelo ID
        const result = await collection.deleteOne({ _id: new ObjectId(req.session.userId) });

        if (result.deletedCount === 0) {
            return res.status(404).send('Usuário não encontrado'); // Retorna 404 se o usuário não existir
        }

        res.redirect('/'); // Retorna sucesso
    } catch (err) {
        console.error('Erro ao excluir usuário:', err); // Log do erro
        res.status(500).send('Erro ao processar a requisição, por favor, tente novamente mais tarde.'); // Retorno de erro
    } finally {
        await client.close(); // Fecha a conexão com o banco de dados
    }
});

app.post('/conta/save-image', async (req, res) => {
    if (!req.session.userId) {
        return res.status(403).send('Não autorizado'); // Se não estiver logado
    }

    const { imageUrl } = req.body; // Captura a URL da imagem
    const client = new MongoClient(url);

    try {
        await client.connect();
        const db = client.db(dbName);
        const collection = db.collection(collectionUser);

        // Atualiza o campo da foto do usuário logado
        await collection.updateOne(
            { _id: new ObjectId(req.session.userId) },
            { $set: { foto: imageUrl } }
        );

        res.json({ message: 'Imagem de perfil atualizada com sucesso!' });
    } catch (error) {
        console.error('Erro ao atualizar a imagem:', error);
        res.status(500).send('Erro ao atualizar a imagem');
    } finally {
        await client.close();
    }
});

// Rota para login
// server.js
app.post('/login', async (req, res) => {
    const email = req.body.email;
    const senha = req.body.senha;
    const client = new MongoClient(url);

    try {
        await client.connect();
        const db = client.db(dbName);
        const collection = db.collection(collectionUser);

        const user = await collection.findOne({ email });
        if (!user) {
            return res.json({ error: "E-mail não encontrado" });
        }

        const match = await bcrypt.compare(senha, user.senha);
        if (!match) {
            return res.json({ error: "Senha incorreta" });
        }

        req.session.userId = user._id;
        res.redirect('/dashboard');
    } catch (err) {
        console.error('Erro ao fazer login', err);
        res.status(500).json({ error: 'Erro ao fazer login, por favor, tente novamente mais tarde.' });
    } finally {
        client.close();
    }
});


// Rota para registro de novos usuários
app.post('/registro', async (req, res) => {
    const newUser = req.body;
    const client = new MongoClient(url);

    try {
        await client.connect();
        const db = client.db(dbName);
        const collection = db.collection(collectionUser);

        const existentUser = await collection.findOne({ nome: newUser.nome });
        const existentEmail = await collection.findOne({ email: newUser.email });

        // Verifique se as senhas coincidem
        if (newUser.senha !== newUser.confirmarSenha) {
            return res.send(`
            <h1>As senhas não coincidem. Tente novamente.</h1>
            <a href="/registro" style="padding: 10px; background-color: #007bff; color: white; text-decoration: none; border-radius: 5px;">Voltar para Registro</a>
            <a href="/" style="padding: 10px; background-color: #007bff; color: white; text-decoration: none; border-radius: 5px;">Voltar para Início</a>
        `);
        }

        if (existentUser) {
            return res.send(`
                <h1>Usuário já existente, tente outro</h1>
                <a href="/registro" style="padding: 10px; background-color: #007bff; color: white; text-decoration: none; border-radius: 5px;">Voltar para Registro</a>
                <a href="/" style="padding: 10px; background-color: #007bff; color: white; text-decoration: none; border-radius: 5px;">Voltar para Início</a>
            `);
        }

        if (existentEmail) {
            return res.send(`
                <h1>Email já existente, tente outro</h1>
                <a href="/registro" style="padding: 10px; background-color: #007bff; color: white; text-decoration: none; border-radius: 5px;">Voltar para Registro</a>
                <a href="/" style="padding: 10px; background-color: #007bff; color: white; text-decoration: none; border-radius: 5px;">Voltar para Início</a>
            `);
        }

        const CriptoSenha = await bcrypt.hash(req.body.senha, 15)

        const result = await collection.insertOne({
            nome: req.body.nome,
            senha: CriptoSenha,
            renda: req.body.renda,
            nascimento: req.body.nascimento,
            email: req.body.email,
            numero: req.body.numero,
            cpf: req.body.cpf,
            foto: req.body.foto,
            desconto: req.body.desconto
        }
        );
        req.session.userId = result.insertedId;

        if (req.body.renda <= 1200) {
            appDesconto = await collection.updateOne({ _id: result.insertedId }, { $set: { desconto: true } })
        } else {
            appDesconto = await collection.updateOne({ _id: result.insertedId }, { $set: { desconto: false } })
        }

        console.log(result.insertedId)

        return res.redirect('/dashboard');
    } catch (err) {
        console.error('Erro ao fazer registro', err);
        res.status(500).send('Erro ao registrar, por favor, tente novamente mais tarde.');
    } finally {
        client.close();
    }
});

app.get('/loja', async (req, res) => {
    const client = new MongoClient(url);

    try {
        // Conecta ao banco de dados
        await client.connect();
        const db = client.db(dbName);
        const collection = db.collection(collectionShop);


        // Obtém todos os usuários da coleção
        const suplementos = await collection.find({}).toArray();

        // Retorna os usuários como resposta
        const cardsHtml = suplementos.map(suplemento => criarCard(suplemento)).join('');
        const pageHtmlPath = path.join(__dirname + '/HTML/loja.html');
        let pageHtml = fs.readFileSync(pageHtmlPath, 'utf-8');
        pageHtml = pageHtml.replace('{{cardsHtml}}', cardsHtml);
        res.send(pageHtml);
    } catch (err) {
        console.error('Erro ao acessar o MongoDB:', err);
        res.status(500).send('Erro ao acessar o banco de dados');
    } finally {
        await client.close(); // Fecha a conexão com o banco de dados
    }
});

app.post('/FitLab', async (req, res) => {
    const payInfo = req.body
    const client = new MongoClient(url)


    try {
        await client.connect();
        const db = client.db(dbName);
        const collection = db.collection(collectionUser);

        const user = await collection.findOne({ nome: payInfo.nome })

        console.log(user)

        if (!user) {
            res.send(`<h1>Usuário não encontrado</h1> <br> <a href="/FitLab"> tente novamente! </a> `)
        }

        const plan = await collection.updateOne({ nome: user.nome }, { $set: { "Plano": "FitLab" } })


        console.log(plan)

        res.redirect('/dashboard')

    } catch (err) {
        console.error("erro ao cadastrar no plano, tente novamente mais tarde", err)
    } finally {
        await client.close()
    }
})

// calculadora de agua:
function calcularAgua() {
    const peso = document.getElementById('peso').value;
    const resultadoDiv = document.getElementById('resultado');

    if (peso > 0) {
        const aguaRecomendada = peso * 35; // Resultadi vai ser em litros 
        resultadoDiv.innerHTML = `A quantidade recomendada de água por dia é: ${(aguaRecomendada / 1000).toFixed(2)} litros.`;
    } else {
        resultadoDiv.innerHTML = 'Por favor, insira um peso válido.';
    }
}

// Inicia o servidor na porta especificada
app.listen(port, () => {
    console.log(`http://localhost:${port}`); // Log para indicar que o servidor está rodando
});
