const express = require("express");
const { ObjectId } = require("mongodb");
const dbo = require("../db/conn");

const router = express.Router();

function flattenObject(ob) {
  const toReturn = {};

  for (const i in ob) {
    if (!Object.prototype.hasOwnProperty.call(ob, i)) continue;

    if (typeof ob[i] === "object" && ob[i] !== null && !Array.isArray(ob[i])) {
      const flatObject = flattenObject(ob[i]);
      for (const x in flatObject) {
        if (!Object.prototype.hasOwnProperty.call(flatObject, x)) continue;

        toReturn[i + "." + x] = flatObject[x];
      }
    } else {
      toReturn[i] = ob[i];
    }
  }
  return toReturn;
}

// Criar operador
router.post("/operadores/create", async (req, res) => {
  const dbConnect = dbo.getDb();

  const novoOperador = {
    nome: req.body.nome,
    cpf: req.body.cpf,
    telefone: req.body.telefone,
    categoria_cnh: req.body.categoria_cnh,
    status: req.body.status,
    observacao: req.body.observacao,
  };

  try {
    const result = await dbConnect.collection("operadores").insertOne(novoOperador);
    res.status(201).send(result);
  } catch (err) {
    res.status(500).send({ error: "Erro ao adicionar operador", details: err.message });
  }
});

// Listar todos operadores
router.get("/operadores", async (req, res) => {
  const dbConnect = dbo.getDb();

  try {
    const operadores = await dbConnect.collection("operadores").find({}).toArray();
    res.status(200).send(operadores);
  } catch (err) {
    res.status(500).send({ error: "Erro ao buscar operadores" });
  }
});

// Buscar operador por id
router.get("/operadores/:id", async (req, res) => {
  const dbConnect = dbo.getDb();
  const query = { _id: new ObjectId(req.params.id) };

  try {
    const operador = await dbConnect.collection("operadores").findOne(query);
    if (!operador) {
      return res.status(404).send("Operador não encontrado");
    }
    res.status(200).send(operador);
  } catch (err) {
    res.status(500).send({ error: "Erro ao buscar operador" });
  }
});

// Atualizar operador (PATCH)
router.patch("/operadores/update/:id", async (req, res) => {
  const dbConnect = dbo.getDb();
  const query = { _id: new ObjectId(req.params.id) };

  // Remove _id caso venha no body
  delete req.body._id;

  const updates = {
    $set: flattenObject(req.body),
  };

  try {
    const result = await dbConnect.collection("operadores").updateOne(query, updates);

    if (result.matchedCount === 0) {
      return res.status(404).send({ error: "Operador não encontrado" });
    }

    const operadorAtualizado = await dbConnect.collection("operadores").findOne(query);
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
