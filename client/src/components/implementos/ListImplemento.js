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

export default function ListImplementos() {
  const [implementos, setImplementos] = useState([]);

  useEffect(() => {
    async function getImplementos() {
      try {
        const response = await fetch(`${API_URL}/implementos`);
        if (!response.ok) {
          throw new Error("Erro ao buscar implementos");
        }
        const data = await response.json();
        setImplementos(data);
      } catch (error) {
        alert("Erro ao buscar implementos: " + error.message);
      }
    }
    getImplementos();
  }, []);

  return (
    <div style={{ backgroundColor: "#fff", padding: "20px", borderRadius: "5px" }}>
      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.85rem", textAlign: "center" }}>
        <thead style={{ backgroundColor: "#f8f8f8", fontWeight: "600" }}>
          <tr style={{ borderBottom: "1px solid #ccc" }}>
            <th style={{ padding: "12px 0" }}>#</th>
            <th style={{ padding: "12px 0" }}>Tipo</th>
            <th style={{ padding: "12px 0" }}>Marca</th>
            <th style={{ padding: "12px 0" }}>Modelo</th>
            <th style={{ padding: "12px 0" }}>Status</th>
            <th style={{ padding: "12px 0" }}>Foto</th>
            <th style={{ padding: "12px 0" }}></th>
          </tr>
        </thead>
        <tbody>
          {implementos.length === 0 && (
            <tr>
              <td colSpan={7} style={{ padding: "12px 0" }}>
                Nenhum implemento cadastrado.
              </td>
            </tr>
          )}
          {implementos.map((imp, idx) => (
            <tr key={imp._id} style={{ borderBottom: "1px solid #ccc" }}>
              <td style={{ padding: "12px 8px" }}>{idx + 1}</td>
              <td style={{ padding: "12px 8px" }}>{imp.tipo}</td>
              <td style={{ padding: "12px 8px" }}>{imp.marca}</td>
              <td style={{ padding: "12px 8px" }}>{imp.modelo}</td>
              <td style={{ padding: "12px 8px" }}>{imp.status}</td>
              <td style={{ padding: "8px" }}>
                {imp.foto ? (
                  <img src={imp.foto} alt="Foto do implemento" style={{ width: 60, borderRadius: 4 }} />
                ) : (
                  "Sem foto"
                )}
              </td>
              <td style={{ textAlign: "center", padding: "12px 8px" }}>
                <Link to={`/implementos/${imp._id}`} style={btnDetalhes}>
                  Mais detalhes
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
