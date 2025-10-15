import React, { useState } from "react";
import UserListOperador from "./userListOperador";
import CreateOperador from "./CreateOperador";

export default function Operadores() {
  const [showModal, setShowModal] = useState(false);

  // estilos do botão iguais ao do componente Associados
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

  const modalBackdrop = {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100vw",
    height: "100vh",
    backgroundColor: "rgba(0,0,0,0.3)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
    overflowY: "auto",
    padding: "20px",
  };

  return (
    <div style={{ padding: "20px", fontFamily: "'Segoe UI', sans-serif" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          marginBottom: "30px",
        }}
      >
        <button
          style={btnCadastrar}
          onClick={() => setShowModal(true)}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#163F33")}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#1B4D3E")}
        >
          <span style={plusStyle}>+</span> Novo operador
        </button>
      </div>

      <UserListOperador />

      {showModal && (
        <div style={modalBackdrop} onClick={() => setShowModal(false)}>
          <div onClick={(e) => e.stopPropagation()}>
            <CreateOperador onClose={() => setShowModal(false)} />
          </div>
        </div>
      )}
    </div>
  );
}
