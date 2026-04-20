const express = require('express');
const router = express.Router();

const controller = require('../controller/usuarioController');

router.post('/usuarios', controller.register);
router.post('/login', controller.login);
router.get('/usuarios', controller.findAll);

module.exports = router;
