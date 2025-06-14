import React from "react";
import ListImplemento from "./ListImplemento";
import { Link } from "react-router-dom";

export default function Implementos() {
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
           marginBottom: "30px",
         }}
       >
         <Link style={btnCadastrar} to="/implementos/create">
           + novo implemento
         </Link>
       </div>
 
       <ListImplemento implemento={Implementos} />
     </div>
   );
}
