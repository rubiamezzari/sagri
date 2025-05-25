const express = require("express");
const { ObjectId } = require("mongodb");
const dbo = require("../db/conn");

const router = express.Router();

// Adicionar um associado
router.post("/associados/add", async (req, res) => {
  const dbConnect = dbo.getDb();

  const novoAssociado = {
    nome: req.body.nome,
    cpf: req.body.cpf,
    email: req.body.email,
    telefone: req.body.telefone,
    senha: req.body.senha,
    data_associacao: req.body.data_associacao,
    endereco: req.body.endereco,
    documentos: req.body.documentos,
  };

  try {
    const result = await dbConnect.collection("associados").insertOne(novoAssociado);
    res.status(201).send(result);
  } catch (err) {
    res.status(500).send({ error: "Erro ao adicionar associado" });
  }
});

// Listar todos os associados
router.get("/associados", async (req, res) => {
  const dbConnect = dbo.getDb();

  try {
    const result = await dbConnect.collection("associados").find({}).toArray();
    res.status(200).send(result);
  } catch (err) {
    res.status(500).send({ error: "Erro ao buscar associados" });
  }
});

// Buscar um associado pelo ID (Detalhes)
router.get("/associados/:id", async (req, res) => {
  const dbConnect = dbo.getDb();
  const query = { _id: new ObjectId(req.params.id) };

  try {
    const result = await dbConnect.collection("associados").findOne(query);
    if (!result) {
      res.status(404).send("Associado não encontrado");
    } else {
      res.status(200).send(result);
    }
  } catch (err) {
    res.status(500).send({ error: "Erro ao buscar associado" });
  }
});

// Deletar associado
router.delete("/associados/:id", async (req, res) => {
  const dbConnect = dbo.getDb();
  const query = { _id: new ObjectId(req.params.id) };

  try {
    const result = await dbConnect.collection("associados").deleteOne(query);
    res.status(200).send(result);
  } catch (err) {
    res.status(500).send({ error: "Erro ao deletar associado" });
  }
});

// Atualizar associado
router.patch("/associados/:id", async (req, res) => {
  const dbConnect = dbo.getDb();
  const query = { _id: new ObjectId(req.params.id) };

  const updates = {
    $set: req.body,
  };

  try {
    const result = await dbConnect.collection("associados").updateOne(query, updates);
    res.status(200).send(result);
  } catch (err) {
    res.status(500).send({ error: "Erro ao atualizar associado" });
  }
});

module.exports = router;
