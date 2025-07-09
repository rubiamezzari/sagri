const express = require("express");
const dbo = require("../db/conn");

const router = express.Router();

// Retorna o administrador único (supondo que exista apenas um)
router.get("/administradores", async (req, res) => {
  const dbConnect = dbo.getDb();

  try {
    const administrador = await dbConnect.collection("administradores").findOne({}, {
      projection: { nome: 1, cpf: 1, email: 1 }
    });

    if (!administrador) {
      return res.status(404).send({ error: "Administrador não encontrado" });
    }

    res.status(200).send(administrador);
  } catch (err) {
    res.status(500).send({ error: "Erro ao buscar administrador" });
  }
});

// Buscar administrador por CPF (sem senha no retorno)
router.get("/administradores/find", async (req, res) => {
  const dbConnect = dbo.getDb();
  const { cpf } = req.query;

  if (!cpf) {
    return res.status(400).send({ error: "CPF é obrigatório" });
  }

  try {
    const administrador = await dbConnect.collection("administradores").findOne(
      { cpf },
      { projection: { senha: 0 } } // oculta a senha
    );

    if (!administrador) {
      return res.status(404).send({ error: "Administrador não encontrado" });
    }

    res.status(200).send(administrador);
  } catch (err) {
    res.status(500).send({ error: "Erro ao buscar administrador" });
  }
});

module.exports = router;
