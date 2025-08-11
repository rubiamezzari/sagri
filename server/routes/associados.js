const express = require("express");
const { ObjectId } = require("mongodb");
const dbo = require("../db/conn");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const bcrypt = require("bcrypt");

const router = express.Router();
const SALT_ROUNDS = 10;

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    let folder = "uploads/";
    if (file.fieldname === "anuidade") folder += "anuidade";
    else if (file.fieldname === "caf") folder += "caf";
    if (!fs.existsSync(folder)) fs.mkdirSync(folder, { recursive: true });
    cb(null, folder);
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    const name = `${Date.now()}${ext}`;
    cb(null, name);
  },
});
const upload = multer({ storage });

router.post(
  "/associados/create",
  upload.fields([
    { name: "anuidade", maxCount: 1 },
    { name: "caf", maxCount: 1 },
  ]),
  async (req, res) => {
    const dbConnect = dbo.getDb();
    try {
      const dados = JSON.parse(req.body.dados);
      const cpfLimpo = dados.cpf.replace(/[^\d]/g, "");

      const existente = await dbConnect.collection("associados").findOne({ cpf: cpfLimpo });
      if (existente) {
        return res.status(409).send({ mensagem: "CPF já cadastrado" });
      }

      const senhaHash = await bcrypt.hash(dados.senha, SALT_ROUNDS);

      const novoAssociado = {
        ...dados,
        cpf: cpfLimpo,
        senha: senhaHash,
        tipo: "associado", // <-- Adicionado aqui
        documentos: {
          anuidade: req.files?.anuidade?.[0]?.filename || null,
          caf: req.files?.caf?.[0]?.filename || null,
        },
      };

      const result = await dbConnect.collection("associados").insertOne(novoAssociado);
      res.status(201).send(result);
    } catch (err) {
      console.error("Erro ao cadastrar associado com arquivos:", err);
      res.status(500).send({ error: "Erro ao cadastrar associado", details: err.message });
    }
  }
);

router.post("/associados", async (req, res) => {
  const dbConnect = dbo.getDb();
  try {
    const cpfLimpo = req.body.cpf.replace(/[^\d]/g, "");

    const existente = await dbConnect.collection("associados").findOne({ cpf: cpfLimpo });
    if (existente) {
      return res.status(409).send({ mensagem: "CPF já cadastrado" });
    }

    const senhaHash = await bcrypt.hash(req.body.senha, SALT_ROUNDS);

    const novoAssociado = {
      nome: req.body.nome,
      cpf: cpfLimpo,
      email: req.body.email,
      telefone: req.body.telefone,
      senha: senhaHash,
      data_associacao: req.body.data_associacao,
      endereco: req.body.endereco,
      documentos: req.body.documentos,
      tipo: "associado", // <-- Também adicionado aqui
    };

    const result = await dbConnect.collection("associados").insertOne(novoAssociado);
    res.status(201).send(result);
  } catch (err) {
    res.status(500).send({ error: "Erro ao adicionar associado", details: err.message });
  }
});

function flattenObject(ob) {
  const toReturn = {};
  for (const i in ob) {
    if (!Object.prototype.hasOwnProperty.call(ob, i)) continue;
    if (typeof ob[i] === "object" && ob[i] !== null && !Array.isArray(ob[i])) {
      const flatObject = flattenObject(ob[i]);
      for (const x in flatObject) {
        if (!Object.prototype.hasOwnProperty.call(flatObject, x)) continue;
        toReturn[i + "." + x] = flatObject[x];
      }
    } else {
      toReturn[i] = ob[i];
    }
  }
  return toReturn;
}

router.patch("/associados/update/:id", async (req, res) => {
  const dbConnect = dbo.getDb();
  const query = { _id: new ObjectId(req.params.id) };
  delete req.body._id;

  if (req.body.senha) {
    try {
      req.body.senha = await bcrypt.hash(req.body.senha, SALT_ROUNDS);
    } catch (err) {
      return res.status(500).send({ error: "Erro ao processar senha", details: err.message });
    }
  }

  const updates = { $set: flattenObject(req.body) };

  try {
    const result = await dbConnect.collection("associados").updateOne(query, updates);
    if (result.matchedCount === 0) {
      return res.status(404).send({ error: "Associado não encontrado" });
    }

    const atualizado = await dbConnect.collection("associados").findOne(query);
    res.status(200).send(atualizado);
  } catch (err) {
    res.status(500).send({ error: "Erro ao atualizar associado", details: err.message });
  }
});

router.get("/associados", async (req, res) => {
  const dbConnect = dbo.getDb();
  try {
    const result = await dbConnect.collection("associados").find({}).toArray();
    res.status(200).send(result);
  } catch (err) {
    res.status(500).send({ error: "Erro ao buscar associados" });
  }
});

router.get("/associados/:id", async (req, res) => {
  const dbConnect = dbo.getDb();
  const query = { _id: new ObjectId(req.params.id) };
  try {
    const result = await dbConnect.collection("associados").findOne(query);
    if (!result) {
      res.status(404).send("Associado não encontrado");
    } else {
      res.status(200).send(result);
    }
  } catch (err) {
    res.status(500).send({ error: "Erro ao buscar associado" });
  }
});

router.delete("/associados/:id", async (req, res) => {
  const dbConnect = dbo.getDb();
  const query = { _id: new ObjectId(req.params.id) };
  try {
    const result = await dbConnect.collection("associados").deleteOne(query);
    res.status(200).send(result);
  } catch (err) {
    res.status(500).send({ error: "Erro ao deletar associado" });
  }
});

module.exports = router;
