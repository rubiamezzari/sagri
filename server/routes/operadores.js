const express = require('express');
const router = express.Router();

// Lista de operadores de exemplo
const operadores = [
  { _id: '1', nome: 'João da Silva', cpf: "121.1800.619."},
];

// GET todos os operadores
router.get('/operadores', (req, res) => {
  res.json(operadores);
});

module.exports = router;
