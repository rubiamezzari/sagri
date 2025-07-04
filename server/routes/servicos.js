const express = require("express");
const { ObjectId } = require("mongodb");
const dbo = require("../db/conn");

const router = express.Router();

// Criar novo serviço com validação simples
router.post("/servicos/create", async (req, res) => {
  const db = dbo.getDb();

  const { nome, maquina_tipo, implemento_tipo, observacao } = req.body;

  if (!nome || !maquina_tipo || !implemento_tipo) {
    return res.status(400).json({ error: "Campos 'nome', 'maquina_tipo' e 'implemento_tipo' são obrigatórios" });
  }

  try {
    const novoServico = {
      nome,
      maquina_tipo,
      implemento_tipo,
      observacao: observacao || "",
    };

    const result = await db.collection("servicos").insertOne(novoServico);
    res.status(201).json({ message: "Serviço criado com sucesso", id: result.insertedId });
  } catch (err) {
    res.status(500).json({ error: "Erro ao cadastrar serviço", details: err.message });
  }
});

// Listar todos os serviços
router.get("/servicos", async (req, res) => {
  const db = dbo.getDb();

  try {
    const servicos = await db.collection("servicos").find({}).toArray();
    res.status(200).json(servicos);
  } catch (err) {
    res.status(500).json({ error: "Erro ao buscar serviços" });
  }
});

// Buscar serviço por ID
router.get("/servicos/:id", async (req, res) => {
  const db = dbo.getDb();
  let query;

  try {
    query = { _id: new ObjectId(req.params.id) };
  } catch {
    return res.status(400).json({ error: "ID inválido" });
  }

  try {
    const servico = await db.collection("servicos").findOne(query);
    if (!servico) {
      return res.status(404).json({ error: "Serviço não encontrado" });
    }
    res.status(200).json(servico);
  } catch (err) {
    res.status(500).json({ error: "Erro ao buscar serviço" });
  }
});

// Atualizar serviço com validação mínima
router.patch("/servicos/update/:id", async (req, res) => {
  const db = dbo.getDb();
  let query;

  try {
    query = { _id: new ObjectId(req.params.id) };
  } catch {
    return res.status(400).json({ error: "ID inválido" });
  }

  const { nome, maquina_tipo, implemento_tipo, observacao } = req.body;

  if (!nome && !maquina_tipo && !implemento_tipo && !observacao) {
    return res.status(400).json({ error: "Nenhum campo para atualizar foi enviado" });
  }

  const updates = {
    $set: {},
  };

  if (nome) updates.$set.nome = nome;
  if (maquina_tipo) updates.$set.maquina_tipo = maquina_tipo;
  if (implemento_tipo) updates.$set.implemento_tipo = implemento_tipo;
  if (observacao !== undefined) updates.$set.observacao = observacao;

  try {
    const result = await db.collection("servicos").updateOne(query, updates);

    if (result.matchedCount === 0) {
      return res.status(404).json({ error: "Serviço não encontrado" });
    }

    const atualizado = await db.collection("servicos").findOne(query);
    res.status(200).json({ message: "Serviço atualizado com sucesso", servico: atualizado });
  } catch (err) {
    res.status(500).json({ error: "Erro ao atualizar serviço", details: err.message });
  }
});

// Deletar serviço
router.delete("/servicos/:id", async (req, res) => {
  const db = dbo.getDb();
  let query;

  try {
    query = { _id: new ObjectId(req.params.id) };
  } catch {
    return res.status(400).json({ error: "ID inválido" });
  }

  try {
    const result = await db.collection("servicos").deleteOne(query);
    if (result.deletedCount === 0) {
      return res.status(404).json({ error: "Serviço não encontrado" });
    }
    res.status(200).json({ message: "Serviço deletado com sucesso" });
  } catch (err) {
    res.status(500).json({ error: "Erro ao deletar serviço" });
  }
});

module.exports = router;
