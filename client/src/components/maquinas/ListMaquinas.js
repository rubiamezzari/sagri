import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const API_URL = "http://localhost:5050";

const btnDetalhes = {
  backgroundColor: "#1c3d21",
  color: "#fff",
  padding: "5px 12px",
  borderRadius: "4px",
  fontSize: "0.75rem",
  border: "none",
  cursor: "pointer",
  fontWeight: "500",
  textDecoration: "none",
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
        backgroundColor: "#ccedbf",
        color: "#155724",
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

  return (
    <div style={{ width: "100%", backgroundColor: "#fff", padding: "20px", borderRadius: "5px" }}>
      <div style={{ marginBottom: "15px" }}>
        <input
          type="text"
          placeholder="Pesquisar máquina..."
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
          style={{
            width: "100%",
            padding: "10px",
            borderRadius: "5px",
            border: "1px solid #ccc",
            outlineColor: "#1c3d21",
            fontSize: "0.85rem",
          }}
        />
      </div>

      <table style={{
        width: "100%",
        borderCollapse: "collapse",
        fontSize: "0.85rem",
        textAlign: "center"
      }}>
        <thead style={{ backgroundColor: "#f8f8f8", fontWeight: "600" }}>
          <tr style={{ borderBottom: "1px solid #ccc" }}>
            <th style={{ padding: "12px 0" }}>#</th>
            <th style={{ padding: "12px 0" }}>Tipo</th>
            <th style={{ padding: "12px 0" }}>Marca</th>
            <th style={{ padding: "12px 0" }}>Modelo</th>
            <th style={{ padding: "12px 0" }}>Status</th>
            <th style={{ padding: "12px 0" }}></th>
          </tr>
        </thead>
        <tbody>
          {implementosFiltrados.length === 0 ? (
            <tr>
              <td colSpan={6} style={{ padding: "12px 0" }}>
                Nenhum implemento encontrado.
              </td>
            </tr>
          ) : (
            implementosFiltrados.map((imp, idx) => (
              <tr key={imp._id} style={{ borderBottom: "1px solid #ccc" }}>
                <td style={{ padding: "12px 8px" }}>{idx + 1}</td>
                <td style={{ padding: "12px 8px" }}>{imp.tipo?.toUpperCase()}</td>
                <td style={{ padding: "12px 8px" }}>{imp.marca?.toUpperCase()}</td>
                <td style={{ padding: "12px 8px" }}>{imp.modelo?.toUpperCase()}</td>
                <td style={{ padding: "12px 8px" }}>
                  <span style={getStatusStyle(imp.status)}>{imp.status}</span>
                </td>
                <td style={{ textAlign: "center", padding: "12px 8px" }}>
                  <Link to={`/implementos/${imp._id}`} style={btnDetalhes}>
                    Mais detalhes
                  </Link>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
