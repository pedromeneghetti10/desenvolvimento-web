const express = require('express');
const cors = require('cors');
const path = require('path');
const db = require('./database');

const PORT = 3000;
const app = express();

app.use(express.json());
app.use(cors());
app.use(express.static('HTML'));

// Funções de renderização
const MiniSocial = {
    getActiveNavClass(currentPage, linkHref) {
        if (linkHref === currentPage || (currentPage === '' && linkHref === 'home.html')) {
            return 'active';
        }
        return '';
    },

    getTheme(req) {
        return req.cookies?.theme || 'light';
    },

    renderAuthState(user) {
        return {
            isAuthenticated: !!user,
            userName: user?.nome || '',
            user: user
        };
    }
};

// Bootstrap: criar tabelas
db.run(`
    CREATE TABLE IF NOT EXISTS mensagem (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        texto TEXT NOT NULL
    )
`);

db.run(`
    CREATE TABLE IF NOT EXISTS usuario (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nome TEXT NOT NULL,
        email TEXT NOT NULL UNIQUE,
        senha TEXT NOT NULL
    )
`);

const mensagemRoutes = require('./routes/mensagemRoutes.js');
const usuarioRoutes = require('./routes/usuarioRoutes.js');
app.use(mensagemRoutes);
app.use(usuarioRoutes);

app.listen(PORT, () => {
    console.log(`✅ Servidor rodando em http://localhost:${PORT}`);
});