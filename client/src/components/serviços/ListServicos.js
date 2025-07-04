import React, { useEffect, useState } from "react";

const containerStyle = {
  padding: "20px",
  backgroundColor: "#f5f9f4",
  minHeight: "100vh",
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
  backgroundColor: "#daf4d0",
  borderRadius: "8px",
  padding: "20px",
  boxShadow: "0 1px 3px rgba(25, 58, 30, 0.1)",
  transition: "transform 0.1s",
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
};

const textStyle = {
  marginBottom: "6px",
  color: "#335533",
  fontSize: "1rem",
};

const API_URL = "http://localhost:5050";

export default function ListServicos() {
  const [servicos, setServicos] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [hoveredId, setHoveredId] = useState(null);

  useEffect(() => {
    fetch(`${API_URL}/servicos`)
      .then((res) => res.json())
      .then((data) => setServicos(data))
      .catch((err) => console.error("Erro ao buscar serviços:", err));
  }, []);

  const filteredServicos = servicos.filter((s) =>
    s.nome.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div style={containerStyle}>
      <input
        type="text"
        placeholder="Buscar serviço..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        style={searchStyle}
      />

      <div style={gridStyle}>
        {filteredServicos.length === 0 && (
          <p>Nenhum serviço encontrado.</p>
        )}

        {filteredServicos.map((servico) => (
          <div
            key={servico._id}
            style={{
              ...cardStyle,
              ...(hoveredId === servico._id ? cardHoverStyle : {}),
            }}
            onMouseEnter={() => setHoveredId(servico._id)}
            onMouseLeave={() => setHoveredId(null)}
          >
            <h3 style={titleStyle}>{servico.nome}</h3>
            <p style={textStyle}>
              <strong>Máquina:</strong> {servico.maquina_tipo}
            </p>
            <p style={textStyle}>
              <strong>Implemento:</strong> {servico.implemento_tipo}
            </p>
            {servico.observacao && (
              <p style={textStyle}>
                <em>{servico.observacao}</em>
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
