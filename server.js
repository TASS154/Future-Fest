const express = require('express');
const { MongoClient, ObjectId } = require('mongodb');
const app = express();
const path = require('path')
const bcrypt = require('bcrypt');
const port = 3001;
const methodOverride = require('method-override');
const fs = require('fs');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, '/HTML')));

const url = 'mongodb://127.0.0.1:27017/';
const dbName = 'academia';
const collectionUser = 'usuarios';
const collectionShop = 'loja';

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/HTML/home.html')
})

app.get('/sobrenos', (req, res) => {
    res.sendFile(__dirname + '/HTML/sobrenos.html')
})

app.get('/planos', (req, res) => {
    res.sendFile(__dirname + '/HTML/planos.html')
})

app.get('/loja', (req, res) => {
    res.sendFile(__dirname + '/HTML/dadossuplemento.html')
})

app.get('/B-corp', (req, res) => {
    res.sendFile(__dirname + '/HTML/B-corp.html')
})

app.get('/login', (req, res) => {
    res.sendFile(__dirname + '/HTML/login.html')
})

app.get('/cursos', (req, res) => {
    res.sendFile(__dirname + '/HTML/cursos.html')
})

app.get('/pp', (req, res) => {
    res.sendFile(__dirname + '/HTML/pp.html')
})

app.get('/termos', (req, res) => {
    res.sendFile(__dirname + '/HTML/termos.html')
})


app.get('/email', (req, res) => {
    res.sendFile(__dirname + '/HTML/email.html')
})

app.get('/registro', (req, res) => {
    res.sendFile(__dirname + '/HTML/registro.html')
})

app.get('/conta', (req, res) => {
    res.sendFile(__dirname + '/HTML/conta.html')
})

app.get('/planos', (req, res) => {
    res.sendFile(__dirname + '/HTML/planos.html')
})

app.get('/esqueceu', (req, res) => {
    res.sendFile(__dirname + '/HTML/esqueceu-a-senha.html')
})

app.get('/po', (req, res) => {
    res.sendFile(__dirname + '/HTML/po.html')
})

app.get('/dashboard', (req, res) => {
    res.sendFile(__dirname + '/HTML/dashboard.html')
})

app.post('/login', async (req, res) => {
    const { email, senha } = req.body;

    const client = new MongoClient(url);

    try {
        await client.connect();
        const db = client.db(dbName);
        const collection = db.collection(collectionUser);

        // Procura o usuário pelo e-mail
        const user = await collection.findOne({ email });

        // Verifica se o e-mail existe
        if (!user) {
            return res.status(401).send('E-mail não encontrado.'); // Email não registrado
        }

        console.log(user)

        if (senha !== user.senha) {
            return res.status(401).send('Senha incorreta.'); // Senha incorreta
        } else {
            res.redirect('/dashboard')
        };
    } catch (err) {
        console.error('Erro ao fazer login', err);
        res.status(500).send('Erro ao fazer login, por favor, tente novamente mais tarde.');
    } finally {
        client.close();
    }
});

app.post('/registro', async (req, res) => {
    const newUser = req.body
    const client = new MongoClient(url)

    try {
        await client.connect();

        const db = client.db(dbName);
        const collection = db.collection(collectionUser)

        const result = await collection.insertOne(newUser)
        console.log(`usuário ${result.insertedId} inserido com sucesso`)

        res.redirect('/')
    } catch (err) {
        console.error('Erro ao cadastrar usuario', err)
        res.status(500).send('Erro ao fazer o regristro da conta, por favor, tente novamente mais tarde')
    } finally {
        client.close();
    }

})

// saida do banco de dados para cards


function criarCard(suplemento) {
    let cards = '';
    suplemento.forEach(suplemento => {
        cards += `
        <div class="card mb-3">
            <img src="/images/${suplemento.img}" class="card-img-top w-100 h-auto" alt="${suplemento.nome}">
            <div class="card-body">
                <h5 class="card-title">${suplemento.nome}</h5>
                <p class="card-text">${suplemento.desc}</p>
                <p class="card-text"><strong>Preço:</strong> R$ ${suplemento.preco}</p>
                <a href="${suplemento.url_info}" class="btn btn-primary">Mais Informações</a>
            </div>
        </div>
        `;
    });
    return cards;
}
function criarCard(suplemento) {
    let cards = '';
    suplemento.forEach(suplemento => {
        cards += `
        <div class="card mb-3">
            <img src="/images/${suplemento.imagem}" class="card-img-top w-100 h-auto" alt="${suplemento.nome}">
            <div class="card-body">
                <h5 class="card-title">${suplemento.nome}</h5>
                <p class="card-text">${suplemento.desc}</p>
                <p class="card-text"><strong>Preço:</strong> R$ ${suplemento.preco}</p>
                <a href="${suplemento.url_info}" class="btn btn-primary">Mais Informações</a>
            </div>
        </div>
        `;
    });
    return cards;
}
function criarCard(suplemento) {
    let cards = '';
    suplemento.forEach(suplemento => {
        cards += `
        <div class="card mb-3">
            <img src="/images/${suplemento.imagem}" class="card-img-top w-100 h-auto" alt="${suplemento.nome}">
            <div class="card-body">
                <h5 class="card-title">${suplemento.nome}</h5>
                <p class="card-text">${suplemento.desc}</p>
                <p class="card-text"><strong>Preço:</strong> R$ ${suplemento.preco}</p>
                <a href="${suplemento.url_info}" class="btn btn-primary">Mais Informações</a>
            </div>
        </div>
        `;
    });
    return cards;
}


app.get('/', async (req, res) => {
    const cardsHtml = suplemento.map(suplemento => criarCard(suplemento)).join('');
    const pageHtmlPath = path.join(__dirname, 'dadossuplemento.html');
    let pageHtml = fs.readFileSync(pageHtmlPath, 'utf-8');
    pageHtml = pageHtml.replace('{{cardsHtml}}', cardsHtml);
    res.send(pageHtml);
});

app.listen(port, () => {
    console.log(`http://localhost:${port}`)
})