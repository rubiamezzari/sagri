const express = require("express");
const dbo = require("../db/conn");

const router = express.Router();

router.post("/login", async (req, res) => {
  let { cpf, senha } = req.body;

  if (!cpf || !senha) {
    return res.status(400).send({ mensagem: "CPF e senha são obrigatórios" });
  }

  const db = dbo.getDb();

  const cpfLimpo = cpf.replace(/[^\d]/g, "");

  const tipos = [
    { nome: "administradores", tipo: "administrador" },
    { nome: "operadores", tipo: "operador" },
    { nome: "associados", tipo: "associado" },
  ];

  try {
    for (const { nome, tipo } of tipos) {
      const user = await db.collection(nome).findOne({ cpf: cpfLimpo });

      if (user) {
        if (senha !== user.senha) {
          return res.status(401).send({ mensagem: "Senha incorreta" });
        }

        return res.status(200).send({ id: user._id, tipo });
      }
    }

    return res.status(404).send({ mensagem: "Usuário não encontrado" });
  } catch (err) {
    console.error("Erro no login:", err.message);
    res.status(500).send({ mensagem: "Erro interno no servidor" });
  }
});

module.exports = router;
