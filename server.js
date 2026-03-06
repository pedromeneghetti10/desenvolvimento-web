    const express = require('express');
    const cors = require('cors');

    const PORT = 3000;
    const app = express();
    app.use(express.json());
    app.use(cors());
    app.use(express.static('HTML'));


    let usuarios = [
        { id: 1, nome: "Ana",    idade: 20 },
        { id: 2, nome: "Carlos", idade: 25 },
        { id: 3, nome: "Maria",  idade: 30 },
    ];


    app.get('/usuarios/:id', (req, res) => {
        const id = Number(req.params.id);
        const usuario = usuarios.find(u => u.id === id);
        if (!usuario) {
            return res.status(404).json({
                erro: "Usuarios não encontrado"
            });
        }
        return res.json(usuario); 
    });


    app.post('/usuarios', (req, res) => {
        const { nome, email } = req.body || {};

        if (!nome || !email) {
            return res.status(400).json({
                erro: "Nome e email são obrigatórios"
            });
        }

        const novoId = usuarios.length > 0
            ? Math.max(...usuarios.map(u => u.id)) + 1
            : 1;

        const novoUsuario = {
            id: novoId,
            nome,
            email
        }

        usuarios.push(novoUsuario);

        return res.status(201).json(novoUsuario);
    });


    app.get('/usuarios', (req, res) => {
        res.json(usuarios);
    });


    app.put('/usuarios/:id', (req, res) => {
        const id = Number(req.params.id);
        const { nome, email, idade } = req.body;

        const usuario = usuarios.find(u => u.id === id);
        if (!usuario) {
            return res.status(404).json({ erro: "Usuário não encontrado" });
        }

        if (nome) usuario.nome = nome;
        if (email) usuario.email = email;
        if (idade !== undefined) usuario.idade = idade;

        return res.json(usuario);
    });


    app.delete('/usuarios/:id', (req, res) => {
        const id = Number(req.params.id);
        const index = usuarios.findIndex(u => u.id === id);

        if (index === -1) {
            return res.status(404).json({ erro: "Usuário não encontrado" });
        }

        usuarios.splice(index, 1); // remove do array
        return res.status(204).send(); // 204 No Content = deletado com sucesso
    });

    // daqui pra baixo é o código da atividade de comentários

    // serve os arquivos HTML
app.use(express.static('HTML'));

let comentarios = [
  { id: 1, nome: "João", mensagem: "Cara, você é craque mesmo!" },
  { id: 2, nome: "Maria", mensagem: "Vi você jogar no domingo, que golaço!" },
  { id: 3, nome: "Carlos", mensagem: "Orgulho do Planalto!" },
];

app.get('/comentarios', (req, res) => {
  res.json(comentarios);
});

app.post('/comentarios', (req, res) => {
  const { nome, mensagem } = req.body;

  if (!nome || !mensagem) {
    return res.status(400).json({ erro: "Nome e mensagem são obrigatórios" });
  }

  const novoComentario = {
    id: comentarios.length + 1,
    nome,
    mensagem
  };

  comentarios.push(novoComentario);
  return res.status(201).json(novoComentario);
});

    app.listen(PORT, () => {
        console.log(`Servidor rodando em http://localhost:${PORT}`);

    });