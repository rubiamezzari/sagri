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
  switch (status?.toLowerCase()) {
    case "disponível":
      return {
        backgroundColor: "#d4edda", 
        color: "#155724",          
        padding: "5px 12px",
        borderRadius: "10px",
        fontWeight: "600",
        fontSize: "0.85rem",
        display: "inline-block",
        textTransform: "capitalize",
      };
    case "indisponível":
      return {
        backgroundColor: "#f8d7da", 
        color: "#721c24",         
        padding: "5px 12px",
        borderRadius: "10px",
        fontWeight: "600",
        fontSize: "0.85rem",
        display: "inline-block",
        textTransform: "capitalize",
      };
    default:
      return {
        backgroundColor: "#e2e3e5", 
        color: "#383d41",           
        padding: "5px 12px",
        borderRadius: "10px",
        fontWeight: "600",
        fontSize: "0.85rem",
        display: "inline-block",
        textTransform: "capitalize",
      };
  }
}

export default function ListMaquinas() {
  const [maquinas, setMaquinas] = useState([]);
  const [busca, setBusca] = useState("");

  useEffect(() => {
    async function getMaquinas() {
      try {
        const response = await fetch(`${API_URL}/maquinas`);
        if (!response.ok) {
          throw new Error("Erro ao buscar máquinas");
        }
        const data = await response.json();
        setMaquinas(data);
      } catch (error) {
        alert("Erro ao buscar máquinas: " + error.message);
      }
    }
    getMaquinas();
  }, []);

  const maquinasFiltradas = maquinas.filter((maq) =>
    maq.tipo.toLowerCase().includes(busca.toLowerCase()) ||
    maq.marca.toLowerCase().includes(busca.toLowerCase()) ||
    maq.modelo.toLowerCase().includes(busca.toLowerCase()) ||
    maq.status.toLowerCase().includes(busca.toLowerCase())
  );

  return (
    <div style={{ padding: "20px" }}>
      <div
        style={{
          backgroundColor: "#fff",
          padding: "20px",
          borderRadius: "5px",
        }}
      >
        <div style={{ marginBottom: "20px" }}>
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
              marginBottom: "15px",
            }}
          />
        </div>

        {/* Tabela */}
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            fontSize: "0.85rem",
            textAlign: "center",
          }}
        >
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
            {maquinasFiltradas.length === 0 ? (
              <tr>
                <td colSpan={7} style={{ padding: "12px 0" }}>
                  Nenhuma máquina encontrada.
                </td>
              </tr>
            ) : (
              maquinasFiltradas.map((maq, idx) => (
                <tr key={maq._id} style={{ borderBottom: "1px solid #ccc" }}>
                  <td style={{ padding: "12px 8px" }}>{idx + 1}</td>
                  <td style={{ padding: "12px 8px" }}>{maq.tipo}</td>
                  <td style={{ padding: "12px 8px" }}>{maq.marca}</td>
                  <td style={{ padding: "12px 8px" }}>{maq.modelo}</td>
                  <td style={{ padding: "12px 8px" }}>
                    <span style={getStatusStyle(maq.status)}>{maq.status}</span>
                  </td>
                  <td style={{ textAlign: "center", padding: "12px 8px" }}>
                    <Link to={`/maquinas/${maq._id}`} style={btnDetalhes}>
                      Mais detalhes
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
