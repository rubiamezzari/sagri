// routes/maquinas.js
const express = require('express');
const router = express.Router();

const maquinas = [
  { _id: '1', nome: 'Trator X', modelo: 'TX-200' },
  { _id: '2', nome: 'Colheitadeira Y', modelo: 'CY-500' },
];

// Rota para listar todas
router.get('/maquinas', (req, res) => {
  res.json(maquinas);
});

// Rota para buscar uma máquina pelo ID
router.get('/maquinas/:id', (req, res) => {
  const maquina = maquinas.find(m => m._id === req.params.id);
  if (!maquina) return res.status(404).json({ message: 'Máquina não encontrada' });
  res.json(maquina);
});

module.exports = router;
