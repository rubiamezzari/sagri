const express = require("express");
const router = express.Router();
const dbo = require("../db/conn");
const { ObjectId } = require("mongodb"); // IMPORT ESSENCIAL

const COLLECTION = "marcas";

// ===== GET todas as marcas =====
router.get("/", async (req, res) => {
  try {
    const db = dbo.getDb();
    const marcas = await db.collection(COLLECTION).find({}).toArray();
    res.json(marcas);
  } catch (err) {
    console.error("Erro ao buscar marcas:", err);
    res.status(500).json({ error: err.message });
  }
});

// ===== POST criar nova marca =====
router.post("/", async (req, res) => {
  try {
    const db = dbo.getDb();
    const { nome } = req.body;

    if (!nome) return res.status(400).json({ error: "Nome é obrigatório" });

    const result = await db.collection(COLLECTION).insertOne({ nome });

    res.status(201).json({ _id: result.insertedId, nome });
  } catch (err) {
    console.error("Erro ao cadastrar marca:", err);
    res.status(500).json({ error: err.message });
  }
});

// ===== DELETE marca =====
router.delete("/:id", async (req, res) => {
  const db = dbo.getDb();
  const query = { _id: new ObjectId(req.params.id) };

  try {
    const result = await db.collection(COLLECTION).deleteOne(query);
    if (result.deletedCount === 0)
      return res.status(404).json({ error: "Marca não encontrada" });
    res.json({ message: "Marca excluída com sucesso" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
