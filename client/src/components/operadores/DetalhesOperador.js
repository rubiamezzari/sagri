import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";

const API_URL = "http://localhost:5050";

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

export default function DetalhesOperador() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [operador, setOperador] = useState(null);

  useEffect(() => {
    async function fetchOperador() {
      const response = await fetch(`${API_URL}/operadores/${id}`);
      if (!response.ok) {
        alert(`Erro ao carregar operador: ${response.statusText}`);
        return;
      }
      const data = await response.json();
      setOperador(data);
    }

    fetchOperador();
  }, [id]);

  async function handleDelete() {
    const confirmar = window.confirm("Tem certeza que deseja excluir este operador?");
    if (!confirmar) return;

    const response = await fetch(`${API_URL}/operadores/${id}`, {
      method: "DELETE",
    });

    if (response.ok) {
      alert("Operador excluído com sucesso!");
      navigate("/operadores/list");
    } else {
      alert("Erro ao excluir operador.");
    }
  }

  if (!operador) return <div>Carregando...</div>;

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
      <h2 style={tituloNome}>{operador.nome}</h2>

      <div style={linha}>
        <div style={campoLabel}>Telefone:</div> {operador.telefone}
      </div>
      <div style={linha}>
        <div style={campoLabel}>CPF:</div> {operador.cpf}
      </div>
      <div style={linha}>
        <div style={campoLabel}>Status:</div> {operador.status}
      </div>

      <div style={linha}>
        <div style={campoLabel}>Foto:</div>
        {operador.foto ? (
          <img
            src={operador.foto}
            alt="Foto do operador"
            style={{ width: 100, borderRadius: 8 }}
          />
        ) : (
          "Sem foto"
        )}
      </div>

      <div style={{ marginTop: "30px" }}>
        <Link to={`/operadores/edit/${id}`} style={btnEditar}>
          Editar
        </Link>
        <button onClick={handleDelete} style={btnExcluir}>
          Excluir
        </button>
      </div>
    </div>
  );
}
