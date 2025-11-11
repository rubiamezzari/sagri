"use client"

import { useEffect, useState } from "react"
import { Search, Wrench, Tractor, Settings, Plus, Edit2, Trash2, X, AlertCircle, Loader2 } from "lucide-react"
import { motion } from "framer-motion"
import CreateServico from "./CreateServico"

const API_URL = "http://localhost:5050"

const EditServico = ({ servico, onClose, onDeleted, onUpdated }) => {
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

  const [maquinas, setMaquinas] = useState([])
  const [implementos, setImplementos] = useState([])
  const [loading, setLoading] = useState(true)
  const [errors, setErrors] = useState({})

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)

        const maquinasRes = await fetch(`${API_URL}/maquinas`)
        if (maquinasRes.ok) {
          const maquinasData = await maquinasRes.json()
          setMaquinas(maquinasData)
        }

        const implementosRes = await fetch(`${API_URL}/implementos`)
        if (implementosRes.ok) {
          const implementosData = await implementosRes.json()
          setImplementos(implementosData)
        }
      } catch (error) {
        console.error("Erro ao carregar dados:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  function updateForm(value) {
    setForm((prev) => ({ ...prev, ...value }))
    Object.keys(value).forEach((key) => {
      if (errors[key]) {
        setErrors((prev) => ({ ...prev, [key]: undefined }))
      }
    })
  }

  function validateForm() {
    const newErrors = {}

    if (!form.nome.trim()) {
      newErrors.nome = "Nome do serviço é obrigatório"
    } else if (form.nome.trim().length < 3) {
      newErrors.nome = "Nome deve ter pelo menos 3 caracteres"
    }

    if (!form.maquina_tipo.trim()) {
      newErrors.maquina_tipo = "Tipo de máquina é obrigatório"
    }

    if (!form.implemento_tipo.trim()) {
      newErrors.implemento_tipo = "Tipo de implemento é obrigatório"
    }

    return newErrors
  }

  async function handleSave() {
    const newErrors = validateForm()

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      alert("Por favor, corrija os erros no formulário antes de salvar.")
      return
    }

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
      if (onUpdated) {
        onUpdated({ ...servico, ...form, _id: servicoId })
      }
      onClose()
    } catch (error) {
      console.error("Erro ao atualizar:", error)
      alert("Erro ao atualizar serviço.")
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
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(27, 77, 62, 0.15)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
        padding: "20px",
        backdropFilter: "blur(8px)",
      }}
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        transition={{ duration: 0.2 }}
        style={{
          backgroundColor: "#FFFFFF",
          borderRadius: "20px",
          maxWidth: "720px",
          width: "100%",
          maxHeight: "90vh",
          overflow: "hidden",
          boxShadow: "0 25px 50px -12px rgba(27, 77, 62, 0.25), 0 0 0 1px rgba(27, 77, 62, 0.05)",
          display: "flex",
          flexDirection: "column",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header with Icon - Same as CreateServico */}
        <div
          style={{
            background: "#FFFFFF",
            padding: "32px 32px 24px",
            borderBottom: "1px solid #E5E7EB",
            position: "relative",
          }}
        >
          {/* Green accent line */}
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              height: "4px",
              background: "linear-gradient(90deg, #1B4D3E 0%, #2A6B4F 100%)",
            }}
          />

          <button
            onClick={onClose}
            style={{
              position: "absolute",
              top: "20px",
              right: "20px",
              border: "1px solid #E5E7EB",
              borderRadius: "10px",
              width: "40px",
              height: "40px",
              cursor: "pointer",
              color: "#6B7280",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "all 0.2s ease",
              backgroundColor: "#F9FAFB",
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = "#F3F4F6"
              e.target.style.borderColor = "#D1D5DB"
              e.target.style.color = "#1F2937"
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = "#F9FAFB"
              e.target.style.borderColor = "#E5E7EB"
              e.target.style.color = "#6B7280"
            }}
          >
            <X size={20} />
          </button>

          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <div
              style={{
                width: "56px",
                height: "56px",
                borderRadius: "14px",
                background: "linear-gradient(135deg, #1B4D3E 0%, #2A6B4F 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
                boxShadow: "0 4px 12px rgba(27, 77, 62, 0.15)",
              }}
            >
              <Wrench size={28} color="#fff" />
            </div>
            <div>
              <h2
                style={{
                  fontSize: "24px",
                  fontWeight: "700",
                  margin: 0,
                  color: "#1F2937",
                  letterSpacing: "-0.5px",
                }}
              >
                Editar Serviço
              </h2>
              <p
                style={{
                  fontSize: "14px",
                  color: "#6B7280",
                  margin: "4px 0 0 0",
                }}
              >
                Atualize as informações do serviço
              </p>
            </div>
          </div>
        </div>

        {/* Content - Same structure as CreateServico */}
        <div
          style={{
            padding: "32px",
            overflowY: "auto",
            flex: 1,
            backgroundColor: "#F9FAFB",
          }}
        >
          {loading ? (
            <div
              style={{
                textAlign: "center",
                padding: "60px 20px",
                color: "#6B7280",
              }}
            >
              <Loader2
                size={48}
                color="#1B4D3E"
                style={{
                  animation: "spin 1s linear infinite",
                  margin: "0 auto 16px",
                  display: "block",
                }}
              />
              <p style={{ fontSize: "15px", fontWeight: "500" }}>Carregando dados...</p>
            </div>
          ) : (
            <div
              style={{
                backgroundColor: "#FFFFFF",
                borderRadius: "16px",
                padding: "24px",
                border: "1px solid #E5E7EB",
                boxShadow: "0 1px 3px rgba(0, 0, 0, 0.05)",
              }}
            >
              <div
                style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "20px" }}
              >
                <div style={{ gridColumn: "1 / -1" }}>
                  <InputField
                    label="Nome do Serviço"
                    name="nome"
                    type="text"
                    value={form.nome}
                    onChange={(e) => updateForm({ nome: e.target.value })}
                    placeholder="Digite o nome do serviço"
                    required
                    error={errors.nome}
                  />
                </div>

                <SelectField
                  label="Tipo de Máquina"
                  name="maquina_tipo"
                  value={form.maquina_tipo}
                  onChange={(e) => updateForm({ maquina_tipo: e.target.value })}
                  options={maquinas}
                  placeholder="Selecione a máquina"
                  required
                  error={errors.maquina_tipo}
                />

                <SelectField
                  label="Tipo de Implemento"
                  name="implemento_tipo"
                  value={form.implemento_tipo}
                  onChange={(e) => updateForm({ implemento_tipo: e.target.value })}
                  options={implementos}
                  placeholder="Selecione o implemento"
                  required
                  error={errors.implemento_tipo}
                />

                <div style={{ gridColumn: "1 / -1" }}>
                  <TextAreaField
                    label="Observações"
                    name="observacao"
                    value={form.observacao}
                    onChange={(e) => updateForm({ observacao: e.target.value })}
                    placeholder="Informações adicionais sobre o serviço..."
                    rows={4}
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions - Updated to match CreateServico style */}
        <div
          style={{
            padding: "24px 32px",
            borderTop: "1px solid #E5E7EB",
            backgroundColor: "#FFFFFF",
            display: "flex",
            gap: "12px",
            justifyContent: "space-between",
          }}
        >
          <button
            onClick={handleExcluir}
            style={{
              padding: "12px 28px",
              borderRadius: "10px",
              border: "1px solid #DC2626",
              backgroundColor: "transparent",
              color: "#DC2626",
              fontSize: "14px",
              fontWeight: "600",
              cursor: "pointer",
              transition: "all 0.2s ease",
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = "#FEE2E2"
              e.target.style.transform = "translateY(-2px)"
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = "transparent"
              e.target.style.transform = "translateY(0)"
            }}
          >
            <Trash2 style={{ width: "16px", height: "16px" }} />
            Excluir
          </button>

          <div style={{ display: "flex", gap: "12px" }}>
            <button
              type="button"
              onClick={onClose}
              style={{
                padding: "12px 28px",
                borderRadius: "10px",
                border: "1px solid #D1D5DB",
                backgroundColor: "#FFFFFF",
                color: "#6B7280",
                fontSize: "14px",
                fontWeight: "600",
                cursor: "pointer",
                transition: "all 0.2s ease",
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = "#F9FAFB"
                e.target.style.transform = "translateY(-2px)"
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = "#FFFFFF"
                e.target.style.transform = "translateY(0)"
              }}
            >
              Cancelar
            </button>

            <button
              onClick={handleSave}
              disabled={loading}
              style={{
                padding: "12px 28px",
                borderRadius: "10px",
                border: "none",
                background: loading ? "#D1D5DB" : "linear-gradient(135deg, #1B4D3E 0%, #2A6B4F 100%)",
                color: "#FFFFFF",
                fontSize: "14px",
                fontWeight: "600",
                cursor: loading ? "not-allowed" : "pointer",
                transition: "all 0.2s ease",
                boxShadow: loading ? "none" : "0 4px 12px rgba(27, 77, 62, 0.2)",
              }}
              onMouseEnter={(e) => {
                if (!loading) {
                  e.target.style.transform = "translateY(-2px)"
                  e.target.style.boxShadow = "0 6px 16px rgba(27, 77, 62, 0.3)"
                }
              }}
              onMouseLeave={(e) => {
                if (!loading) {
                  e.target.style.transform = "translateY(0)"
                  e.target.style.boxShadow = "0 4px 12px rgba(27, 77, 62, 0.2)"
                }
              }}
            >
              Salvar Alterações
            </button>
          </div>
        </div>
      </motion.div>

      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </motion.div>
  )
}

