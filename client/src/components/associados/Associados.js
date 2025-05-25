import React from "react";
import UserListAssociado from "./userListAssociado";
import { Link } from "react-router-dom";

export default function Associados() {
  const btnCadastrar = {
    backgroundColor: "#ccedbf",
    color: "#000",
    padding: "5px 16px",
    borderRadius: "5px",
    border: "1px dashed #1c3d21",
    cursor: "pointer",
    fontWeight: "500",
    textDecoration: "none",
  };

  return (
    <div style={{ padding: "20px" }}>
      <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "15px" }}>
        <Link style={btnCadastrar} to="/associados/create">
          + novo cadastro
        </Link>
      </div>
      <UserListAssociado />
    </div>
  );
}
