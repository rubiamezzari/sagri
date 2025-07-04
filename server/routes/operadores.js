const express = require("express");
const { ObjectId } = require("mongodb");
const dbo = require("../db/conn");

const router = express.Router();

// Criar operador (sem hash na senha)
router.post("/operadores/create", async (req, res) => {
  const dbConnect = dbo.getDb();

  try {
    const cpfLimpo = req.body.cpf.replace(/[^\d]/g, "");

    // 🔒 Verifica se já existe operador com esse CPF
    const existente = await dbConnect.collection("operadores").findOne({ cpf: cpfLimpo });
    if (existente) {
      return res.status(409).send({ mensagem: "CPF já cadastrado" });
    }

    const novoOperador = {
      nome: req.body.nome,
      senha: req.body.senha, // senha salva em texto simples
      email: req.body.email,
      telefone: req.body.telefone,
      cpf: cpfLimpo,
    };

    const result = await dbConnect.collection("operadores").insertOne(novoOperador);
    res.status(201).send(result);
  } catch (err) {
    res.status(500).send({ error: "Erro ao adicionar operador", details: err.message });
  }
});

// Listar todos os operadores
router.get("/operadores", async (req, res) => {
  const dbConnect = dbo.getDb();

  try {
    const operadores = await dbConnect.collection("operadores").find({}, {
      projection: { nome: 1, email: 1, telefone: 1, cpf: 1 }
    }).toArray();

    res.status(200).send(operadores);
  } catch (err) {
    res.status(500).send({ error: "Erro ao buscar operadores" });
  }
});

// Buscar operador por ID
router.get("/operadores/:id", async (req, res) => {
  const dbConnect = dbo.getDb();
  const query = { _id: new ObjectId(req.params.id) };

  try {
    const operador = await dbConnect.collection("operadores").findOne(query, {
      projection: { nome: 1, email: 1, telefone: 1, cpf: 1 }
    });

    if (!operador) {
      return res.status(404).send("Operador não encontrado");
    }

    res.status(200).send(operador);
  } catch (err) {
    res.status(500).send({ error: "Erro ao buscar operador" });
  }
});

// Atualizar operador (sem hash)
router.patch("/operadores/update/:id", async (req, res) => {
  const dbConnect = dbo.getDb();
  const query = { _id: new ObjectId(req.params.id) };

  delete req.body._id;

  const updates = {
    $set: req.body,
  };

  try {
    const result = await dbConnect.collection("operadores").updateOne(query, updates);

    if (result.matchedCount === 0) {
      return res.status(404).send({ error: "Operador não encontrado" });
    }

    const operadorAtualizado = await dbConnect.collection("operadores").findOne(query, {
      projection: { nome: 1, email: 1, telefone: 1, cpf: 1 }
    });

    res.status(200).send(operadorAtualizado);
  } catch (err) {
    res.status(500).send({ error: "Erro ao atualizar operador", details: err.message });
  }
});

// Deletar operador
router.delete("/operadores/:id", async (req, res) => {
  const dbConnect = dbo.getDb();
  const query = { _id: new ObjectId(req.params.id) };

  try {
    const result = await dbConnect.collection("operadores").deleteOne(query);
    res.status(200).send(result);
  } catch (err) {
    res.status(500).send({ error: "Erro ao deletar operador" });
  }
});

module.exports = router;
