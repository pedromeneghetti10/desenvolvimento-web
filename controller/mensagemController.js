const mensagemService = require('../service/mensagemService');

// GET
function listAll(req, res) {
    mensagemService.listAll((err, dados) => {
        if (err) return res.status(500).json(err);

        res.json(dados);
    });
}

function create(req, res) {
    const { texto } = req.body;

    mensagemService.create(texto, (err) => {
        if (err) return res.status(400).json({ erro: err.message });

        res.status(201).json({ mensagem: "Mensagem criada!" });
    });
}

module.exports = { listAll, create };