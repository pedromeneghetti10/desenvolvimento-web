const mensagemRepository = require('../repository/mensagemRepository');

function listAll(callback) {
    mensagemRepository.listAll(callback);
}

function create(texto, callback) {
    if (!texto) {
        return callback(new Error("Texto é obrigatório"));
    }

    mensagemRepository.insert(texto, callback);
}

module.exports = { listAll, create };