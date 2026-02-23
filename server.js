    const express = require('express');

    const PORT = 3000;
    const app = express();
    app.use(express.json());


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


    app.listen(PORT, () => {
        console.log(`Servidor rodando em http://localhost:${PORT}`);

    });