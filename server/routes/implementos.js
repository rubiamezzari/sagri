const express = require("express");
const { ObjectId } = require("mongodb");
const dbo = require("../db/conn");

const router = express.Router();

// GET todos implementos com status atualizado conforme agendamento
router.get("/implementos", async (req, res) => {
  const dbConnect = dbo.getDb();

  try {
    const implementos = await dbConnect.collection("implementos").find({}).toArray();

    const agendamentosAtivos = await dbConnect
      .collection("agendamentos")
      .find({ status: "agendado" })
      .toArray();

    const implementosAgendadosIds = new Set(
      agendamentosAtivos.map((a) => a.implementoId.toString())
    );

    const implementosAtualizados = implementos.map((implemento) => {
      // Verifica se o implemento está agendado
      if (implementosAgendadosIds.has(implemento._id.toString())) {
        implemento.status = "indisponível";
      } else {
        // Define "disponível" se status estiver ausente
        implemento.status = implemento.status || "disponível";
      }

      return implemento;
    });

    res.status(200).send(implementosAtualizados);
  } catch (err) {
    console.error("Erro ao buscar implementos:", err);
    res.status(500).send({ error: "Erro ao buscar implementos", details: err.message });
  }
});

// GET implemento por id
router.get("/implementos/:id", async (req, res) => {
  const dbConnect = dbo.getDb();
  const query = { _id: new ObjectId(req.params.id) };

  try {
    const result = await dbConnect.collection("implementos").findOne(query);

    if (!result) {
      return res.status(404).send("Implemento não encontrado");
    }

    res.status(200).send(result);
  } catch (err) {
    console.error("Erro ao buscar implemento por ID:", err);
    res.status(500).send({ error: "Erro ao buscar implemento", details: err.message });
  }
});

// POST criar novo implemento
router.post("/implementos/create", async (req, res) => {
  const dbConnect = dbo.getDb();

  try {
    const dados = JSON.parse(req.body.dados || "{}");

    const novoImplemento = {
      ...dados,
    };

    const result = await dbConnect.collection("implementos").insertOne(novoImplemento);

    console.log("Implemento cadastrado:", result.insertedId);

    res.status(201).json({
      message: "Implemento cadastrado com sucesso!",
      implementoId: result.insertedId,
    });
  } catch (err) {
    console.error("Erro ao cadastrar implemento:", err);
    res.status(500).json({
      error: "Erro ao adicionar implemento",
      details: err.message,
    });
  }
});

// PATCH atualizar implemento por id
router.patch("/implementos/update/:id", async (req, res) => {
  const dbConnect = dbo.getDb();
  const query = { _id: new ObjectId(req.params.id) };

  try {
    const dados = req.body.dados ? JSON.parse(req.body.dados) : {};
    const updates = { $set: { ...dados } };

    const result = await dbConnect.collection("implementos").updateOne(query, updates);

    if (result.matchedCount === 0) {
      return res.status(404).json({ error: "Implemento não encontrado" });
    }

    const implementoAtualizado = await dbConnect.collection("implementos").findOne(query);

    res.status(200).json(implementoAtualizado);
  } catch (err) {
    console.error("Erro ao atualizar implemento:", err);
    res.status(500).json({ error: "Erro ao atualizar implemento", details: err.message });
  }
});

// DELETE implemento
router.delete("/implementos/:id", async (req, res) => {
  const dbConnect = dbo.getDb();

  try {
    const query = { _id: new ObjectId(req.params.id) };
    const result = await dbConnect.collection("implementos").deleteOne(query);

    if (result.deletedCount === 0) {
      return res.status(404).json({ error: "Implemento não encontrado" });
    }

    res.status(200).json({ message: "Implemento excluído com sucesso" });
  } catch (err) {
    console.error("Erro ao excluir implemento:", err);
    res.status(500).json({ error: "Erro ao excluir implemento", details: err.message });
  }
});

module.exports = router;
