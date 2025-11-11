const express = require("express")
const { ObjectId } = require("mongodb")
const dbo = require("../db/conn")
const multer = require("multer")
const path = require("path")
const fs = require("fs")
const bcrypt = require("bcrypt")

const router = express.Router()
const SALT_ROUNDS = 10

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let folder = "uploads/"
    if (file.fieldname === "caf") folder += "caf"

    if (!fs.existsSync(folder)) {
      try {
        fs.mkdirSync(folder, { recursive: true })
        console.log(`[Backend] Pasta criada: ${folder}`)
      } catch (err) {
        console.error(`[Backend] Erro ao criar pasta ${folder}:`, err)
        return cb(err, null)
      }
    }
    cb(null, folder)
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname)
    const name = `${Date.now()}${ext}`
    console.log(`[Backend] Salvando arquivo: ${name}`)
    cb(null, name)
  },
})

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|pdf/
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase())
    const mimetype = allowedTypes.test(file.mimetype)

    if (mimetype && extname) {
      return cb(null, true)
    } else {
      cb(new Error("Apenas arquivos JPEG, PNG ou PDF são permitidos"))
    }
  },
})

router.post("/associados/create", upload.fields([{ name: "caf", maxCount: 1 }]), async (req, res) => {
  console.log("[Backend] Recebendo requisição POST /associados/create")
  console.log("[Backend] Body:", req.body)
  console.log("[Backend] Files:", req.files)

  const dbConnect = dbo.getDb()
  try {
    if (!req.body.dados) {
      console.error("[Backend] Campo 'dados' não encontrado no body")
      return res.status(400).json({
        error: "Dados do associado não fornecidos",
        mensagem: "Campo 'dados' é obrigatório",
      })
    }

    let dados
    try {
      dados = JSON.parse(req.body.dados)
      console.log("[Backend] Dados parseados:", dados)
    } catch (parseError) {
      console.error("[Backend] Erro ao fazer parse dos dados:", parseError)
      return res.status(400).json({
        error: "Dados inválidos",
        mensagem: "Não foi possível processar os dados do associado",
      })
    }

    if (!dados.nome || !dados.cpf || !dados.senha) {
      console.error("[Backend] Campos obrigatórios faltando")
      return res.status(400).json({
        error: "Campos obrigatórios faltando",
        mensagem: "Nome, CPF e senha são obrigatórios",
      })
    }

    const cpfLimpo = dados.cpf.replace(/[^\d]/g, "")
    console.log("[Backend] CPF limpo:", cpfLimpo)

    const existente = await dbConnect.collection("associados").findOne({ cpf: cpfLimpo })
    if (existente) {
      console.log("[Backend] CPF já cadastrado:", cpfLimpo)
      return res.status(409).json({ mensagem: "CPF já cadastrado" })
    }

    console.log("[Backend] Gerando hash da senha...")
    const senhaHash = await bcrypt.hash(dados.senha, SALT_ROUNDS)

    const novoAssociado = {
      ...dados,
      cpf: cpfLimpo,
      senha: senhaHash,
      tipo: "associado",
      documentos: {
        caf: req.files?.caf?.[0]?.filename || null,
      },
      data_cadastro: new Date().toISOString(),
    }

    console.log("[Backend] Inserindo associado no banco...")
    const result = await dbConnect.collection("associados").insertOne(novoAssociado)

    console.log("[Backend] Associado cadastrado com sucesso:", result.insertedId)
    res.status(201).json({
      success: true,
      insertedId: result.insertedId,
      mensagem: "Associado cadastrado com sucesso",
    })
  } catch (err) {
    console.error("[Backend] Erro ao cadastrar associado:", err)
    res.status(500).json({
      error: "Erro ao cadastrar associado",
      details: err.message,
      mensagem: "Erro interno do servidor ao cadastrar associado",
    })
  }
})