function InputField({ label, name, type, value, onChange, placeholder, required = false, error }) {
  return (
    <div>
      <label
        style={{
          display: "block",
          fontSize: "12px",
          fontWeight: "600",
          color: "#374151",
          marginBottom: "8px",
        }}
      >
        {label}
        {required && <span style={{ color: "#DC2626", marginLeft: "4px" }}>*</span>}
      </label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        style={{
          width: "100%",
          padding: "12px 14px",
          borderRadius: "10px",
          border: error ? "1px solid #DC2626" : "1px solid #E5E7EB",
          fontSize: "14px",
          color: "#1F2937",
          outline: "none",
          transition: "all 0.2s ease",
          boxSizing: "border-box",
          backgroundColor: "#fff",
        }}
        onFocus={(e) => {
          if (!error) {
            e.target.style.borderColor = "#1B4D3E"
            e.target.style.boxShadow = "0 0 0 3px rgba(27, 77, 62, 0.1)"
          }
        }}
        onBlur={(e) => {
          e.target.style.borderColor = error ? "#DC2626" : "#E5E7EB"
          e.target.style.boxShadow = "none"
        }}
      />
      {error && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "4px",
            marginTop: "4px",
            color: "#DC2626",
            fontSize: "12px",
          }}
        >
          <AlertCircle size={14} />
          <span>{error}</span>
        </div>
      )}
    </div>
  )
}

