const express = require('express');
const router = express.Router();

// Defina as rotas do operador, por exemplo:
router.get('/', (req, res) => {
  res.send('Lista de operadores');
});

module.exports = router;
