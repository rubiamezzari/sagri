"use client"

import { useState, useEffect } from "react"

const API_URL = "http://localhost:5050"

export default function ListAgendamentos() {
  const [solicitacoes, setSolicitacoes] = useState([])
  const [busca, setBusca] = useState("")
  const [paginaAtual, setPaginaAtual] = useState(1)
  const [agendamentoSelecionado, setAgendamentoSelecionado] = useState(null)
  const [loading, setLoading] = useState(false)
  const [filtroAtivo, setFiltroAtivo] = useState("todos")
  const [mostrarModalRecusa, setMostrarModalRecusa] = useState(false)
  const [motivoRecusa, setMotivoRecusa] = useState("")

  useEffect(() => {
    carregarSolicitacoes()
  }, [])

  async function carregarSolicitacoes() {
    try {
      setLoading(true)
      const res = await fetch(`${API_URL}/solicitacoes`)
      const data = await res.json()

      const dataComNomes = await Promise.all(
        data.map(async (sol) => {
          if (sol.usuario_id) {
            try {
              const userRes = await fetch(`${API_URL}/associados/${sol.usuario_id}`)
              const userData = await userRes.json()
              return { ...sol, nomeUsuario: userData.nome || "Associado" }
            } catch {
              return { ...sol, nomeUsuario: "Desconhecido" }
            }
          }
          return { ...sol, nomeUsuario: "Desconhecido" }
        }),
      )

      // Ordenar por data mais recente
      const sorted = dataComNomes.sort((a, b) => {
        const dateA = new Date(a.data_servico)
        const dateB = new Date(b.data_servico)
        return dateB - dateA
      })

      setSolicitacoes(sorted)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const itensPorPagina = 9

  // Filtrar por status
  const filtradas = solicitacoes
    .filter((s) => {
      if (filtroAtivo === "todos") return true
      return s.status?.toLowerCase() === filtroAtivo
    })
    .filter(
      (s) =>
        s.tipoServico?.toLowerCase().includes(busca.toLowerCase()) ||
        s.nomeUsuario?.toLowerCase().includes(busca.toLowerCase()) ||
        s.status?.toLowerCase().includes(busca.toLowerCase()),
    )

  const totalPaginas = Math.ceil(filtradas.length / itensPorPagina)
  const paginadas = filtradas.slice((paginaAtual - 1) * itensPorPagina, paginaAtual * itensPorPagina)

  const mudarPagina = (novaPagina) => {
    if (novaPagina >= 1 && novaPagina <= totalPaginas) setPaginaAtual(novaPagina)
  }

  const abrirModal = (agendamento) => setAgendamentoSelecionado(agendamento)
  const fecharModal = () => setAgendamentoSelecionado(null)

  const atualizarStatus = async (id, status) => {
    try {
      const body = { status }
      if (status === "recusado" && motivoRecusa.trim()) {
        body.motivo_recusa = motivoRecusa.trim()
      }

      console.log("[v0] Atualizando status:", { id, status, body })

      const response = await fetch(`${API_URL}/solicitacoes/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      })

      if (!response.ok) {
        const errorText = await response.text()
        console.error("[v0] Erro na resposta:", response.status, errorText)
        throw new Error(`Erro ${response.status}: ${errorText}`)
      }

      const updatedData = await response.json()
      console.log("[v0] Resposta do servidor:", updatedData)
      console.log("[v0] motivo_recusa recebido:", updatedData.motivo_recusa)

      const motivoRecusaToSave = status === "recusado" && motivoRecusa.trim() ? motivoRecusa.trim() : null

      setSolicitacoes((old) =>
        old.map((s) =>
          s._id === id
            ? {
                ...s,
                status,
                ...(motivoRecusaToSave ? { motivo_recusa: motivoRecusaToSave } : {}),
              }
            : s,
        ),
      )

      if (agendamentoSelecionado?._id === id) {
        setAgendamentoSelecionado({
          ...agendamentoSelecionado,
          status,
          ...(motivoRecusaToSave ? { motivo_recusa: motivoRecusaToSave } : {}),
        })
      }

      setMostrarModalRecusa(false)
      setMotivoRecusa("")

      if (status === "recusado") {
        setAgendamentoSelecionado(null)
      }
    } catch (error) {
      console.error("[v0] Erro ao atualizar status:", error)
      alert(`Erro ao atualizar status: ${error.message}`)
    }
  }

  const deletarAgendamento = async (id) => {
    if (!window.confirm("Deseja realmente excluir este agendamento?")) return
    try {
      await fetch(`${API_URL}/solicitacoes/${id}`, { method: "DELETE" })
      setSolicitacoes((old) => old.filter((s) => s._id !== id))
      fecharModal()
    } catch {
      alert("Erro ao excluir")
    }
  }

  const getStatusBadge = (status) => {
    const styles = {
      pendente: {
        backgroundColor: "#FFF9E6",
        color: "#8B6914",
        dotColor: "#F59E0B",
        borderColor: "#FDE68A",
      },
      aprovado: {
        backgroundColor: "#E8F5E9",
        color: "#1B5E20",
        dotColor: "#10B981",
        borderColor: "#A8D5BA",
      },
      recusado: {
        backgroundColor: "#FBE9E7",
        color: "#BF360C",
        dotColor: "#EF4444",
        borderColor: "#FFCCBC",
      },
      concluido: {
        backgroundColor: "#E0F2F1",
        color: "#00695C",
        dotColor: "#14B8A6",
        borderColor: "#80CBC4",
      },
    }

    const style = styles[status?.toLowerCase()] || {
      backgroundColor: "#F5F5F5",
      color: "#757575",
      dotColor: "#9E9E9E",
      borderColor: "#E0E0E0",
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
          border: `1px solid ${style.borderColor}`,
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
        {status}
      </div>
    )
  }

  const countByStatus = {
    pendente: solicitacoes.filter((s) => s.status?.toLowerCase() === "pendente").length,
    aprovado: solicitacoes.filter((s) => s.status?.toLowerCase() === "aprovado").length,
    recusado: solicitacoes.filter((s) => s.status?.toLowerCase() === "recusado").length,
    concluido: solicitacoes.filter((s) => s.status?.toLowerCase() === "concluido").length,
  }

  return (
    <div
      style={{
        width: "100%",
        maxWidth: "1400px",
        margin: "0 auto",
        padding: "32px 20px",
      }}
    >
      {/* Header Section */}
      <div style={{ marginBottom: "32px" }}>
        <div style={{ marginBottom: "24px" }}>
          <h1
            style={{
              fontSize: "32px",
              fontWeight: "700",
              color: "#1F2937",
              marginBottom: "8px",
              letterSpacing: "-0.5px",
            }}
          >
            Agendamentos
          </h1>
          <p style={{ fontSize: "15px", color: "#6B7280", margin: 0 }}>
            Gerencie todas as solicitações de serviço dos associados
          </p>
        </div>

        {/* Filtros */}
        <div
          style={{
            backgroundColor: "#fff",
            borderRadius: "16px",
            padding: "10px",
            marginBottom: "20px",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.08)",
            border: "1px solid #E5E7EB",
            display: "inline-flex",
            gap: "8px",
            flexWrap: "wrap",
          }}
        >
          <button
            onClick={() => {
              setFiltroAtivo("todos")
              setPaginaAtual(1)
            }}
            style={{
              padding: "10px 20px",
              borderRadius: "8px",
              border: "none",
              backgroundColor: filtroAtivo === "todos" ? "#1B4D3E" : "transparent",
              color: filtroAtivo === "todos" ? "#fff" : "#6B7280",
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
                backgroundColor: filtroAtivo === "todos" ? "rgba(255,255,255,0.25)" : "#E5E7EB",
                color: filtroAtivo === "todos" ? "#fff" : "#6B7280",
                padding: "2px 8px",
                borderRadius: "12px",
                fontSize: "12px",
                fontWeight: "600",
              }}
            >
              {solicitacoes.length}
            </span>
          </button>

          <button
            onClick={() => {
              setFiltroAtivo("pendente")
              setPaginaAtual(1)
            }}
            style={{
              padding: "10px 20px",
              borderRadius: "8px",
              border: "none",
              backgroundColor: filtroAtivo === "pendente" ? "#1B4D3E" : "transparent",
              color: filtroAtivo === "pendente" ? "#fff" : "#6B7280",
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
                backgroundColor: filtroAtivo === "pendente" ? "rgba(255,255,255,0.25)" : "#FFF9E6",
                color: filtroAtivo === "pendente" ? "#fff" : "#8B6914",
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
            onClick={() => {
              setFiltroAtivo("aprovado")
              setPaginaAtual(1)
            }}
            style={{
              padding: "10px 20px",
              borderRadius: "8px",
              border: "none",
              backgroundColor: filtroAtivo === "aprovado" ? "#1B4D3E" : "transparent",
              color: filtroAtivo === "aprovado" ? "#fff" : "#6B7280",
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
                backgroundColor: filtroAtivo === "aprovado" ? "rgba(255,255,255,0.25)" : "#E8F5E9",
                color: filtroAtivo === "aprovado" ? "#fff" : "#1B5E20",
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
            onClick={() => {
              setFiltroAtivo("concluido")
              setPaginaAtual(1)
            }}
            style={{
              padding: "10px 20px",
              borderRadius: "8px",
              border: "none",
              backgroundColor: filtroAtivo === "concluido" ? "#1B4D3E" : "transparent",
              color: filtroAtivo === "concluido" ? "#fff" : "#6B7280",
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
                backgroundColor: filtroAtivo === "concluido" ? "rgba(255,255,255,0.25)" : "#E0F2F1",
                color: filtroAtivo === "concluido" ? "#fff" : "#00695C",
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
            onClick={() => {
              setFiltroAtivo("recusado")
              setPaginaAtual(1)
            }}
            style={{
              padding: "10px 20px",
              borderRadius: "8px",
              border: "none",
              backgroundColor: filtroAtivo === "recusado" ? "#1B4D3E" : "transparent",
              color: filtroAtivo === "recusado" ? "#fff" : "#6B7280",
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
                backgroundColor: filtroAtivo === "recusado" ? "rgba(255,255,255,0.25)" : "#FBE9E7",
                color: filtroAtivo === "recusado" ? "#fff" : "#BF360C",
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
      </div>

      {/* Search Bar */}
      <div style={{ marginBottom: "32px", position: "relative" }}>
        <div
          style={{
            position: "absolute",
            left: "20px",
            top: "50%",
            transform: "translateY(-50%)",
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}
        >
          <svg
            style={{
              width: "22px",
              height: "22px",
              color: "#9CA3AF",
            }}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2.5}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
        <input
          type="text"
          placeholder="Pesquisar por serviço, associado ou status..."
          value={busca}
          onChange={(e) => {
            setBusca(e.target.value)
            setPaginaAtual(1)
          }}
          style={{
            width: "100%",
            padding: "18px 20px 18px 58px",
            borderRadius: "16px",
            border: "2px solid #E5E7EB",
            backgroundColor: "#fff",
            fontSize: "15px",
            outline: "none",
            transition: "all 0.3s ease",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.06)",
            fontWeight: "500",
          }}
          onFocus={(e) => {
            e.target.style.borderColor = "#1B4D3E"
            e.target.style.boxShadow = "0 0 0 4px rgba(27, 77, 62, 0.12), 0 4px 12px rgba(0, 0, 0, 0.08)"
          }}
          onBlur={(e) => {
            e.target.style.borderColor = "#E5E7EB"
            e.target.style.boxShadow = "0 4px 12px rgba(0, 0, 0, 0.06)"
          }}
        />
        {busca && (
          <button
            onClick={() => {
              setBusca("")
              setPaginaAtual(1)
            }}
            style={{
              position: "absolute",
              right: "18px",
              top: "50%",
              transform: "translateY(-50%)",
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: "4px",
              color: "#9CA3AF",
              transition: "color 0.2s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = "#8B4513"
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = "#9CA3AF"
            }}
          >
            <svg style={{ width: "20px", height: "20px" }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      {/* Cards Grid */}
      {loading ? (
        <div
          style={{
            padding: "80px 20px",
            textAlign: "center",
            backgroundColor: "#fff",
            borderRadius: "20px",
            border: "1px solid #E5E7EB",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.06)",
          }}
        >
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
          <p style={{ color: "#6B7280", fontSize: "15px", fontWeight: "500" }}>Carregando agendamentos...</p>
        </div>
      ) : paginadas.length === 0 ? (
        <div
          style={{
            padding: "80px 20px",
            textAlign: "center",
            backgroundColor: "#fff",
            borderRadius: "20px",
            border: "1px solid #E5E7EB",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.06)",
          }}
        >
          <div
            style={{
              width: "80px",
              height: "80px",
              margin: "0 auto 24px",
              background: "linear-gradient(135deg, #F3F4F6 0%, #E5E7EB 100%)",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <svg
              style={{
                width: "40px",
                height: "40px",
                color: "#9CA3AF",
              }}
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
          </div>
          <h3 style={{ fontSize: "18px", fontWeight: "600", color: "#374151", marginBottom: "8px" }}>
            Nenhum agendamento encontrado
          </h3>
          <p style={{ color: "#9CA3AF", fontSize: "14px", margin: 0 }}>
            {filtroAtivo === "todos" && "Não há agendamentos cadastrados no momento"}
            {filtroAtivo === "pendente" && "Não há agendamentos pendentes"}
            {filtroAtivo === "aprovado" && "Não há agendamentos aprovados"}
            {filtroAtivo === "concluido" && "Não há agendamentos concluídos"}
            {filtroAtivo === "recusado" && "Não há agendamentos recusados"}
          </p>
        </div>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(360px, 1fr))",
            gap: "24px",
            marginBottom: "40px",
          }}
        >
          {paginadas.map((s) => (
            <div
              key={s._id}
              onClick={() => abrirModal(s)}
              style={{
                backgroundColor: "#fff",
                padding: "28px",
                borderRadius: "20px",
                border: "1px solid #E5E7EB",
                cursor: "pointer",
                transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                boxShadow: "0 4px 12px rgba(0, 0, 0, 0.06)",
                position: "relative",
                opacity: 1,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "#FAFAF9"
                e.currentTarget.style.borderColor = "#1B4D3E"
                e.currentTarget.style.transform = "translateY(-6px)"
                e.currentTarget.style.boxShadow = "0 12px 24px rgba(27, 77, 62, 0.15)"
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "#fff"
                e.currentTarget.style.borderColor = "#E5E7EB"
                e.currentTarget.style.transform = "translateY(0)"
                e.currentTarget.style.boxShadow = "0 4px 12px rgba(0, 0, 0, 0.06)"
              }}
            >
              {/* Status Badge - Top Right */}
              <div style={{ position: "absolute", top: "20px", right: "20px" }}>{getStatusBadge(s.status)}</div>

              {/* Header with Avatar */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "16px",
                  marginBottom: "24px",
                  paddingBottom: "24px",
                  borderBottom: "2px solid #F3F4F6",
                }}
              >
                <div
                  style={{
                    width: "64px",
                    height: "64px",
                    borderRadius: "50%",
                    backgroundColor: "#1B4D3E",
                    color: "#fff",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "22px",
                    fontWeight: "700",
                    flexShrink: 0,
                  }}
                >
                  {s.nomeUsuario
                    ?.split(" ")
                    .map((n) => n[0])
                    .join("")
                    .substring(0, 2)
                    .toUpperCase()}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <h3
                    style={{
                      fontSize: "19px",
                      fontWeight: "700",
                      color: "#1F2937",
                      marginBottom: "6px",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                      letterSpacing: "-0.3px",
                    }}
                  >
                    {s.tipoServico}
                  </h3>
                  <p
                    style={{
                      fontSize: "14px",
                      color: "#6B7280",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                      fontWeight: "500",
                    }}
                  >
                    {s.nomeUsuario}
                  </p>
                </div>
              </div>

              {/* Details */}
              <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <svg
                    style={{
                      width: "18px",
                      height: "18px",
                      color: "#6B7280",
                      flexShrink: 0,
                    }}
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
                  <div style={{ fontSize: "14px", color: "#374151" }}>
                    <span style={{ fontWeight: "500" }}>
                      {new Date(s.data_servico).toLocaleDateString("pt-BR", {
                        day: "2-digit",
                        month: "long",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <svg
                    style={{
                      width: "18px",
                      height: "18px",
                      color: "#6B7280",
                      flexShrink: 0,
                    }}
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
                  <div style={{ fontSize: "14px", color: "#374151" }}>
                    <span style={{ fontWeight: "500" }}>{s.hora}</span>
                  </div>
                </div>

                {s.tempo_estimado && (
                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <svg
                      style={{
                        width: "18px",
                        height: "18px",
                        color: "#6B7280",
                        flexShrink: 0,
                      }}
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

                {/* Horímetro Info */}
                {s.status?.toLowerCase() === "concluido" &&
                  s.horimetro_inicial != null &&
                  s.horimetro_final != null && (
                    <div
                      style={{
                        marginTop: "12px",
                        padding: "16px",
                        background: "linear-gradient(135deg, #DFF0E8 0%, #C8E6D4 100%)",
                        borderRadius: "12px",
                        border: "2px solid #A8D5BA",
                        boxShadow: "0 2px 8px rgba(168, 213, 186, 0.3)",
                      }}
                    >
                      <div
                        style={{
                          fontSize: "11px",
                          color: "#0D4A2C",
                          fontWeight: "700",
                          marginBottom: "6px",
                          textTransform: "uppercase",
                          letterSpacing: "0.5px",
                        }}
                      >
                        Horímetro
                      </div>
                      <div style={{ fontSize: "15px", color: "#0D4A2C", fontWeight: "700" }}>
                        {Number(s.horimetro_final) - Number(s.horimetro_inicial)}h trabalhadas
                      </div>
                      <div style={{ fontSize: "12px", color: "#0D4A2C", marginTop: "6px", opacity: 0.85 }}>
                        {s.horimetro_inicial}h → {s.horimetro_final}h
                      </div>
                    </div>
                  )}
              </div>

              {/* Footer */}
              <div
                style={{
                  marginTop: "24px",
                  paddingTop: "20px",
                  borderTop: "2px solid #F3F4F6",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "flex-end",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                    fontSize: "14px",
                    fontWeight: "600",
                    color: "#1B4D3E",
                  }}
                >
                  Ver detalhes
                  <svg style={{ width: "18px", height: "18px" }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPaginas > 1 && (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: "20px",
          }}
        >
          <button
            onClick={() => mudarPagina(paginaAtual - 1)}
            disabled={paginaAtual === 1}
            style={{
              padding: "12px 24px",
              borderRadius: "12px",
              border: "2px solid #E5E7EB",
              backgroundColor: paginaAtual === 1 ? "#F9FAFB" : "#fff",
              color: paginaAtual === 1 ? "#D1D5DB" : "#1B4D3E",
              fontSize: "14px",
              fontWeight: "600",
              cursor: paginaAtual === 1 ? "not-allowed" : "pointer",
              transition: "all 0.2s ease",
              boxShadow: paginaAtual === 1 ? "none" : "0 2px 8px rgba(0, 0, 0, 0.06)",
            }}
            onMouseEnter={(e) => {
              if (paginaAtual !== 1) {
                e.target.style.backgroundColor = "#F9FAFB"
                e.target.style.borderColor = "#1B4D3E"
              }
            }}
            onMouseLeave={(e) => {
              if (paginaAtual !== 1) {
                e.target.style.backgroundColor = "#fff"
                e.target.style.borderColor = "#E5E7EB"
              }
            }}
          >
            ← Anterior
          </button>

          <span
            style={{
              fontSize: "15px",
              color: "#374151",
              fontWeight: "600",
              padding: "8px 16px",
              backgroundColor: "#F9FAFB",
              borderRadius: "8px",
            }}
          >
            Página {paginaAtual} de {totalPaginas}
          </span>

          <button
            onClick={() => mudarPagina(paginaAtual + 1)}
            disabled={paginaAtual === totalPaginas}
            style={{
              padding: "12px 24px",
              borderRadius: "12px",
              border: "2px solid #E5E7EB",
              backgroundColor: paginaAtual === totalPaginas ? "#F9FAFB" : "#fff",
              color: paginaAtual === totalPaginas ? "#D1D5DB" : "#1B4D3E",
              fontSize: "14px",
              fontWeight: "600",
              cursor: paginaAtual === totalPaginas ? "not-allowed" : "pointer",
              transition: "all 0.2s ease",
              boxShadow: paginaAtual === totalPaginas ? "none" : "0 2px 8px rgba(0, 0, 0, 0.06)",
            }}
            onMouseEnter={(e) => {
              if (paginaAtual !== totalPaginas) {
                e.target.style.backgroundColor = "#F9FAFB"
                e.target.style.borderColor = "#1B4D3E"
              }
            }}
            onMouseLeave={(e) => {
              if (paginaAtual !== totalPaginas) {
                e.target.style.backgroundColor = "#fff"
                e.target.style.borderColor = "#E5E7EB"
              }
            }}
          >
            Próxima →
          </button>
        </div>
      )}

      {/* Modal */}
      {agendamentoSelecionado && (
        <div
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
          onClick={fecharModal}
        >
          <div
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
                  {agendamentoSelecionado.tipoServico}
                </h2>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  {getStatusBadge(agendamentoSelecionado.status)}
                </div>
              </div>
              <button
                onClick={fecharModal}
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
                padding: "36px",
                overflowY: "auto",
                flex: 1,
              }}
            >
              <div style={{ display: "flex", flexDirection: "column", gap: "28px" }}>
                {/* Associado Info */}
                <div>
                  <h3
                    style={{
                      fontSize: "13px",
                      fontWeight: "700",
                      color: "#6B7280",
                      textTransform: "uppercase",
                      letterSpacing: "0.8px",
                      marginBottom: "16px",
                    }}
                  >
                    Solicitante
                  </h3>
                  <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
                    <div
                      style={{
                        width: "56px",
                        height: "56px",
                        borderRadius: "50%",
                        backgroundColor: "#1B4D3E",
                        color: "#fff",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "20px",
                        fontWeight: "700",
                      }}
                    >
                      {agendamentoSelecionado.nomeUsuario
                        ?.split(" ")
                        .map((n) => n[0])
                        .join("")
                        .substring(0, 2)
                        .toUpperCase()}
                    </div>
                    <div>
                      <div
                        style={{
                          fontSize: "17px",
                          fontWeight: "700",
                          color: "#1F2937",
                        }}
                      >
                        {agendamentoSelecionado.nomeUsuario}
                      </div>
                      <div style={{ fontSize: "14px", color: "#6B7280", fontWeight: "500" }}>Associado</div>
                    </div>
                  </div>
                </div>

                {/* Schedule Details */}
                <div>
                  <h3
                    style={{
                      fontSize: "13px",
                      fontWeight: "700",
                      color: "#6B7280",
                      textTransform: "uppercase",
                      letterSpacing: "0.8px",
                      marginBottom: "16px",
                    }}
                  >
                    Detalhes do Agendamento
                  </h3>
                  <div
                    style={{
                      background: "linear-gradient(135deg, #F9FAFB 0%, #F3F4F6 100%)",
                      padding: "20px",
                      borderRadius: "16px",
                      border: "1px solid #E5E7EB",
                      display: "flex",
                      flexDirection: "column",
                      gap: "14px",
                    }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                      <span style={{ color: "#6B7280", fontSize: "14px" }}>Data:</span>
                      <span
                        style={{
                          color: "#1F2937",
                          fontSize: "14px",
                          fontWeight: "600",
                        }}
                      >
                        {new Date(agendamentoSelecionado.data_servico).toLocaleDateString("pt-BR", {
                          day: "2-digit",
                          month: "long",
                          year: "numeric",
                        })}
                      </span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                      <span style={{ color: "#6B7280", fontSize: "14px" }}>Hora:</span>
                      <span
                        style={{
                          color: "#1F2937",
                          fontSize: "14px",
                          fontWeight: "600",
                        }}
                      >
                        {agendamentoSelecionado.hora}
                      </span>
                    </div>
                    {agendamentoSelecionado.tempo_estimado && (
                      <div style={{ display: "flex", justifyContent: "space-between" }}>
                        <span style={{ color: "#6B7280", fontSize: "14px" }}>Tempo Estimado:</span>
                        <span
                          style={{
                            color: "#1F2937",
                            fontSize: "14px",
                            fontWeight: "600",
                          }}
                        >
                          {agendamentoSelecionado.tempo_estimado}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Horímetro Details - se concluído */}
                {agendamentoSelecionado.status?.toLowerCase() === "concluido" &&
                  agendamentoSelecionado.horimetro_inicial != null &&
                  agendamentoSelecionado.horimetro_final != null && (
                    <div>
                      <h3
                        style={{
                          fontSize: "13px",
                          fontWeight: "700",
                          color: "#6B7280",
                          textTransform: "uppercase",
                          letterSpacing: "0.8px",
                          marginBottom: "16px",
                        }}
                      >
                        Horímetro Registrado
                      </h3>
                      <div
                        style={{
                          background: "linear-gradient(135deg, #DFF0E8 0%, #C8E6D4 100%)",
                          padding: "24px",
                          borderRadius: "16px",
                          border: "2px solid #A8D5BA",
                          boxShadow: "0 4px 12px rgba(168, 213, 186, 0.3)",
                        }}
                      >
                        <div style={{ fontSize: "32px", color: "#0D4A2C", fontWeight: "800", marginBottom: "10px" }}>
                          {Number(agendamentoSelecionado.horimetro_final) -
                            Number(agendamentoSelecionado.horimetro_inicial)}
                          h
                        </div>
                        <div style={{ fontSize: "14px", color: "#0D4A2C", opacity: 0.9, fontWeight: "600" }}>
                          Horas trabalhadas no total
                        </div>
                        <div
                          style={{
                            marginTop: "16px",
                            paddingTop: "16px",
                            borderTop: "2px solid #A8D5BA",
                            display: "flex",
                            gap: "24px",
                            fontSize: "14px",
                            color: "#0D4A2C",
                          }}
                        >
                          <div>
                            <span style={{ opacity: 0.8 }}>Inicial: </span>
                            <span style={{ fontWeight: "700" }}>{agendamentoSelecionado.horimetro_inicial}h</span>
                          </div>
                          <div>
                            <span style={{ opacity: 0.8 }}>Final: </span>
                            <span style={{ fontWeight: "700" }}>{agendamentoSelecionado.horimetro_final}h</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                {/* Observations */}
                {agendamentoSelecionado.observacao && (
                  <div>
                    <h3
                      style={{
                        fontSize: "13px",
                        fontWeight: "700",
                        color: "#6B7280",
                        textTransform: "uppercase",
                        letterSpacing: "0.8px",
                        marginBottom: "16px",
                      }}
                    >
                      Observações
                    </h3>
                    <div
                      style={{
                        background: "linear-gradient(135deg, #F9FAFB 0%, #F3F4F6 100%)",
                        padding: "20px",
                        borderRadius: "16px",
                        border: "1px solid #E5E7EB",
                        fontSize: "15px",
                        color: "#374151",
                        lineHeight: "1.7",
                        fontWeight: "500",
                      }}
                    >
                      {agendamentoSelecionado.observacao}
                    </div>
                  </div>
                )}

                {agendamentoSelecionado.status?.toLowerCase() === "recusado" &&
                  agendamentoSelecionado.motivo_recusa && (
                    <div>
                      <h3
                        style={{
                          fontSize: "13px",
                          fontWeight: "700",
                          color: "#991B1B",
                          textTransform: "uppercase",
                          letterSpacing: "0.8px",
                          marginBottom: "16px",
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
                      </h3>
                      <div
                        style={{
                          background: "#FEF2F2",
                          padding: "20px",
                          borderRadius: "16px",
                          border: "2px solid #FEE2E2",
                          fontSize: "15px",
                          color: "#991B1B",
                          lineHeight: "1.7",
                          fontWeight: "600",
                        }}
                      >
                        {agendamentoSelecionado.motivo_recusa}
                      </div>
                    </div>
                  )}
              </div>
            </div>

            {/* Modal Footer */}
            <div
              style={{
                padding: "28px 36px",
                borderTop: "2px solid #E5E7EB",
                display: "flex",
                gap: "12px",
                background: "linear-gradient(to top, #FAFAF9 0%, #fff 100%)",
              }}
            >
              <button
                onClick={() => {
                  atualizarStatus(agendamentoSelecionado._id, "aprovado")
                }}
                disabled={
                  agendamentoSelecionado.status === "aprovado" ||
                  agendamentoSelecionado.status === "recusado" ||
                  agendamentoSelecionado.status === "concluido"
                }
                style={{
                  flex: 1,
                  padding: "14px 24px",
                  borderRadius: "12px",
                  border:
                    agendamentoSelecionado.status === "aprovado" ||
                    agendamentoSelecionado.status === "recusado" ||
                    agendamentoSelecionado.status === "concluido"
                      ? "2px solid #D1D5DB"
                      : "2px solid #2D7A5F",
                  background:
                    agendamentoSelecionado.status === "aprovado" ||
                    agendamentoSelecionado.status === "recusado" ||
                    agendamentoSelecionado.status === "concluido"
                      ? "#F3F4F6"
                      : "linear-gradient(135deg, #E8F3ED 0%, #D4E9DD 100%)",
                  color:
                    agendamentoSelecionado.status === "aprovado" ||
                    agendamentoSelecionado.status === "recusado" ||
                    agendamentoSelecionado.status === "concluido"
                      ? "#9CA3AF"
                      : "#1B4D3E",
                  fontSize: "15px",
                  fontWeight: "700",
                  cursor:
                    agendamentoSelecionado.status === "aprovado" ||
                    agendamentoSelecionado.status === "recusado" ||
                    agendamentoSelecionado.status === "concluido"
                      ? "not-allowed"
                      : "pointer",
                  transition: "all 0.2s ease",
                  boxShadow:
                    agendamentoSelecionado.status === "aprovado" ||
                    agendamentoSelecionado.status === "recusado" ||
                    agendamentoSelecionado.status === "concluido"
                      ? "none"
                      : "0 2px 8px rgba(27, 77, 62, 0.15)",
                }}
                onMouseEnter={(e) => {
                  if (
                    agendamentoSelecionado.status !== "aprovado" &&
                    agendamentoSelecionado.status !== "recusado" &&
                    agendamentoSelecionado.status !== "concluido"
                  ) {
                    e.target.style.background = "linear-gradient(135deg, #D4E9DD 0%, #C8E6D4 100%)"
                    e.target.style.transform = "translateY(-2px)"
                    e.target.style.boxShadow = "0 4px 12px rgba(27, 77, 62, 0.25)"
                  }
                }}
                onMouseLeave={(e) => {
                  if (
                    agendamentoSelecionado.status !== "aprovado" &&
                    agendamentoSelecionado.status !== "recusado" &&
                    agendamentoSelecionado.status !== "concluido"
                  ) {
                    e.target.style.background = "linear-gradient(135deg, #E8F3ED 0%, #D4E9DD 100%)"
                    e.target.style.transform = "translateY(0)"
                    e.target.style.boxShadow = "0 2px 8px rgba(27, 77, 62, 0.15)"
                  }
                }}
              >
                ✓ Aprovar
              </button>
              <button
                onClick={() => {
                  setMostrarModalRecusa(true)
                  setMotivoRecusa("")
                }}
                disabled={
                  agendamentoSelecionado.status === "aprovado" ||
                  agendamentoSelecionado.status === "recusado" ||
                  agendamentoSelecionado.status === "concluido"
                }
                style={{
                  flex: 1,
                  padding: "14px 24px",
                  borderRadius: "12px",
                  border:
                    agendamentoSelecionado.status === "aprovado" ||
                    agendamentoSelecionado.status === "recusado" ||
                    agendamentoSelecionado.status === "concluido"
                      ? "2px solid #D1D5DB"
                      : "2px solid #C17B5C",
                  background:
                    agendamentoSelecionado.status === "aprovado" ||
                    agendamentoSelecionado.status === "recusado" ||
                    agendamentoSelecionado.status === "concluido"
                      ? "#F3F4F6"
                      : "linear-gradient(135deg, #F9E8E4 0%, #F3DDD3 100%)",
                  color:
                    agendamentoSelecionado.status === "aprovado" ||
                    agendamentoSelecionado.status === "recusado" ||
                    agendamentoSelecionado.status === "concluido"
                      ? "#9CA3AF"
                      : "#8B4513",
                  fontSize: "15px",
                  fontWeight: "700",
                  cursor:
                    agendamentoSelecionado.status === "aprovado" ||
                    agendamentoSelecionado.status === "recusado" ||
                    agendamentoSelecionado.status === "concluido"
                      ? "not-allowed"
                      : "pointer",
                  transition: "all 0.2s ease",
                  boxShadow:
                    agendamentoSelecionado.status === "aprovado" ||
                    agendamentoSelecionado.status === "recusado" ||
                    agendamentoSelecionado.status === "concluido"
                      ? "none"
                      : "0 2px 8px rgba(139, 69, 19, 0.15)",
                }}
                onMouseEnter={(e) => {
                  if (
                    agendamentoSelecionado.status !== "aprovado" &&
                    agendamentoSelecionado.status !== "recusado" &&
                    agendamentoSelecionado.status !== "concluido"
                  ) {
                    e.target.style.background = "linear-gradient(135deg, #F3DDD3 0%, #EDD0C3 100%)"
                    e.target.style.transform = "translateY(-2px)"
                    e.target.style.boxShadow = "0 4px 12px rgba(139, 69, 19, 0.25)"
                  }
                }}
                onMouseLeave={(e) => {
                  if (
                    agendamentoSelecionado.status !== "aprovado" &&
                    agendamentoSelecionado.status !== "recusado" &&
                    agendamentoSelecionado.status !== "concluido"
                  ) {
                    e.target.style.background = "linear-gradient(135deg, #F9E8E4 0%, #F3DDD3 100%)"
                    e.target.style.transform = "translateY(0)"
                    e.target.style.boxShadow = "0 2px 8px rgba(139, 69, 19, 0.15)"
                  }
                }}
              >
                × Recusar
              </button>
              <button
                onClick={() => deletarAgendamento(agendamentoSelecionado._id)}
                style={{
                  padding: "14px 24px",
                  borderRadius: "12px",
                  border: "2px solid #E5E7EB",
                  backgroundColor: "#fff",
                  color: "#6B7280",
                  fontSize: "15px",
                  fontWeight: "700",
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                  boxShadow: "0 2px 8px rgba(0, 0, 0, 0.06)",
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = "#F9FAFB"
                  e.target.style.borderColor = "#D1D5DB"
                  e.target.style.color = "#6B7280"
                  e.target.style.transform = "translateY(-2px)"
                  e.target.style.boxShadow = "0 4px 12px rgba(0, 0, 0, 0.15)"
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = "#fff"
                  e.target.style.borderColor = "#E5E7EB"
                  e.target.style.color = "#6B7280"
                  e.target.style.transform = "translateY(0)"
                  e.target.style.boxShadow = "0 2px 8px rgba(0, 0, 0, 0.06)"
                }}
              >
                Excluir
              </button>
            </div>
          </div>
        </div>
      )}

      {mostrarModalRecusa && agendamentoSelecionado && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0, 0, 0, 0.7)",
            backdropFilter: "blur(6px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1001,
            padding: "20px",
          }}
          onClick={() => {
            setMostrarModalRecusa(false)
            setMotivoRecusa("")
          }}
        >
          <div
            style={{
              backgroundColor: "#fff",
              borderRadius: "24px",
              maxWidth: "550px",
              width: "100%",
              boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.3)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Refusal Modal Header */}
            <div
              style={{
                padding: "32px 36px",
                borderBottom: "2px solid #E5E7EB",
                background: "linear-gradient(to bottom, #FBE9E7 0%, #fff 100%)",
              }}
            >
              <h2
                style={{
                  fontSize: "22px",
                  fontWeight: "700",
                  color: "#1F2937",
                  margin: 0,
                  letterSpacing: "-0.3px",
                }}
              >
                Motivo da Recusa
              </h2>
              <p
                style={{
                  fontSize: "15px",
                  color: "#6B7280",
                  marginTop: "10px",
                  marginBottom: 0,
                  lineHeight: "1.6",
                }}
              >
                Por favor, informe o motivo da recusa deste serviço
              </p>
            </div>

            {/* Refusal Modal Content */}
            <div style={{ padding: "32px 36px" }}>
              <textarea
                value={motivoRecusa}
                onChange={(e) => setMotivoRecusa(e.target.value)}
                placeholder="Digite o motivo da recusa..."
                style={{
                  width: "100%",
                  minHeight: "140px",
                  padding: "16px 18px",
                  borderRadius: "12px",
                  border: "2px solid #D4E7D7",
                  backgroundColor: "#FEFDFB",
                  fontSize: "15px",
                  color: "#1F2937",
                  fontFamily: "inherit",
                  resize: "vertical",
                  outline: "none",
                  transition: "all 0.2s ease",
                  lineHeight: "1.6",
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = "#1B4D3E"
                  e.target.style.boxShadow = "0 0 0 4px rgba(27, 77, 62, 0.1)"
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = "#D4E7D7"
                  e.target.style.boxShadow = "none"
                }}
              />
            </div>

            {/* Refusal Modal Footer */}
            <div
              style={{
                padding: "24px 36px",
                borderTop: "2px solid #E5E7EB",
                display: "flex",
                gap: "12px",
                justifyContent: "flex-end",
                background: "linear-gradient(to top, #FAFAF9 0%, #fff 100%)",
              }}
            >
              <button
                onClick={() => {
                  setMostrarModalRecusa(false)
                  setMotivoRecusa("")
                }}
                style={{
                  padding: "12px 28px",
                  borderRadius: "12px",
                  border: "2px solid #E5E7EB",
                  backgroundColor: "#fff",
                  color: "#6B7280",
                  fontSize: "15px",
                  fontWeight: "700",
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                  boxShadow: "0 2px 8px rgba(0, 0, 0, 0.06)",
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = "#F9FAFB"
                  e.target.style.borderColor = "#D1D5DB"
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = "#fff"
                  e.target.style.borderColor = "#E5E7EB"
                }}
              >
                Cancelar
              </button>
              <button
                onClick={() => {
                  if (!motivoRecusa.trim()) {
                    alert("Por favor, informe o motivo da recusa")
                    return
                  }
                  atualizarStatus(agendamentoSelecionado._id, "recusado")
                }}
                style={{
                  padding: "12px 28px",
                  borderRadius: "12px",
                  border: "2px solid #C17B5C",
                  background: "linear-gradient(135deg, #8B4513 0%, #6F3710 100%)",
                  color: "#fff",
                  fontSize: "15px",
                  fontWeight: "700",
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                  boxShadow: "0 4px 12px rgba(139, 69, 19, 0.3)",
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = "linear-gradient(135deg, #6F3710 0%, #5A2C0D 100%)"
                  e.target.style.transform = "translateY(-2px)"
                  e.target.style.boxShadow = "0 6px 16px rgba(139, 69, 19, 0.4)"
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = "linear-gradient(135deg, #8B4513 0%, #6F3710 100%)"
                  e.target.style.transform = "translateY(0)"
                  e.target.style.boxShadow = "0 4px 12px rgba(139, 69, 19, 0.3)"
                }}
              >
                Confirmar Recusa
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  )
}
