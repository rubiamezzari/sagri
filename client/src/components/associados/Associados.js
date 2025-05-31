import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import UserListAssociado from "./userListAssociado";

export default function Associados() {
  const [associados, setAssociados] = useState([]);
  const [filtro, setFiltro] = useState("");

  useEffect(() => {
    fetch("http://localhost:5050/associados")
      .then(res => res.json())
      .then(data => setAssociados(data))
      .catch(err => console.error("Erro ao buscar associados:", err));
  }, []);

  const btnCadastrar = {
    backgroundColor: "#ccedbf",
    color: "#000",
    padding: "8px 14px",
    borderRadius: "6px",
    border: "1px solid #1c3d21",
    cursor: "pointer",
    fontWeight: "500",
    textDecoration: "none",
    display: "flex",
    alignItems: "center",
    height: "38px",
  };

  const inputStyle = {
    color: "#ccedbf",
    padding: "8px 12px",
    width: "100%",
    maxWidth: "400px",
    borderRadius: "6px",
    border: "0.1px solid #ccedbf",
    outline: "none",
    fontSize: "0.9rem",
    height: "38px",
  };

  const associadosFiltrados = associados.filter(assoc =>
    assoc.nome.toLowerCase().includes(filtro.toLowerCase()) ||
    assoc.cpf.includes(filtro) ||
    assoc.telefone.includes(filtro) ||
    (assoc.endereco?.bairro || "").toLowerCase().includes(filtro.toLowerCase())
  );

  return (
    <div style={{ padding: "20px" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "10px",
          marginBottom: "20px",
        }}
      >
        <input
          type="text"
          placeholder="Pesquisar por nome, CPF, telefone ou bairro..."
          value={filtro}
          onChange={e => setFiltro(e.target.value)}
          style={inputStyle}
        />

        <Link style={btnCadastrar} to="/associados/create">
          + novo associado
        </Link>
      </div>

      <UserListAssociado associados={associadosFiltrados} />
    </div>
  );
}
