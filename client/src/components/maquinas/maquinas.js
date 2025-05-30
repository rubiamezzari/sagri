import React from "react";
import ListMaquinas from "./ListMaquinas";
import { Link } from "react-router-dom";

export default function Maquinas() {
  const btnCadastrar = {
    backgroundColor: "#ccedbf",
    color: "#000",
    padding: "5px 16px",
    borderRadius: "5px",
    border: "1px solid #1c3d21",
    cursor: "pointer",
    fontWeight: "500",
    textDecoration: "none",
  };

  return (
    <div style={{ padding: "20px" }}>
      <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "15px" }}>
        <Link style={btnCadastrar} to="/maquinas/create">
          + nova máquina
        </Link>
      </div>
      <ListMaquinas />
    </div>
  );
}
