const db = require('../database');

// Inserir novo usuário
function create(nome, email, senhaHash, callback) {
    db.run(
        'INSERT INTO usuario (nome, email, senha) VALUES (?, ?, ?)',
        [nome, email, senhaHash],
        callback
    );
}

// Procurar usuário por email
function findByEmail(email, callback) {
    db.get(
        'SELECT * FROM usuario WHERE email = ?',
        [email],
        callback
    );
}

// Listar todos os usuários
function findAll(callback) {
    db.all(
        'SELECT id, nome, email FROM usuario',
        [],
        callback
    );
}

module.exports = { create, findByEmail, findAll };
