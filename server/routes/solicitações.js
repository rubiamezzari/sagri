// routes/solicitacoes.js
const express = require("express");
const { ObjectId } = require("mongodb");
const dbo = require("../db/conn");

const router = express.Router();

// POST - Criar nova solicitação
router.post("/solicitacoes", async (req, res) => {
  const dbConnect = dbo.getDb();
  try {
    const { data, tipoServico, hora, tempo, observacao, usuario_id } = req.body;

    if (!data || !tipoServico || !hora || !usuario_id) {
      return res.status(400).json({ error: "Campos obrigatórios faltando" });
    }

    const novaSolicitacao = {
      usuario_id: new ObjectId(usuario_id),
      tipoServico,
      data_solicitacao: new Date(),
      data_servico: new Date(data),
      hora,
      tempo_estimado: tempo || "",
      observacao: observacao || "",
      status: "pendente",
      criadoEm: new Date(),
    };

    const result = await dbConnect.collection("solicitacoes").insertOne(novaSolicitacao);

    res.status(201).json({
      message: "Solicitação criada com sucesso!",
      solicitacaoId: result.insertedId,
    });
  } catch (err) {
    console.error("Erro ao criar solicitação:", err);
    res.status(500).json({ error: "Erro ao criar solicitação", details: err.message });
  }
});

// GET - Buscar todas solicitações
router.get("/solicitacoes", async (req, res) => {
  try {
    const dbConnect = dbo.getDb();
    const solicitacoes = await dbConnect
      .collection("solicitacoes")
      .find({})
      .sort({ criadoEm: -1 })
      .toArray();

    res.json(solicitacoes);
  } catch (err) {
    console.error("Erro ao buscar solicitações:", err);
    res.status(500).json({ error: "Erro ao buscar solicitações" });
  }
});

// PUT - Atualizar status da solicitação
router.put("/solicitacoes/:id", async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    const dbConnect = dbo.getDb();
    await dbConnect
      .collection("solicitacoes")
      .updateOne({ _id: new ObjectId(id) }, { $set: { status } });

    res.json({ message: "Status atualizado com sucesso" });
  } catch (err) {
    console.error("Erro ao atualizar status:", err);
    res.status(500).json({ error: "Erro ao atualizar status" });
  }
});

module.exports = router;
