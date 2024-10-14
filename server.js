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

function criarCard(suplemento) {
    return `
    <link rel="stylesheet" href="loja.css">
<div class="card mb-3">
<img src="${suplemento.img}" class="card-img-top" style="width: 100px; height: 100px;" alt="${suplemento. Nome}">
    <div class="card-body">
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

app.get('/sobrenos', (req, res) => {
    res.sendFile(__dirname + '/HTML/sobrenos.html'); // Página "Sobre Nós"
});

app.get('/planos', (req, res) => {
    res.sendFile(__dirname + '/HTML/planos.html'); // Página de Planos
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


app.get('/CartaoSilver', (req, res) => {
    res.sendFile(__dirname + '/HTML/CartaoSilver.html'); // Página de Registro
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
            <img src="${usuario.foto}" alt="Foto de perfil" class="profile-image">
            </a>
            <h2>Bem-vindo, ${usuario.nome}!</h2>
            <p>Email: ${usuario.email}</p>
            <a href="/logout" class="btn btn-danger">Sair</a>
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
        <div class="profile-img">
            <img src="${usuario.foto}" alt="Imagem de Perfil" class="img-thumbnail" id="profileImage" style="width: 200px; height: 200px;">
        </div>
        <div class="Seu-Perfil">
            <div class="form-container">
            <form method="POST" action='/conta/upload' enctype="multipart/form-data">
                <div class="mb-3">
                    <label for="formFile" class="form-label">Vamos lá, mostre sua foto! (Aceitamos: PNG e JPG)</label>
                    <input class="form-control input-sm" type="file" id="formFile">
                    <button type="submit" class="btn btn-primary">Upload</button>
                </div>
            </form>
            <form method="POST" action='/conta/change'> 
                <div class="mb-3">
                    <label for="nomeUsuario" class="form-label">Nome de Usuário:</label>
                    <div class="nome-container">
                        <span id="nomeDisplay">${usuario.nome}</span>
                        <img src="https://i.ibb.co/DkQS76X/edit.png" alt="editar" class="edit" id="editNome">
                    </div>
                    <input class="form-control input-sm" type="text" id="nomeInput" name="novoNome" placeholder="Seu nome de usuário" style="display: none;">
                    <button id="confirmButton" class="btn btn-primary" style="display: none;">Salvar</button>
                </div>
                <div class="mb-3 row align-items-center">
                    <label for="staticEmail" class="col-auto col-form-label">Endereço de E-mail:<br>
                        <span>${usuario.email}</span></label>
                </div>
            </div>
        </div>
        </form>
        <form method="POST" action='/conta/delete'>
            <button type="submit" class="btn btn-danger btn-apagar">
                <img src="https://i.ibb.co/Ss6dxLd/trashh.png" alt="Icone de apagar Conta" class="i-apagar">
                <span class="btn-apagar-text">Apagar Conta</span>
            </button>
        </form>
        <script>
        document.getElementById('editNome').addEventListener('click', function () {
    document.getElementById('nomeDisplay').style.display = 'none';
    document.getElementById('nomeInput').style.display = 'block';
    document.getElementById('nomeInput').value = document.getElementById('nomeDisplay').textContent;
    document.getElementById('editNome').style.display = 'none';
    document.getElementById('confirmButton').style.display = 'inline-block';
});

document.getElementById('confirmButton').addEventListener('click', function () {
    const novoNome = document.getElementById('nomeInput').value;
    document.getElementById('nomeDisplay').textContent = novoNome;
    document.getElementById('nomeDisplay').style.display = 'inline-block';
    document.getElementById('nomeInput').style.display = 'none';
    document.getElementById('confirmButton').style.display = 'none';
    document.getElementById('editNome').style.display = 'inline-block';
});


//Email
document.getElementById('editEmail').addEventListener('click', function () {
    document.getElementById('nomeDisplay1').style.display = 'none';
    document.getElementById('nomeInput1').style.display = 'block';
    document.getElementById('nomeInput1').value = document.getElementById('nomeDisplay').textContent;
    document.getElementById('editEmail').style.display = 'none';
    document.getElementById('confirmButton1').style.display = 'inline-block';
});

document.getElementById('confirmButton1').addEventListener('click', function () {
    const novoNome = document.getElementById('nomeInput1').value;
    document.getElementById('nomeDisplay1').textContent = novoNome;
    document.getElementById('nomeDisplay1').style.display = 'inline-block';
    document.getElementById('nomeInput1').style.display = 'none';
    document.getElementById('confirmButton1').style.display = 'none';
    document.getElementById('editEmail').style.display = 'inline-block';
});

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

    const novoNome = req.body.novoNome; // Obtém o novo nome do corpo da requisição
    const client = new MongoClient(url);

    try {
        await client.connect(); // Conecta ao MongoDB
        const db = client.db(dbName);
        const collection = db.collection(collectionUser);

        // Atualiza o nome do usuário no banco de dados
        const result = await collection.updateOne(
            { _id: new ObjectId(req.session.userId) },
            { $set: { nome: novoNome } }
        );

        if (result.modifiedCount === 0) {
            return res.status(404).send('Usuário não encontrado ou o nome não foi atualizado');
        }

        res.redirect('/conta'); // Redireciona de volta para a página da conta
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
        const result = await collection.deleteOne({  _id: new ObjectId(req.session.userId) });

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
    const { email, senha } = req.body;
    const client = new MongoClient(url);

    try {
        await client.connect();
        const db = client.db(dbName);
        const collection = db.collection(collectionUser);

        const user = await collection.findOne({ email });

        if (!user) {
            return res.send(`
                <h1>E-mail não encontrado.</h1>
                <a href="/login" style="padding: 10px; background-color: #007bff; color: white; text-decoration: none; border-radius: 5px;">Voltar para Login</a>
                <a href="/" style="padding: 10px; background-color: #007bff; color: white; text-decoration: none; border-radius: 5px;">Voltar para Início</a>
            `);
        }

        if (senha !== user.senha) {
            return res.send(`
                <h1>Senha incorreta.</h1>
                <a href="/login" style="padding: 10px; background-color: #007bff; color: white; text-decoration: none; border-radius: 5px;">Voltar para Login</a>
                <a href="/" style="padding: 10px; background-color: #007bff; color: white; text-decoration: none; border-radius: 5px;">Voltar para Início</a>
            `);
        }

        req.session.userId = user._id;
        res.redirect('/dashboard');
    } catch (err) {
        console.error('Erro ao fazer login', err);
        res.status(500).send('Erro ao fazer login, por favor, tente novamente mais tarde.');
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

        const result = await collection.insertOne(newUser);
        req.session.userId = result.insertedId;

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

// Inicia o servidor na porta especificada
app.listen(port, () => {
    console.log(`http://localhost:${port}`); // Log para indicar que o servidor está rodando
});
