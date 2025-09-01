const express = require("express");
const router = express.Router();
const dbo = require("../db/conn");
const { ObjectId } = require("mongodb"); // IMPORT ESSENCIAL

const COLLECTION = "tipos";

// ===== GET todos os tipos ou filtrar por categoria =====
router.get("/", async (req, res) => {
  try {
    const db = dbo.getDb();
    const { categoria } = req.query; // "maquina" ou "implemento"
    const query = categoria ? { categoria } : {};
    const tipos = await db.collection(COLLECTION).find(query).toArray();
    res.json(tipos);
  } catch (err) {
    console.error("Erro ao buscar tipos:", err);
    res.status(500).json({ error: err.message });
  }
});

// ===== POST criar novo tipo =====
router.post("/", async (req, res) => {
  try {
    const db = dbo.getDb();
    const { tipo, categoria } = req.body;

    if (!tipo || !categoria)
      return res.status(400).json({ error: "Tipo e categoria são obrigatórios" });

    const result = await db.collection(COLLECTION).insertOne({ tipo, categoria });

    res.status(201).json({ _id: result.insertedId, tipo, categoria });
  } catch (err) {
    console.error("Erro ao cadastrar tipo:", err);
    res.status(500).json({ error: err.message });
  }
});

// ===== DELETE tipo =====
router.delete("/:id", async (req, res) => {
  const db = dbo.getDb();
  const query = { _id: new ObjectId(req.params.id) };

  try {
    const result = await db.collection(COLLECTION).deleteOne(query);
    if (result.deletedCount === 0)
      return res.status(404).json({ error: "Tipo não encontrado" });
    res.json({ message: "Tipo excluído com sucesso" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
