import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";

const REACT_APP_YOUR_HOSTNAME = "http://localhost:5050";

const linha = {
  padding: "6px 0",
  display: "flex",
  gap: "8px",
  fontSize: "0.95rem",
  borderBottom: "1px solid #d5ecd0",
};

const campoLabel = {
  minWidth: "160px",
  fontWeight: "bold",
};

const tituloNome = {
  fontSize: "1.25rem",
  fontWeight: "bold",
  textTransform: "uppercase",
  paddingBottom: "10px",
  marginBottom: "20px",
  borderBottom: "2px solid #a5d6a7",
  color: "#1a3c1a",
};

const btnBase = {
  padding: "5px 18px",
  borderRadius: "5px",
  fontWeight: "500",
  fontSize: "1rem",
  border: "none",
  cursor: "pointer",
  transition: "all 0.3s ease",
  marginRight: "15px",
  marginTop: "20px",
  color: "#fff",
  textDecoration: "none",
  display: "inline-block",
};

const btnEditar = {
  ...btnBase,
  backgroundColor: "#1c3d21",
};

const btnExcluir = {
  ...btnBase,
  backgroundColor: "#daf4d0",
  color: "#86a479",
};

export default function DetalhesMaquina() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [maquina, setMaquina] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      const res = await fetch(`${REACT_APP_YOUR_HOSTNAME}/maquinas/${id}`);
      const data = await res.json();
      setMaquina(data);
      setLoading(false);
    }
    fetchData();
  }, [id]);

  async function handleDelete() {
    const confirmar = window.confirm("Tem certeza que deseja excluir esta máquina?");
    if (!confirmar) return;

    const res = await fetch(`${REACT_APP_YOUR_HOSTNAME}/maquinas/${id}`, {
      method: "DELETE",
    });

    if (res.ok) {
      alert("Máquina excluída com sucesso!");
      navigate("/maquinas/list");
    } else {
      alert("Erro ao excluir máquina.");
    }
  }

  if (loading || !maquina) return <div>Carregando...</div>;

  return (
    <div
      style={{
        backgroundColor: "#fff",
        padding: "30px",
        borderRadius: "5px",
        maxWidth: "950px",
        margin: "40px auto",
        fontFamily: "'Segoe UI', sans-serif",
      }}
    >
      <h2 style={tituloNome}>{maquina.tipo || maquina.nome}</h2>

      <div style={linha}>
        <div style={campoLabel}>Marca:</div> {maquina.marca}
      </div>
      <div style={linha}>
        <div style={campoLabel}>Modelo:</div> {maquina.modelo}
      </div>
      <div style={linha}>
        <div style={campoLabel}>Potência:</div> {maquina.potencia || "N/A"}
      </div>
      <div style={linha}>
        <div style={campoLabel}>Número de Série:</div> {maquina.n_serie || "N/A"}
      </div>
      <div style={linha}>
        <div style={campoLabel}>Status:</div> {maquina.status || "N/A"}
      </div>
      <div style={linha}>
        <div style={campoLabel}>Observação:</div> {maquina.observacao || "Sem observações"}
      </div>

      {maquina.foto && (
        <div style={{ marginTop: "20px" }}>
          <img
            src={maquina.foto}
            alt="Foto da máquina"
            style={{ maxWidth: "100%", borderRadius: "8px" }}
          />
        </div>
      )}

      <div style={{ marginTop: "30px" }}>
        <Link to={`/maquinas/edit/${id}`} style={btnEditar}>
          Editar
        </Link>
        <button onClick={handleDelete} style={btnExcluir}>
          Excluir
        </button>
      </div>
    </div>
  );
}
