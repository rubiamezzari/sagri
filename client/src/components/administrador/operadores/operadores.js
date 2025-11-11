"use client"

import { useState, useEffect } from "react"
import UserListOperador from "./userListOperador"
import CreateOperador from "./CreateOperador"

const API_URL = "http://localhost:5050"

export default function Operadores() {
  const [showModal, setShowModal] = useState(false)
  const [operadores, setOperadores] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchOperadores()
  }, [])

  const fetchOperadores = async () => {
    try {
      const response = await fetch(`${API_URL}/operadores`)
      const data = await response.json()
      setOperadores(data)
    } catch (error) {
      console.error("Erro ao buscar operadores:", error)
      setOperadores([])
    } finally {
      setLoading(false)
    }
  }

  const handleOperadorCreated = () => {
    fetchOperadores()
    setShowModal(false)
  }

  const btnCadastrar = {
    backgroundColor: "#1B4D3E",
    color: "#FFFFFF",
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
  }

  const btnCadastrarCentro = {
    ...btnCadastrar,
    padding: "12px 32px",
    fontSize: "16px",
  }

  const plusStyle = {
    color: "#A8E6CF",
    fontSize: "22px",
    fontWeight: "700",
    marginRight: "4px",
  }

  const modalBackdrop = {
    position: "fixed" ,
    top: 0,
    left: 0,
    width: "100vw",
    height: "100vh",
    backgroundColor: "rgba(0,0,0,0.3)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
    overflowY: "auto" ,
    padding: "20px",
  }

  const emptyStateContainer = {
    display: "flex",
    flexDirection: "column" ,
    alignItems: "center",
    justifyContent: "center",
    minHeight: "60vh",
    gap: "20px",
  }

  const emptyStateText = {
    fontSize: "18px",
    color: "#666",
    textAlign: "center",
    marginBottom: "10px",
  }

  if (loading) {
    return (
      <div style={{ padding: "20px", textAlign: "center" }}>
        <p>Carregando...</p>
      </div>
    )
  }

  if (operadores.length === 0) {
    return (
      <div style={{ padding: "20px", fontFamily: "'Segoe UI', sans-serif" }}>
        <div style={emptyStateContainer}>
          <p style={emptyStateText}>Nenhum operador cadastrado</p>
          <button
            style={btnCadastrarCentro}
            onClick={() => setShowModal(true)}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#163F33")}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#1B4D3E")}
          >
            <span style={plusStyle}>+</span> Cadastrar primeiro operador
          </button>
        </div>

        {showModal && (
          <div style={modalBackdrop} onClick={() => setShowModal(false)}>
            <div onClick={(e) => e.stopPropagation()}>
              <CreateOperador onClose={handleOperadorCreated} />
            </div>
          </div>
        )}
      </div>
    )
  }

  return (
    <div style={{ padding: "20px", fontFamily: "'Segoe UI', sans-serif" }}>
      <UserListOperador operadores={operadores} onUpdate={fetchOperadores} />

      {showModal && (
        <div style={modalBackdrop} onClick={() => setShowModal(false)}>
          <div onClick={(e) => e.stopPropagation()}>
            <CreateOperador onClose={handleOperadorCreated} />
          </div>
        </div>
      )}
    </div>
  )
}
