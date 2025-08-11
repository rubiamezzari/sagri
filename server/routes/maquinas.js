const express = require("express");
const { ObjectId } = require("mongodb");
const dbo = require("../db/conn");

const router = express.Router();

// GET todas as máquinas com status atualizado conforme agendamentos no dia
router.get("/maquinas", async (req, res) => {
  const dbConnect = dbo.getDb();

  try {
    const maquinas = await dbConnect.collection("maquinas").find({}).toArray();

    const hoje = new Date();
    const inicioDoDia = new Date(hoje.setHours(0, 0, 0, 0));
    const fimDoDia = new Date(hoje.setHours(23, 59, 59, 999));

    const agendamentosHoje = await dbConnect
      .collection("agendamentos")
      .find({
        dataInicio: { $lte: fimDoDia },
        dataFim: { $gte: inicioDoDia },
      })
      .toArray();

    const maquinasComStatusAtualizado = maquinas.map((maquina) => {
      const estaEmUso = agendamentosHoje.some(
        (ag) => ag.maquinaId?.toString() === maquina._id.toString()
      );

      const statusAtualizado = estaEmUso ? "em uso" : maquina.status || "disponível";

      // Se tiver foto em buffer, converte para base64 (se não tiver foto, fica null)
      let fotoBase64 = null;
      if (maquina.foto && Buffer.isBuffer(maquina.foto)) {
        fotoBase64 = `data:image/jpeg;base64,${maquina.foto.toString("base64")}`;
      }

      return {
        ...maquina,
        status: statusAtualizado,
        foto: fotoBase64,
      };
    });

    res.status(200).json(maquinasComStatusAtualizado);
  } catch (err) {
    console.error("Erro ao buscar máquinas:", err);
    res.status(500).json({ error: "Erro ao buscar máquinas", details: err.message });
  }
});

// GET máquina por ID
router.get("/maquinas/:id", async (req, res) => {
  const dbConnect = dbo.getDb();
  const query = { _id: new ObjectId(req.params.id) };

  try {
    const maquina = await dbConnect.collection("maquinas").findOne(query);

    if (!maquina) {
      return res.status(404).json({ error: "Máquina não encontrada" });
    }

    if (maquina.foto && Buffer.isBuffer(maquina.foto)) {
      maquina.foto = `data:image/jpeg;base64,${maquina.foto.toString("base64")}`;
    } else {
      maquina.foto = null;
    }

    res.status(200).json(maquina);
  } catch (err) {
    console.error("Erro ao buscar máquina por ID:", err);
    res.status(500).json({ error: "Erro ao buscar máquina", details: err.message });
  }
});

// POST criar nova máquina (sem multer, só JSON)
router.post("/maquinas/create", async (req, res) => {
  const dbConnect = dbo.getDb();

  try {
    const dados = req.body;

    if (!dados || !dados.tipo || !dados.marca) {
      return res.status(400).json({ error: "Campos obrigatórios não preenchidos" });
    }

    const novaMaquina = {
      tipo: dados.tipo,
      marca: dados.marca,
      modelo: dados.modelo || "",
      potencia: dados.potencia || "",
      status: "disponível", // default
      n_serie: dados.n_serie || "",
      observacao: dados.observacao || "",
      foto: null, // sem foto porque tirou upload
    };

    const result = await dbConnect.collection("maquinas").insertOne(novaMaquina);

    res.status(201).json({
      message: "Máquina cadastrada com sucesso!",
      maquinaId: result.insertedId,
    });
  } catch (err) {
    console.error("Erro ao cadastrar máquina:", err);
    res.status(500).json({ error: "Erro ao adicionar máquina", details: err.message });
  }
});

// PATCH atualizar máquina (sem multer)
router.patch("/maquinas/update/:id", async (req, res) => {
  const dbConnect = dbo.getDb();
  const query = { _id: new ObjectId(req.params.id) };
  const dados = req.body;

  try {
    if (dados._id) delete dados._id;
    if (dados.foto) delete dados.foto; // não atualiza foto pois não tem upload

    const updates = { $set: dados };

    const result = await dbConnect.collection("maquinas").updateOne(query, updates);

    if (result.matchedCount === 0) {
      return res.status(404).json({ error: "Máquina não encontrada" });
    }

    const maquinaAtualizada = await dbConnect.collection("maquinas").findOne(query);

    if (maquinaAtualizada.foto && Buffer.isBuffer(maquinaAtualizada.foto)) {
      maquinaAtualizada.foto = `data:image/jpeg;base64,${maquinaAtualizada.foto.toString("base64")}`;
    } else {
      maquinaAtualizada.foto = null;
    }

    res.status(200).json(maquinaAtualizada);
  } catch (err) {
    console.error("Erro ao atualizar máquina:", err);
    res.status(500).json({ error: "Erro ao atualizar máquina", details: err.message });
  }
});

// DELETE máquina
router.delete("/maquinas/:id", async (req, res) => {
  const dbConnect = dbo.getDb();

  try {
    const query = { _id: new ObjectId(req.params.id) };
    const result = await dbConnect.collection("maquinas").deleteOne(query);

    if (result.deletedCount === 0) {
      return res.status(404).json({ error: "Máquina não encontrada" });
    }

    res.status(200).json({ message: "Máquina excluída com sucesso" });
  } catch (err) {
    console.error("Erro ao excluir máquina:", err);
    res.status(500).json({ error: "Erro ao excluir máquina", details: err.message });
  }
});

module.exports = router;
