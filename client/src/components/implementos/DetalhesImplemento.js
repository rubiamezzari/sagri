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

export default function DetalhesImplemento() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [implemento, setImplemento] = useState(null);

  useEffect(() => {
    async function fetchData() {
      const response = await fetch(`${REACT_APP_YOUR_HOSTNAME}/implementos/${id}`);
      if (!response.ok) {
        const message = `Ocorreu um erro: ${response.statusText}`;
        window.alert(message);
        return;
      }
      const implemento = await response.json();
      setImplemento(implemento);
    }
    fetchData();
  }, [id]);

  async function handleDelete() {
    const confirmar = window.confirm("Tem certeza que deseja excluir este implemento?");
    if (!confirmar) return;

    const response = await fetch(`${REACT_APP_YOUR_HOSTNAME}/implementos/${id}`, {
      method: "DELETE",
    });

    if (response.ok) {
      alert("Implemento excluído com sucesso!");
      navigate("/implementos/list");
    } else {
      alert("Erro ao excluir implemento.");
    }
  }

  if (!implemento) {
    return <div>Carregando...</div>;
  }

  return (
    <div
      style={{
        backgroundColor: "#fff",
        padding: "30px",
        borderRadius: "5px",
        maxWidth: "950px",
        margin: "40px auto",
        fontFamily: "'Segoe UI', sans-serif",
        color: "#333",
      }}
    >
      <h2 style={tituloNome}>{`${implemento.tipo} - ${implemento.marca} ${implemento.modelo}`}</h2>

      <div style={linha}>
        <div style={campoLabel}>ID:</div> #{implemento.numero}
      </div>
      <div style={linha}>
        <div style={campoLabel}>Tipo:</div> {implemento.tipo}
      </div>
      <div style={linha}>
        <div style={campoLabel}>Marca:</div> {implemento.marca}
      </div>
      <div style={linha}>
        <div style={campoLabel}>Modelo:</div> {implemento.modelo}
      </div>
      <div style={linha}>
        <div style={campoLabel}>Capacidade:</div> {implemento.capacidade}
      </div>
      <div style={linha}>
        <div style={campoLabel}>Número de Série:</div> {implemento.n_serie}
      </div>
      <div style={linha}>
        <div style={campoLabel}>Status:</div> {implemento.status}
      </div>

      {implemento.foto && (
        <div style={{ marginTop: "25px" }}>
          <img
            src={implemento.foto}
            alt={`Foto do implemento ${implemento.tipo}`}
            style={{ maxWidth: "300px", borderRadius: "6px", boxShadow: "0 0 10px rgba(0,0,0,0.1)" }}
          />
        </div>
      )}

      {implemento.observacao && (
        <div style={{ marginTop: "25px" }}>
          <h4 style={{ fontSize: "1.05rem", color: "#1a3c1a" }}>Observações:</h4>
          <p>{implemento.observacao}</p>
        </div>
      )}

      <div style={{ marginTop: "30px" }}>
        <Link to={`/implementos/edit/${id}`} style={btnEditar}>
          Editar
        </Link>
        <button onClick={handleDelete} style={btnExcluir}>
          Excluir
        </button>
      </div>
    </div>
  );
}
