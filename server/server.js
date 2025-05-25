const express = require("express");
const cors = require("cors");
const dbo = require("./db/conn");

const app = express();
const port = 5050;

app.use(cors());
app.use(express.json());

app.use(require("./routes/associados"));
app.use(require("./routes/operadores"));
app.use(require("./routes/maquinas"));
app.use(require("./routes/implementos"));


// Teste
app.get("/", (req, res) => {
  res.send("Servidor rodando!");
});

dbo.connectToMongoDB((err) => {
  if (err) {
    console.error(err);
    process.exit();
  }
  app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`);
  });
});
