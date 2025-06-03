import React from "react";
import UserListOperador from "./UserListOperador";
import { Link } from "react-router-dom";

export default function operadores() {
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
          alignItems: "center",
          flexWrap: "wrap",
          gap: "10px",
          marginBottom: "20px",
        }}
      >
        <Link style={btnCadastrar} to="/operadores/create">
          + novo operador
        </Link>
      </div>
      <UserListOperador />
    </div>
  );
}
