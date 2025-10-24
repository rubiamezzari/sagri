
import { useEffect, useState } from "react"
import { Search, Wrench, Tractor, Settings, Plus } from "lucide-react"
import CreateServico from "./CreateServico"

const API_URL = "http://localhost:5050"

const DetalhesServico = ({ servico, onClose, onDeleted, onUpdated }) => {
  const [isEditing, setIsEditing] = useState(false)
  const [focusField, setFocusField] = useState(null)
  const servicoId = servico?.id || servico?._id

  const [form, setForm] = useState({
    nome: servico?.nome || "",
    maquina_tipo:
      typeof servico?.maquina_tipo === "string" ? servico.maquina_tipo : JSON.stringify(servico?.maquina_tipo) || "",
    implemento_tipo:
      typeof servico?.implemento_tipo === "string"
        ? servico.implemento_tipo
        : JSON.stringify(servico?.implemento_tipo) || "",
    observacao: servico?.observacao || "",
  })

  function updateForm(value) {
    setForm((prev) => ({ ...prev, ...value }))
  }

  async function handleSave() {
    try {
      const response = await fetch(`${API_URL}/servicos/update/${servicoId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      })

      if (!response.ok) {
        alert("Erro ao atualizar serviço.")
        return
      }

      alert("Serviço atualizado com sucesso!")
      setIsEditing(false)
      if (onUpdated) {
        onUpdated({ ...servico, ...form, _id: servicoId })
      }
    } catch (error) {
      console.error("Erro ao atualizar:", error)
      alert("Erro ao atualizar serviço.")
    }
  }

  function handleCancelEdit() {
    if (window.confirm("Deseja cancelar as alterações?")) {
      setForm({
        nome: servico?.nome || "",
        maquina_tipo:
          typeof servico?.maquina_tipo === "string"
            ? servico.maquina_tipo
            : JSON.stringify(servico?.maquina_tipo) || "",
        implemento_tipo:
          typeof servico?.implemento_tipo === "string"
            ? servico.implemento_tipo
            : JSON.stringify(servico?.implemento_tipo) || "",
        observacao: servico?.observacao || "",
      })
      setIsEditing(false)
    }
  }

  async function handleExcluir() {
    if (!window.confirm("Tem certeza que deseja excluir este serviço?")) return
    try {
      const resp = await fetch(`${API_URL}/servicos/${servicoId}`, {
        method: "DELETE",
      })
      if (resp.ok) {
        alert("Serviço excluído com sucesso!")
        onDeleted && onDeleted(servicoId)
        onClose && onClose()
      } else {
        alert("Erro ao excluir serviço.")
      }
    } catch (err) {
      alert("Erro: " + err.message)
    }
  }

  if (!servico) return null

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
        padding: "20px",
      }}
      onClick={onClose}
    >
      <div
        style={{
          backgroundColor: "#fff",
          borderRadius: "16px",
          maxWidth: "700px",
          width: "100%",
          maxHeight: "90vh",
          overflow: "hidden",
          boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1)",
          display: "flex",
          flexDirection: "column",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          style={{
            padding: "24px 32px",
            borderBottom: "1px solid #E5E7EB",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div style={{ flex: 1, minWidth: 0 }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "16px",
                marginBottom: "8px",
              }}
            >
              <div
                style={{
                  width: "56px",
                  height: "56px",
                  borderRadius: "50%",
                  backgroundColor: "#1B4D3E",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                <Wrench style={{ width: "28px", height: "28px", color: "#fff" }} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <h2
                  style={{
                    fontSize: "24px",
                    fontWeight: "600",
                    color: "#1F2937",
                    margin: 0,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {isEditing ? "Editar Serviço" : servico?.nome || "Serviço"}
                </h2>
                <p
                  style={{
                    fontSize: "14px",
                    color: "#6B7280",
                    margin: "4px 0 0 0",
                  }}
                >
                  {isEditing ? "Atualize as informações abaixo" : `ID: ${servicoId || "-"}`}
                </p>
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              background: "none",
              border: "none",
              fontSize: "28px",
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

        {/* Content */}
        <div
          style={{
            padding: "32px",
            overflowY: "auto",
            flex: 1,
          }}
        >
          {/* VIEW MODE */}
          {!isEditing && (
            <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
              {/* Service Info Section */}
              <div>
                <h3
                  style={{
                    fontSize: "16px",
                    fontWeight: "600",
                    color: "#1B4D3E",
                    marginBottom: "16px",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                  }}
                >
                  <svg style={{ width: "20px", height: "20px" }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  Informações do Serviço
                </h3>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr",
                    gap: "16px",
                  }}
                >
                  <InfoItem label="Nome do Serviço" value={servico?.nome} />
                </div>
              </div>

              {/* Equipment Section */}
              <div>
                <h3
                  style={{
                    fontSize: "16px",
                    fontWeight: "600",
                    color: "#1B4D3E",
                    marginBottom: "16px",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                  }}
                >
                  <svg style={{ width: "20px", height: "20px" }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"
                    />
                  </svg>
                  Equipamentos Utilizados
                </h3>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: "16px",
                  }}
                >
                  <EquipmentItem
                    label="Máquina"
                    value={
                      typeof servico?.maquina_tipo === "string"
                        ? servico.maquina_tipo
                        : JSON.stringify(servico?.maquina_tipo)
                    }
                  />
                  <EquipmentItem
                   
                    label="Implemento"
                    value={
                      typeof servico?.implemento_tipo === "string"
                        ? servico.implemento_tipo
                        : JSON.stringify(servico?.implemento_tipo)
                    }
                  />
                </div>
              </div>

              {/* Observations */}
              {servico?.observacao && (
                <div
                  style={{
                    padding: "20px",
                    backgroundColor: "#F9FAFB",
                    borderRadius: "12px",
                    border: "1px solid #E5E7EB",
                  }}
                >
                  <div
                    style={{
                      fontSize: "12px",
                      fontWeight: "600",
                      color: "#6B7280",
                      marginBottom: "8px",
                      textTransform: "uppercase",
                      letterSpacing: "0.5px",
                    }}
                  >
                    Observações
                  </div>
                  <div
                    style={{
                      fontSize: "14px",
                      color: "#374151",
                      lineHeight: "1.6",
                    }}
                  >
                    {servico?.observacao}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* EDIT MODE */}
          {isEditing && (
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <div>
                <label
                  style={{
                    display: "block",
                    marginBottom: "6px",
                    color: "#1B4D3E",
                    fontSize: "13px",
                    fontWeight: "500",
                  }}
                >
                  Nome do Serviço *
                </label>
                <input
                  type="text"
                  value={form.nome}
                  onChange={(e) => updateForm({ nome: e.target.value })}
                  onFocus={() => setFocusField("nome")}
                  onBlur={() => setFocusField(null)}
                  required
                  style={{
                    width: "100%",
                    height: "40px",
                    padding: "0 12px",
                    border: "2px solid",
                    borderColor: focusField === "nome" ? "#1B4D3E" : "#D4E7D7",
                    borderRadius: "8px",
                    backgroundColor: "#FEFDFB",
                    fontSize: "14px",
                    outline: "none",
                    transition: "all 0.3s",
                    boxSizing: "border-box",
                  }}
                />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                <div>
                  <label
                    style={{
                      display: "block",
                      marginBottom: "6px",
                      color: "#1B4D3E",
                      fontSize: "13px",
                      fontWeight: "500",
                    }}
                  >
                    Tipo de Máquina *
                  </label>
                  <input
                    type="text"
                    value={form.maquina_tipo}
                    onChange={(e) => updateForm({ maquina_tipo: e.target.value })}
                    onFocus={() => setFocusField("maquina_tipo")}
                    onBlur={() => setFocusField(null)}
                    required
                    style={{
                      width: "100%",
                      height: "40px",
                      padding: "0 12px",
                      border: "2px solid",
                      borderColor: focusField === "maquina_tipo" ? "#1B4D3E" : "#D4E7D7",
                      borderRadius: "8px",
                      backgroundColor: "#FEFDFB",
                      fontSize: "14px",
                      outline: "none",
                      transition: "all 0.3s",
                      boxSizing: "border-box",
                    }}
                  />
                </div>

                <div>
                  <label
                    style={{
                      display: "block",
                      marginBottom: "6px",
                      color: "#1B4D3E",
                      fontSize: "13px",
                      fontWeight: "500",
                    }}
                  >
                    Tipo de Implemento *
                  </label>
                  <input
                    type="text"
                    value={form.implemento_tipo}
                    onChange={(e) => updateForm({ implemento_tipo: e.target.value })}
                    onFocus={() => setFocusField("implemento_tipo")}
                    onBlur={() => setFocusField(null)}
                    required
                    style={{
                      width: "100%",
                      height: "40px",
                      padding: "0 12px",
                      border: "2px solid",
                      borderColor: focusField === "implemento_tipo" ? "#1B4D3E" : "#D4E7D7",
                      borderRadius: "8px",
                      backgroundColor: "#FEFDFB",
                      fontSize: "14px",
                      outline: "none",
                      transition: "all 0.3s",
                      boxSizing: "border-box",
                    }}
                  />
                </div>
              </div>

              <div>
                <label
                  style={{
                    display: "block",
                    marginBottom: "6px",
                    color: "#1B4D3E",
                    fontSize: "13px",
                    fontWeight: "500",
                  }}
                >
                  Observações
                </label>
                <textarea
                  value={form.observacao}
                  onChange={(e) => updateForm({ observacao: e.target.value })}
                  onFocus={() => setFocusField("observacao")}
                  onBlur={() => setFocusField(null)}
                  rows={3}
                  style={{
                    width: "100%",
                    padding: "12px",
                    border: "2px solid",
                    borderColor: focusField === "observacao" ? "#1B4D3E" : "#D4E7D7",
                    borderRadius: "8px",
                    backgroundColor: "#FEFDFB",
                    fontSize: "14px",
                    outline: "none",
                    transition: "all 0.3s",
                    boxSizing: "border-box",
                    fontFamily: "inherit",
                    resize: "vertical",
                  }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div
          style={{
            padding: "24px 32px",
            borderTop: "1px solid #E5E7EB",
            display: "flex",
            gap: "12px",
            justifyContent: "flex-end",
          }}
        >
          {!isEditing ? (
            <>
              <button
                onClick={() => setIsEditing(true)}
                style={{
                  padding: "12px 24px",
                  borderRadius: "8px",
                  border: "1px solid #1B4D3E",
                  backgroundColor: "#1B4D3E",
                  color: "#fff",
                  fontSize: "14px",
                  fontWeight: "600",
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow = "0 4px 12px rgba(27, 77, 62, 0.3)"
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = "none"
                }}
              >
                Editar
              </button>

              <button
                onClick={handleExcluir}
                style={{
                  padding: "12px 24px",
                  borderRadius: "8px",
                  border: "1px solid #DC2626",
                  backgroundColor: "transparent",
                  color: "#DC2626",
                  fontSize: "14px",
                  fontWeight: "600",
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = "#FEE2E2"
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = "transparent"
                }}
              >
                Excluir
              </button>
            </>
          ) : (
            <>
              <button
                onClick={handleCancelEdit}
                style={{
                  padding: "12px 24px",
                  borderRadius: "8px",
                  border: "2px solid #DC2626",
                  backgroundColor: "transparent",
                  color: "#DC2626",
                  fontSize: "14px",
                  fontWeight: "600",
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = "#FEE2E2"
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = "transparent"
                }}
              >
                Cancelar
              </button>

              <button
                onClick={handleSave}
                style={{
                  padding: "12px 24px",
                  borderRadius: "8px",
                  border: "none",
                  backgroundColor: "#1B4D3E",
                  color: "#fff",
                  fontSize: "14px",
                  fontWeight: "600",
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow = "0 4px 12px rgba(27, 77, 62, 0.3)"
                  e.currentTarget.style.transform = "translateY(-2px)"
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = "none"
                  e.currentTarget.style.transform = "translateY(0)"
                }}
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
                  <polyline points="17 21 17 13 7 13 7 21" />
                  <polyline points="7 3 7 8 15 8" />
                </svg>
                Salvar Alterações
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

// Helper component for displaying info items
function InfoItem({ label, value }) {
  return (
    <div>
      <div
        style={{
          fontSize: "12px",
          fontWeight: "600",
          color: "#6B7280",
          marginBottom: "6px",
          textTransform: "uppercase",
          letterSpacing: "0.5px",
        }}
      >
        {label}
      </div>
      <div
        style={{
          fontSize: "15px",
          color: "#1F2937",
          fontWeight: "500",
        }}
      >
        {value || "-"}
      </div>
    </div>
  )
}

// Helper component for equipment items
function EquipmentItem({ icon, label, value }) {
  return (
    <div
      style={{
        padding: "16px",
        backgroundColor: "#F9FAFB",
        borderRadius: "12px",
        border: "1px solid #E5E7EB",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          marginBottom: "8px",
          color: "#1B4D3E",
        }}
      >
        {icon}
        <span
          style={{
            fontSize: "12px",
            fontWeight: "600",
            color: "#6B7280",
            textTransform: "uppercase",
            letterSpacing: "0.5px",
          }}
        >
          {label}
        </span>
      </div>
      <div
        style={{
          fontSize: "15px",
          color: "#1F2937",
          fontWeight: "600",
        }}
      >
        {value || "-"}
      </div>
    </div>
  )
}

export default function ListServicos() {
  const [servicos, setServicos] = useState([])
  const [busca, setBusca] = useState("")
  const [servicoSelecionado, setServicoSelecionado] = useState(null)
  const [mostrarModal, setMostrarModal] = useState(false)
  const [mostrarCriarServico, setMostrarCriarServico] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchServicos()
  }, [])

  async function fetchServicos() {
    try {
      setLoading(true)
      const response = await fetch(`${API_URL}/servicos`)
      const data = await response.json()

      // Ordenar por data de criação (mais recentes primeiro)
      // Se não houver campo de data, ordenar por _id (ObjectId do MongoDB contém timestamp)
      const servicosOrdenados = data.sort((a, b) => {
        if (a.createdAt && b.createdAt) {
          return new Date(b.createdAt) - new Date(a.createdAt)
        }
        // Fallback: ordenar por _id (mais recente primeiro)
        return b._id?.localeCompare(a._id) || 0
      })

      setServicos(servicosOrdenados)
    } catch (error) {
      console.error("Erro ao buscar serviços:", error)
    } finally {
      setLoading(false)
    }
  }

  const servicosFiltrados = servicos.filter(
    (s) =>
      s.nome?.toLowerCase().includes(busca.toLowerCase()) ||
      (typeof s.maquina_tipo === "string" && s.maquina_tipo?.toLowerCase().includes(busca.toLowerCase())) ||
      (typeof s.implemento_tipo === "string" && s.implemento_tipo?.toLowerCase().includes(busca.toLowerCase())),
  )

  const abrirDetalhes = (servico) => {
    setServicoSelecionado(servico)
    setMostrarModal(true)
  }

  const handleDelete = (idDeleted) => {
    setServicos((old) => old.filter((s) => s._id !== idDeleted))
    setMostrarModal(false)
  }

  const handleUpdate = (servicoAtualizado) => {
    setServicos((old) => old.map((s) => (s._id === servicoAtualizado._id ? servicoAtualizado : s)))
    setMostrarModal(false)
  }

  const handleServicoCreated = (novoServico) => {
    // Adicionar o novo serviço no início da lista
    setServicos((old) => [novoServico, ...old])
    setMostrarCriarServico(false)
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
              width: "56px",
              height: "56px",
              border: "4px solid #E5E7EB",
              borderTop: "4px solid #1B4D3E",
              borderRadius: "50%",
              animation: "spin 1s linear infinite",
              margin: "0 auto 20px",
            }}
          />
          <p style={{ color: "#1B4D3E", fontWeight: "600", fontSize: "15px" }}>Carregando serviços...</p>
        </div>
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
      <div style={{ maxWidth: "1800px", margin: "0 auto",width:"100%"}}>
        {/* Header */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "32px",
            flexWrap: "wrap",
            gap: "16px",
          }}
        >
          <div>
            <h1
              style={{
                color: "#1B4D3E",
                fontSize: "36px",
                fontWeight: "700",
                margin: "0 0 8px 0",
                display: "flex",
                alignItems: "center",
                gap: "12px",
              }}
            >
              Serviços
            </h1>
          </div>

          {/* Add Button */}
          <button
            onClick={() => setMostrarCriarServico(true)}
            style={{
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
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "#153D2F"
              e.currentTarget.style.transform = "translateY(-2px)"
              e.currentTarget.style.boxShadow = "0 4px 12px rgba(27, 77, 62, 0.3)"
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "#1B4D3E"
              e.currentTarget.style.transform = "translateY(0)"
              e.currentTarget.style.boxShadow = "0 2px 8px rgba(27, 77, 62, 0.2)"
            }}
          >
            <Plus
              style={{
                color: "#A8E6CF", // verde claro
                fontSize: "22px",
                fontWeight: "700",
                marginRight: "4px",
              }}
            />
            Novo Serviço
          </button>
        </div>

        {/* Search Bar */}
        <div style={{ marginBottom: "28px", position: "relative" }}>
          <Search
            style={{
              position: "absolute",
              left: "16px",
              top: "50%",
              transform: "translateY(-50%)",
              width: "20px",
              height: "20px",
              color: "#9CA3AF",
            }}
          />
          <input
            type="text"
            placeholder="Buscar serviços por nome, máquina ou implemento..."
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            style={{
              width: "100%",
              padding: "14px 16px 14px 48px",
              borderRadius: "12px",
              border: "1px solid #E5E7EB",
              backgroundColor: "#fff",
              fontSize: "15px",
              outline: "none",
              transition: "all 0.2s ease",
              boxShadow: "0 1px 3px rgba(0, 0, 0, 0.08)",
            }}
            onFocus={(e) => {
              e.target.style.borderColor = "#1B4D3E"
              e.target.style.boxShadow = "0 0 0 3px rgba(27, 77, 62, 0.1)"
            }}
            onBlur={(e) => {
              e.target.style.borderColor = "#E5E7EB"
              e.target.style.boxShadow = "0 1px 3px rgba(0, 0, 0, 0.08)"
            }}
          />
        </div>

        {/* Empty State */}
        {servicosFiltrados.length === 0 && (
          <div
            style={{
              padding: "80px 20px",
              textAlign: "center",
              backgroundColor: "#fff",
              borderRadius: "20px",
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.08)",
              border: "1px solid #E5E7EB",
            }}
          >
            <div
              style={{
                width: "72px",
                height: "72px",
                borderRadius: "50%",
                backgroundColor: "#F3F4F6",
                margin: "0 auto 20px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Wrench style={{ width: "36px", height: "36px", color: "#9CA3AF" }} />
            </div>
            <h3
              style={{
                fontSize: "18px",
                fontWeight: "600",
                color: "#374151",
                marginBottom: "8px",
              }}
            >
              Nenhum serviço encontrado
            </h3>
            <p style={{ color: "#9CA3AF", fontSize: "14px" }}>
              {busca ? "Tente ajustar sua busca" : "Você ainda não possui serviços cadastrados"}
            </p>
          </div>
        )}

        {/* Cards Grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
            gap: "12px",
          }}
        >
          {servicosFiltrados.map((servico) => (
            <div
              key={servico._id}
              onClick={() => abrirDetalhes(servico)}
              style={{
                backgroundColor: "#fff",
                padding: "16px 14px",
                borderRadius: "16px",
                border: "1px solid #E5E7EB",
                cursor: "pointer",
                transition: "all 0.3s ease",
                boxShadow: "0 2px 8px rgba(0, 0, 0, 0.06)",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                textAlign: "center",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "#FAFAF9"
                e.currentTarget.style.borderColor = "#1B4D3E"
                e.currentTarget.style.transform = "translateY(-4px)"
                e.currentTarget.style.boxShadow = "0 10px 25px rgba(0, 0, 0, 0.12)"
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "#fff"
                e.currentTarget.style.borderColor = "#E5E7EB"
                e.currentTarget.style.transform = "translateY(0)"
                e.currentTarget.style.boxShadow = "0 2px 8px rgba(0, 0, 0, 0.06)"
              }}
            >
              {/* Icon */}
              <div
                style={{
                  width: "44px",
                  height: "44px",
                  borderRadius: "12px",
                  background: "linear-gradient(135deg, #1B4D3E 0%, #153D2F 100%)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: "0 4px 12px rgba(27, 77, 62, 0.2)",
                  marginBottom: "12px",
                }}
              >
                <Wrench style={{ width: "20px", height: "20px", color: "#fff" }} />
              </div>

              {/* Service Name */}
              <h3
                style={{
                  fontSize: "15px",
                  fontWeight: "700",
                  color: "#1B4D3E",
                  margin: "0 0 6px 0",
                  lineHeight: "1.3",
                }}
              >
                {servico.nome}
              </h3>

              {/* Observation Preview */}
              {servico.observacao && (
                <p
                  style={{
                    fontSize: "12px",
                    color: "#6B7280",
                    margin: "0 0 8px 0",
                    lineHeight: "1.5",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    display: "-webkit-box",
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical",
                  }}
                >
                  {servico.observacao}
                </p>
              )}

              {/* View Details Arrow */}
              <div
                style={{
                  marginTop: "auto",
                  paddingTop: "8px",
                  display: "flex",
                  alignItems: "center",
                  gap: "4px",
                  fontSize: "13px",
                  fontWeight: "600",
                  color: "#1B4D3E",
                }}
              >
                Ver detalhes
                <svg style={{ width: "16px", height: "16px" }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          ))}
        </div>

        {/* Modal de Detalhes */}
        {mostrarModal && servicoSelecionado && (
          <DetalhesServico
            servico={servicoSelecionado}
            onClose={() => setMostrarModal(false)}
            onDeleted={handleDelete}
            onUpdated={handleUpdate}
          />
        )}
      </div>

      {/* Modal de Criar Serviço - Renderizado fora do container principal */}
      {mostrarCriarServico && (
        <CreateServico onClose={() => setMostrarCriarServico(false)} onCreated={handleServicoCreated} />
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
