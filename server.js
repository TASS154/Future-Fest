// Importa as dependências necessárias
const express = require('express'); // Framework para criação de servidores web
const session = require('express-session')
const { MongoClient, ObjectId } = require('mongodb'); // Cliente MongoDB para operações no banco de dados
const app = express(); // Cria uma instância do aplicativo Express
const path = require('path'); // Módulo para manipulação de caminhos de arquivos
const bcrypt = require('bcrypt'); // Módulo para criptografia de senhas
const port = 3000; // Porta em que o servidor irá escutar
const methodOverride = require('method-override'); // Middleware para permitir métodos HTTP que não são suportados pelo HTML
const fs = require('fs'); // Módulo para operações de sistema de arquivos

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

// Roteamento para as páginas HTML
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/HTML/home.html'); // Página inicial
});

app.get('/sobrenos', (req, res) => {
    res.sendFile(__dirname + '/HTML/sobrenos.html'); // Página "Sobre Nós"
});

app.get('/planos', (req, res) => {
    res.sendFile(__dirname + '/HTML/planos.html'); // Página de Planos
});

app.get('/loja', (req, res) => {
    res.sendFile(__dirname + '/HTML/loja.html'); // Página da Loja
});

app.get('/B-corp', (req, res) => {
    res.sendFile(__dirname + '/HTML/B-corp.html'); // Página B-corp
});

app.get('/login', (req, res) => {
    res.sendFile(__dirname + '/HTML/login.html'); // Página de Login
});

app.get('/cursos', (req, res) => {
    res.sendFile(__dirname + '/HTML/cursos.html'); // Página de Cursos
});

app.get('/pp', (req, res) => {
    res.sendFile(__dirname + '/HTML/pp.html'); // Página PP
});

app.get('/termos', (req, res) => {
    res.sendFile(__dirname + '/HTML/termos.html'); // Página de Termos
});

app.get('/email', (req, res) => {
    res.sendFile(__dirname + '/HTML/email.html'); // Página de Email
});

app.get('/registro', (req, res) => {
    res.sendFile(__dirname + '/HTML/registro.html'); // Página de Registro
});

app.get('/conta', (req, res) => {
    res.sendFile(__dirname + '/HTML/conta.html'); // Página de Conta
});

app.get('/dashboard', async (req, res) => {
    if (!req.session.userId) {
        return res.redirect('/login'); // Redireciona se não estiver logado
    }
    
    const client = new MongoClient(url);
    try {
       await client.connect();
        const db = client.db(dbName);
        const collection = db.collection(collectionUser);
    
         const usuario = await collection.findOne({ _id: new ObjectId(req.session.userId) });
            
        if (!usuario) {
            return res.status(404).send('Usuário não encontrado');
        }
    
        const dashboardHTML = `
        <!DOCTYPE html>
        <html lang="pt-br">
        <head>
            <meta charset="UTF-8">
            <title>Dashboard</title>
            <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/css/bootstrap.min.css">
        </head>
        <body>
            <div class="container">
                <h1>Bem-vindo, ${usuario.nome}!</h1>
                <a href='/conta/${req.session.userId}'>
                <img src="${usuario.foto}" alt="Foto de perfil" class="img-thumbnail" style="width: 200px; height: 200px;">
            </a>
                <p>Email: ${usuario.email}</p>
                <a href="/logout">Sair</a>
            </div>
        </body>
        </html>
        `;
    
            res.send(dashboardHTML);
        } catch (err) {
            console.error('Erro ao acessar dashboard', err);
            res.status(500).send('Erro ao acessar o dashboard, por favor, tente novamente mais tarde.');
        } finally {
            client.close();
        }
    });

