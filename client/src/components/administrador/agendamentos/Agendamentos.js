import React from "react";
import ListSolicitacao from "./ListSolicitacao";
import { Link } from "react-router-dom";
import ListServicos from "../servicos/ListServicos";

export default function agendamento() {
  

  return (
     <div style={{ padding: "20px" }}>
       
 
       <ListSolicitacao agendamento={agendamento} />
     </div>
   );
}
