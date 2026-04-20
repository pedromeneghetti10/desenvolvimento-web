const usuarioService = require('../service/usuarioService');

// Registrar novo usuário
function register(req, res) {
    const { nome, email, senha } = req.body;

    usuarioService.register(nome, email, senha, (err) => {
        if (err) return res.status(400).json({ erro: err.message });
        res.status(201).json({ mensagem: 'Usuário criado com sucesso!' });
    });
}

// Fazer login
function login(req, res) {
    const { email, senha } = req.body;

    usuarioService.login(email, senha, (err, usuario) => {
        if (err) return res.status(401).json({ erro: err.message });
        res.json({ mensagem: 'Login bem-sucedido!', usuario });
    });
}

// Listar todos
function findAll(req, res) {
    usuarioService.findAll((err, usuarios) => {
        if (err) return res.status(500).json({ erro: err.message });
        res.json(usuarios);
    });
}

module.exports = { register, login, findAll };
