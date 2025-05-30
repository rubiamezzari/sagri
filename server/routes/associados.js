const express = require("express");
const { ObjectId } = require("mongodb");
const dbo = require("../db/conn");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const router = express.Router();

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
  }
});

const upload = multer({ storage });

// ROTA para criar associado com upload de arquivos
router.post(
  "/associados/create",
  upload.fields([
    { name: "anuidade", maxCount: 1 },
    { name: "caf", maxCount: 1 }
  ]),
  async (req, res) => {
    const dbConnect = dbo.getDb();

    try {
      const dados = JSON.parse(req.body.dados);

      const novoAssociado = {
        ...dados,
        documentos: {
          anuidade: req.files?.anuidade?.[0]?.filename || null,
          caf: req.files?.caf?.[0]?.filename || null
        }
      };

      const result = await dbConnect.collection("associados").insertOne(novoAssociado);
      res.status(201).send(result);
    } catch (err) {
      console.error("Erro ao cadastrar associado com arquivos:", err);
      res.status(500).send({ error: "Erro ao cadastrar associado", details: err.message });
    }
  }
);

// ROTA para criar associado sem arquivos (JSON)
router.post("/associados", async (req, res) => {
  const dbConnect = dbo.getDb();

  const novoAssociado = {
    nome: req.body.nome,
    cpf: req.body.cpf,
    email: req.body.email,
    telefone: req.body.telefone,
    senha: req.body.senha,
    data_associacao: req.body.data_associacao,
    endereco: req.body.endereco,
    documentos: req.body.documentos,
  };

  try {
    const result = await dbConnect.collection("associados").insertOne(novoAssociado);
    res.status(201).send(result);
  } catch (err) {
    res.status(500).send({ error: "Erro ao adicionar associado", details: err.message });
  }
});

// Buscar todos os associados
router.get("/associados", async (req, res) => {
  const dbConnect = dbo.getDb();

  try {
    const result = await dbConnect.collection("associados").find({}).toArray();
    res.status(200).send(result);
  } catch (err) {
    res.status(500).send({ error: "Erro ao buscar associados" });
  }
});

// Buscar associado por ID
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

// Deletar associado por ID
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

// Função auxiliar para "achatar" objetos (você usa no PATCH)
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

// Atualizar associado por ID (PATCH)
router.patch("/associados/update/:id", async (req, res) => {
  const dbConnect = dbo.getDb();
  const query = { _id: new ObjectId(req.params.id) };

  // REMOVE o _id do corpo da requisição para evitar erro
  delete req.body._id;

  const updates = {
    $set: flattenObject(req.body),
  };

  console.log(query);
  console.log(updates);

  try {
    const result = await dbConnect.collection("associados").updateOne(query, updates);

    if (result.matchedCount === 0) {
      return res.status(404).send({ error: "Associado não encontrado" });
    }

    const associadoAtualizado = await dbConnect.collection("associados").findOne(query);
    res.status(200).send(associadoAtualizado);
  } catch (err) {
    console.log(err.message);
    res.status(500).send({ error: "Erro ao atualizar associado!!", details: err.message });
  }
});
router.patch("/associados/update/:id", async (req, res) => {
  const dbConnect = dbo.getDb();
  const query = { _id: new ObjectId(req.params.id) };

  // REMOVE o _id do corpo da requisição para evitar erro
  delete req.body._id;

  const updates = {
    $set: flattenObject(req.body),
  };

  console.log(query);
  console.log(updates);

  try {
    const result = await dbConnect.collection("associados").updateOne(query, updates);

    if (result.matchedCount === 0) {
      return res.status(404).send({ error: "Associado não encontrado" });
    }

    const associadoAtualizado = await dbConnect.collection("associados").findOne(query);
    res.status(200).send(associadoAtualizado);
  } catch (err) {
    console.log(err.message);
    res.status(500).send({ error: "Erro ao atualizar associado!!", details: err.message });
  }
});


router.post("/associados/update/:id", async (req, res) => {
  const dbConnect = dbo.getDb();
  const query = { _id: new ObjectId(req.params.id) };

  console.log(query)

  const updates = {
    $set: flattenObject(req.body),
  };

  try {
    const result = await dbConnect.collection("associados").updateOne(query, updates);

    if (result.matchedCount === 0) {
      return res.status(404).send({ error: "Associado não encontrado" });
    }

    const associadoAtualizado = await dbConnect.collection("associados").findOne(query);
    res.status(200).send(associadoAtualizado);
  } catch (err) {
    res.status(500).send({ error: "Erro ao atualizar associado", details: err.message });
  }
});


module.exports = router;
