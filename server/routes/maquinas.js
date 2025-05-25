const express = require('express');
const router = express.Router();

const maquinas = [
  { _id: '1', nome: 'Trator X', modelo: 'TX-200' },
  { _id: '2', nome: 'Colheitadeira Y', modelo: 'CY-500' },
];

router.get('/', (req, res) => {
  res.json(maquinas);
});

router.get('/:id', (req, res) => {
  const maquina = maquinas.find(m => m._id === req.params.id);
  if (!maquina) return res.status(404).json({ message: 'Máquina não encontrada' });
  res.json(maquina);
});

module.exports = router;
