// routes/login.js
const express = require("express");
const bcrypt = require("bcryptjs");
const dbo = require("../db/conn");

const router = express.Router();

router.post("/login", async (req, res) => {
  const { cpf, senha } = req.body;

  if (!cpf || !senha) {
    return res.status(400).json({ mensagem: "CPF e senha são obrigatórios" });
  }

  const db = dbo.getDb();

  // Função para verificar usuário em uma coleção
  const buscarUsuario = async (colecao, tipo) => {
    const usuario = await db.collection(colecao).findOne({ cpf });
    if (usuario) {
      const senhaValida = await bcrypt.compare(senha, usuario.senha);
      if (senhaValida) {
        return {
          sucesso: true,
          usuario: {
            _id: usuario._id,
            nome: usuario.nome,
            cpf: usuario.cpf,
            tipo,
          },
        };
      }
    }
    return { sucesso: false };
  };

  const tentativas = [
    await buscarUsuario("administradores", "administrador"),
    await buscarUsuario("operadores", "operador"),
    await buscarUsuario("associados", "associado"),
  ];

  const usuarioLogado = tentativas.find((t) => t.sucesso);

  if (usuarioLogado) {
    console.log(usuarioLogado)
    return res.json(usuarioLogado.usuario);
  } else {
    return res.status(401).json({ mensagem: "CPF ou senha inválidos" });
  }
});

module.exports = router;
