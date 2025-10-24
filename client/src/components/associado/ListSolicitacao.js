"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Search, FileText, Trash2, X } from "lucide-react"

const API_URL = "http://localhost:5050"

const colors = {
  primary: "#1B4D3E",
  secondary: "#2a6b54",
  background: "#F5F1E8",
  cardBg: "#FFFFFF",
  accent: "#D1FAE5",
  accentDark: "#10B981",
  border: "#E5E7EB",
  textPrimary: "#1F2937",
  textSecondary: "#6B7280",
  warning: "#F59E0B",
  success: "#10B981",
  approved: "#10B981",
  pending: "#F59E0B",
  rejected: "#EF4444",
  canceled: "#6B7280",
}

const Detalhes = ({ solicitacao, handleDelete, handleCancel }) => {
  console.log("[v0] Detalhes solicitacao:", solicitacao)
  console.log("[v0] Status:", solicitacao.status)
  console.log("[v0] motivo_recusa:", solicitacao.motivo_recusa)

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
            marginBottom: "14px",
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
  const [expandedId, setExpandedId] = useState(null)
  const [statusFilter, setStatusFilter] = useState("todos")

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
        backgroundColor: "#F3F4F6",
        color: "#6B7280",
        dotColor: "#9CA3AF",
      },
      aprovado: {
        backgroundColor: "#F0FDF4",
        color: "#166534",
        dotColor: "#10B981",
      },
      recusado: {
        backgroundColor: "#FEF2F2",
        color: "#991B1B",
        dotColor: "#EF4444",
      },
      cancelado: {
        backgroundColor: "#F3F4F6",
        color: "#6B7280",
        dotColor: "#9CA3AF",
      },
    }

    const style = styles[status?.toLowerCase()] || {
      backgroundColor: "#F3F4F6",
      color: "#6B7280",
      dotColor: "#9CA3AF",
    }

    return (
      <div
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "8px",
          padding: "6px 12px",
          borderRadius: "12px",
          fontSize: "13px",
          fontWeight: "500",
          textTransform: "capitalize",
          backgroundColor: style.backgroundColor,
          color: style.color,
        }}
      >
        <div
          style={{
            width: "8px",
            height: "8px",
            borderRadius: "50%",
            backgroundColor: style.dotColor,
          }}
        />
        {status || "Pendente"}
      </div>
    )
  }

  const handleDelete = async (id) => {
    if (!window.confirm("Deseja realmente excluir esta solicitação?")) return
    try {
      await fetch(`${API_URL}/solicitacoes/${id}`, { method: "DELETE" })
      setSolicitacoes((old) => old.filter((s) => s._id !== id))
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
              borderTop: `4px solid ${colors.primary}`,
              borderRadius: "50%",
              animation: "spin 1s linear infinite",
              margin: "0 auto 20px",
            }}
          />
          <p style={{ color: colors.primary, fontWeight: "500" }}>Carregando solicitações...</p>
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
              border: "1px solid #E5E7EB",
              backgroundColor: "#fff",
              fontSize: "14px",
              outline: "none",
              transition: "all 0.2s ease",
              boxShadow: "0 1px 2px rgba(0, 0, 0, 0.05)",
              boxSizing: "border-box",
            }}
            onFocus={(e) => {
              e.target.style.borderColor = colors.primary
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
          <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
            <button
              onClick={() => setStatusFilter("todos")}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                padding: "10px 16px",
                backgroundColor: statusFilter === "todos" ? "#1B4D3E" : "#F9FAFB",
                borderRadius: "8px",
                border: statusFilter === "todos" ? "1px solid #1B4D3E" : "1px solid #E5E7EB",
                fontSize: "14px",
                color: statusFilter === "todos" ? "#FFFFFF" : "#6B7280",
                fontWeight: "500",
                cursor: "pointer",
                transition: "all 0.2s ease",
              }}
              onMouseEnter={(e) => {
                if (statusFilter !== "todos") {
                  e.currentTarget.style.backgroundColor = "#F3F4F6"
                  e.currentTarget.style.borderColor = "#D1D5DB"
                }
              }}
              onMouseLeave={(e) => {
                if (statusFilter !== "todos") {
                  e.currentTarget.style.backgroundColor = "#F9FAFB"
                  e.currentTarget.style.borderColor = "#E5E7EB"
                }
              }}
            >
              <span style={{ fontWeight: "600", fontSize: "15px" }}>{countByStatus.todos}</span>
              Todas
            </button>

            <button
              onClick={() => setStatusFilter("pendente")}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                padding: "10px 16px",
                backgroundColor: statusFilter === "pendente" ? "#F3F4F6" : "#F9FAFB",
                borderRadius: "8px",
                border: statusFilter === "pendente" ? "2px solid #6B7280" : "1px solid #E5E7EB",
                fontSize: "14px",
                color: "#6B7280",
                fontWeight: "500",
                cursor: "pointer",
                transition: "all 0.2s ease",
              }}
              onMouseEnter={(e) => {
                if (statusFilter !== "pendente") {
                  e.currentTarget.style.backgroundColor = "#F3F4F6"
                  e.currentTarget.style.borderColor = "#D1D5DB"
                }
              }}
              onMouseLeave={(e) => {
                if (statusFilter !== "pendente") {
                  e.currentTarget.style.backgroundColor = "#F9FAFB"
                  e.currentTarget.style.borderColor = "#E5E7EB"
                }
              }}
            >
              <div
                style={{
                  width: "8px",
                  height: "8px",
                  borderRadius: "50%",
                  backgroundColor: "#9CA3AF",
                }}
              />
              <span style={{ fontWeight: "600", fontSize: "15px", color: "#374151" }}>{countByStatus.pendente}</span>
              Pendente{countByStatus.pendente !== 1 ? "s" : ""}
            </button>

            <button
              onClick={() => setStatusFilter("aprovado")}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                padding: "10px 16px",
                backgroundColor: statusFilter === "aprovado" ? "#F0FDF4" : "#F9FAFB",
                borderRadius: "8px",
                border: statusFilter === "aprovado" ? "2px solid #10B981" : "1px solid #E5E7EB",
                fontSize: "14px",
                color: statusFilter === "aprovado" ? "#166534" : "#6B7280",
                fontWeight: "500",
                cursor: "pointer",
                transition: "all 0.2s ease",
              }}
              onMouseEnter={(e) => {
                if (statusFilter !== "aprovado") {
                  e.currentTarget.style.backgroundColor = "#F3F4F6"
                  e.currentTarget.style.borderColor = "#D1D5DB"
                }
              }}
              onMouseLeave={(e) => {
                if (statusFilter !== "aprovado") {
                  e.currentTarget.style.backgroundColor = "#F9FAFB"
                  e.currentTarget.style.borderColor = "#E5E7EB"
                }
              }}
            >
              <div
                style={{
                  width: "8px",
                  height: "8px",
                  borderRadius: "50%",
                  backgroundColor: "#10B981",
                }}
              />
              <span
                style={{
                  fontWeight: "600",
                  fontSize: "15px",
                  color: statusFilter === "aprovado" ? "#166534" : "#374151",
                }}
              >
                {countByStatus.aprovado}
              </span>
              Aprovado{countByStatus.aprovado !== 1 ? "s" : ""}
            </button>

            <button
              onClick={() => setStatusFilter("recusado")}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                padding: "10px 16px",
                backgroundColor: statusFilter === "recusado" ? "#FEF2F2" : "#F9FAFB",
                borderRadius: "8px",
                border: statusFilter === "recusado" ? "2px solid #EF4444" : "1px solid #E5E7EB",
                fontSize: "14px",
                color: statusFilter === "recusado" ? "#991B1B" : "#6B7280",
                fontWeight: "500",
                cursor: "pointer",
                transition: "all 0.2s ease",
              }}
              onMouseEnter={(e) => {
                if (statusFilter !== "recusado") {
                  e.currentTarget.style.backgroundColor = "#F3F4F6"
                  e.currentTarget.style.borderColor = "#D1D5DB"
                }
              }}
              onMouseLeave={(e) => {
                if (statusFilter !== "recusado") {
                  e.currentTarget.style.backgroundColor = "#F9FAFB"
                  e.currentTarget.style.borderColor = "#E5E7EB"
                }
              }}
            >
              <div
                style={{
                  width: "8px",
                  height: "8px",
                  borderRadius: "50%",
                  backgroundColor: "#EF4444",
                }}
              />
              <span
                style={{
                  fontWeight: "600",
                  fontSize: "15px",
                  color: statusFilter === "recusado" ? "#991B1B" : "#374151",
                }}
              >
                {countByStatus.recusado}
              </span>
              Recusado{countByStatus.recusado !== 1 ? "s" : ""}
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
              border: "1px solid #E5E7EB",
            }}
          >
            <FileText size={48} style={{ color: "#D1D5DB", margin: "0 auto 16px" }} />
            <p style={{ color: colors.textSecondary, fontSize: "15px", margin: 0 }}>
              {searchTerm ? "Nenhuma solicitação encontrada" : "Você ainda não tem solicitações"}
            </p>
          </motion.div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <AnimatePresence>
              {filtered.map((s, index) => {
                const isExpanded = expandedId === s._id

                return (
                  <motion.div
                    key={s._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ delay: index * 0.05 }}
                    style={{
                      backgroundColor: "#fff",
                      borderRadius: "16px",
                      overflow: "hidden",
                      boxShadow: "0 1px 2px rgba(0, 0, 0, 0.05)",
                      transition: "all 0.2s ease",
                      border: "1px solid #E5E7EB",
                      position: "relative",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = "#FAFAF9"
                      e.currentTarget.style.borderColor = "#1B4D3E"
                      e.currentTarget.style.transform = "translateY(-2px)"
                      e.currentTarget.style.boxShadow = "0 8px 16px rgba(0, 0, 0, 0.1)"
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = "#fff"
                      e.currentTarget.style.borderColor = "#E5E7EB"
                      e.currentTarget.style.transform = "translateY(0)"
                      e.currentTarget.style.boxShadow = "0 1px 2px rgba(0, 0, 0, 0.05)"
                    }}
                  >
                    {/* Card Header */}
                    <div
                      onClick={() => setExpandedId(isExpanded ? null : s._id)}
                      style={{
                        padding: "24px",
                        cursor: "pointer",
                        transition: "background-color 0.2s ease",
                      }}
                    >
                      {/* Status Badge - Top Right */}
                      <div style={{ position: "absolute", top: "20px", right: "20px" }}>{getStatusBadge(s.status)}</div>

                      {/* Main Content */}
                      <div style={{ paddingRight: "140px" }}>
                        <h3
                          style={{
                            fontSize: "18px",
                            fontWeight: "600",
                            color: "#1F2937",
                            marginBottom: "12px",
                          }}
                        >
                          {s.tipoServico}
                        </h3>

                        {/* Details Row */}
                        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                            <svg
                              style={{ width: "16px", height: "16px", color: "#6B7280", flexShrink: 0 }}
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
                            <span style={{ fontSize: "14px", color: "#374151", fontWeight: "500" }}>
                              {new Date(s.data_servico).toLocaleDateString("pt-BR", {
                                day: "2-digit",
                                month: "long",
                                year: "numeric",
                              })}
                            </span>
                          </div>

                          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                            <svg
                              style={{ width: "16px", height: "16px", color: "#6B7280", flexShrink: 0 }}
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
                            <span style={{ fontSize: "14px", color: "#374151", fontWeight: "500" }}>
                              {s.hora || "--:--"}
                            </span>
                          </div>

                          {s.tempo_estimado && (
                            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                              <svg
                                style={{ width: "16px", height: "16px", color: "#6B7280", flexShrink: 0 }}
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M13 10V3L4 14h7v7l9-11h-7z"
                                />
                              </svg>
                              <div style={{ fontSize: "14px", color: "#374151" }}>
                                <span style={{ color: "#6B7280" }}>Tempo estimado: </span>
                                <span style={{ fontWeight: "500" }}>{s.tempo_estimado}</span>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Footer - Ver detalhes */}
                      {!isExpanded && (
                        <div
                          style={{
                            marginTop: "16px",
                            paddingTop: "16px",
                            borderTop: "1px solid #F3F4F6",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "flex-end",
                          }}
                        >
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "4px",
                              fontSize: "13px",
                              fontWeight: "500",
                              color: "#1B4D3E",
                            }}
                          >
                            Ver detalhes
                            <svg
                              style={{ width: "16px", height: "16px" }}
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Expanded Content */}
                    <motion.div
                      initial={false}
                      animate={{
                        height: isExpanded ? "auto" : 0,
                        opacity: isExpanded ? 1 : 0,
                      }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                      style={{
                        overflow: "hidden",
                      }}
                    >
                      <Detalhes solicitacao={s} handleDelete={handleDelete} handleCancel={handleCancel} />
                    </motion.div>
                  </motion.div>
                )
              })}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  )
}
