const express = require('express');
const router = express.Router();

// Dados simulados (substitua pelo banco depois)
const implementos = [
  { _id: '1', nome: 'Arado', descricao: 'Arado de disco', marca: 'Marca A' },
  { _id: '2', nome: 'Grade', descricao: 'Grade niveladora', marca: 'Marca B' },
];

// Rota para listar todos os implementos
router.get('/', (req, res) => {
  res.json(implementos);
});

// Rota para buscar implemento por ID
router.get('/:id', (req, res) => {
  const implemento = implementos.find(i => i._id === req.params.id);
  if (!implemento) return res.status(404).json({ message: 'Implemento não encontrado' });
  res.json(implemento);
});

module.exports = router;
