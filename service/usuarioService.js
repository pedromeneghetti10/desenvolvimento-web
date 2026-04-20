const bcrypt = require('bcrypt');
const usuarioRepository = require('../repository/usuarioRepository');

// Registrar novo usuário
function register(nome, email, senha, callback) {
    // Validar dados
    if (!nome || !email || !senha) {
        return callback(new Error('nome, email e senha são obrigatórios'));
    }

    // Hash da senha
    bcrypt.hash(senha, 10, (err, senhaHash) => {
        if (err) return callback(err);

        // Criar usuário no banco
        usuarioRepository.create(nome, email, senhaHash, callback);
    });
}

// Fazer login
function login(email, senha, callback) {
    if (!email || !senha) {
        return callback(new Error('email e senha são obrigatórios'));
    }

    // Procurar usuário
    usuarioRepository.findByEmail(email, (err, usuario) => {
        if (err) return callback(err);
        if (!usuario) return callback(new Error('email ou senha inválidos'));

        // Comparar senha
        bcrypt.compare(senha, usuario.senha, (err, match) => {
            if (err) return callback(err);
            if (!match) return callback(new Error('email ou senha inválidos'));

            callback(null, usuario);
        });
    });
}

// Listar todos
function findAll(callback) {
    usuarioRepository.findAll(callback);
}

module.exports = { register, login, findAll };
