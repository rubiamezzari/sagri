// routes/implementos.js
const express = require("express");
const { ObjectId } = require("mongodb");
const dbo = require("../db/conn");

const router = express.Router();

// --- GET todos os implementos ---
router.get("/implementos", async (req, res) => {
  const dbConnect = dbo.getDb();

  try {
    const implementos = await dbConnect.collection("implementos").find({}).toArray();

    res.status(200).json(implementos);
  } catch (err) {
    console.error("Erro ao buscar implementos:", err);
    res.status(500).json({ error: "Erro ao buscar implementos", details: err.message });
  }
});

// --- GET implemento por ID ---
router.get("/implementos/:id", async (req, res) => {
  const dbConnect = dbo.getDb();
  const query = { _id: new ObjectId(req.params.id) };

  try {
    const implemento = await dbConnect.collection("implementos").findOne(query);

    if (!implemento) return res.status(404).json({ error: "Implemento não encontrado" });

    res.status(200).json(implemento);
  } catch (err) {
    console.error("Erro ao buscar implemento por ID:", err);
    res.status(500).json({ error: "Erro ao buscar implemento", details: err.message });
  }
});

// --- POST criar implemento ---
router.post("/implementos/create", async (req, res) => {
  const dbConnect = dbo.getDb();

  try {
    const dados = req.body; // JSON direto do frontend

    // Validar campos obrigatórios
    if (!dados.tipo || !dados.marca) {
      return res.status(400).json({ error: "Os campos 'tipo' e 'marca' são obrigatórios" });
    }

    const novoImplemento = {
      ...dados,
      status: "disponível", // status padrão
    };

    const result = await dbConnect.collection("implementos").insertOne(novoImplemento);

    res.status(201).json({
      message: "Implemento cadastrado com sucesso!",
      implementoId: result.insertedId,
    });
  } catch (err) {
    console.error("Erro ao cadastrar implemento:", err);
    res.status(500).json({ error: "Erro ao adicionar implemento", details: err.message });
  }
});

// --- PATCH atualizar implemento ---
router.patch("/implementos/update/:id", async (req, res) => {
  const dbConnect = dbo.getDb();
  const query = { _id: new ObjectId(req.params.id) };

  try {
    const dados = req.body;

    if (dados._id) delete dados._id;

    const result = await dbConnect.collection("implementos").updateOne(query, { $set: dados });

    if (result.matchedCount === 0)
      return res.status(404).json({ error: "Implemento não encontrado" });

    const implementoAtualizado = await dbConnect.collection("implementos").findOne(query);
    res.status(200).json(implementoAtualizado);
  } catch (err) {
    console.error("Erro ao atualizar implemento:", err);
    res.status(500).json({ error: "Erro ao atualizar implemento", details: err.message });
  }
});

// --- DELETE implemento ---
router.delete("/implementos/:id", async (req, res) => {
  const dbConnect = dbo.getDb();
  const query = { _id: new ObjectId(req.params.id) };

  try {
    const result = await dbConnect.collection("implementos").deleteOne(query);

    if (result.deletedCount === 0)
      return res.status(404).json({ error: "Implemento não encontrado" });

    res.status(200).json({ message: "Implemento excluído com sucesso" });
  } catch (err) {
    console.error("Erro ao excluir implemento:", err);
    res.status(500).json({ error: "Erro ao excluir implemento", details: err.message });
  }
});

module.exports = router;
