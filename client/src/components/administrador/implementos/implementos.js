import React from "react";
import ListImplemento from "./ListImplemento";
import { Link } from "react-router-dom";

export default function Implementos() {
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

  const plusStyle = {
    color: "#A8E6CF", // verde claro
    fontSize: "22px",
    fontWeight: "700",
    marginRight: "4px",
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
         <Link style={btnCadastrar} to="/implementos/create"><span style={plusStyle}>+</span> Implemento
         </Link>
       </div>
 
       <ListImplemento implemento={Implementos} />
     </div>
   );
}
