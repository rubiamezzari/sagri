import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import ListServicos from "./ListServicos"; 

// Estilos em JS (inline)
const containerStyle = {
  padding: "20px",
  maxWidth: "1000px",
  margin: "0 auto",
};

const headerStyle = {
  display: "flex",
  justifyContent: "flex-end",
  alignItems: "center",
  marginBottom: "20px",
};

const buttonStyle = {
  padding: "6px 20px",
  backgroundColor: "#daf4d0",
  color: "#1a381f",
  border: "1.5px solid #1a381f",
  borderRadius: "5px",
  cursor: "pointer",
  fontWeight: "600",
  fontSize: "1rem",
  transition: "background-color 0.3s",
};

const buttonHoverStyle = {
  backgroundColor: "#c2ddb7",
};

export default function Servicos() {
  const navigate = useNavigate();
  const [hover, setHover] = useState(false);

  const handleCadastrarClick = () => {
    navigate("/servicos/create"); // essa rota precisa estar configurada no App.js
  };

  return (
    <div style={containerStyle}>
      <header style={headerStyle}>
        <button
          style={hover ? { ...buttonStyle, ...buttonHoverStyle } : buttonStyle}
          onClick={handleCadastrarClick}
          onMouseEnter={() => setHover(true)}
          onMouseLeave={() => setHover(false)}
        >
          + serviço
        </button>
      </header>

      <ListServicos /> {/* Lista de serviços em quadrados */}
    </div>
  );
}