router.post("/associados", async (req, res) => {
  console.log("[Backend] Recebendo requisição POST /associados")
  const dbConnect = dbo.getDb()
  try {
    if (!req.body.nome || !req.body.cpf || !req.body.senha) {
      return res.status(400).json({
        error: "Campos obrigatórios faltando",
        mensagem: "Nome, CPF e senha são obrigatórios",
      })
    }

    const cpfLimpo = req.body.cpf.replace(/[^\d]/g, "")

    const existente = await dbConnect.collection("associados").findOne({ cpf: cpfLimpo })
    if (existente) {
      return res.status(409).json({ mensagem: "CPF já cadastrado" })
    }

    const senhaHash = await bcrypt.hash(req.body.senha, SALT_ROUNDS)

    const novoAssociado = {
      nome: req.body.nome,
      cpf: cpfLimpo,
      email: req.body.email,
      telefone: req.body.telefone,
      senha: senhaHash,
      data_associacao: req.body.data_associacao,
      endereco: req.body.endereco,
      documentos: req.body.documentos,
      tipo: "associado",
      data_cadastro: new Date().toISOString(),
    }

    const result = await dbConnect.collection("associados").insertOne(novoAssociado)
    res.status(201).json({
      success: true,
      insertedId: result.insertedId,
      mensagem: "Associado cadastrado com sucesso",
    })
  } catch (err) {
    console.error("[Backend] Erro ao adicionar associado:", err)
    res.status(500).json({ error: "Erro ao adicionar associado", details: err.message })
  }
})

function flattenObject(ob) {
  const toReturn = {}
  for (const i in ob) {
    if (!Object.prototype.hasOwnProperty.call(ob, i)) continue
    if (typeof ob[i] === "object" && ob[i] !== null && !Array.isArray(ob[i])) {
      const flatObject = flattenObject(ob[i])
      for (const x in flatObject) {
        if (!Object.prototype.hasOwnProperty.call(flatObject, x)) continue
        toReturn[i + "." + x] = flatObject[x]
      }
    } else {
      toReturn[i] = ob[i]
    }
  }
  return toReturn
}

router.patch("/associados/update/:id", async (req, res) => {
  console.log("[Backend] Recebendo requisição PATCH /associados/update/:id")
  const dbConnect = dbo.getDb()
  const query = { _id: new ObjectId(req.params.id) }
  delete req.body._id

  if (req.body.senha) {
    try {
      req.body.senha = await bcrypt.hash(req.body.senha, SALT_ROUNDS)
    } catch (err) {
      return res.status(500).json({ error: "Erro ao processar senha", details: err.message })
    }
  }

  const updates = { $set: flattenObject(req.body) }

  try {
    const result = await dbConnect.collection("associados").updateOne(query, updates)
    if (result.matchedCount === 0) {
      return res.status(404).json({ error: "Associado não encontrado" })
    }

    const atualizado = await dbConnect.collection("associados").findOne(query)
    res.status(200).json(atualizado)
  } catch (err) {
    console.error("[Backend] Erro ao atualizar associado:", err)
    res.status(500).json({ error: "Erro ao atualizar associado", details: err.message })
  }
})

router.get("/associados", async (req, res) => {
  console.log("[Backend] Recebendo requisição GET /associados")
  const dbConnect = dbo.getDb()
  try {
    const result = await dbConnect.collection("associados").find({}).toArray()
    res.status(200).json(result)
  } catch (err) {
    console.error("[Backend] Erro ao buscar associados:", err)
    res.status(500).json({ error: "Erro ao buscar associados" })
  }
})

router.get("/associados/:id", async (req, res) => {
  console.log("[Backend] Recebendo requisição GET /associados/:id")
  const dbConnect = dbo.getDb()
  const query = { _id: new ObjectId(req.params.id) }
  try {
    const result = await dbConnect.collection("associados").findOne(query)
    if (!result) {
      res.status(404).json({ error: "Associado não encontrado" })
    } else {
      res.status(200).json(result)
    }
  } catch (err) {
    console.error("[Backend] Erro ao buscar associado:", err)
    res.status(500).json({ error: "Erro ao buscar associado" })
  }
})

router.delete("/associados/:id", async (req, res) => {
  console.log("[Backend] Recebendo requisição DELETE /associados/:id")
  const dbConnect = dbo.getDb()
  const query = { _id: new ObjectId(req.params.id) }
  try {
    const result = await dbConnect.collection("associados").deleteOne(query)
    if (result.deletedCount === 0) {
      return res.status(404).json({ error: "Associado não encontrado" })
    }
    res.status(200).json({ success: true, mensagem: "Associado excluído com sucesso" })
  } catch (err) {
    console.error("[Backend] Erro ao deletar associado:", err)
    res.status(500).json({ error: "Erro ao deletar associado" })
  }
})

module.exports = router
