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
    backgroundColor: "#ccedbf",
    color: "#000",
    padding: "5px 15px",
    borderRadius: "5px",
    border: "1px solid #1c3d21",
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
          + novo associado
        </Link>
      </div>

      <UserListAssociado associados={associados} />
    </div>
  );
}