function SelectField({ label, name, value, onChange, options, placeholder, required = false, error }) {
  return (
    <div>
      <label
        style={{
          display: "block",
          fontSize: "12px",
          fontWeight: "600",
          color: "#374151",
          marginBottom: "8px",
        }}
      >
        {label}
        {required && <span style={{ color: "#DC2626", marginLeft: "4px" }}>*</span>}
      </label>
      <select
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        style={{
          width: "100%",
          padding: "12px 14px",
          borderRadius: "10px",
          border: error ? "1px solid #DC2626" : "1px solid #E5E7EB",
          fontSize: "14px",
          color: value ? "#1F2937" : "#9CA3AF",
          outline: "none",
          transition: "all 0.2s ease",
          boxSizing: "border-box",
          backgroundColor: "#fff",
          cursor: "pointer",
        }}
        onFocus={(e) => {
          if (!error) {
            e.target.style.borderColor = "#1B4D3E"
            e.target.style.boxShadow = "0 0 0 3px rgba(27, 77, 62, 0.1)"
          }
        }}
        onBlur={(e) => {
          e.target.style.borderColor = error ? "#DC2626" : "#E5E7EB"
          e.target.style.boxShadow = "none"
        }}
      >
        <option value="" disabled>
          {placeholder}
        </option>
        {options.map((option) => {
          const displayValue = option.tipo || option.modelo || option.nome || option._id
          const optionValue = option.tipo || option._id

          return (
            <option key={option._id} value={optionValue}>
              {displayValue}
            </option>
          )
        })}
      </select>
      {error && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "4px",
            marginTop: "4px",
            color: "#DC2626",
            fontSize: "12px",
          }}
        >
          <AlertCircle size={14} />
          <span>{error}</span>
        </div>
      )}
    </div>
  )
}

