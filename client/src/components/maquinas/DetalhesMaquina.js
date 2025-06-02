import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";

const API_URL = "http://localhost:5050";

const styles = {
  container: {
    backgroundColor: "#fff",
    padding: "30px",
    borderRadius: "5px",
    maxWidth: "950px",
    margin: "40px auto",
    fontFamily: "'Segoe UI', sans-serif",
  },
  titulo: {
    fontSize: "1.25rem",
    fontWeight: "bold",
    textTransform: "uppercase",
    paddingBottom: "10px",
    marginBottom: "20px",
    borderBottom: "2px solid #a5d6a7",
    color: "#1a3c1a",
  },
  linha: {
    padding: "6px 0",
    display: "flex",
    gap: "8px",
    fontSize: "0.95rem",
    borderBottom: "1px solid #d5ecd0",
  },
  campoLabel: {
    minWidth: "160px",
    fontWeight: "bold",
  },
  imagem: {
    marginTop: "20px",
    maxWidth: "100%",
    borderRadius: "8px",
  },
  botoes: {
    marginTop: "30px",
  },
  btnBase: {
    padding: "5px 18px",
    borderRadius: "5px",
    fontWeight: "500",
    fontSize: "1rem",
    border: "none",
    cursor: "pointer",
    transition: "all 0.3s ease",
    marginRight: "15px",
    textDecoration: "none",
    display: "inline-block",
  },
  btnEditar: {
    backgroundColor: "#1c3d21",
    color: "#daf4d0",
  },
  btnExcluir: {
    backgroundColor: "#daf4d0",
    color: "#86a479",
  },
};

const statusStyle = {
  padding: "4px 10px",
  borderRadius: "12px",
  fontWeight: "bold",
  textTransform: "capitalize",
  display: "inline-block",
};

function getStatusStyle(status) {
  switch (status?.toLowerCase()) {
    case "disponivel":
      return { ...statusStyle, backgroundColor: "#d0f0c0", color: "#1a3c1a" };
    case "indisponivel":
      return { ...statusStyle, backgroundColor: "#f9d5d3", color: "#a83232" };
    case "manutencao":
      return { ...statusStyle, backgroundColor: "#fff3cd", color: "#856404" };
    default:
      return { ...statusStyle, backgroundColor: "#eee", color: "#333" };
  }
}

export default function DetalhesMaquina() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [maquina, setMaquina] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch(`${API_URL}/maquinas/${id}`);
        const data = await res.json();
        setMaquina(data);
      } catch (err) {
        alert("Erro ao carregar máquina.");
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [id]);

  async function handleDelete() {
    const confirmar = window.confirm("Tem certeza que deseja excluir esta máquina?");
    if (!confirmar) return;

    try {
      const res = await fetch(`${API_URL}/maquinas/${id}`, { method: "DELETE" });
      if (res.ok) {
        alert("Máquina excluída com sucesso!");
        navigate("/maquinas/list");
      } else {
        alert("Erro ao excluir máquina.");
      }
    } catch (error) {
      alert("Erro na conexão com o servidor.");
    }
  }

  if (loading || !maquina) return <div style={{ textAlign: "center" }}>Carregando...</div>;

  return (
    <div style={styles.container}>
      <h2 style={styles.titulo}>{maquina.tipo || maquina.nome}</h2>

      <div style={styles.linha}>
        <div style={styles.campoLabel}>Marca:</div> {maquina.marca || "N/A"}
      </div>
      <div style={styles.linha}>
        <div style={styles.campoLabel}>Modelo:</div> {maquina.modelo || "N/A"}
      </div>
      <div style={styles.linha}>
        <div style={styles.campoLabel}>Potência:</div> {maquina.potencia || "N/A"}
      </div>
      <div style={styles.linha}>
        <div style={styles.campoLabel}>Número de Série:</div> {maquina.n_serie || "N/A"}
      </div>
      <div style={styles.linha}>
        <div style={styles.campoLabel}>Status:</div>
        <span style={getStatusStyle(maquina.status)}>{maquina.status || "Não informado"}</span>
      </div>
      <div style={styles.linha}>
        <div style={styles.campoLabel}>Observação:</div>{" "}
        {maquina.observacao?.trim() ? maquina.observacao : "Sem observações"}
      </div>

      {maquina.foto && (
        <div>
          <img src={maquina.foto} alt="Foto da máquina" style={styles.imagem} />
        </div>
      )}

      <div style={styles.botoes}>
        <Link to={`/maquinas/edit/${id}`} style={{ ...styles.btnBase, ...styles.btnEditar }}>
          Editar
        </Link>
        <button onClick={handleDelete} style={{ ...styles.btnBase, ...styles.btnExcluir }}>
          Excluir
        </button>
      </div>
    </div>
  );
}
