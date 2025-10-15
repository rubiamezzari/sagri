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

const buttonStyle = {
  padding: "4px 20px",
  backgroundColor: "#D2EFE6",
  color: "#1a381f",
  border: "1.5px solid #1a381f",
  borderRadius: "12px",
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
    navigate("/servicos/create");
  };

  return (
    <div style={containerStyle}>
    

      <ListServicos /> 
    </div>
  );
}
