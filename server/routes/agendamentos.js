router.post("/create", async (req, res) => {
  const dbConnect = dbo.getDb();

  try {
    const dados = req.body;

    if (!dados.tipo_servico || !dados.data_servico || !dados.hora) {
      return res.status(400).json({ error: "Campos obrigatórios faltando" });
    }

    const novoAgendamento = {
      usuario_id: new ObjectId(dados.usuario_id), // você passa do front ou pega do token
      tipo_servico: dados.tipo_servico,
      data_solicitacao: new Date(), // data do pedido automático
      data_servico: new Date(dados.data_servico),
      hora: dados.hora,
      tempo_estimado: dados.tempo_estimado || "",
      observacao: dados.observacao || "",
      maquina_id: null,
      implemento_id: null,
      status: "pendente",
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
