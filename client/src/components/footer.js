import React from "react";
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap/dist/js/bootstrap.bundle";

export default function Footer() {
  return (
    <footer style={{ backgroundColor: "#ccedbf" }} className="text-dark py-4 shadow-sm">
      <div className="container text-center">
        <h5 className="mb-2 " style={{ color: "#000" }}>
          SAGRI - Sistema de Agendamento de Maquinário Agrícola
        </h5>
        <p className="mb-0" style={{ fontSize: "0.95rem", color:"000" }}>
          Conselho Municipal de Desenvolvimento Agropecuário do Campo, Balneário Gaivota - SC
        </p>
      </div>
    </footer>
  );
}
