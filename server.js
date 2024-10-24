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
<img src="${suplemento.img}" class="card-img-top" style="width: 100px; height: 100px;" alt="${suplemento.Nome}">
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

app.get('/calculadora', (req, res) => {
    res.sendFile(__dirname + '/HTML/calculadora.html'); // Página calculadora
});

app.get('/voltar-home', (req, res) => {
    res.sendFile(__dirname + '/HTML/home.html'); // Página calculadora
});
app.get('/sobrenos', (req, res) => {
    res.sendFile(__dirname + '/HTML/sobrenos.html'); // Página "Sobre Nós"
});

app.get('/loja', (req, res) => {
    res.sendFile(__dirname + '/HTML/loja.html'); // Página de Planos
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
                    <h1>Progresso 1</h1>
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
                    <h1>Progresso 2</h1>
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
                    <h1>Progresso 3</h1>
                </div>
            </div>
        </div>
        <hr>
        <h1>Sua Assinatura</h1>
        <hr>
        <p> ${usuario.Plano} </p>
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

<div class="Seu-Perfil">
    <div class="form-container">
        <form method="POST" action='/conta/upload' enctype="multipart/form-data" class="mb-4">
            <div class="mb-3">
                <label for="formFile" class="form-label">Vamos lá, mostre sua foto! (Aceitamos: PNG e JPG)</label>
                <input class="form-control" type="file" id="formFile" name="foto" aria-describedby="fileHelp">
                <small id="fileHelp" class="form-text text-muted">Escolha uma imagem de perfil.</small>
                <button type="submit" class="btn btn-primary mt-3">Upload</button> <!-- Aumentar margem superior -->
            </div>
        </form>

        <form method="POST" action='/conta/change'>
            <div class="mb-3">
                <label for="nomeUsuario" class="form-label">Nome de Usuário:</label>
                <div class="nome-container d-flex align-items-center">
                    <span id="nomeDisplay" class="me-2">${usuario.nome}</span>
                    <img src="https://i.ibb.co/DkQS76X/edit.png" alt="Editar Nome" class="edit" id="editNome" style="cursor: pointer;" aria-label="Editar Nome">
                </div>
                <input class="form-control" type="text" id="nomeInput" name="novoNome" placeholder="Seu nome de usuário" style="display: none;" aria-label="Novo Nome">
                <button id="confirmButton" class="btn btn-primary mt-3" style="display: none;" aria-label="Salvar Nome">Salvar</button> <!-- Aumentar margem superior -->
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
        event.preventDefault(); // Impede o envio do formulário
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

// Rota para login
app.post('/login', async (req, res) => {
    const email = req.body.email;
    const senha = req.body.senha
    const client = new MongoClient(url);

    try {
        await client.connect();
        const db = client.db(dbName);
        const collection = db.collection(collectionUser);

        const user = await collection.findOne({ email });

        const mathc = await bcrypt.compare(senha, user.senha)

        if (!user) {
            return res.send(`
                <h1>E-mail não encontrado.</h1>
                <a href="/login" style="padding: 10px; background-color: #007bff; color: white; text-decoration: none; border-radius: 5px;">Voltar para Login</a>
                <a href="/" style="padding: 10px; background-color: #007bff; color: white; text-decoration: none; border-radius: 5px;">Voltar para Início</a>
            `);
        }

        if (mathc) {
            req.session.userId = user._id;
            res.redirect('/dashboard');
        } else {
            return res.send(`
                <h1>Senha incorreta.</h1>
                <a href="/login" style="padding: 10px; background-color: #007bff; color: white; text-decoration: none; border-radius: 5px;">Voltar para Login</a>
                <a href="/" style="padding: 10px; background-color: #007bff; color: white; text-decoration: none; border-radius: 5px;">Voltar para Início</a>
            `);
        }


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
