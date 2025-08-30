const express = require("express");
const bcrypt = require("bcryptjs");
const dbo = require("../db/conn");

const router = express.Router();

router.post("/login", async (req, res) => {
  const { cpf, senha } = req.body;

  if (!cpf || !senha) {
    return res.status(400).json({ mensagem: "CPF e senha são obrigatórios" });
  }

  try {
    const db = dbo.getDb();

    // Função para buscar usuário em uma coleção
    const buscarUsuario = async (colecao, tipo) => {
      const usuario = await db.collection(colecao).findOne({ cpf });
      if (!usuario) return null;

      const senhaValida = await bcrypt.compare(senha, usuario.senha);
      if (!senhaValida) return null;

      // Retorna o objeto do usuário já com _id como string
      return {
        _id: usuario._id.toString(),
        nome: usuario.nome,
        cpf: usuario.cpf,
        tipo,
      };
    };

    // Testa nas 3 coleções
    const colecoes = [
      { nome: "administradores", tipo: "admin" },
      { nome: "operadores", tipo: "operador" },
      { nome: "associados", tipo: "associado" },
    ];

    let usuarioEncontrado = null;
    for (let c of colecoes) {
      const u = await buscarUsuario(c.nome, c.tipo);
      if (u) {
        usuarioEncontrado = u;
        break;
      }
    }

    if (!usuarioEncontrado) {
      return res.status(401).json({ mensagem: "CPF ou senha inválidos" });
    }

    // Retorna usuário diretamente, pronto para salvar no localStorage
    return res.json(usuarioEncontrado);

  } catch (err) {
    console.error("Erro no login:", err);
    return res.status(500).json({ mensagem: "Erro interno do servidor" });
  }
});

module.exports = router;
