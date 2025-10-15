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
    backgroundColor: "#D2EFE6",
    color: "#000",
    padding: "5px 15px",
    borderRadius: "12px",
    border: "1px solid #1A381F",
    cursor: "pointer",
    fontWeight: "500",
    textDecoration: "none",
  };

  return (
    <div style={{ padding: "20px" }}>
      

      <ListMaquinas maquinas={maquinas} />
    </div>
  );
}