app.get('/conta/:id', async (req, res) => {
    const client = new MongoClient(url);
    const id = req.params.id; // Extrai o ID da URL
    try {
        await client.connect();
        const db = client.db(dbName);
        const collection = db.collection(collectionUser);

        // Busca o usuário pelo ID
        const usuario = await collection.findOne({ _id: new ObjectId(id) }); // Certifique-se de usar ObjectId

        if (!usuario) {
            return res.status(404).send('Usuário não encontrado'); // Retorna 404 se o usuário não existir
        }

        // Gera o HTML com os dados do usuário
        const display = `
        <div class="profile-img">
            <img src="${usuario.foto}" alt="Imagem de Perfil" class="img-thumbnail" id="profileImage"
                style="width: 200px; height: 200px;">
        </div>
        <div class="Seu-Perfil">
            <div class="form-container">
                <div class="mb-3">
                    <label for="formFile" class="form-label">Vamos lá, mostre sua foto! (Aceitamos: PNG e JPG)</label>
                    <input class="form-control input-sm" type="file" id="formFile">
                </div>
                <div class="mb-3">
                    <label for="nomeUsuario" class="form-label">Nome de Usuário:</label>
                    <div class="nome-container">
                        <span id="nomeDisplay">${usuario.nome}</span> <!-- Use o campo correto do usuário -->
                        <img src="https://i.ibb.co/DkQS76X/edit.png" alt="editar" class="edit" id="editIcon">
                    </div>
                    <input class="form-control input-sm" type="text" id="nomeInput" placeholder="Seu nome de usuário"
                        style="display: none;">
                    <button id="confirmButton" class="btn btn-primary" style="display: none;">Salvar</button>
                </div>
                <div class="mb-3 row align-items-center">
                    <label for="staticEmail" class="col-auto col-form-label">Endereço de E-mail:<br>
                        <span>${usuario.email}</span></label>
                </div>
            </div>
        </div>
    </form>

    <form method="POST" action='/conta/${id}'>
    <button type="submit" class="btn btn-danger btn-apagar">
        <img src="https://i.ibb.co/Ss6dxLd/trashh.png" alt="Icone de apagar Conta" class="i-apagar">
        <span class="btn-apagar-text">Apagar Conta</span>
    </button>


</form>
        `;

        res.send(display); // Envia o HTML gerado como resposta
    } catch (err) {
        console.error('Erro ao buscar usuário', err);
        res.status(500).send('Erro ao buscar usuário, por favor, tente novamente mais tarde.');
    } finally {
        client.close(); // Fecha a conexão com o banco de dados
    }
});

app.post('/conta/:id', async (req, res) => {
    const id = req.params.id; // Obtém o ID da URL
    const client = new MongoClient(url);

    try {
        await client.connect(); // Conecta ao banco de dados
        const db = client.db(dbName);
        const collection = db.collection(collectionUser);

        // Exclui o usuário pelo ID
        const result = await collection.deleteOne({ _id: new ObjectId(id) });

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

// Rota para login
app.post('/login', async (req, res) => {
    const { email, senha } = req.body; // Extrai email e senha do corpo da requisição

    const client = new MongoClient(url); // Cria uma nova instância do cliente MongoDB

    try {
        await client.connect(); // Conecta ao banco de dados
        const db = client.db(dbName); // Seleciona o banco de dados
        const collection = db.collection(collectionUser); // Seleciona a coleção de usuários

        // Procura o usuário pelo e-mail
        const user = await collection.findOne({ email });

        // Verifica se o e-mail existe
        if (!user) {
            return res.status(401).send('E-mail não encontrado.'); // Resposta se o email não foi encontrado
        }

        console.log(user); // Log do usuário encontrado

        // Verifica a senha (aqui deveria ser usado bcrypt para comparar senhas por questão de segurança)
        if (senha !== user.senha) {
            return res.status(401).send('Senha incorreta.'); // Resposta se a senha estiver incorreta
        } else {
            res.redirect('/dashboard'); // Redireciona para o dashboard se o login for bem-sucedido
        }
    } catch (err) {
        console.error('Erro ao fazer login', err); // Log de erro
        res.status(500).send('Erro ao fazer login, por favor, tente novamente mais tarde.'); // Resposta em caso de erro
    } finally {
        client.close(); // Fecha a conexão com o banco de dados
    }
});

// Rota para registro de novos usuários
app.post('/registro', async (req, res) => {
    const newUser = req.body; // Extrai os dados do novo usuário do corpo da requisição
    const client = new MongoClient(url); // Cria uma nova instância do cliente MongoDB

    try {
        await client.connect(); // Conecta ao banco de dados

        const db = client.db(dbName); // Seleciona o banco de dados
        const collection = db.collection(collectionUser); // Seleciona a coleção de usuários

        // Insere o novo usuário na coleção
        const result = await collection.insertOne(newUser);
        console.log(`usuário ${result.insertedId} inserido com sucesso`); // Log do ID do usuário inserido

        req.session.userId = result.insertedId; // Armazena o ID do usuário na sessão
        return res.redirect(`/dashboard`); // Redireciona para a página inicial
    } catch (err) {
        console.error('Erro ao cadastrar usuario', err); // Log de erro
        res.status(500).send('Erro ao fazer o registro da conta, por favor, tente novamente mais tarde'); // Resposta em caso de erro
    } finally {
        client.close(); // Fecha a conexão com o banco de dados
    }
});

// Inicia o servidor na porta especificada
app.listen(port, () => {
    console.log(`http://localhost:${port}`); // Log para indicar que o servidor está rodando
});
