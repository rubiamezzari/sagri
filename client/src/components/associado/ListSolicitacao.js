"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Search, FileText, Trash2, X } from "lucide-react"

const API_URL = "http://localhost:5050"

const Detalhes = ({ solicitacao, handleDelete, handleCancel }) => {
  const horasTotais =
    solicitacao.horimetro_inicial != null && solicitacao.horimetro_final != null
      ? Number(solicitacao.horimetro_final) - Number(solicitacao.horimetro_inicial)
      : null

  return (
    <div
      style={{
        padding: "24px 28px",
        borderTop: "1px solid #F3F4F6",
      }}
    >
      {solicitacao.status?.toLowerCase() === "recusado" && solicitacao.motivo_recusa && (
        <div
          style={{
            padding: "20px",
            backgroundColor: "#FEF2F2",
            borderRadius: "12px",
            border: "2px solid #FEE2E2",
            marginBottom: "24px",
          }}
        >
          <div
            style={{
              fontSize: "12px",
              color: "#991B1B",
              fontWeight: "700",
              marginBottom: "10px",
              textTransform: "uppercase",
              letterSpacing: "0.5px",
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <svg style={{ width: "16px", height: "16px" }} fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clipRule="evenodd"
              />
            </svg>
            Motivo da Recusa
          </div>
          <div style={{ fontSize: "15px", color: "#7F1D1D", lineHeight: "1.7", fontWeight: "600" }}>
            {solicitacao.motivo_recusa}
          </div>
        </div>
      )}

      {/* Details Grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
          gap: "14px",
          marginBottom: "20px",
        }}
      >
        {/* Data */}
        <div
          style={{
            padding: "14px 16px",
            backgroundColor: "#F9FAFB",
            borderRadius: "10px",
            border: "1px solid #E5E7EB",
          }}
        >
          <div
            style={{
              fontSize: "11px",
              color: "#6B7280",
              fontWeight: "600",
              marginBottom: "5px",
              textTransform: "uppercase",
              letterSpacing: "0.5px",
            }}
          >
            Data do Serviço
          </div>
          <div style={{ fontSize: "14px", color: "#1B4D3E", fontWeight: "600" }}>
            {new Date(solicitacao.data_servico).toLocaleDateString("pt-BR", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            })}
          </div>
        </div>

        {/* Hora */}
        <div
          style={{
            padding: "14px 16px",
            backgroundColor: "#F9FAFB",
            borderRadius: "10px",
            border: "1px solid #E5E7EB",
          }}
        >
          <div
            style={{
              fontSize: "11px",
              color: "#6B7280",
              fontWeight: "600",
              marginBottom: "5px",
              textTransform: "uppercase",
              letterSpacing: "0.5px",
            }}
          >
            Horário
          </div>
          <div style={{ fontSize: "14px", color: "#1B4D3E", fontWeight: "600" }}>{solicitacao.hora || "--:--"}</div>
        </div>

        {/* Tempo Estimado */}
        {solicitacao.tempo_estimado && (
          <div
            style={{
              padding: "14px 16px",
              backgroundColor: "#F9FAFB",
              borderRadius: "10px",
              border: "1px solid #E5E7EB",
            }}
          >
            <div
              style={{
                fontSize: "11px",
                color: "#6B7280",
                fontWeight: "600",
                marginBottom: "5px",
                textTransform: "uppercase",
                letterSpacing: "0.5px",
              }}
            >
              Tempo Estimado
            </div>
            <div style={{ fontSize: "14px", color: "#1B4D3E", fontWeight: "600" }}>{solicitacao.tempo_estimado}</div>
          </div>
        )}

        {/* Data de Solicitação */}
        <div
          style={{
            padding: "14px 16px",
            backgroundColor: "#F9FAFB",
            borderRadius: "10px",
            border: "1px solid #E5E7EB",
          }}
        >
          <div
            style={{
              fontSize: "11px",
              color: "#6B7280",
              fontWeight: "600",
              marginBottom: "5px",
              textTransform: "uppercase",
              letterSpacing: "0.5px",
            }}
          >
            Solicitado em
          </div>
          <div style={{ fontSize: "14px", color: "#1B4D3E", fontWeight: "600" }}>
            {new Date(solicitacao.data_solicitacao).toLocaleDateString("pt-BR", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            })}
          </div>
        </div>
      </div>

      {/* Máquina */}
      {solicitacao.maquina_id && (
        <div
          style={{
            padding: "14px 16px",
            backgroundColor: "#F9FAFB",
            borderRadius: "10px",
            border: "1px solid #E5E7EB",
            marginBottom: "20px",
          }}
        >
          <div
            style={{
              fontSize: "11px",
              color: "#6B7280",
              fontWeight: "600",
              marginBottom: "5px",
              textTransform: "uppercase",
              letterSpacing: "0.5px",
            }}
          >
            Máquina
          </div>
          <div style={{ fontSize: "14px", color: "#1B4D3E", fontWeight: "600" }}>{solicitacao.maquina_id}</div>
        </div>
      )}

      {/* Observação */}
      {solicitacao.observacao && (
        <div
          style={{
            padding: "14px 16px",
            backgroundColor: "#F9FAFB",
            borderRadius: "10px",
            border: "1px solid #E5E7EB",
            marginBottom: "20px",
          }}
        >
          <div
            style={{
              fontSize: "11px",
              color: "#6B7280",
              fontWeight: "600",
              marginBottom: "6px",
              textTransform: "uppercase",
              letterSpacing: "0.5px",
            }}
          >
            Observação
          </div>
          <div style={{ fontSize: "14px", color: "#374151", lineHeight: "1.6" }}>{solicitacao.observacao}</div>
        </div>
      )}

      {/* Horímetro - quando houver dados */}
      {horasTotais != null && (
        <div
          style={{
            padding: "18px 20px",
            backgroundColor: "#ECFDF5",
            borderRadius: "12px",
            marginBottom: "16px",
            border: "1px solid #A7F3D0",
          }}
        >
          <div
            style={{
              fontSize: "11px",
              color: "#065F46",
              fontWeight: "600",
              marginBottom: "6px",
              textTransform: "uppercase",
              letterSpacing: "0.5px",
            }}
          >
            Horas Trabalhadas
          </div>
          <div style={{ fontSize: "28px", color: "#065F46", fontWeight: "700" }}>{horasTotais}h</div>
          <div style={{ fontSize: "12px", color: "#065F46", marginTop: "4px", opacity: 0.8 }}>
            Inicial: {solicitacao.horimetro_inicial}h • Final: {solicitacao.horimetro_final}h
          </div>
        </div>
      )}

      {/* Action Buttons */}
      {solicitacao.status?.toLowerCase() === "pendente" && (
        <div style={{ display: "flex", gap: "10px", marginTop: "20px" }}>
          <button
            onClick={(e) => {
              e.stopPropagation()
              handleCancel(solicitacao._id)
            }}
            style={{
              flex: 1,
              padding: "10px 16px",
              backgroundColor: "#fff",
              color: "#6B7280",
              border: "1px solid #E5E7EB",
              borderRadius: "8px",
              fontSize: "14px",
              fontWeight: "600",
              cursor: "pointer",
              transition: "all 0.3s ease",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "#F9FAFB"
              e.currentTarget.style.borderColor = "#D1D5DB"
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "#fff"
              e.currentTarget.style.borderColor = "#E5E7EB"
            }}
          >
            <X size={16} />
            Cancelar Solicitação
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation()
              handleDelete(solicitacao._id)
            }}
            style={{
              flex: 1,
              padding: "10px 16px",
              backgroundColor: "#FEF2F2",
              color: "#991B1B",
              border: "1px solid #FEE2E2",
              borderRadius: "8px",
              fontSize: "14px",
              fontWeight: "600",
              cursor: "pointer",
              transition: "all 0.3s ease",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "#FEE2E2"
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "#FEF2F2"
            }}
          >
            <Trash2 size={16} />
            Excluir
          </button>
        </div>
      )}
    </div>
  )
}

