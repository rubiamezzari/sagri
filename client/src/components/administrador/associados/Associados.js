import React, { useEffect, useState } from "react";
import UserListAssociado from "./userListAssociado";
import CreateAssociado from "./CreateAssociado";

const API_URL = "http://localhost:5050";

export default function Associados() {
  const [associados, setAssociados] = useState([]);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchAssociados();
  }, []);

  async function fetchAssociados() {
    try {
      const res = await fetch(`${API_URL}/associados`);
      const data = await res.json();
      setAssociados(data);
    } catch (err) {
      console.error("Erro ao buscar associados:", err);
    }
  }

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
          onMouseEnter={(e) =>
            (e.currentTarget.style.backgroundColor = "#163F33")
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.backgroundColor = "#1B4D3E")
          }
        >
          <span style={plusStyle}>+</span> Novo associado
        </button>
      </div>

      <UserListAssociado associados={associados} />

      {showModal && (
        <div style={modalBackdrop} onClick={() => setShowModal(false)}>
          <div onClick={(e) => e.stopPropagation()}>
            <CreateAssociado
              onClose={() => {
                setShowModal(false);
                fetchAssociados(); // atualiza a lista após cadastrar
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
