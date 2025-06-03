import React, { useEffect, useState } from "react";
import ListMaquinas from "./ListMaquinas";
import { Link } from "react-router-dom";

export default function Maquinas() {
  const [maquinas, setMaquinas] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5050/maquinas")
      .then(res => res.json())
      .then(data => setMaquinas(data))
      .catch(err => console.error("Erro ao buscar máquinas:", err));
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
          alignItems: "center",
          flexWrap: "wrap",
          marginBottom: "20px",
        }}
      >
        <Link style={btnCadastrar} to="/maquinas/create">
          + nova máquina
        </Link>
      </div>

      <ListMaquinas maquinas={maquinas} />
    </div>
  );
}
