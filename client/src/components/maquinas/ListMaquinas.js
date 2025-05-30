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

export default function ListMaquinas() {
  const [maquinas, setMaquinas] = useState([]);

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
          {maquinas.length === 0 && (
            <tr>
              <td colSpan={7} style={{ padding: "12px 0" }}>
                Nenhuma máquina cadastrada.
              </td>
            </tr>
          )}
          {maquinas.map((maq, idx) => (
            <tr key={maq._id} style={{ borderBottom: "1px solid #ccc" }}>
              <td style={{ padding: "12px 8px" }}>{idx + 1}</td>
              <td style={{ padding: "12px 8px" }}>{maq.tipo}</td>
              <td style={{ padding: "12px 8px" }}>{maq.marca}</td>
              <td style={{ padding: "12px 8px" }}>{maq.modelo}</td>
              <td style={{ padding: "12px 8px" }}>{maq.status}</td>
              <td style={{ padding: "8px" }}>
                {maq.foto ? (
                  <img src={maq.foto} alt="Foto da máquina" style={{ width: 60, borderRadius: 4 }} />
                ) : (
                  "Sem foto"
                )}
              </td>
              <td style={{ textAlign: "center", padding: "12px 8px" }}>
                <Link to={`/maquinas/${maq._id}`} style={btnDetalhes}>
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
