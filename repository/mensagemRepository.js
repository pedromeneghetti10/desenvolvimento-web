const db = require('../database');

// listar mensagens
function listAll(callback) {
    db.all('SELECT * FROM mensagem', [], callback);
}

// inserir mensagem (EXERCÍCIO do slide)
function insert(texto, callback) {
    db.run(
        'INSERT INTO mensagem (texto) VALUES (?)',
        [texto],
        callback
    );
}

module.exports = { listAll, insert };