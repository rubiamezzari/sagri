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
      maquina_id: dados.maquina_id || null,
      implemento_id: dados.implemento_id || null,
      status: "pendente",
      horimetro_inicial: null,
      horimetro_final: null,
      motivo_recusa: null,
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
    const agendamentos = await dbConnect
      .collection("agendamentos")
      .find()
      .sort({ criadoEm: -1 })
      .toArray();
    res.status(200).json(agendamentos);
  } catch (err) {
    res.status(500).json({ error: "Erro ao buscar agendamentos", details: err.message });
  }
});

// Listar apenas agendamentos aprovados
router.get("/approved", async (req, res) => {
  const dbConnect = dbo.getDb();
  try {
    const aprovados = await dbConnect
      .collection("agendamentos")
      .find({ status: "aprovado" })
      .sort({ criadoEm: -1 })
      .toArray();
    res.status(200).json(aprovados);
  } catch (err) {
    res.status(500).json({ error: "Erro ao buscar agendamentos aprovados", details: err.message });
  }
});

// Atualizar agendamento (status, horímetro, motivo_recusa, etc)
router.put("/:id", async (req, res) => {
  const dbConnect = dbo.getDb();
  const { id } = req.params;
  const { 
    status, 
    motivo_recusa, 
    horimetro_inicial, 
    horimetro_final 
  } = req.body;

  try {
    // Verificar se o agendamento existe
    const agendamentoExistente = await dbConnect
      .collection("agendamentos")
      .findOne({ _id: new ObjectId(id) });

    if (!agendamentoExistente) {
      return res.status(404).json({ error: "Agendamento não encontrado" });
    }

    const updateFields = {};

    // Atualizar status se fornecido
    if (status) {
      updateFields.status = status.toLowerCase();
    }

    // Atualizar motivo de recusa se fornecido
    if (status && status.toLowerCase() === "recusado" && motivo_recusa) {
      updateFields.motivo_recusa = motivo_recusa;
    }

    // Atualizar horímetro se fornecido
    if (horimetro_inicial !== undefined) {
      updateFields.horimetro_inicial = horimetro_inicial;
    }

    if (horimetro_final !== undefined) {
      updateFields.horimetro_final = horimetro_final;
    }

    // Se está marcando como concluído e tem horímetro, garantir que status é concluido
    if (horimetro_inicial !== undefined && horimetro_final !== undefined) {
      updateFields.status = "concluido";
    }

    const result = await dbConnect
      .collection("agendamentos")
      .updateOne(
        { _id: new ObjectId(id) },
        { $set: updateFields }
      );

    if (result.matchedCount === 0) {
      return res.status(404).json({ error: "Agendamento não encontrado" });
    }

    // Buscar e retornar o agendamento atualizado
    const updatedAgendamento = await dbConnect
      .collection("agendamentos")
      .findOne({ _id: new ObjectId(id) });

    res.status(200).json({
      message: "Agendamento atualizado com sucesso",
      agendamento: updatedAgendamento,
    });
  } catch (err) {
    console.error("Erro ao atualizar agendamento:", err);
    res.status(500).json({ error: "Erro ao atualizar agendamento", details: err.message });
  }
});

// Cadastrar horímetro (endpoint específico - mantido por compatibilidade)
router.post("/horimetro/:id", async (req, res) => {
  const dbConnect = dbo.getDb();
  const { id } = req.params;
  const { horimetro_inicial, horimetro_final } = req.body;

  if (horimetro_inicial == null || horimetro_final == null) {
    return res.status(400).json({ error: "Horímetro inicial e final são obrigatórios" });
  }

  try {
    const agendamento = await dbConnect
      .collection("agendamentos")
      .findOne({ _id: new ObjectId(id) });

    if (!agendamento) {
      return res.status(404).json({ error: "Agendamento não encontrado" });
    }

    // Atualizar horímetro e marcar como concluído
    await dbConnect.collection("agendamentos").updateOne(
      { _id: new ObjectId(id) },
      { 
        $set: { 
          horimetro_inicial, 
          horimetro_final,
          status: "concluido"
        } 
      }
    );

    res.status(200).json({ message: "Horímetro cadastrado com sucesso" });
  } catch (err) {
    console.error("Erro ao cadastrar horímetro:", err);
    res.status(500).json({ error: "Erro ao cadastrar horímetro", details: err.message });
  }
});

// Deletar agendamento
router.delete("/:id", async (req, res) => {
  const dbConnect = dbo.getDb();
  try {
    const result = await dbConnect
      .collection("agendamentos")
      .deleteOne({ _id: new ObjectId(req.params.id) });

    if (result.deletedCount === 0) {
      return res.status(404).json({ error: "Agendamento não encontrado" });
    }

    res.status(200).json({ message: "Agendamento deletado com sucesso" });
  } catch (err) {
    console.error("Erro ao deletar agendamento:", err);
    res.status(500).json({ error: "Erro ao deletar agendamento", details: err.message });
  }
});

module.exports = router;
