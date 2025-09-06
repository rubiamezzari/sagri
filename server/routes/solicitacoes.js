const express = require("express");
const { ObjectId } = require("mongodb");
const dbo = require("../db/conn");

const router = express.Router();

// POST - Criar nova solicitação
router.post("/", async (req, res) => {
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
      status: "pendente", // Status inicial sempre será 'pendente'
      criadoEm: new Date(),
    };

    const result = await dbConnect
      .collection("solicitacoes")
      .insertOne(novaSolicitacao);

    res.status(201).json({
      message: "Solicitação criada com sucesso!",
      solicitacaoId: result.insertedId,
    });
  } catch (err) {
    console.error("Erro ao criar solicitação:", err);
    res.status(500).json({ error: "Erro ao criar solicitação", details: err.message });
  }
});

// GET - Todas as solicitações com filtro opcional por status
router.get("/", async (req, res) => {
  try {
    const dbConnect = dbo.getDb();
    const { status } = req.query; // Pega o parâmetro 'status' da URL

    // Cria um objeto de filtro vazio.
    let query = {};

    // Se o parâmetro de status existir, adiciona ele ao objeto de filtro.
    if (status) {
      // Garante que a busca seja sempre com letras minúsculas
      query.status = status.toLowerCase();
    }

    const solicitacoes = await dbConnect
      .collection("solicitacoes")
      .find(query) // Usa o objeto de filtro na busca
      .sort({ criadoEm: -1 })
      .toArray();

    res.json(solicitacoes);
  } catch (err) {
    console.error("Erro ao buscar solicitações:", err);
    res.status(500).json({ error: "Erro ao buscar solicitações" });
  }
});

// GET - Solicitações de um usuário
router.get("/usuario/:usuarioId", async (req, res) => {
  const { usuarioId } = req.params;

  try {
    const dbConnect = dbo.getDb();
    const solicitacoes = await dbConnect
      .collection("solicitacoes")
      .find({ usuario_id: new ObjectId(usuarioId) })
      .sort({ criadoEm: -1 })
      .toArray();

    res.json(solicitacoes);
  } catch (err) {
    console.error("Erro ao buscar solicitações por usuário:", err);
    res.status(500).json({ error: "Erro ao buscar solicitações do usuário" });
  }
});

// PUT - Atualizar status da solicitação
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    const dbConnect = dbo.getDb();
    await dbConnect
      .collection("solicitacoes")
      .updateOne(
        { _id: new ObjectId(id) },
        // Garante que o status seja salvo sempre em minúsculas
        { $set: { status: status.toLowerCase() } }
      );

    res.json({ message: "Status atualizado com sucesso" });
  } catch (err) {
    console.error("Erro ao atualizar status:", err);
    res.status(500).json({ error: "Erro ao atualizar status" });
  }
});

module.exports = router;