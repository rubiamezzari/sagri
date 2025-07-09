const express = require("express");
const { ObjectId } = require("mongodb");
const dbo = require("../db/conn");

const router = express.Router();

router.post("/create", async (req, res) => {
  const dbConnect = dbo.getDb();

  try {
    const dados = req.body;

    if (!dados.tipo_servico || !dados.data_servico || !dados.hora) {
      return res.status(400).json({ error: "Campos obrigatórios faltando" });
    }

    // Buscar o serviço para saber os tipos de máquina e implemento necessários
    const servico = await dbConnect.collection("servicos").findOne({ _id: new ObjectId(dados.tipo_servico) });
    if (!servico) {
      return res.status(404).json({ error: "Serviço não encontrado" });
    }

    // Buscar máquinas do tipo do serviço
    const maquinas = await dbConnect.collection("maquinas").find({ tipo: servico.maquina_tipo }).toArray();

    // Buscar implementos do tipo do serviço
    const implementos = await dbConnect.collection("implementos").find({ tipo: servico.implemento_tipo }).toArray();

    if (maquinas.length === 0 || implementos.length === 0) {
      return res.status(400).json({ error: "Equipamentos necessários para o serviço não cadastrados" });
    }

    // Buscar agendamentos ativos na mesma data e hora que ocupam esses equipamentos
    // Você pode ajustar para intervalo de tempo se quiser
    const agendamentosNoDia = await dbConnect.collection("agendamentos").find({
      data_servico: new Date(dados.data_servico),
      hora: dados.hora,
      status: { $in: ["pendente", "confirmado", "em andamento"] },
      $or: [
        { maquina_id: { $in: maquinas.map(m => m._id.toString()) } },
        { implemento_id: { $in: implementos.map(i => i._id.toString()) } }
      ]
    }).toArray();

    const maquinasOcupadasIds = agendamentosNoDia.map(a => a.maquina_id);
    const implementosOcupadosIds = agendamentosNoDia.map(a => a.implemento_id);

    const maquinasDisponiveis = maquinas.filter(m => !maquinasOcupadasIds.includes(m._id.toString()));
    const implementosDisponiveis = implementos.filter(i => !implementosOcupadosIds.includes(i._id.toString()));

    if (maquinasDisponiveis.length === 0 || implementosDisponiveis.length === 0) {
      return res.status(400).json({ error: "Não há equipamentos disponíveis para o serviço nessa data e hora" });
    }

    const maquinaEscolhida = maquinasDisponiveis[0];
    const implementoEscolhido = implementosDisponiveis[0];

    const novoAgendamento = {
      usuario_id: new ObjectId(dados.usuario_id),
      tipo_servico: dados.tipo_servico,
      data_solicitacao: new Date(),
      data_servico: new Date(dados.data_servico),
      hora: dados.hora,
      tempo_estimado: dados.tempo_estimado || "",
      observacao: dados.observacao || "",
      maquina_id: maquinaEscolhida._id.toString(),
      implemento_id: implementoEscolhido._id.toString(),
      status: "pendente",
      criadoEm: new Date(),
    };

    const result = await dbConnect.collection("agendamentos").insertOne(novoAgendamento);

    res.status(201).json({
      message: "Agendamento criado com sucesso!",
      agendamentoId: result.insertedId,
      maquina: maquinaEscolhida,
      implemento: implementoEscolhido,
    });
  } catch (err) {
    console.error("Erro ao criar agendamento:", err);
    res.status(500).json({ error: "Erro ao criar agendamento", details: err.message });
  }
});

module.exports = router;
