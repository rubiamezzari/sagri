import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import ListServicos from "./ListServicos"; 

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

  const btnCadastrar = {
    backgroundColor: "#1B4D3E", // verde escuro
    color: "#FFFFFF", // texto branco
    padding: "6px 20px",
    borderRadius: "12px",
    border: "none",
    cursor: "pointer",
    fontWeight: "600",
    fontSize: "15px",
    display: "flex",
    alignItems: "center",
    gap: "8px",
    transition: "0.3s",
  };

  

const buttonHoverStyle = {
  backgroundColor: "#c2ddb7",
};

export default function Servicos() {
  const navigate = useNavigate();
  const [hover, setHover] = useState(false);

  const handleCadastrarClick = () => {
    navigate("/servicos/create");
  };

  return (
    <div style={containerStyle}>
    

      <ListServicos /> 
    </div>
  );
}
