"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"

const API_URL = "http://localhost:5050"

const Detalhes = ({ agendamentos, handleHorimetroUpdate }) => {
  const [showHorimetroForm, setShowHorimetroForm] = useState(false)
  const [horimetroInicial, setHorimetroInicial] = useState("")
  const [horimetroFinal, setHorimetroFinal] = useState("")

  const horasTotais =
    agendamentos.horimetro_inicial != null && agendamentos.horimetro_final != null
      ? Number(agendamentos.horimetro_final) - Number(agendamentos.horimetro_inicial)
      : null

  const isDone = agendamentos.status?.toLowerCase() === "concluido"
  const endereco = agendamentos.enderecoUsuario || {}

  const saveHorimetro = async () => {
    if (!horimetroInicial || !horimetroFinal) {
      alert("Por favor, preencha ambos os campos de horímetro.")
      return
    }
    if (Number(horimetroFinal) <= Number(horimetroInicial)) {
      alert("O horímetro final deve ser maior que o inicial.")
      return
    }
    await handleHorimetroUpdate(agendamentos._id, Number(horimetroInicial), Number(horimetroFinal))
    setShowHorimetroForm(false)
    setHorimetroInicial("")
    setHorimetroFinal("")
  }

  // Function to open Google Maps with the address
  const openInMaps = () => {
    const addressParts = []
    if (endereco.rua && endereco.numero) {
      addressParts.push(`${endereco.rua}, ${endereco.numero}`)
    }
    if (endereco.bairro) addressParts.push(endereco.bairro)
    if (endereco.cidade) addressParts.push(endereco.cidade)
    if (endereco.uf) addressParts.push(endereco.uf)
    if (endereco.cep) addressParts.push(endereco.cep)

    const fullAddress = addressParts.join(", ")
    const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(fullAddress)}`
    window.open(mapsUrl, "_blank")
  }

  return (
    <div
      style={{
        padding: "24px",
        backgroundColor: "#FAFAF9",
        borderTop: "1px solid #E5E7EB",
      }}
    >
      {/* Primary Info Grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: "12px",
          marginBottom: "20px",
        }}
      >
        {/* Data */}
        <div
          style={{
            padding: "12px 16px",
            backgroundColor: "#fff",
            borderRadius: "10px",
            border: "1px solid #E5E7EB",
          }}
        >
          <div
            style={{
              fontSize: "11px",
              color: "#6B7280",
              fontWeight: "600",
              marginBottom: "4px",
              textTransform: "uppercase",
              letterSpacing: "0.5px",
            }}
          >
            Data
          </div>
          <div style={{ fontSize: "14px", color: "#1B4D3E", fontWeight: "600" }}>
            {new Date(agendamentos.data_servico).toLocaleDateString("pt-BR", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            })}
          </div>
        </div>

        {/* Hora */}
        <div
          style={{
            padding: "12px 16px",
            backgroundColor: "#fff",
            borderRadius: "10px",
            border: "1px solid #E5E7EB",
          }}
        >
          <div
            style={{
              fontSize: "11px",
              color: "#6B7280",
              fontWeight: "600",
              marginBottom: "4px",
              textTransform: "uppercase",
              letterSpacing: "0.5px",
            }}
          >
            Horário
          </div>
          <div style={{ fontSize: "14px", color: "#1B4D3E", fontWeight: "600" }}>{agendamentos.hora}</div>
        </div>

        {/* Tempo Estimado */}
        {agendamentos.tempo_estimado && (
          <div
            style={{
              padding: "12px 16px",
              backgroundColor: "#fff",
              borderRadius: "10px",
              border: "1px solid #E5E7EB",
            }}
          >
            <div
              style={{
                fontSize: "11px",
                color: "#6B7280",
                fontWeight: "600",
                marginBottom: "4px",
                textTransform: "uppercase",
                letterSpacing: "0.5px",
              }}
            >
              Duração
            </div>
            <div style={{ fontSize: "14px", color: "#1B4D3E", fontWeight: "600" }}>{agendamentos.tempo_estimado}</div>
          </div>
        )}

        {/* Usuário */}
        <div
          style={{
            padding: "12px 16px",
            backgroundColor: "#fff",
            borderRadius: "10px",
            border: "1px solid #E5E7EB",
          }}
        >
          <div
            style={{
              fontSize: "11px",
              color: "#6B7280",
              fontWeight: "600",
              marginBottom: "4px",
              textTransform: "uppercase",
              letterSpacing: "0.5px",
            }}
          >
            Solicitante
          </div>
          <div style={{ fontSize: "14px", color: "#1B4D3E", fontWeight: "600" }}>{agendamentos.nomeUsuario}</div>
        </div>
      </div>

      {/* Endereço do Solicitante */}
      {(endereco.rua || endereco.cidade) && (
        <div
          style={{
            padding: "16px 18px",
            backgroundColor: "#fff",
            borderRadius: "12px",
            border: "1px solid #E5E7EB",
            marginBottom: "20px",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "flex-start",
              justifyContent: "space-between",
              gap: "12px",
            }}
          >
            <div style={{ flex: 1 }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  marginBottom: "10px",
                }}
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#1B4D3E"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
                <div
                  style={{
                    fontSize: "11px",
                    color: "#1B4D3E",
                    fontWeight: "600",
                    textTransform: "uppercase",
                    letterSpacing: "0.5px",
                  }}
                >
                  Endereço do Local
                </div>
              </div>
              <div style={{ fontSize: "14px", color: "#374151", lineHeight: "1.6" }}>
                {endereco.rua && endereco.numero && (
                  <div style={{ marginBottom: "4px" }}>
                    <strong>
                      {endereco.rua}, {endereco.numero}
                    </strong>
                    {endereco.complemento && ` - ${endereco.complemento}`}
                  </div>
                )}
                {endereco.bairro && <div style={{ marginBottom: "4px" }}>{endereco.bairro}</div>}
                {(endereco.cidade || endereco.uf || endereco.cep) && (
                  <div>
                    {endereco.cidade && `${endereco.cidade}`}
                    {endereco.uf && ` - ${endereco.uf}`}
                    {endereco.cep && ` • CEP: ${endereco.cep}`}
                  </div>
                )}
              </div>
            </div>
            <button
              onClick={openInMaps}
              style={{
                padding: "10px 16px",
                backgroundColor: "#1B4D3E",
                color: "#fff",
                border: "none",
                borderRadius: "8px",
                fontSize: "13px",
                fontWeight: "600",
                cursor: "pointer",
                transition: "all 0.3s ease",
                boxShadow: "0 2px 8px rgba(27, 77, 62, 0.2)",
                display: "flex",
                alignItems: "center",
                gap: "6px",
                whiteSpace: "nowrap",
                flexShrink: 0,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "#153D2F"
                e.currentTarget.style.transform = "translateY(-1px)"
                e.currentTarget.style.boxShadow = "0 4px 12px rgba(27, 77, 62, 0.3)"
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "#1B4D3E"
                e.currentTarget.style.transform = "translateY(0)"
                e.currentTarget.style.boxShadow = "0 2px 8px rgba(27, 77, 62, 0.2)"
              }}
            >
              <svg style={{ width: "16px", height: "16px" }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
              Ver no Maps
            </button>
          </div>
        </div>
      )}

      {/* Máquina e Implemento */}
      {(agendamentos.maquina_id || agendamentos.implemento_id) && (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: "12px",
            marginBottom: "20px",
          }}
        >
          {agendamentos.maquina_id && (
            <div
              style={{
                padding: "12px 16px",
                backgroundColor: "#fff",
                borderRadius: "10px",
                border: "1px solid #E5E7EB",
              }}
            >
              <div
                style={{
                  fontSize: "11px",
                  color: "#6B7280",
                  fontWeight: "600",
                  marginBottom: "4px",
                  textTransform: "uppercase",
                  letterSpacing: "0.5px",
                }}
              >
                Máquina
              </div>
              <div style={{ fontSize: "14px", color: "#1B4D3E", fontWeight: "600" }}>{agendamentos.maquina_id}</div>
            </div>
          )}

          {agendamentos.implemento_id && (
            <div
              style={{
                padding: "12px 16px",
                backgroundColor: "#fff",
                borderRadius: "10px",
                border: "1px solid #E5E7EB",
              }}
            >
              <div
                style={{
                  fontSize: "11px",
                  color: "#6B7280",
                  fontWeight: "600",
                  marginBottom: "4px",
                  textTransform: "uppercase",
                  letterSpacing: "0.5px",
                }}
              >
                Implemento
              </div>
              <div style={{ fontSize: "14px", color: "#1B4D3E", fontWeight: "600" }}>{agendamentos.implemento_id}</div>
            </div>
          )}
        </div>
      )}

      {/* Observação */}
      {agendamentos.observacao && (
        <div
          style={{
            padding: "14px 16px",
            backgroundColor: "#fff",
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
          <div style={{ fontSize: "14px", color: "#374151", lineHeight: "1.6" }}>{agendamentos.observacao}</div>
        </div>
      )}

      {/* Horas Trabalhadas */}
      {horasTotais != null && (
        <div
          style={{
            padding: "14px 16px",
            borderRadius: "10px",
            marginBottom: "16px",
            border: "1px solid #A7F3D0",
            backgroundColor: "#F0FDF4",
            boxShadow: "0 1px 3px rgba(16, 185, 129, 0.08)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "6px" }}>
            <div
              style={{
                width: "32px",
                height: "32px",
                borderRadius: "8px",
                backgroundColor: "#10B981",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <svg
                style={{ width: "16px", height: "16px" }}
                fill="none"
                stroke="#fff"
                viewBox="0 0 24 24"
                strokeWidth={2.5}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <div
                style={{
                  fontSize: "10px",
                  color: "#065F46",
                  fontWeight: "600",
                  marginBottom: "2px",
                  textTransform: "uppercase",
                  letterSpacing: "0.5px",
                }}
              >
                Horas Trabalhadas
              </div>
              <div style={{ fontSize: "20px", color: "#065F46", fontWeight: "700" }}>{horasTotais}h</div>
            </div>
          </div>
          <div
            style={{
              fontSize: "12px",
              color: "#065F46",
              marginTop: "6px",
              paddingTop: "8px",
              borderTop: "1px solid #A7F3D0",
            }}
          >
            Inicial: <strong>{agendamentos.horimetro_inicial}h</strong> • Final:{" "}
            <strong>{agendamentos.horimetro_final}h</strong>
          </div>
        </div>
      )}

      {/* Formulário Horímetro */}
      {!isDone && horasTotais == null && (
        <>
          {!showHorimetroForm ? (
            <button
              onClick={() => setShowHorimetroForm(true)}
              style={{
                padding: "12px 24px",
                backgroundColor: "#1B4D3E",
                color: "#fff",
                border: "none",
                borderRadius: "10px",
                fontSize: "14px",
                fontWeight: "600",
                cursor: "pointer",
                transition: "all 0.3s ease",
                boxShadow: "0 2px 8px rgba(27, 77, 62, 0.2)",
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "#153D2F"
                e.currentTarget.style.transform = "translateY(-1px)"
                e.currentTarget.style.boxShadow = "0 4px 12px rgba(27, 77, 62, 0.3)"
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "#1B4D3E"
                e.currentTarget.style.transform = "translateY(0)"
                e.currentTarget.style.boxShadow = "0 2px 8px rgba(27, 77, 62, 0.2)"
              }}
            >
              <svg style={{ width: "18px", height: "18px" }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              Cadastrar Horímetro
            </button>
          ) : (
            <div
              style={{
                padding: "20px",
                backgroundColor: "#fff",
                borderRadius: "12px",
                border: "2px solid #E5E7EB",
              }}
            >
              <h4
                style={{
                  margin: "0 0 16px 0",
                  color: "#1B4D3E",
                  fontSize: "16px",
                  fontWeight: "600",
                }}
              >
                Registrar Horímetro
              </h4>

              <div style={{ marginBottom: "14px" }}>
                <label
                  style={{
                    display: "block",
                    marginBottom: "6px",
                    fontSize: "13px",
                    fontWeight: "600",
                    color: "#374151",
                  }}
                >
                  Horímetro Inicial
                </label>
                <input
                  type="number"
                  placeholder="Digite o horímetro inicial"
                  value={horimetroInicial}
                  onChange={(e) => setHorimetroInicial(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "11px 14px",
                    borderRadius: "8px",
                    border: "1px solid #D1D5DB",
                    fontSize: "14px",
                    outline: "none",
                    transition: "all 0.3s ease",
                    boxSizing: "border-box",
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = "#1B4D3E"
                    e.target.style.boxShadow = "0 0 0 3px rgba(27, 77, 62, 0.1)"
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = "#D1D5DB"
                    e.target.style.boxShadow = "none"
                  }}
                />
              </div>

              <div style={{ marginBottom: "16px" }}>
                <label
                  style={{
                    display: "block",
                    marginBottom: "6px",
                    fontSize: "13px",
                    fontWeight: "600",
                    color: "#374151",
                  }}
                >
                  Horímetro Final
                </label>
                <input
                  type="number"
                  placeholder="Digite o horímetro final"
                  value={horimetroFinal}
                  onChange={(e) => setHorimetroFinal(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "11px 14px",
                    borderRadius: "8px",
                    border: "1px solid #D1D5DB",
                    fontSize: "14px",
                    outline: "none",
                    transition: "all 0.3s ease",
                    boxSizing: "border-box",
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = "#1B4D3E"
                    e.target.style.boxShadow = "0 0 0 3px rgba(27, 77, 62, 0.1)"
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = "#D1D5DB"
                    e.target.style.boxShadow = "none"
                  }}
                />
              </div>

              <div style={{ display: "flex", gap: "10px" }}>
                <button
                  onClick={() => {
                    setShowHorimetroForm(false)
                    setHorimetroInicial("")
                    setHorimetroFinal("")
                  }}
                  style={{
                    flex: 1,
                    padding: "11px 16px",
                    backgroundColor: "#fff",
                    color: "#6B7280",
                    border: "1px solid #E5E7EB",
                    borderRadius: "8px",
                    fontSize: "14px",
                    fontWeight: "600",
                    cursor: "pointer",
                    transition: "all 0.3s ease",
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
                  Cancelar
                </button>
                <button
                  onClick={saveHorimetro}
                  style={{
                    flex: 1,
                    padding: "11px 16px",
                    backgroundColor: "#1B4D3E",
                    color: "#fff",
                    border: "none",
                    borderRadius: "8px",
                    fontSize: "14px",
                    fontWeight: "600",
                    cursor: "pointer",
                    transition: "all 0.3s ease",
                    boxShadow: "0 2px 8px rgba(27, 77, 62, 0.2)",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = "#153D2F"
                    e.currentTarget.style.boxShadow = "0 4px 12px rgba(27, 77, 62, 0.3)"
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = "#1B4D3E"
                    e.currentTarget.style.boxShadow = "0 2px 8px rgba(27, 77, 62, 0.2)"
                  }}
                >
                  Salvar
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}

export default function ListAgendOperador() {
  const [solicitacoes, setSolicitacoes] = useState([])
  const [expandedId, setExpandedId] = useState(null)
  const [loading, setLoading] = useState(true)
  const [filtroAtivo, setFiltroAtivo] = useState("todos")

  useEffect(() => {
    carregarSolicitacoes()
  }, [])

  async function carregarSolicitacoes() {
    try {
      setLoading(true)
      const res = await fetch(`${API_URL}/solicitacoes`)
      const data = await res.json()
      const aprovadas = data.filter((s) => ["aprovado", "concluido"].includes(s.status?.toLowerCase()))
      const solicitacoesComNomes = await Promise.all(
        aprovadas.map(async (s) => {
          if (s.usuario_id) {
            try {
              const userRes = await fetch(`${API_URL}/associados/${s.usuario_id}`)
              const userData = await userRes.json()
              return {
                ...s,
                nomeUsuario: userData.nome || "Associado",
                enderecoUsuario: userData.endereco || {},
              }
            } catch {
              return { ...s, nomeUsuario: "Desconhecido", enderecoUsuario: {} }
            }
          }
          return { ...s, nomeUsuario: "Desconhecido", enderecoUsuario: {} }
        }),
      )
      const sorted = solicitacoesComNomes.sort((a, b) => {
        const dateA = new Date(a.data_servico)
        const dateB = new Date(b.data_servico)
        // Ordenar por data (mais recente primeiro)
        if (dateB.getTime() !== dateA.getTime()) {
          return dateB.getTime() - dateA.getTime()
        }
        // Se mesma data, ordenar por hora
        const timeA = a.hora || "00:00"
        const timeB = b.hora || "00:00"
        return timeB.localeCompare(timeA)
      })
      setSolicitacoes(sorted)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleHorimetroUpdate = async (id, inicial, final) => {
    try {
      const response = await fetch(`${API_URL}/solicitacoes/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          horimetro_inicial: inicial,
          horimetro_final: final,
          status: "concluido",
        }),
      })

      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(errorText || "Erro ao cadastrar horímetro")
      }

      setSolicitacoes((prev) =>
        prev.map((s) =>
          s._id === id
            ? {
                ...s,
                horimetro_inicial: inicial,
                horimetro_final: final,
                status: "concluido",
              }
            : s,
        ),
      )

      alert("Horímetro cadastrado com sucesso!")
    } catch (err) {
      console.error("Erro ao cadastrar horímetro:", err)
      alert("Erro ao cadastrar horímetro: " + err.message)
    }
  }

  const solicitacoesFiltradas = solicitacoes.filter((s) => {
    if (filtroAtivo === "todos") return true
    if (filtroAtivo === "pendentes") return s.status?.toLowerCase() === "aprovado"
    if (filtroAtivo === "concluidos") return s.status?.toLowerCase() === "concluido"
    return true
  })

  const countPendentes = solicitacoes.filter((s) => s.status?.toLowerCase() === "aprovado").length
  const countConcluidos = solicitacoes.filter((s) => s.status?.toLowerCase() === "concluido").length

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
              width: "56px",
              height: "56px",
              border: "4px solid #E5E7EB",
              borderTop: "4px solid #1B4D3E",
              borderRadius: "50%",
              animation: "spin 1s linear infinite",
              margin: "0 auto 20px",
            }}
          />
          <p style={{ color: "#1B4D3E", fontWeight: "600", fontSize: "15px" }}>Carregando agendamentos...</p>
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
              fontSize: "36px",
              fontWeight: "700",
              color: "#1B4D3E",
              margin: "0 0 8px 0",
              display: "flex",
              alignItems: "center",
              gap: "12px",
            }}
          >
            Meus Agendamentos
          </h1>
          <p style={{ fontSize: "16px", color: "#6B7280", margin: 0 }}>
            Gerencie seus agendamentos aprovados e concluídos
          </p>
        </div>

        {/* Filtros */}
        <div
          style={{
            backgroundColor: "#fff",
            borderRadius: "12px",
            padding: "8px",
            marginBottom: "24px",
            boxShadow: "0 2px 8px rgba(0, 0, 0, 0.06)",
            display: "inline-flex",
            gap: "8px",
          }}
        >
          <button
            onClick={() => setFiltroAtivo("todos")}
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
            onClick={() => setFiltroAtivo("pendentes")}
            style={{
              padding: "10px 20px",
              borderRadius: "8px",
              border: "none",
              backgroundColor: filtroAtivo === "pendentes" ? "#1B4D3E" : "transparent",
              color: filtroAtivo === "pendentes" ? "#fff" : "#6B7280",
              fontSize: "14px",
              fontWeight: "600",
              cursor: "pointer",
              transition: "all 0.2s ease",
              display: "flex",
              alignItems: "center",
              gap: "6px",
            }}
          >
            A Fazer
            <span
              style={{
                backgroundColor: filtroAtivo === "pendentes" ? "rgba(255,255,255,0.25)" : "#FEF3C7",
                color: filtroAtivo === "pendentes" ? "#fff" : "#92400E",
                padding: "2px 8px",
                borderRadius: "12px",
                fontSize: "12px",
                fontWeight: "600",
              }}
            >
              {countPendentes}
            </span>
          </button>

          <button
            onClick={() => setFiltroAtivo("concluidos")}
            style={{
              padding: "10px 20px",
              borderRadius: "8px",
              border: "none",
              backgroundColor: filtroAtivo === "concluidos" ? "#1B4D3E" : "transparent",
              color: filtroAtivo === "concluidos" ? "#fff" : "#6B7280",
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
                backgroundColor: filtroAtivo === "concluidos" ? "rgba(255,255,255,0.25)" : "#D1FAE5",
                color: filtroAtivo === "concluidos" ? "#fff" : "#065F46",
                padding: "2px 8px",
                borderRadius: "12px",
                fontSize: "12px",
                fontWeight: "600",
              }}
            >
              {countConcluidos}
            </span>
          </button>
        </div>

        {/* Lista de Agendamentos */}
        {solicitacoesFiltradas.length === 0 ? (
          <div
            style={{
              padding: "60px 20px",
              textAlign: "center",
              backgroundColor: "#fff",
              borderRadius: "16px",
              boxShadow: "0 2px 8px rgba(0, 0, 0, 0.06)",
              border: "1px solid #E5E7EB",
            }}
          >
            <div
              style={{
                width: "64px",
                height: "64px",
                borderRadius: "50%",
                backgroundColor: "#F9FAFB",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 16px",
              }}
            >
              <svg
                style={{
                  width: "32px",
                  height: "32px",
                  color: "#D1D5DB",
                }}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
            <p style={{ color: "#6B7280", fontSize: "15px", margin: 0 }}>
              {filtroAtivo === "todos" && "Nenhum agendamento encontrado"}
              {filtroAtivo === "pendentes" && "Nenhum agendamento pendente"}
              {filtroAtivo === "concluidos" && "Nenhum agendamento concluído"}
            </p>
          </div>
        ) : (
          <motion.div layout style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            {solicitacoesFiltradas.map((s) => {
              const isExpanded = expandedId === s._id
              const isDone = s.status?.toLowerCase() === "concluido"

              return (
                <motion.div
                  key={s._id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  style={{
                    backgroundColor: "#fff",
                    borderRadius: "16px",
                    overflow: "hidden",
                    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.06)",
                    transition: "all 0.3s ease",
                    border: "1px solid #E5E7EB",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.boxShadow = "0 8px 20px rgba(0, 0, 0, 0.1)"
                    e.currentTarget.style.borderColor = "#D1D5DB"
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.boxShadow = "0 2px 8px rgba(0, 0, 0, 0.06)"
                    e.currentTarget.style.borderColor = "#E5E7EB"
                  }}
                >
                  {/* Card Header */}
                  <div
                    onClick={() => setExpandedId(isExpanded ? null : s._id)}
                    style={{
                      padding: "20px 24px",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      cursor: "pointer",
                      backgroundColor: isExpanded ? "#FAFAF9" : "#fff",
                      transition: "background-color 0.3s ease",
                    }}
                  >
                    <div style={{ flex: 1 }}>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "12px",
                          marginBottom: "8px",
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
                        <div
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "4px",
                            padding: "4px 12px",
                            backgroundColor: isDone ? "#D1FAE5" : "#FEF3C7",
                            color: isDone ? "#065F46" : "#92400E",
                            borderRadius: "12px",
                            fontSize: "11px",
                            fontWeight: "600",
                          }}
                        >
                          {isDone ? (
                            <>
                              <svg
                                style={{ width: "12px", height: "12px" }}
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                              </svg>
                              Concluído
                            </>
                          ) : (
                            <>
                              <svg
                                style={{ width: "12px", height: "12px" }}
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
                              A Fazer
                            </>
                          )}
                        </div>
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

                    <div
                      style={{
                        width: "32px",
                        height: "32px",
                        borderRadius: "50%",
                        backgroundColor: "#F3F4F6",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        transition: "all 0.3s ease",
                        transform: isExpanded ? "rotate(180deg)" : "rotate(0deg)",
                      }}
                    >
                      <svg
                        style={{ width: "16px", height: "16px", color: "#6B7280" }}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>

                  {/* Expanded Content */}
                  <div
                    style={{
                      maxHeight: isExpanded ? "2000px" : "0",
                      overflow: "hidden",
                      transition: "max-height 0.4s ease-in-out",
                    }}
                  >
                    <Detalhes agendamentos={s} handleHorimetroUpdate={handleHorimetroUpdate} />
                  </div>
                </motion.div>
              )
            })}
          </motion.div>
        )}
      </div>
    </div>
  )
}
