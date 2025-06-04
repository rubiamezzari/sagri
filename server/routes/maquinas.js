const express = require("express");
const { ObjectId } = require("mongodb");
const dbo = require("../db/conn");

const router = express.Router();

// GET todas as máquinas com status atualizado baseado em agendamento do dia
router.get("/maquinas", async (req, res) => {
  const dbConnect = dbo.getDb();

  try {
    const maquinas = await dbConnect.collection("maquinas").find({}).toArray();

    const hoje = new Date();
    const inicioDoDia = new Date(hoje.setHours(0, 0, 0, 0));
    const fimDoDia = new Date(hoje.setHours(23, 59, 59, 999));

    const agendamentosHoje = await dbConnect
      .collection("agendamentos")
      .find({
        dataInicio: { $lte: fimDoDia },
        dataFim: { $gte: inicioDoDia },
      })
      .toArray();

    const maquinasComStatusAtualizado = maquinas.map((maquina) => {
      const estaEmUso = agendamentosHoje.some(
        (ag) => ag.maquinaId.toString() === maquina._id.toString()
      );

      return {
        ...maquina,
        status: estaEmUso ? "em uso" : maquina.status,
      };
    });

    res.status(200).send(maquinasComStatusAtualizado);
  } catch (err) {
    console.error("Erro ao buscar máquinas:", err);
    res.status(500).send({ error: "Erro ao buscar máquinas", details: err.message });
  }
});

// GET máquina por id
router.get("/maquinas/:id", async (req, res) => {
  const dbConnect = dbo.getDb();
  const query = { _id: new ObjectId(req.params.id) };

  try {
    const result = await dbConnect.collection("maquinas").findOne(query);

    if (!result) {
      return res.status(404).send("Máquina não encontrada");
    }

    res.status(200).send(result);
  } catch (err) {
    console.error("Erro ao buscar máquina por ID:", err);
    res.status(500).send({ error: "Erro ao buscar máquina", details: err.message });
  }
});

// POST criar nova máquina
router.post("/maquinas/create", async (req, res) => {
  const dbConnect = dbo.getDb();

  try {
    const dados = JSON.parse(req.body.dados || "{}");

    const novaMaquina = {
      tipo: dados.tipo,
      marca: dados.marca,
      modelo: dados.modelo,
      potencia: dados.potencia,
      status: dados.status,
      n_serie: dados.n_serie,
      observacao: dados.observacao,
    };

    const result = await dbConnect.collection("maquinas").insertOne(novaMaquina);

    console.log("Máquina cadastrada:", result.insertedId);

    res.status(201).json({
      message: "Máquina cadastrada com sucesso!",
      maquinaId: result.insertedId,
    });
  } catch (err) {
    console.error("Erro ao cadastrar máquina:", err);
    res.status(500).json({
      error: "Erro ao adicionar máquina",
      details: err.message,
    });
  }
});

// PATCH atualizar máquina por id
router.patch("/maquinas/update/:id", async (req, res) => {
  const dbConnect = dbo.getDb();
  const query = { _id: new ObjectId(req.params.id) };

  try {
    const dados = req.body.dados ? JSON.parse(req.body.dados) : {};
    delete dados._id;

    const updates = { $set: { ...dados } };

    const result = await dbConnect.collection("maquinas").updateOne(query, updates);

    if (result.matchedCount === 0) {
      return res.status(404).json({ error: "Máquina não encontrada" });
    }

    const maquinaAtualizada = await dbConnect.collection("maquinas").findOne(query);

    res.status(200).json(maquinaAtualizada);
  } catch (err) {
    console.error("Erro ao atualizar máquina:", err);
    res.status(500).json({ error: "Erro ao atualizar máquina", details: err.message });
  }
});

// DELETE máquina
router.delete("/maquinas/:id", async (req, res) => {
  const dbConnect = dbo.getDb();

  try {
    const query = { _id: new ObjectId(req.params.id) };
    const result = await dbConnect.collection("maquinas").deleteOne(query);

    if (result.deletedCount === 0) {
      return res.status(404).json({ error: "Máquina não encontrada" });
    }

    res.status(200).json({ message: "Máquina excluída com sucesso" });
  } catch (err) {
    console.error("Erro ao excluir máquina:", err);
    res.status(500).json({ error: "Erro ao excluir máquina", details: err.message });
  }
});

module.exports = router;