function TextAreaField({ label, name, value, onChange, placeholder, rows = 3 }) {
  return (
    <div>
      <label
        style={{
          display: "block",
          fontSize: "12px",
          fontWeight: "600",
          color: "#374151",
          marginBottom: "8px",
        }}
      >
        {label}
      </label>
      <textarea
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        rows={rows}
        style={{
          width: "100%",
          padding: "12px 14px",
          borderRadius: "10px",
          border: "1px solid #E5E7EB",
          fontSize: "14px",
          color: "#1F2937",
          outline: "none",
          transition: "all 0.2s ease",
          boxSizing: "border-box",
          fontFamily: "inherit",
          resize: "vertical",
          backgroundColor: "#fff",
        }}
        onFocus={(e) => {
          e.target.style.borderColor = "#1B4D3E"
          e.target.style.boxShadow = "0 0 0 3px rgba(27, 77, 62, 0.1)"
        }}
        onBlur={(e) => {
          e.target.style.borderColor = "#E5E7EB"
          e.target.style.boxShadow = "none"
        }}
      />
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

      const servicosOrdenados = data.sort((a, b) => {
        if (a.createdAt && b.createdAt) {
          return new Date(b.createdAt) - new Date(a.createdAt)
        }
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

  const abrirEdicao = (servico) => {
    setServicoSelecionado(servico)
    setMostrarModal(true)
  }

  const handleDelete = async (servico, e) => {
    e.stopPropagation()

    if (!window.confirm(`Deseja realmente excluir o serviço "${servico.nome}"?`)) {
      return
    }

    try {
      const response = await fetch(`${API_URL}/servicos/${servico._id}`, {
        method: "DELETE",
      })

      if (!response.ok) throw new Error("Erro ao excluir serviço")

      setServicos((old) => old.filter((s) => s._id !== servico._id))
      alert("Serviço excluído com sucesso!")
    } catch (error) {
      alert("Erro ao excluir serviço: " + error.message)
    }
  }

  const handleDeleteFromModal = (idDeleted) => {
    setServicos((old) => old.filter((s) => s._id !== idDeleted))
    setMostrarModal(false)
  }

  const handleUpdate = (servicoAtualizado) => {
    setServicos((old) => old.map((s) => (s._id === servicoAtualizado._id ? servicoAtualizado : s)))
    setMostrarModal(false)
  }

  const handleServicoCreated = (novoServico) => {
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
          backgroundColor: "#fff",
        }}
      >
        <div style={{ textAlign: "center" }}>
          <div
            style={{
              width: "48px",
              height: "48px",
              border: "3px solid #E5E7EB",
              borderTop: "3px solid #1B4D3E",
              borderRadius: "50%",
              animation: "spin 1s linear infinite",
              margin: "0 auto 16px",
            }}
          />
          <p style={{ color: "#6B7280", fontSize: "14px" }}>Carregando serviços...</p>
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
        width: "100%",
        maxWidth: "100%",
        margin: "0 auto",
        padding: "32px 20px",
      }}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          marginBottom: "24px",
          flexWrap: "wrap",
          gap: "16px",
        }}
      >
        <div>
          <h1
            style={{
              color: "#1B4D3E",
              margin: "0 0 6px 0",
            }}
          >
            Serviços
          </h1>
          <p style={{ color: "#6B7280", fontSize: "14px", margin: 0 }}>
            {servicos.length} {servicos.length === 1 ? "serviço cadastrado" : "serviços cadastrados"}
          </p>
        </div>

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
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = "#1B4D3E"
          }}
        >
          <Plus style={{
    color: "#A8E6CF", // verde claro
    fontSize: "22px",
    fontWeight: "700",
    marginRight: "4px",}} />
          Novo Serviço
        </button>
      </div>

      {/* Search Bar */}
      <div style={{ marginBottom: "24px", position: "relative" }}>
        <Search
          style={{
            position: "absolute",
            left: "14px",
            top: "50%",
            transform: "translateY(-50%)",
            width: "18px",
            height: "18px",
            color: "#9CA3AF",
          }}
        />
        <input
          type="text"
          placeholder="Pesquisar por nome, máquina ou implemento..."
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
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
          }}
          onFocus={(e) => {
            e.target.style.borderColor = "#1B4D3E"
            e.target.style.boxShadow = "0 0 0 3px rgba(27, 77, 62, 0.1)"
          }}
          onBlur={(e) => {
            e.target.style.borderColor = "#E5E7EB"
            e.target.style.boxShadow = "0 1px 2px rgba(0, 0, 0, 0.05)"
          }}
        />
      </div>

      {/* Empty State */}
      {servicosFiltrados.length === 0 && (
        <div
          style={{
            padding: "64px 20px",
            textAlign: "center",
            backgroundColor: "#fff",
            borderRadius: "16px",
            border: "1px solid #E5E7EB",
          }}
        >
          <Wrench style={{ width: "48px", height: "48px", color: "#D1D5DB", margin: "0 auto 16px" }} />
          <h3
            style={{
              fontSize: "16px",
              color: "#374151",
              marginBottom: "6px",
            }}
          >
            Nenhum serviço encontrado
          </h3>
          <p style={{ color: "#9CA3AF", fontSize: "14px", margin: 0 }}>
            {busca ? "Tente ajustar sua busca" : "Comece adicionando um novo serviço"}
          </p>
        </div>
      )}

      {/* Services Grid - Expanded to full width with responsive grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
          gap: "16px",
        }}
      >
        {servicosFiltrados.map((servico) => (
          <div
            key={servico._id}
            style={{
              backgroundColor: "#fff",
              padding: "20px",
              borderRadius: "16px",
              border: "1px solid #E5E7EB",
              transition: "all 0.2s ease",
              boxShadow: "0 1px 2px rgba(0, 0, 0, 0.05)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "#FAFAF9"
              e.currentTarget.style.borderColor = "#1B4D3E"
              e.currentTarget.style.transform = "translateY(-2px)"
              e.currentTarget.style.boxShadow = "0 4px 6px rgba(0, 0, 0, 0.07)"
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "#fff"
              e.currentTarget.style.borderColor = "#E5E7EB"
              e.currentTarget.style.transform = "translateY(0)"
              e.currentTarget.style.boxShadow = "0 1px 2px rgba(0, 0, 0, 0.05)"
            }}
          >
            {/* Header */}
            <div
              style={{
                display: "flex",
                alignItems: "flex-start",
                justifyContent: "space-between",
                gap: "12px",
                marginBottom: "16px",
              }}
            >
              <div style={{ display: "flex", alignItems: "flex-start", gap: "12px", flex: 1, minWidth: 0 }}>
                <div
                  style={{
                    width: "40px",
                    height: "40px",
                    borderRadius: "10px",
                    backgroundColor: "#F0F9F6",
                    border: "1px solid #D4E7D7",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  <Wrench style={{ width: "20px", height: "20px", color: "#1B4D3E" }} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <h3
                    style={{
                      fontSize: "16px",
                      fontWeight: "600",
                      color: "#1F2937",
                      margin: 0,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {servico.nome}
                  </h3>
                </div>
              </div>

              {/* Action Buttons */}
              <div
                style={{
                  display: "flex",
                  gap: "8px",
                  flexShrink: 0,
                }}
              >
                <div
                  onClick={() => abrirEdicao(servico)}
                  style={{
                    width: "32px",
                    height: "32px",
                    borderRadius: "50%",
                    backgroundColor: "#F3F4F6",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    transition: "all 0.2s ease",
                    cursor: "pointer",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = "#1B4D3E"
                    e.currentTarget.style.color = "#fff"
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = "#F3F4F6"
                    e.currentTarget.style.color = "#6B7280"
                  }}
                >
                  <Edit2 style={{ width: "16px", height: "16px" }} />
                </div>

                <div
                  onClick={(e) => handleDelete(servico, e)}
                  style={{
                    width: "32px",
                    height: "32px",
                    borderRadius: "50%",
                    backgroundColor: "#F3F4F6",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    transition: "all 0.2s ease",
                    cursor: "pointer",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = "#DC2626"
                    e.currentTarget.style.color = "#fff"
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = "#F3F4F6"
                    e.currentTarget.style.color = "#6B7280"
                  }}
                >
                  <Trash2 style={{ width: "16px", height: "16px" }} />
                </div>
              </div>
            </div>

            {/* Equipment Badges */}
            <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginBottom: "12px" }}>
              {servico.maquina_tipo && (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                    fontSize: "13px",
                    color: "#1B4D3E",
                  }}
                >
                  <Tractor style={{ width: "14px", height: "14px" }} />
                  <span style={{ color: "#6B7280" }}>
                    {typeof servico.maquina_tipo === "string"
                      ? servico.maquina_tipo
                      : JSON.stringify(servico.maquina_tipo)}
                  </span>
                </div>
              )}
              {servico.implemento_tipo && (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                    fontSize: "13px",
                    color: "#1B4D3E",
                  }}
                >
                  <Settings style={{ width: "14px", height: "14px" }} />
                  <span style={{ color: "#6B7280" }}>
                    {typeof servico.implemento_tipo === "string"
                      ? servico.implemento_tipo
                      : JSON.stringify(servico.implemento_tipo)}
                  </span>
                </div>
              )}
            </div>

            {/* Observation Preview */}
            {servico.observacao && (
              <div
                style={{
                  fontSize: "13px",
                  color: "#9CA3AF",
                  lineHeight: "1.5",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  display: "-webkit-box",
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: "vertical",
                  marginTop: "12px",
                  paddingTop: "12px",
                  borderTop: "1px solid #F3F4F6",
                }}
              >
                {servico.observacao}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Modal de Edição */}
      {mostrarModal && servicoSelecionado && (
        <EditServico
          servico={servicoSelecionado}
          onClose={() => setMostrarModal(false)}
          onDeleted={handleDeleteFromModal}
          onUpdated={handleUpdate}
        />
      )}

      {/* Modal de Criar Serviço */}
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
