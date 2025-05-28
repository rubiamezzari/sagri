const express = require("express");
const { ObjectId } = require("mongodb");
const dbo = require("../db/conn");
const multer = require("multer");

const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({ storage });

router.get("/implementos", async (req, res) => {
  const dbConnect = dbo.getDb();

  try {
    const result = await dbConnect.collection("implementos").find({}).toArray();

    const implementosComImagem = result.map((implemento) => {
      if (implemento.foto && Buffer.isBuffer(implemento.foto)) {
        implemento.foto = `data:image/jpeg;base64,${implemento.foto.toString("base64")}`;
      } else {
        implemento.foto = null;
      }
      return implemento;
    });

    res.status(200).send(implementosComImagem);
  } catch (err) {
    console.error("Erro ao buscar implementos:", err);
    res.status(500).send({ error: "Erro ao buscar implementos", details: err.message });
  }
});

router.get("/implementos/:id", async (req, res) => {
  const dbConnect = dbo.getDb();
  const query = { _id: new ObjectId(req.params.id) };

  try {
    const result = await dbConnect.collection("implementos").findOne(query);

    if (!result) {
      return res.status(404).send("Implemento não encontrado");
    }

    if (result.foto && Buffer.isBuffer(result.foto)) {
      result.foto = `data:image/jpeg;base64,${result.foto.toString("base64")}`;
    } else {
      result.foto = null;
    }

    res.status(200).send(result);
  } catch (err) {
    console.error("Erro ao buscar implemento por ID:", err);
    res.status(500).send({ error: "Erro ao buscar implemento", details: err.message });
  }
});

router.post("/implementos/create", upload.single("foto"), async (req, res) => {
  const dbConnect = dbo.getDb();

  try {
    const dados = JSON.parse(req.body.dados);

    const novoImplemento = {
      ...dados,
      foto: req.file ? req.file.buffer : null,
    };

    const result = await dbConnect.collection("implementos").insertOne(novoImplemento);

    console.log("Implemento cadastrado:", result.insertedId);

    res.status(201).json({
      message: "Implemento cadastrado com sucesso!",
      implementoId: result.insertedId,
    });

  } catch (err) {
    console.error("Erro ao cadastrar implemento:", err);
    res.status(500).json({
      error: "Erro ao adicionar implemento",
      details: err.message,
    });
  }
});

router.delete("/implementos/:id", async (req, res) => {
  const dbConnect = dbo.getDb();

  try {
    const query = { _id: new ObjectId(req.params.id) };
    const result = await dbConnect.collection("implementos").deleteOne(query);

    if (result.deletedCount === 0) {
      return res.status(404).json({ error: "Implemento não encontrado" });
    }

    res.status(200).json({ message: "Implemento excluído com sucesso" });
  } catch (err) {
    console.error("Erro ao excluir implemento:", err);
    res.status(500).json({ error: "Erro ao excluir implemento", details: err.message });
  }
});

module.exports = router;
