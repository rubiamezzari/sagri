const express = require("express")
const { ObjectId } = require("mongodb")
const dbo = require("../db/conn")

const router = express.Router()

// POST - Criar nova solicitação
router.post("/", async (req, res) => {
  const dbConnect = dbo.getDb()
  try {
    const { 
      data, 
      tipoServico, 
      hora, 
      tempo, 
      observacao, 
      usuario_id,
      maquina_id,
      implemento_id 
    } = req.body

    if (!data || !tipoServico || !hora || !usuario_id) {
      return res.status(400).json({ error: "Campos obrigatórios faltando" })
    }

    const novaSolicitacao = {
      usuario_id: new ObjectId(usuario_id),
      tipoServico,
      data_solicitacao: new Date(),
      data_servico: new Date(data),
      hora,
      tempo_estimado: tempo || "",
      observacao: observacao || "",
      maquina_id: maquina_id || null,
      implemento_id: implemento_id || null,
      status: "pendente",
      horimetro_inicial: null,
      horimetro_final: null,
      motivo_recusa: null,
      criadoEm: new Date(),
    }

    const result = await dbConnect.collection("solicitacoes").insertOne(novaSolicitacao)

    res.status(201).json({
      message: "Solicitação criada com sucesso!",
      solicitacaoId: result.insertedId,
    })
  } catch (err) {
    console.error("Erro ao criar solicitação:", err)
    res.status(500).json({ error: "Erro ao criar solicitação", details: err.message })
  }
})

// GET - Todas as solicitações com filtro opcional por status
router.get("/", async (req, res) => {
  try {
    const dbConnect = dbo.getDb()
    const { status } = req.query

    const query = {}

    if (status) {
      query.status = status.toLowerCase()
    }

    const solicitacoes = await dbConnect
      .collection("solicitacoes")
      .find(query)
      .sort({ criadoEm: -1 })
      .toArray()

    res.json(solicitacoes)
  } catch (err) {
    console.error("Erro ao buscar solicitações:", err)
    res.status(500).json({ error: "Erro ao buscar solicitações" })
  }
})

// GET - Solicitações de um usuário
router.get("/usuario/:usuarioId", async (req, res) => {
  const { usuarioId } = req.params

  try {
    const dbConnect = dbo.getDb()
    const solicitacoes = await dbConnect
      .collection("solicitacoes")
      .find({ usuario_id: new ObjectId(usuarioId) })
      .sort({ criadoEm: -1 })
      .toArray()

    res.json(solicitacoes)
  } catch (err) {
    console.error("Erro ao buscar solicitações por usuário:", err)
    res.status(500).json({ error: "Erro ao buscar solicitações do usuário" })
  }
})

// PUT - Atualizar solicitação (status, horímetro, motivo_recusa, etc)
router.put("/:id", async (req, res) => {
  const { id } = req.params
  const { 
    status, 
    motivo_recusa, 
    horimetro_inicial, 
    horimetro_final 
  } = req.body

  try {
    const dbConnect = dbo.getDb()

    // Verificar se a solicitação existe
    const solicitacaoExistente = await dbConnect
      .collection("solicitacoes")
      .findOne({ _id: new ObjectId(id) })

    if (!solicitacaoExistente) {
      return res.status(404).json({ error: "Solicitação não encontrada" })
    }

    const updateFields = {}

    // Atualizar status se fornecido
    if (status) {
      updateFields.status = status.toLowerCase()
    }

    // Atualizar motivo de recusa se fornecido
    if (status && status.toLowerCase() === "recusado" && motivo_recusa) {
      updateFields.motivo_recusa = motivo_recusa
    }

    // Atualizar horímetro se fornecido
    if (horimetro_inicial !== undefined) {
      updateFields.horimetro_inicial = horimetro_inicial
    }

    if (horimetro_final !== undefined) {
      updateFields.horimetro_final = horimetro_final
    }

    // Se está marcando como concluído e tem horímetro, garantir que status é concluido
    if (horimetro_inicial !== undefined && horimetro_final !== undefined) {
      updateFields.status = "concluido"
    }

    const result = await dbConnect
      .collection("solicitacoes")
      .updateOne(
        { _id: new ObjectId(id) }, 
        { $set: updateFields }
      )

    if (result.matchedCount === 0) {
      return res.status(404).json({ error: "Solicitação não encontrada" })
    }

    // Buscar e retornar a solicitação atualizada
    const updatedSolicitacao = await dbConnect
      .collection("solicitacoes")
      .findOne({ _id: new ObjectId(id) })

    res.json({
      message: "Solicitação atualizada com sucesso",
      solicitacao: updatedSolicitacao,
    })
  } catch (err) {
    console.error("Erro ao atualizar solicitação:", err)
    res.status(500).json({ error: "Erro ao atualizar solicitação", details: err.message })
  }
})

// DELETE - Excluir uma solicitação
router.delete("/:id", async (req, res) => {
  const { id } = req.params

  try {
    const dbConnect = dbo.getDb()

    const result = await dbConnect
      .collection("solicitacoes")
      .deleteOne({ _id: new ObjectId(id) })

    if (result.deletedCount === 0) {
      return res.status(404).json({ error: "Solicitação não encontrada" })
    }

    res.json({ message: "Solicitação excluída com sucesso" })
  } catch (err) {
    console.error("Erro ao excluir solicitação:", err)
    res.status(500).json({ error: "Erro ao excluir solicitação" })
  }
})

module.exports = router
