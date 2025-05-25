import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const REACT_APP_YOUR_HOSTNAME = "http://localhost:5050";

// Estilo do botão "Mais detalhes"
const btnDetalhes = {
  backgroundColor: "#1c3d21",
  color: "#fff",
  padding: "5px 12px",
  borderRadius: "4px",
  fontSize: "0.75rem",
  border: "none",
  cursor: "pointer",
  fontWeight: "500",
  textDecoration:"none",
};

export default function UserListAssociado() {
  const [associados, setAssociados] = useState([]);

  useEffect(() => {
    async function getAssociados() {
      const response = await fetch(`${REACT_APP_YOUR_HOSTNAME}/associados/`);

      if (!response.ok) {
        const message = `Ocorreu um erro: ${response.statusText}`;
        window.alert(message);
        return;
      }

      const associados = await response.json();
      setAssociados(associados);
    }

    getAssociados();
  }, []);

  function associadoList() {
    return associados.map((associado, index) => (
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
    ));
  }

  return (
    <div
      style={{
        backgroundColor: "#fff",
        padding: "20px",
        borderRadius: "5px",
      }}
    >
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
            <th style={{ padding: "12px 0" }}>Nome completo</th>
            <th style={{ padding: "12px 0" }}>Telefone</th>
            <th style={{ padding: "12px 0" }}>CPF</th>
            <th style={{ padding: "12px 0" }}>Bairro</th>
            <th style={{ padding: "12px 0" }}></th>
          </tr>
        </thead>
        <tbody>{associadoList()}</tbody>
      </table>
    </div>
  );
}
