const express = require("express");
const { ObjectId } = require("mongodb");
const dbo = require("../db/conn");

const router = express.Router();

// Criar agendamento
router.post("/create", async (req, res) => {
  const dbConnect = dbo.getDb();
  try {
    const dados = req.body;

    if (!dados.tipo_servico || !dados.data_servico || !dados.hora || !dados.usuario_id) {
      return res.status(400).json({ error: "Campos obrigatórios faltando" });
    }

    const novoAgendamento = {
      usuario_id: new ObjectId(dados.usuario_id),
      tipo_servico: dados.tipo_servico,
      data_solicitacao: new Date(),
      data_servico: new Date(dados.data_servico),
      hora: dados.hora,
      tempo_estimado: dados.tempo_estimado || "",
      observacao: dados.observacao || "",
      maquina_id: dados.maquina_id || "",
      implemento_id: dados.implemento_id || "",
      status: "pendente",
      horimetro_inicial: null,
      horimetro_final: null,
      criadoEm: new Date(),
    };

    const result = await dbConnect.collection("agendamentos").insertOne(novoAgendamento);

    res.status(201).json({
      message: "Agendamento criado com sucesso!",
      agendamentoId: result.insertedId,
    });
  } catch (err) {
    console.error("Erro ao criar agendamento:", err);
    res.status(500).json({ error: "Erro ao criar agendamento", details: err.message });
  }
});

// Listar todos os agendamentos
router.get("/", async (req, res) => {
  const dbConnect = dbo.getDb();
  try {
    const agendamentos = await dbConnect.collection("agendamentos").find().toArray();
    res.status(200).json(agendamentos);
  } catch (err) {
    res.status(500).json({ error: "Erro ao buscar agendamentos", details: err.message });
  }
});

// Listar apenas agendamentos aprovados
router.get("/approved", async (req, res) => {
  const dbConnect = dbo.getDb();
  try {
    const aprovados = await dbConnect.collection("agendamentos").find({ status: "aprovado" }).toArray();
    res.status(200).json(aprovados);
  } catch (err) {
    res.status(500).json({ error: "Erro ao buscar agendamentos aprovados", details: err.message });
  }
});

// Atualizar status do agendamento
router.put("/:id", async (req, res) => {
  const dbConnect = dbo.getDb();
  const { id } = req.params;
  const { status } = req.body;

  if (!status) return res.status(400).json({ error: "Status é obrigatório" });

  try {
    const result = await dbConnect.collection("agendamentos").updateOne(
      { _id: new ObjectId(id) },
      { $set: { status } }
    );

    if (result.matchedCount === 0) return res.status(404).json({ error: "Agendamento não encontrado" });

    res.status(200).json({ message: "Status atualizado com sucesso" });
  } catch (err) {
    res.status(500).json({ error: "Erro ao atualizar status", details: err.message });
  }
});

// Cadastrar horímetro (inicial e final)
router.post("/horimetro/:id", async (req, res) => {
  const dbConnect = dbo.getDb();
  const { id } = req.params;
  const { horimetro_inicial, horimetro_final } = req.body;

  if (horimetro_inicial == null || horimetro_final == null) {
    return res.status(400).json({ error: "Horímetro inicial e final são obrigatórios" });
  }

  try {
    const agendamento = await dbConnect.collection("agendamentos").findOne({ _id: new ObjectId(id) });
    if (!agendamento) return res.status(404).json({ error: "Agendamento não encontrado" });

    // Só cadastrar se ainda estiver null
    if (agendamento.horimetro_inicial !== null || agendamento.horimetro_final !== null) {
      return res.status(400).json({ error: "Horímetro já cadastrado" });
    }

    await dbConnect.collection("agendamentos").updateOne(
      { _id: new ObjectId(id) },
      { $set: { horimetro_inicial, horimetro_final } }
    );

    res.status(200).json({ message: "Horímetro cadastrado com sucesso" });
  } catch (err) {
    res.status(500).json({ error: "Erro ao cadastrar horímetro", details: err.message });
  }
});

// Deletar agendamento
router.delete("/:id", async (req, res) => {
  const dbConnect = dbo.getDb();
  try {
    const result = await dbConnect.collection("agendamentos").deleteOne({ _id: new ObjectId(req.params.id) });
    res.status(200).json({ message: "Agendamento deletado", result });
  } catch (err) {
    res.status(500).json({ error: "Erro ao deletar agendamento", details: err.message });
  }
});

module.exports = router;
