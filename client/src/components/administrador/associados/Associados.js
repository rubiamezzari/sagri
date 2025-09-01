import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import UserListAssociado from "./userListAssociado";

export default function Associados() {
  const [associados, setAssociados] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5050/associados")
      .then(res => res.json())
      .then(data => setAssociados(data))
      .catch(err => console.error("Erro ao buscar associados:", err));
  }, []);

  const btnCadastrar = {
    backgroundColor: "#D2EFE6",
    color: "#000",
    padding: "5px 15px",
    borderRadius: "12px",
    border: "1px solid #1B4D3E",
    cursor: "pointer",
    fontWeight: "500",
    textDecoration: "none",
  };

  return (
    <div style={{ padding: "20px" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          marginBottom: "30px",
        }}
      >
        <Link style={btnCadastrar} to="/associados/create">
          + Novo associado
        </Link>
      </div>

      <UserListAssociado associados={associados} />
    </div>
  );
}
