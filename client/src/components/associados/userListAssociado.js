import React, { useState } from "react";
import { Link } from "react-router-dom";

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


export default function UserListAssociado({ associados }) {
  const [busca, setBusca] = useState("");

  const associadosFiltrados = associados.filter((associado) =>
    associado.nome?.toLowerCase().includes(busca.toLowerCase()) ||
    associado.telefone?.toLowerCase().includes(busca.toLowerCase()) ||
    associado.cpf?.toLowerCase().includes(busca.toLowerCase()) ||
    associado.endereco?.bairro?.toLowerCase().includes(busca.toLowerCase())
  );

  return (
    <div style={{ width: "100%", backgroundColor: "#fff", padding: "20px", borderRadius: "5px", }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", }}>
        <input
          type="text"
          placeholder="Pesquisar associado..."
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
      <table style={{
        width: "100%",
        borderCollapse: "collapse",
        fontSize: "0.85rem",
        textAlign: "center"
      }}>

        <thead style={{
          backgroundColor: "#f8f8f8",
          fontWeight: "600"
        }}>
          <tr style={{ borderBottom: "1px solid #ccc" }}>
            <th style={{ padding: "12px 0" }}>#</th>
            <th style={{ padding: "12px 0" }}>Nome completo</th>
            <th style={{ padding: "12px 0" }}>Telefone</th>
            <th style={{ padding: "12px 0" }}>CPF</th>
            <th style={{ padding: "12px 0" }}>Bairro</th>
            <th style={{ padding: "12px 0" }}></th>
          </tr>
        </thead>
        <tbody>
          {associadosFiltrados.length === 0 ? (
            <tr>
              <td colSpan={6} style={{ padding: "12px 0" }}>
                Nenhum associado encontrado.
              </td>
            </tr>
          ) : (
            associadosFiltrados.map((associado, index) => (
              <tr key={associado._id} style={{ borderBottom: "1px solid #ccc" }}>
                <td style={{ padding: "12px 8px" }}>{index + 1}</td>
                <td style={{ padding: "12px 8px" }}>{associado.nome?.toUpperCase()}</td>
                <td style={{ padding: "12px 8px" }}>{associado.telefone}</td>
                <td style={{ padding: "12px 8px" }}>{associado.cpf}</td>
                <td style={{ padding: "12px 8px" }}>{associado.endereco?.bairro?.toUpperCase()}</td>
                <td style={{ textAlign: "center", padding: "12px 8px" }}>
                  <Link style={btnDetalhes} to={`/associados/${associado._id}`}>
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