export default function MinhasSolicitacoes() {
  const [solicitacoes, setSolicitacoes] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [loading, setLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState("todos")
  const [modalSolicitacao, setModalSolicitacao] = useState(null)

  useEffect(() => {
    const usuarioLogado = JSON.parse(localStorage.getItem("usuarioLogado"))
    if (!usuarioLogado?._id) {
      setLoading(false)
      return
    }

    setLoading(true)
    fetch(`${API_URL}/solicitacoes/usuario/${usuarioLogado._id}`)
      .then((res) => res.json())
      .then((data) => {
        setSolicitacoes(data.reverse())
        setLoading(false)
      })
      .catch((err) => {
        console.error(err)
        setLoading(false)
      })
  }, [])

  const getStatusBadge = (status) => {
    const styles = {
      pendente: {
        backgroundColor: "#FFF9E6",
        color: "#8B6914",
      },
      aprovado: {
        backgroundColor: "#E8F5E9",
        color: "#1B5E20",
      },
      recusado: {
        backgroundColor: "#FBE9E7",
        color: "#BF360C",
      },
      cancelado: {
        backgroundColor: "#F5F5F5",
        color: "#757575",
      },
      concluido: {
        backgroundColor: "#E0F2F1",
        color: "#00695C",
      },
    }

    const style = styles[status?.toLowerCase()] || {
      backgroundColor: "#F5F5F5",
      color: "#757575",
    }

    return (
      <div
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "8px",
          padding: "8px 14px",
          borderRadius: "20px",
          fontSize: "13px",
          fontWeight: "600",
          textTransform: "capitalize",
          backgroundColor: style.backgroundColor,
          color: style.color,
        }}
      >
        {status || "Pendente"}
      </div>
    )
  }

  const handleDelete = async (id) => {
    if (!window.confirm("Deseja realmente excluir esta solicitação?")) return
    try {
      await fetch(`${API_URL}/solicitacoes/${id}`, { method: "DELETE" })
      setSolicitacoes((old) => old.filter((s) => s._id !== id))
      setModalSolicitacao(null)
    } catch (err) {
      console.error(err)
      alert("Erro ao excluir.")
    }
  }

  const handleCancel = async (id) => {
    if (!window.confirm("Cancelar esta solicitação?")) return
    try {
      await fetch(`${API_URL}/solicitacoes/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "Cancelado" }),
      })
      setSolicitacoes((old) => old.map((s) => (s._id === id ? { ...s, status: "Cancelado" } : s)))
      setModalSolicitacao(null)
    } catch (err) {
      console.warn("Falha ao notificar servidor sobre cancelamento:", err)
      alert("Erro ao cancelar.")
    }
  }

  const filtered = solicitacoes.filter((s) => {
    const matchesSearch = s.tipoServico?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "todos" || s.status?.toLowerCase() === statusFilter
    return matchesSearch && matchesStatus
  })

  const countByStatus = {
    todos: solicitacoes.length,
    pendente: solicitacoes.filter((s) => s.status?.toLowerCase() === "pendente").length,
    aprovado: solicitacoes.filter((s) => s.status?.toLowerCase() === "aprovado").length,
    recusado: solicitacoes.filter((s) => s.status?.toLowerCase() === "recusado").length,
    concluido: solicitacoes.filter((s) => s.status?.toLowerCase() === "concluido").length,
  }

  if (loading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div style={{ textAlign: "center" }}>
          <div
            style={{
              width: "48px",
              height: "48px",
              border: "4px solid #E5E7EB",
              borderTop: "4px solid #1B4D3E",
              borderRadius: "50%",
              animation: "spin 1s linear infinite",
              margin: "0 auto 20px",
            }}
          />
          <p style={{ color: "#1B4D3E", fontWeight: "500" }}>Carregando solicitações...</p>
        </div>
        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    )
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        padding: "40px 20px",
      }}
    >
      <div
        style={{
          maxWidth: "1000px",
          margin: "0 auto",
        }}
      >
        {/* Header */}
        <div style={{ marginBottom: "32px" }}>
          <h1
            style={{
              fontSize: "32px",
              fontWeight: "700",
              color: "#1B4D3E",
              margin: "0 0 8px 0",
            }}
          >
            Minhas Solicitações
          </h1>
          <p style={{ fontSize: "15px", color: "#6B7280", margin: 0 }}>
            Acompanhe o status de todas as suas solicitações de serviço
          </p>
        </div>

        {/* Search Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          style={{ marginBottom: "24px", position: "relative" }}
        >
          <Search
            size={18}
            style={{
              position: "absolute",
              left: "14px",
              top: "50%",
              transform: "translateY(-50%)",
              color: "#9CA3AF",
            }}
          />
          <input
            type="text"
            placeholder="Buscar por tipo de serviço..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              width: "100%",
              padding: "12px 14px 12px 44px",
              borderRadius: "12px",
              border: "2px solid #E5E7EB",
              backgroundColor: "#fff",
              fontSize: "14px",
              outline: "none",
              transition: "all 0.2s ease",
              boxShadow: "0 1px 2px rgba(0, 0, 0, 0.05)",
              boxSizing: "border-box",
            }}
            onFocus={(e) => {
              e.target.style.borderColor = "#1B4D3E"
              e.target.style.boxShadow = `0 0 0 3px rgba(27, 77, 62, 0.1)`
            }}
            onBlur={(e) => {
              e.target.style.borderColor = "#E5E7EB"
              e.target.style.boxShadow = "0 1px 2px rgba(0, 0, 0, 0.05)"
            }}
          />
        </motion.div>

        {/* Status Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          style={{ marginBottom: "32px" }}
        >
          <div
            style={{
              backgroundColor: "#fff",
              borderRadius: "12px",
              padding: "8px",
              boxShadow: "0 2px 8px rgba(0, 0, 0, 0.06)",
              display: "inline-flex",
              gap: "8px",
              flexWrap: "wrap",
            }}
          >
            <button
              onClick={() => setStatusFilter("todos")}
              style={{
                padding: "10px 20px",
                borderRadius: "8px",
                border: "none",
                backgroundColor: statusFilter === "todos" ? "#1B4D3E" : "transparent",
                color: statusFilter === "todos" ? "#fff" : "#6B7280",
                fontSize: "14px",
                fontWeight: "600",
                cursor: "pointer",
                transition: "all 0.2s ease",
                display: "flex",
                alignItems: "center",
                gap: "6px",
              }}
            >
              Todos
              <span
                style={{
                  backgroundColor: statusFilter === "todos" ? "rgba(255,255,255,0.25)" : "#E5E7EB",
                  color: statusFilter === "todos" ? "#fff" : "#6B7280",
                  padding: "2px 8px",
                  borderRadius: "12px",
                  fontSize: "12px",
                  fontWeight: "600",
                }}
              >
                {countByStatus.todos}
              </span>
            </button>

            <button
              onClick={() => setStatusFilter("pendente")}
              style={{
                padding: "10px 20px",
                borderRadius: "8px",
                border: "none",
                backgroundColor: statusFilter === "pendente" ? "#1B4D3E" : "transparent",
                color: statusFilter === "pendente" ? "#fff" : "#6B7280",
                fontSize: "14px",
                fontWeight: "600",
                cursor: "pointer",
                transition: "all 0.2s ease",
                display: "flex",
                alignItems: "center",
                gap: "6px",
              }}
            >
              Pendentes
              <span
                style={{
                  backgroundColor: statusFilter === "pendente" ? "rgba(255,255,255,0.25)" : "#FFF9E6",
                  color: statusFilter === "pendente" ? "#fff" : "#8B6914",
                  padding: "2px 8px",
                  borderRadius: "12px",
                  fontSize: "12px",
                  fontWeight: "600",
                }}
              >
                {countByStatus.pendente}
              </span>
            </button>

            <button
              onClick={() => setStatusFilter("aprovado")}
              style={{
                padding: "10px 20px",
                borderRadius: "8px",
                border: "none",
                backgroundColor: statusFilter === "aprovado" ? "#1B4D3E" : "transparent",
                color: statusFilter === "aprovado" ? "#fff" : "#6B7280",
                fontSize: "14px",
                fontWeight: "600",
                cursor: "pointer",
                transition: "all 0.2s ease",
                display: "flex",
                alignItems: "center",
                gap: "6px",
              }}
            >
              Aprovados
              <span
                style={{
                  backgroundColor: statusFilter === "aprovado" ? "rgba(255,255,255,0.25)" : "#E8F5E9",
                  color: statusFilter === "aprovado" ? "#fff" : "#1B5E20",
                  padding: "2px 8px",
                  borderRadius: "12px",
                  fontSize: "12px",
                  fontWeight: "600",
                }}
              >
                {countByStatus.aprovado}
              </span>
            </button>

            <button
              onClick={() => setStatusFilter("concluido")}
              style={{
                padding: "10px 20px",
                borderRadius: "8px",
                border: "none",
                backgroundColor: statusFilter === "concluido" ? "#1B4D3E" : "transparent",
                color: statusFilter === "concluido" ? "#fff" : "#6B7280",
                fontSize: "14px",
                fontWeight: "600",
                cursor: "pointer",
                transition: "all 0.2s ease",
                display: "flex",
                alignItems: "center",
                gap: "6px",
              }}
            >
              Concluídos
              <span
                style={{
                  backgroundColor: statusFilter === "concluido" ? "rgba(255,255,255,0.25)" : "#E0F2F1",
                  color: statusFilter === "concluido" ? "#fff" : "#00695C",
                  padding: "2px 8px",
                  borderRadius: "12px",
                  fontSize: "12px",
                  fontWeight: "600",
                }}
              >
                {countByStatus.concluido}
              </span>
            </button>

            <button
              onClick={() => setStatusFilter("recusado")}
              style={{
                padding: "10px 20px",
                borderRadius: "8px",
                border: "none",
                backgroundColor: statusFilter === "recusado" ? "#1B4D3E" : "transparent",
                color: statusFilter === "recusado" ? "#fff" : "#6B7280",
                fontSize: "14px",
                fontWeight: "600",
                cursor: "pointer",
                transition: "all 0.2s ease",
                display: "flex",
                alignItems: "center",
                gap: "6px",
              }}
            >
              Recusados
              <span
                style={{
                  backgroundColor: statusFilter === "recusado" ? "rgba(255,255,255,0.25)" : "#FBE9E7",
                  color: statusFilter === "recusado" ? "#fff" : "#BF360C",
                  padding: "2px 8px",
                  borderRadius: "12px",
                  fontSize: "12px",
                  fontWeight: "600",
                }}
              >
                {countByStatus.recusado}
              </span>
            </button>
          </div>
        </motion.div>

        {/* Lista de Solicitações */}
        {filtered.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            style={{
              padding: "60px 20px",
              textAlign: "center",
              backgroundColor: "#fff",
              borderRadius: "16px",
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.08)",
            }}
          >
            <svg
              style={{
                width: "56px",
                height: "56px",
                color: "#D1D5DB",
                margin: "0 auto 16px",
              }}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            <p style={{ color: "#6B7280", fontSize: "15px" }}>
              {searchTerm
                ? "Nenhuma solicitação encontrada"
                : statusFilter === "todos"
                ? "Você ainda não tem solicitações"
                : `Você não tem solicitações ${statusFilter}s`}
            </p>
          </motion.div>
        ) : (
          <motion.div layout style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <AnimatePresence>
              {filtered.map((s) => (
                <motion.div
                  key={s._id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  onClick={() => setModalSolicitacao(s)}
                  style={{
                    backgroundColor: "#fff",
                    borderRadius: "16px",
                    overflow: "hidden",
                    boxShadow: "0 1px 2px rgba(0, 0, 0, 0.05)",
                    transition: "all 0.2s ease",
                    border: "1px solid #E5E7EB",
                    cursor: "pointer",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.boxShadow = "0 4px 6px rgba(0, 0, 0, 0.07)"
                    e.currentTarget.style.borderColor = "#1B4D3E"
                    e.currentTarget.style.transform = "translateY(-2px)"
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.boxShadow = "0 1px 2px rgba(0, 0, 0, 0.05)"
                    e.currentTarget.style.borderColor = "#E5E7EB"
                    e.currentTarget.style.transform = "translateY(0)"
                  }}
                >
                  {/* Card Header */}
                  <div
                    style={{
                      padding: "20px 24px",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <div style={{ flex: 1 }}>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "10px",
                          marginBottom: "6px",
                          flexWrap: "wrap",
                        }}
                      >
                        <h3
                          style={{
                            fontSize: "18px",
                            fontWeight: "700",
                            color: "#1B4D3E",
                            margin: 0,
                          }}
                        >
                          {s.tipoServico}
                        </h3>
                        {getStatusBadge(s.status)}
                      </div>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "12px",
                          fontSize: "13px",
                          color: "#6B7280",
                        }}
                      >
                        <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                          <svg
                            style={{ width: "14px", height: "14px" }}
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                            />
                          </svg>
                          {new Date(s.data_servico).toLocaleDateString("pt-BR")}
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                          <svg
                            style={{ width: "14px", height: "14px" }}
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg>
                          {s.hora}
                        </div>
                      </div>
                    </div>

                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      {/* Delete Button */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          handleDelete(s._id)
                        }}
                        style={{
                          width: "32px",
                          height: "32px",
                          borderRadius: "50%",
                          backgroundColor: "#FEF2F2",
                          border: "1px solid #FEE2E2",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          cursor: "pointer",
                          transition: "all 0.2s ease",
                          flexShrink: 0,
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = "#FEE2E2"
                          e.currentTarget.style.borderColor = "#FCA5A5"
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = "#FEF2F2"
                          e.currentTarget.style.borderColor = "#FEE2E2"
                        }}
                      >
                        <Trash2 size={14} color="#991B1B" />
                      </button>
                      
                      <ArrowCircle />
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>

      {/* Modal */}
      <AnimatePresence>
        {modalSolicitacao && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: "rgba(0, 0, 0, 0.6)",
              backdropFilter: "blur(4px)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 1000,
              padding: "20px",
            }}
            onClick={() => setModalSolicitacao(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              style={{
                backgroundColor: "#fff",
                borderRadius: "24px",
                maxWidth: "650px",
                width: "100%",
                maxHeight: "90vh",
                overflow: "hidden",
                boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
                display: "flex",
                flexDirection: "column",
              }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div
                style={{
                  padding: "32px 36px",
                  borderBottom: "2px solid #E5E7EB",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  background: "linear-gradient(to bottom, #FAFAF9 0%, #fff 100%)",
                }}
              >
                <div style={{ flex: 1, minWidth: 0 }}>
                  <h2
                    style={{
                      fontSize: "26px",
                      fontWeight: "700",
                      color: "#1F2937",
                      margin: 0,
                      marginBottom: "8px",
                      letterSpacing: "-0.5px",
                    }}
                  >
                    {modalSolicitacao.tipoServico}
                  </h2>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    {getStatusBadge(modalSolicitacao.status)}
                  </div>
                </div>
                <button
                  onClick={() => setModalSolicitacao(null)}
                  style={{
                    background: "none",
                    border: "none",
                    fontSize: "32px",
                    cursor: "pointer",
                    color: "#9CA3AF",
                    padding: "4px",
                    marginLeft: "16px",
                    lineHeight: "1",
                    transition: "color 0.2s ease",
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.color = "#6B7280"
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.color = "#9CA3AF"
                  }}
                >
                  ×
                </button>
              </div>

              {/* Modal Content */}
              <div
                style={{
                  overflowY: "auto",
                  flex: 1,
                }}
              >
                <Detalhes solicitacao={modalSolicitacao} handleDelete={handleDelete} handleCancel={handleCancel} />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  )
}

// Arrow Circle Component with hover effect
function ArrowCircle() {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        width: "32px",
        height: "32px",
        borderRadius: "50%",
        backgroundColor: isHovered ? "#1B4D3E" : "#F3F4F6",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
        transition: "all 0.2s ease",
      }}
    >
      <svg
        style={{ 
          width: "16px", 
          height: "16px",
          color: isHovered ? "#fff" : "#6B7280",
          transition: "color 0.2s ease",
        }}
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
      </svg>
    </div>
  )
}
