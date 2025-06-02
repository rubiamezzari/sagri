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

export default function ListOperadores() {
  const [operadores, setOperadores] = useState([]);
  const [busca, setBusca] = useState("");

  useEffect(() => {
    buscarOperadores();
  }, []);

  async function buscarOperadores() {
    try {
      const response = await fetch(`${API_URL}/operadores`);
      if (!response.ok) throw new Error("Erro ao buscar operadores");
      const data = await response.json();
      setOperadores(data);
    } catch (error) {
      alert("Erro ao buscar operadores: " + error.message);
    }
  }

  const operadoresFiltrados = operadores.filter((op) =>
    op.nome?.toLowerCase().includes(busca.toLowerCase()) ||
    op.telefone?.toLowerCase().includes(busca.toLowerCase()) ||
    op.cpf?.toLowerCase().includes(busca.toLowerCase())
  );

  return (
    <div style={{ width: "100%", padding: "20px" }}>
      <div
        style={{
          maxWidth: "1100px",
          margin: "0 auto",
          backgroundColor: "#fff",
          padding: "20px",
          borderRadius: "5px"
        }}
      >
        <div style={{ marginBottom: "20px" }}>
          <input
            type="text"
            placeholder="Pesquisar operador..."
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
              <th style={{ padding: "12px 0" }}>Nome</th>
              <th style={{ padding: "12px 0" }}>Telefone</th>
              <th style={{ padding: "12px 0" }}>CPF</th>
              <th style={{ padding: "12px 0" }}></th>
            </tr>
          </thead>
          <tbody>
            {operadoresFiltrados.length === 0 ? (
              <tr>
                <td colSpan={6} style={{ padding: "12px 0" }}>
                  Nenhum operador encontrado.
                </td>
              </tr>
            ) : (
              operadoresFiltrados.map((op, idx) => (
                <tr key={op._id} style={{ borderBottom: "1px solid #ccc" }}>
                  <td style={{ padding: "12px 8px" }}>{idx + 1}</td>
                  <td style={{ padding: "12px 8px" }}>{op.nome || "—"}</td>
                  <td style={{ padding: "12px 8px" }}>{op.telefone}</td>
                  <td style={{ padding: "12px 8px" }}>{op.cpf}</td>
                  <td style={{ textAlign: "center", padding: "12px 8px" }}>
                    <Link to={`/operadores/${op._id}`} style={btnDetalhes}>
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
