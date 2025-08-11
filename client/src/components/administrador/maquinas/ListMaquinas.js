import React, { useEffect, useState } from "react";
import DetalhesMaquina from "./DetalhesMaquina";

const API_URL = "http://localhost:5050";

const containerStyle = {
  padding: "20px",
  backgroundColor: "#F0FAF7",
  minHeight: "100vh",
  maxWidth: "1800px",
  width: "100%",
  marginLeft: "auto",
  marginRight: "auto",
};

const searchStyle = {
  width: "100%",
  padding: "10px",
  borderRadius: "5px",
  border: "1px solid #ccc",
  outlineColor: "#1A381F",
  fontSize: "0.85rem",
  marginBottom: "15px",
};

const gridStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
  gap: "20px",
};

const cardStyle = {
  position: "relative",
  backgroundColor: "#fff",
  borderRadius: "8px",
  padding: "20px",
  boxShadow: "0 1px 3px rgba(25, 58, 30, 0.1)",
  transition: "transform 0.1s",
  cursor: "pointer",
};

const cardHoverStyle = {
  transform: "scale(1.03)",
  boxShadow: "0 2px 5px rgba(49, 71, 48, 0.19)",
};

const titleStyle = {
  marginBottom: "10px",
  fontWeight: "bold",
  fontSize: "1.3rem",
  color: "#1A381F",
  textTransform: "uppercase",
};

const textStyle = {
  marginBottom: "6px",
  color: "#335533",
  fontSize: "1rem",
};

function getStatusStyle(status) {
  const baseStyle = {
    padding: "5px 12px",
    borderRadius: "10px",
    fontWeight: "600",
    fontSize: "0.85rem",
    display: "inline-block",
    textTransform: "capitalize",
  };

  switch (status?.toLowerCase()) {
    case "disponível":
      return {
        ...baseStyle,
        backgroundColor: "#C7E5CD",
        color: "#183A20",
      };
    case "indisponível":
      return {
        ...baseStyle,
        backgroundColor: "#f8d7da",
        color: "#721c24",
      };
    default:
      return {
        ...baseStyle,
        backgroundColor: "#e2e3e5",
        color: "#383d41",
      };
  }
}

export default function ListMaquinas() {
  const [maquinas, setMaquinas] = useState([]);
  const [busca, setBusca] = useState("");
  const [hoveredId, setHoveredId] = useState(null);
  const [maquinaSelecionada, setMaquinaSelecionada] = useState(null);
  const [mostrarModal, setMostrarModal] = useState(false);

  useEffect(() => {
    async function getMaquinas() {
      try {
        const response = await fetch(`${API_URL}/maquinas`);
        if (!response.ok) throw new Error("Erro ao buscar máquinas");
        const data = await response.json();
        setMaquinas(data);
      } catch (error) {
        alert("Erro ao buscar máquinas: " + error.message);
      }
    }
    getMaquinas();
  }, []);

  const maquinasFiltradas = maquinas.filter((maq) =>
    maq.tipo?.toLowerCase().includes(busca.toLowerCase()) ||
    maq.marca?.toLowerCase().includes(busca.toLowerCase()) ||
    maq.modelo?.toLowerCase().includes(busca.toLowerCase()) ||
    maq.status?.toLowerCase().includes(busca.toLowerCase())
  );

  const abrirDetalhes = (maquina) => {
    setMaquinaSelecionada(maquina);
    setMostrarModal(true);
  };

  function handleDelete(idDeleted) {
    setMaquinas((old) => old.filter((m) => m._id !== idDeleted));
    setMostrarModal(false);
  }

  function handleUpdate(maquinaAtualizada) {
    setMaquinas((old) =>
      old.map((m) => (m._id === maquinaAtualizada._id ? maquinaAtualizada : m))
    );
    setMostrarModal(false);
  }

  return (
    <div style={containerStyle}>
      <input
        type="text"
        placeholder="Pesquisar máquina..."
        value={busca}
        onChange={(e) => setBusca(e.target.value)}
        style={searchStyle}
      />

      {maquinasFiltradas.length === 0 && <p>Nenhuma máquina encontrada.</p>}

      <div style={gridStyle}>
        {maquinasFiltradas.map((maq) => (
          <div
            key={maq._id}
            style={{
              ...cardStyle,
              ...(hoveredId === maq._id ? cardHoverStyle : {}),
            }}
            onMouseEnter={() => setHoveredId(maq._id)}
            onMouseLeave={() => setHoveredId(null)}
            onClick={() => abrirDetalhes(maq)}
          >
            <span
              style={{
                ...getStatusStyle(maq.status),
                position: "absolute",
                top: 15,
                right: 15,
              }}
            >
              {maq.status}
            </span>

            <h3 style={titleStyle}>{maq.tipo}</h3>

            <p style={textStyle}>
              <strong>Marca:</strong> {maq.marca}
            </p>

            <p style={textStyle}>
              <strong>Modelo:</strong> {maq.modelo}
            </p>
          </div>
        ))}
      </div>

      {mostrarModal && maquinaSelecionada && (
        <DetalhesMaquina
          maquina={maquinaSelecionada}
          onClose={() => setMostrarModal(false)}
          onDeleted={handleDelete}
          onUpdated={handleUpdate}  
        />
      )}
    </div>
  );
}
