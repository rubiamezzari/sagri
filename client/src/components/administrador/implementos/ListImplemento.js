import React, { useEffect, useState } from "react";
import DetalhesImplemento from "./DetalhesImplemento";

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

export default function ListImplementos() {
  const [implementos, setImplementos] = useState([]);
  const [busca, setBusca] = useState("");
  const [hoveredId, setHoveredId] = useState(null);
  const [implementoSelecionado, setImplementoSelecionado] = useState(null);
  const [mostrarModal, setMostrarModal] = useState(false);

  useEffect(() => {
    async function getImplementos() {
      try {
        const response = await fetch(`${API_URL}/implementos`);
        if (!response.ok) throw new Error("Erro ao buscar implementos");
        const data = await response.json();
        setImplementos(data);
      } catch (error) {
        alert("Erro ao buscar implementos: " + error.message);
      }
    }
    getImplementos();
  }, []);

  const implementosFiltrados = implementos.filter((imp) =>
    imp.tipo?.toLowerCase().includes(busca.toLowerCase()) ||
    imp.marca?.toLowerCase().includes(busca.toLowerCase()) ||
    imp.modelo?.toLowerCase().includes(busca.toLowerCase()) ||
    imp.status?.toLowerCase().includes(busca.toLowerCase())
  );

  const abrirDetalhes = (implemento) => {
    setImplementoSelecionado(implemento);
    setMostrarModal(true);
  };

  function handleDelete(idDeleted) {
    setImplementos((old) => old.filter((i) => i._id !== idDeleted));
    setMostrarModal(false);
  }

  // Função para atualizar um implemento na lista após edição
  function handleUpdate(implementoAtualizado) {
    setImplementos((old) =>
      old.map((i) => (i._id === implementoAtualizado._id ? implementoAtualizado : i))
    );
    setMostrarModal(false);
  }

  return (
    <div style={containerStyle}>
      <input
        type="text"
        placeholder="Pesquisar implemento..."
        value={busca}
        onChange={(e) => setBusca(e.target.value)}
        style={searchStyle}
      />

      {implementosFiltrados.length === 0 && <p>Nenhum implemento encontrado.</p>}

      <div style={gridStyle}>
        {implementosFiltrados.map((imp) => (
          <div
            key={imp._id}
            style={{
              ...cardStyle,
              ...(hoveredId === imp._id ? cardHoverStyle : {}),
            }}
            onMouseEnter={() => setHoveredId(imp._id)}
            onMouseLeave={() => setHoveredId(null)}
            onClick={() => abrirDetalhes(imp)}
          >
            <span
              style={{
                ...getStatusStyle(imp.status),
                position: "absolute",
                top: 15,
                right: 15,
              }}
            >
              {imp.status}
            </span>

            <h3 style={titleStyle}>{imp.tipo}</h3>

            <p style={textStyle}>
              <strong>Marca:</strong> {imp.marca}
            </p>

            <p style={textStyle}>
              <strong>Modelo:</strong> {imp.modelo}
            </p>
          </div>
        ))}
      </div>

      {mostrarModal && implementoSelecionado && (
        <DetalhesImplemento
          implemento={implementoSelecionado}
          onClose={() => setMostrarModal(false)}
          onDeleted={handleDelete}
          onUpdated={handleUpdate}  // Passa a função para atualizar a lista após edição
        />
      )}
    </div>
  );
}
