const express = require("express");
const cors = require("cors");
const path = require("path");
const dbo = require("./db/conn");

const app = express();
const port = 5050;


app.use(cors({
  origin: "http://localhost:3000" 
}));
app.use(express.json());

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use(require("./routes/associados"));
app.use(require("./routes/operadores"));
app.use(require("./routes/maquinas"));
app.use(require("./routes/implementos"));

app.get("/", (req, res) => {
  res.send("Servidor rodando!");
});

dbo.connectToMongoDB((err) => {
  if (err) {
    console.error("Erro ao conectar ao MongoDB:", err);
    process.exit();
  }
  app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`);
  });
});
