"use client"

import { useState, useEffect } from "react"
import { Search, Tractor, Settings, Plus, X, Loader2 } from "lucide-react"

const API_URL = "http://localhost:5050"

const CreateMaquina = ({ onClose, onCreated }) => {
  const [focusField, setFocusField] = useState(null)
  const [loading, setLoading] = useState(true)
  const [marcas, setMarcas] = useState([])
  const [tipos, setTipos] = useState([])
  const [form, setForm] = useState({
    tipo: "",
    marca: "",
    modelo: "",
    potencia: "",
    n_serie: "",
    observacao: "",
  })

  useEffect(() => {
    fetchMarcasETipos()
  }, [])

  async function fetchMarcasETipos() {
    try {
      setLoading(true)
      const [marcasRes, tiposRes] = await Promise.all([
        fetch(`${API_URL}/marcas`),
        fetch(`${API_URL}/tipos?categoria=maquina`),
      ])

      const marcasData = await marcasRes.json()
      const tiposData = await tiposRes.json()

      setMarcas(marcasData)
      setTipos(tiposData.filter((t) => t.categoria === "maquina"))
    } catch (error) {
      console.error("Erro ao buscar marcas e tipos:", error)
    } finally {
      setLoading(false)
    }
  }

  function updateForm(value) {
    setForm((prev) => ({ ...prev, ...value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()

    if (!form.tipo || !form.marca || !form.modelo) {
      alert("Por favor, preencha todos os campos obrigatórios.")
      return
    }

    try {
      const response = await fetch(`${API_URL}/maquinas`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      })

      if (!response.ok) {
        alert("Erro ao criar máquina.")
        return
      }

      const novaMaquina = await response.json()
      alert("Máquina criada com sucesso!")
      onCreated && onCreated(novaMaquina)
      onClose && onClose()
    } catch (error) {
      console.error("Erro ao criar máquina:", error)
      alert("Erro ao criar máquina.")
    }
  }

  return (
    <div
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
      <div
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
        <div
          style={{
            background: "#FFFFFF",
            padding: "32px 32px 24px",
            borderBottom: "1px solid #E5E7EB",
            position: "relative",
          }}
        >
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
              <Tractor size={28} color="#fff" />
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
                Criar Máquina
              </h2>
              <p
                style={{
                  fontSize: "14px",
                  color: "#6B7280",
                  margin: "4px 0 0 0",
                }}
              >
                Adicione uma nova máquina ao sistema
              </p>
            </div>
          </div>
        </div>

        {/* Content */}
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
              <form onSubmit={handleSubmit}>
                <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
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
                      Tipo de Máquina
                      <span style={{ color: "#DC2626", marginLeft: "4px" }}>*</span>
                    </label>
                    <select
                      value={form.tipo}
                      onChange={(e) => updateForm({ tipo: e.target.value })}
                      required
                      style={{
                        width: "100%",
                        padding: "12px 14px",
                        borderRadius: "10px",
                        border: "1px solid #E5E7EB",
                        fontSize: "14px",
                        color: form.tipo ? "#1F2937" : "#9CA3AF",
                        outline: "none",
                        transition: "all 0.2s ease",
                        boxSizing: "border-box",
                        backgroundColor: "#fff",
                        cursor: "pointer",
                      }}
                      onFocus={(e) => {
                        e.target.style.borderColor = "#1B4D3E"
                        e.target.style.boxShadow = "0 0 0 3px rgba(27, 77, 62, 0.1)"
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = "#E5E7EB"
                        e.target.style.boxShadow = "none"
                      }}
                    >
                      <option value="">Selecione o tipo</option>
                      {tipos.map((tipo) => (
                        <option key={tipo._id} value={tipo.tipo}>
                          {tipo.tipo}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
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
                        Marca
                        <span style={{ color: "#DC2626", marginLeft: "4px" }}>*</span>
                      </label>
                      <select
                        value={form.marca}
                        onChange={(e) => updateForm({ marca: e.target.value })}
                        required
                        style={{
                          width: "100%",
                          padding: "12px 14px",
                          borderRadius: "10px",
                          border: "1px solid #E5E7EB",
                          fontSize: "14px",
                          color: form.marca ? "#1F2937" : "#9CA3AF",
                          outline: "none",
                          transition: "all 0.2s ease",
                          boxSizing: "border-box",
                          backgroundColor: "#fff",
                          cursor: "pointer",
                        }}
                        onFocus={(e) => {
                          e.target.style.borderColor = "#1B4D3E"
                          e.target.style.boxShadow = "0 0 0 3px rgba(27, 77, 62, 0.1)"
                        }}
                        onBlur={(e) => {
                          e.target.style.borderColor = "#E5E7EB"
                          e.target.style.boxShadow = "none"
                        }}
                      >
                        <option value="">Selecione a marca</option>
                        {marcas.map((marca) => (
                          <option key={marca._id} value={marca.nome}>
                            {marca.nome}
                          </option>
                        ))}
                      </select>
                    </div>

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
                        Modelo
                        <span style={{ color: "#DC2626", marginLeft: "4px" }}>*</span>
                      </label>
                      <input
                        type="text"
                        value={form.modelo}
                        onChange={(e) => updateForm({ modelo: e.target.value })}
                        placeholder="Digite o modelo"
                        required
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
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
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
                        Potência
                      </label>
                      <input
                        type="text"
                        value={form.potencia}
                        onChange={(e) => updateForm({ potencia: e.target.value })}
                        placeholder="Ex: 180 CV"
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
                        Número de Série
                      </label>
                      <input
                        type="text"
                        value={form.n_serie}
                        onChange={(e) => updateForm({ n_serie: e.target.value })}
                        placeholder="Digite o número de série"
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
                  </div>

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
                      Observações
                    </label>
                    <textarea
                      value={form.observacao}
                      onChange={(e) => updateForm({ observacao: e.target.value })}
                      placeholder="Informações adicionais sobre a máquina..."
                      rows={4}
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
                </div>
              </form>
            </div>
          )}
        </div>

        <div
          style={{
            padding: "24px 32px",
            borderTop: "1px solid #E5E7EB",
            backgroundColor: "#FFFFFF",
            display: "flex",
            gap: "12px",
            justifyContent: "flex-end",
          }}
        >
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
            onClick={handleSubmit}
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
            Criar Máquina
          </button>
        </div>
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

const CreateImplemento = ({ onClose, onCreated }) => {
  const [focusField, setFocusField] = useState(null)
  const [loading, setLoading] = useState(true)
  const [marcas, setMarcas] = useState([])
  const [tipos, setTipos] = useState([])
  const [form, setForm] = useState({
    tipo: "",
    marca: "",
    modelo: "",
    capacidade: "",
    n_serie: "",
    observacao: "",
  })

  useEffect(() => {
    fetchMarcasETipos()
  }, [])

  async function fetchMarcasETipos() {
    try {
      setLoading(true)
      const [marcasRes, tiposRes] = await Promise.all([
        fetch(`${API_URL}/marcas`),
        fetch(`${API_URL}/tipos?categoria=implemento`),
      ])

      const marcasData = await marcasRes.json()
      const tiposData = await tiposRes.json()

      setMarcas(marcasData)
      setTipos(tiposData.filter((t) => t.categoria === "implemento"))
    } catch (error) {
      console.error("Erro ao buscar marcas e tipos:", error)
    } finally {
      setLoading(false)
    }
  }

  function updateForm(value) {
    setForm((prev) => ({ ...prev, ...value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()

    if (!form.tipo || !form.marca || !form.modelo) {
      alert("Por favor, preencha todos os campos obrigatórios.")
      return
    }

    try {
      const response = await fetch(`${API_URL}/implementos`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      })

      if (!response.ok) {
        alert("Erro ao criar implemento.")
        return
      }

      const novoImplemento = await response.json()
      alert("Implemento criado com sucesso!")
      onCreated && onCreated(novoImplemento)
      onClose && onClose()
    } catch (error) {
      console.error("Erro ao criar implemento:", error)
      alert("Erro ao criar implemento.")
    }
  }

  return (
    <div
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
      <div
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
        <div
          style={{
            background: "#FFFFFF",
            padding: "32px 32px 24px",
            borderBottom: "1px solid #E5E7EB",
            position: "relative",
          }}
        >
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
              <Settings size={28} color="#fff" />
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
                Criar Implemento
              </h2>
              <p
                style={{
                  fontSize: "14px",
                  color: "#6B7280",
                  margin: "4px 0 0 0",
                }}
              >
                Adicione um novo implemento ao sistema
              </p>
            </div>
          </div>
        </div>

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
              <form onSubmit={handleSubmit}>
                <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
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
                      Tipo de Implemento
                      <span style={{ color: "#DC2626", marginLeft: "4px" }}>*</span>
                    </label>
                    <select
                      value={form.tipo}
                      onChange={(e) => updateForm({ tipo: e.target.value })}
                      required
                      style={{
                        width: "100%",
                        padding: "12px 14px",
                        borderRadius: "10px",
                        border: "1px solid #E5E7EB",
                        fontSize: "14px",
                        color: form.tipo ? "#1F2937" : "#9CA3AF",
                        outline: "none",
                        transition: "all 0.2s ease",
                        boxSizing: "border-box",
                        backgroundColor: "#fff",
                        cursor: "pointer",
                      }}
                      onFocus={(e) => {
                        e.target.style.borderColor = "#1B4D3E"
                        e.target.style.boxShadow = "0 0 0 3px rgba(27, 77, 62, 0.1)"
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = "#E5E7EB"
                        e.target.style.boxShadow = "none"
                      }}
                    >
                      <option value="">Selecione o tipo</option>
                      {tipos.map((tipo) => (
                        <option key={tipo._id} value={tipo.tipo}>
                          {tipo.tipo}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
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
                        Marca
                        <span style={{ color: "#DC2626", marginLeft: "4px" }}>*</span>
                      </label>
                      <select
                        value={form.marca}
                        onChange={(e) => updateForm({ marca: e.target.value })}
                        required
                        style={{
                          width: "100%",
                          padding: "12px 14px",
                          borderRadius: "10px",
                          border: "1px solid #E5E7EB",
                          fontSize: "14px",
                          color: form.marca ? "#1F2937" : "#9CA3AF",
                          outline: "none",
                          transition: "all 0.2s ease",
                          boxSizing: "border-box",
                          backgroundColor: "#fff",
                          cursor: "pointer",
                        }}
                        onFocus={(e) => {
                          e.target.style.borderColor = "#1B4D3E"
                          e.target.style.boxShadow = "0 0 0 3px rgba(27, 77, 62, 0.1)"
                        }}
                        onBlur={(e) => {
                          e.target.style.borderColor = "#E5E7EB"
                          e.target.style.boxShadow = "none"
                        }}
                      >
                        <option value="">Selecione a marca</option>
                        {marcas.map((marca) => (
                          <option key={marca._id} value={marca.nome}>
                            {marca.nome}
                          </option>
                        ))}
                      </select>
                    </div>

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
                        Modelo
                        <span style={{ color: "#DC2626", marginLeft: "4px" }}>*</span>
                      </label>
                      <input
                        type="text"
                        value={form.modelo}
                        onChange={(e) => updateForm({ modelo: e.target.value })}
                        placeholder="Digite o modelo"
                        required
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
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
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
                        Capacidade
                      </label>
                      <input
                        type="text"
                        value={form.capacidade}
                        onChange={(e) => updateForm({ capacidade: e.target.value })}
                        placeholder="Ex: 5000 litros"
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
                        Número de Série
                      </label>
                      <input
                        type="text"
                        value={form.n_serie}
                        onChange={(e) => updateForm({ n_serie: e.target.value })}
                        placeholder="Digite o número de série"
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
                  </div>

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
                      Observações
                    </label>
                    <textarea
                      value={form.observacao}
                      onChange={(e) => updateForm({ observacao: e.target.value })}
                      placeholder="Informações adicionais sobre o implemento..."
                      rows={4}
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
                </div>
              </form>
            </div>
          )}
        </div>

        <div
          style={{
            padding: "24px 32px",
            borderTop: "1px solid #E5E7EB",
            backgroundColor: "#FFFFFF",
            display: "flex",
            gap: "12px",
            justifyContent: "flex-end",
          }}
        >
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
            onClick={handleSubmit}
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
            Criar Implemento
          </button>
        </div>
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

// Helper Components
function InfoItemCard({ label, value }) {
  return (
    <div>
      <div
        style={{
          fontSize: "11px",
          fontWeight: "700",
          color: "#9CA3AF",
          textTransform: "uppercase",
          letterSpacing: "0.5px",
          marginBottom: "6px",
        }}
      >
        {label}
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

function InputField({ label, value, onChange, type = "text", required = false, maxLength }) {
  return (
    <div>
      <label
        style={{
          display: "block",
          fontSize: "11px",
          fontWeight: "700",
          color: "#6B7280",
          textTransform: "uppercase",
          letterSpacing: "0.5px",
          marginBottom: "8px",
        }}
      >
        {label}
        {required && <span style={{ color: "#DC2626" }}> *</span>}
      </label>
      <input
        type={type}
        value={value}
        onChange={onChange}
        required={required}
        maxLength={maxLength}
        style={{
          width: "100%",
          padding: "12px 14px",
          borderRadius: "10px",
          border: "1px solid #E5E7EB",
          fontSize: "14px",
          color: "#1F2937",
          outline: "none",
          transition: "all 0.2s ease",
          backgroundColor: "#FFFFFF",
        }}
        onFocus={(e) => {
          e.target.style.borderColor = "#1B4D3E"
          e.target.style.boxShadow = "0 0 0 4px rgba(27, 77, 62, 0.1)"
        }}
        onBlur={(e) => {
          e.target.style.borderColor = "#E5E7EB"
          e.target.style.boxShadow = "none"
        }}
      />
    </div>
  )
}

function SelectField({ label, value, onChange, options, required = false }) {
  return (
    <div>
      <label
        style={{
          display: "block",
          fontSize: "11px",
          fontWeight: "700",
          color: "#6B7280",
          textTransform: "uppercase",
          letterSpacing: "0.5px",
          marginBottom: "8px",
        }}
      >
        {label}
        {required && <span style={{ color: "#DC2626" }}> *</span>}
      </label>
      <select
        value={value}
        onChange={onChange}
        required={required}
        style={{
          width: "100%",
          padding: "12px 14px",
          borderRadius: "10px",
          border: "1px solid #E5E7EB",
          fontSize: "14px",
          color: "#1F2937",
          outline: "none",
          transition: "all 0.2s ease",
          backgroundColor: "#FFFFFF",
          cursor: "pointer",
        }}
        onFocus={(e) => {
          e.target.style.borderColor = "#1B4D3E"
          e.target.style.boxShadow = "0 0 0 4px rgba(27, 77, 62, 0.1)"
        }}
        onBlur={(e) => {
          e.target.style.borderColor = "#E5E7EB"
          e.target.style.boxShadow = "none"
        }}
      >
        <option value="">Selecione...</option>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  )
}

// Components with integrated editing
const DetalhesMaquina_ = ({ maquina, onClose, onDeleted, onUpdated }) => {
  const [isEditing, setIsEditing] = useState(false)
  const [loading, setLoading] = useState(false)
  const [marcas, setMarcas] = useState([])
  const [tipos, setTipos] = useState([])
  const maquinaId = maquina?.id || maquina?._id

  const [form, setForm] = useState({
    tipo: maquina?.tipo || "",
    marca: maquina?.marca || "",
    modelo: maquina?.modelo || "",
    potencia: maquina?.potencia || "",
    n_serie: maquina?.n_serie || "",
    observacao: maquina?.observacao || "",
  })

  useEffect(() => {
    if (isEditing) {
      fetchMarcasETipos()
    }
  }, [isEditing])

  async function fetchMarcasETipos() {
    try {
      setLoading(true)
      const [marcasRes, tiposRes] = await Promise.all([
        fetch(`${API_URL}/marcas`),
        fetch(`${API_URL}/tipos?categoria=maquina`),
      ])

      const marcasData = await marcasRes.json()
      const tiposData = await tiposRes.json()

      setMarcas(marcasData)
      setTipos(tiposData.filter((t) => t.categoria === "maquina"))
    } catch (error) {
      console.error("Erro ao buscar marcas e tipos:", error)
    } finally {
      setLoading(false)
    }
  }

  function updateForm(value) {
    setForm((prev) => ({ ...prev, ...value }))
  }

  async function handleSave(e) {
    e.preventDefault()
    setLoading(true)
    try {
      const response = await fetch(`${API_URL}/maquinas/update/${maquinaId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      })

      if (!response.ok) {
        alert("Erro ao atualizar máquina.")
        return
      }

      alert("Máquina atualizada com sucesso!")
      setIsEditing(false)
      if (onUpdated) {
        onUpdated({ ...maquina, ...form, _id: maquinaId })
      }
    } catch (error) {
      console.error("Erro ao atualizar:", error)
      alert("Erro ao atualizar máquina.")
    } finally {
      setLoading(false)
    }
  }

  function handleCancelEdit() {
    setForm({
      tipo: maquina?.tipo || "",
      marca: maquina?.marca || "",
      modelo: maquina?.modelo || "",
      potencia: maquina?.potencia || "",
      n_serie: maquina?.n_serie || "",
      observacao: maquina?.observacao || "",
    })
    setIsEditing(false)
  }

  async function handleExcluir() {
    if (!window.confirm("Tem certeza que deseja excluir esta máquina?")) return
    try {
      const resp = await fetch(`${API_URL}/maquinas/${maquinaId}`, {
        method: "DELETE",
      })
      if (resp.ok) {
        alert("Máquina excluída com sucesso!")
        onDeleted && onDeleted(maquinaId)
        onClose && onClose()
      } else {
        alert("Erro ao excluir máquina.")
      }
    } catch (err) {
      alert("Erro: " + err.message)
    }
  }

  if (!maquina) return null

  return (
    <div
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
      <div
        style={{
          backgroundColor: "#FFFFFF",
          borderRadius: "20px",
          maxWidth: "950px",
          width: "100%",
          maxHeight: "92vh",
          overflow: "hidden",
          boxShadow: "0 25px 50px -12px rgba(27, 77, 62, 0.25), 0 0 0 1px rgba(27, 77, 62, 0.05)",
          display: "flex",
          flexDirection: "column",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header with Gradient */}
        <div
          style={{
            background: "#FFFFFF",
            padding: "32px 36px",
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
              backgroundColor: "#F9FAFB",
              border: "1px solid #E5E7EB",
              borderRadius: "10px",
              width: "40px",
              height: "40px",
              fontSize: "20px",
              cursor: "pointer",
              color: "#6B7280",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "all 0.2s ease",
              zIndex: 1,
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
            ×
          </button>

          <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
            <div
              style={{
                width: "72px",
                height: "72px",
                borderRadius: "14px",
                background: "linear-gradient(135deg, #1B4D3E 0%, #2A6B4F 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "26px",
                fontWeight: "700",
                color: "#FFFFFF",
                flexShrink: 0,
                boxShadow: "0 4px 12px rgba(27, 77, 62, 0.15)",
              }}
            >
              <Tractor size={28} color="#fff" />
            </div>
            <div style={{ flex: 1 }}>
              <h2
                style={{
                  fontSize: "24px",
                  fontWeight: "700",
                  margin: 0,
                  marginBottom: "8px",
                  color: "#1F2937",
                  letterSpacing: "-0.5px",
                }}
              >
                {maquina?.tipo || "Máquina"}
              </h2>
              <div style={{ display: "flex", gap: "16px", fontSize: "13px", color: "#6B7280", flexWrap: "wrap" }}>
                <span
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                    backgroundColor: "#F9FAFB",
                    padding: "4px 10px",
                    borderRadius: "6px",
                    fontWeight: "600",
                  }}
                >
                  <svg width="14" height="14" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z"
                      clipRule="evenodd"
                    />
                  </svg>
                  ID: {maquinaId || "-"}
                </span>
                <span
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                    backgroundColor: "#F0F9F6",
                    padding: "4px 10px",
                    borderRadius: "6px",
                    fontWeight: "600",
                    color: "#1B4D3E",
                  }}
                >
                  {maquina?.status}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div
          style={{
            padding: "36px",
            overflowY: "auto",
            flex: 1,
            backgroundColor: "#F9FAFB",
          }}
        >
          {!isEditing ? (
            <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
              {/* Info Card */}
              <div
                style={{
                  backgroundColor: "#FFFFFF",
                  borderRadius: "16px",
                  padding: "28px",
                  border: "1px solid #E5E7EB",
                  boxShadow: "0 1px 3px rgba(0, 0, 0, 0.05)",
                }}
              >
                <h3
                  style={{
                    fontSize: "11px",
                    fontWeight: "700",
                    color: "#1B4D3E",
                    textTransform: "uppercase",
                    letterSpacing: "0.5px",
                    marginBottom: "20px",
                  }}
                >
                  Informações da Máquina
                </h3>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(2, 1fr)",
                    gap: "20px",
                  }}
                >
                  <InfoItemCard label="Marca" value={maquina?.marca} />
                  <InfoItemCard label="Modelo" value={maquina?.modelo} />
                  <InfoItemCard label="Potência" value={maquina?.potencia} />
                  <InfoItemCard label="N° Série" value={maquina?.n_serie} />
                </div>
              </div>

              {maquina?.observacao && (
                <div
                  style={{
                    backgroundColor: "#FFFFFF",
                    borderRadius: "16px",
                    padding: "28px",
                    border: "1px solid #E5E7EB",
                    boxShadow: "0 1px 3px rgba(0, 0, 0, 0.05)",
                  }}
                >
                  <h3
                    style={{
                      fontSize: "11px",
                      fontWeight: "700",
                      color: "#1B4D3E",
                      textTransform: "uppercase",
                      letterSpacing: "0.5px",
                      marginBottom: "20px",
                    }}
                  >
                    Observações
                  </h3>
                  <div
                    style={{
                      padding: "20px",
                      backgroundColor: "#F9FAFB",
                      borderRadius: "10px",
                      border: "1px solid #E5E7EB",
                    }}
                  >
                    <div
                      style={{
                        fontSize: "14px",
                        color: "#1F2937",
                        lineHeight: "1.8",
                      }}
                    >
                      {maquina?.observacao}
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <form onSubmit={handleSave}>
              <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
                <div
                  style={{
                    backgroundColor: "#FFFFFF",
                    borderRadius: "16px",
                    padding: "28px",
                    border: "1px solid #E5E7EB",
                    boxShadow: "0 1px 3px rgba(0, 0, 0, 0.05)",
                  }}
                >
                  <h3
                    style={{
                      fontSize: "11px",
                      fontWeight: "700",
                      color: "#1B4D3E",
                      textTransform: "uppercase",
                      letterSpacing: "0.5px",
                      marginBottom: "20px",
                    }}
                  >
                    Dados da Máquina
                  </h3>
                  <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                    <div>
                      <label
                        style={{
                          display: "block",
                          fontSize: "11px",
                          fontWeight: "700",
                          color: "#6B7280",
                          textTransform: "uppercase",
                          letterSpacing: "0.5px",
                          marginBottom: "8px",
                        }}
                      >
                        Tipo de Máquina
                        <span style={{ color: "#DC2626" }}> *</span>
                      </label>
                      <select
                        value={form.tipo}
                        onChange={(e) => updateForm({ tipo: e.target.value })}
                        required
                        style={{
                          width: "100%",
                          padding: "12px 14px",
                          borderRadius: "10px",
                          border: "1px solid #E5E7EB",
                          fontSize: "14px",
                          color: "#1F2937",
                          outline: "none",
                          transition: "all 0.2s ease",
                          backgroundColor: "#FFFFFF",
                          cursor: "pointer",
                        }}
                        onFocus={(e) => {
                          e.target.style.borderColor = "#1B4D3E"
                          e.target.style.boxShadow = "0 0 0 4px rgba(27, 77, 62, 0.1)"
                        }}
                        onBlur={(e) => {
                          e.target.style.borderColor = "#E5E7EB"
                          e.target.style.boxShadow = "none"
                        }}
                      >
                        <option value="">Selecione...</option>
                        {tipos.map((tipo) => (
                          <option key={tipo._id} value={tipo.tipo}>
                            {tipo.tipo}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label
                        style={{
                          display: "block",
                          fontSize: "11px",
                          fontWeight: "700",
                          color: "#6B7280",
                          textTransform: "uppercase",
                          letterSpacing: "0.5px",
                          marginBottom: "8px",
                        }}
                      >
                        Marca
                        <span style={{ color: "#DC2626" }}> *</span>
                      </label>
                      <select
                        value={form.marca}
                        onChange={(e) => updateForm({ marca: e.target.value })}
                        required
                        style={{
                          width: "100%",
                          padding: "12px 14px",
                          borderRadius: "10px",
                          border: "1px solid #E5E7EB",
                          fontSize: "14px",
                          color: "#1F2937",
                          outline: "none",
                          transition: "all 0.2s ease",
                          backgroundColor: "#FFFFFF",
                          cursor: "pointer",
                        }}
                        onFocus={(e) => {
                          e.target.style.borderColor = "#1B4D3E"
                          e.target.style.boxShadow = "0 0 0 4px rgba(27, 77, 62, 0.1)"
                        }}
                        onBlur={(e) => {
                          e.target.style.borderColor = "#E5E7EB"
                          e.target.style.boxShadow = "none"
                        }}
                      >
                        <option value="">Selecione...</option>
                        {marcas.map((marca) => (
                          <option key={marca._id} value={marca.nome}>
                            {marca.nome}
                          </option>
                        ))}
                      </select>
                    </div>
                    <InputField
                      label="Modelo"
                      value={form.modelo}
                      onChange={(e) => updateForm({ modelo: e.target.value })}
                      required
                    />
                    <InputField
                      label="Potência"
                      value={form.potencia}
                      onChange={(e) => updateForm({ potencia: e.target.value })}
                    />
                    <InputField
                      label="Número de Série"
                      value={form.n_serie}
                      onChange={(e) => updateForm({ n_serie: e.target.value })}
                    />
                    <div>
                      <label
                        style={{
                          display: "block",
                          fontSize: "11px",
                          fontWeight: "700",
                          color: "#6B7280",
                          textTransform: "uppercase",
                          letterSpacing: "0.5px",
                          marginBottom: "8px",
                        }}
                      >
                        Observações
                      </label>
                      <textarea
                        value={form.observacao}
                        onChange={(e) => updateForm({ observacao: e.target.value })}
                        rows={3}
                        style={{
                          width: "100%",
                          padding: "12px 14px",
                          borderRadius: "10px",
                          border: "1px solid #E5E7EB",
                          fontSize: "14px",
                          color: "#1F2937",
                          outline: "none",
                          transition: "all 0.2s ease",
                          backgroundColor: "#FFFFFF",
                          fontFamily: "inherit",
                          resize: "vertical",
                        }}
                        onFocus={(e) => {
                          e.target.style.borderColor = "#1B4D3E"
                          e.target.style.boxShadow = "0 0 0 4px rgba(27, 77, 62, 0.1)"
                        }}
                        onBlur={(e) => {
                          e.target.style.borderColor = "#E5E7EB"
                          e.target.style.boxShadow = "none"
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </form>
          )}
        </div>

        {/* Footer Actions */}
        <div
          style={{
            padding: "24px 36px",
            borderTop: "1px solid #E5E7EB",
            backgroundColor: "#FFFFFF",
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
                  padding: "12px 28px",
                  borderRadius: "10px",
                  border: "none",
                  background: "linear-gradient(135deg, #1B4D3E 0%, #2A6B4F 100%)",
                  color: "#FFFFFF",
                  fontSize: "14px",
                  fontWeight: "600",
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                  boxShadow: "0 4px 12px rgba(27, 77, 62, 0.2)",
                }}
                onMouseEnter={(e) => {
                  e.target.style.transform = "translateY(-2px)"
                  e.target.style.boxShadow = "0 6px 16px rgba(27, 77, 62, 0.3)"
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = "translateY(0)"
                  e.target.style.boxShadow = "0 4px 12px rgba(27, 77, 62, 0.2)"
                }}
              >
                Editar
              </button>
              <button
                onClick={handleExcluir}
                style={{
                  padding: "12px 28px",
                  borderRadius: "10px",
                  border: "1px solid #FCA5A5",
                  backgroundColor: "#FEF2F2",
                  color: "#DC2626",
                  fontSize: "14px",
                  fontWeight: "600",
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = "#FEE2E2"
                  e.target.style.transform = "translateY(-2px)"
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = "#FEF2F2"
                  e.target.style.transform = "translateY(0)"
                }}
              >
                Excluir
              </button>
            </>
          ) : (
            <>
              <button
                type="button"
                onClick={handleCancelEdit}
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
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
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
                {loading && (
                  <Loader2
                    size={18}
                    style={{
                      animation: "spin 1s linear infinite",
                    }}
                  />
                )}
                Salvar Alterações
              </button>
            </>
          )}
        </div>
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

const DetalhesMaquina = ({ maquina, onClose, onDeleted, onUpdated }) => {
  const [isEditing, setIsEditing] = useState(false)
  const [loading, setLoading] = useState(false)
  const [marcas, setMarcas] = useState([])
  const [tipos, setTipos] = useState([])
  const maquinaId = maquina?.id || maquina?._id

  const [form, setForm] = useState({
    tipo: maquina?.tipo || "",
    marca: maquina?.marca || "",
    modelo: maquina?.modelo || "",
    potencia: maquina?.potencia || "",
    n_serie: maquina?.n_serie || "",
    observacao: maquina?.observacao || "",
  })

  useEffect(() => {
    if (isEditing) {
      fetchMarcasETipos()
    }
  }, [isEditing])

  async function fetchMarcasETipos() {
    try {
      setLoading(true)
      const [marcasRes, tiposRes] = await Promise.all([
        fetch(`${API_URL}/marcas`),
        fetch(`${API_URL}/tipos?categoria=maquina`),
      ])

      const marcasData = await marcasRes.json()
      const tiposData = await tiposRes.json()

      setMarcas(marcasData)
      setTipos(tiposData.filter((t) => t.categoria === "maquina"))
    } catch (error) {
      console.error("Erro ao buscar marcas e tipos:", error)
    } finally {
      setLoading(false)
    }
  }

  function updateForm(value) {
    setForm((prev) => ({ ...prev, ...value }))
  }

  async function handleSave(e) {
    e.preventDefault()
    setLoading(true)
    try {
      const response = await fetch(`${API_URL}/maquinas/update/${maquinaId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      })

      if (!response.ok) {
        alert("Erro ao atualizar máquina.")
        return
      }

      alert("Máquina atualizada com sucesso!")
      setIsEditing(false)
      if (onUpdated) {
        onUpdated({ ...maquina, ...form, _id: maquinaId })
      }
    } catch (error) {
      console.error("Erro ao atualizar:", error)
      alert("Erro ao atualizar máquina.")
    } finally {
      setLoading(false)
    }
  }

  function handleCancelEdit() {
    setForm({
      tipo: maquina?.tipo || "",
      marca: maquina?.marca || "",
      modelo: maquina?.modelo || "",
      potencia: maquina?.potencia || "",
      n_serie: maquina?.n_serie || "",
      observacao: maquina?.observacao || "",
    })
    setIsEditing(false)
  }

  async function handleExcluir() {
    if (!window.confirm("Tem certeza que deseja excluir esta máquina?")) return
    try {
      const resp = await fetch(`${API_URL}/maquinas/${maquinaId}`, {
        method: "DELETE",
      })
      if (resp.ok) {
        alert("Máquina excluída com sucesso!")
        onDeleted && onDeleted(maquinaId)
        onClose && onClose()
      } else {
        alert("Erro ao excluir máquina.")
      }
    } catch (err) {
      alert("Erro: " + err.message)
    }
  }

  if (!maquina) return null

  return (
    <div
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
      <div
        style={{
          backgroundColor: "#FFFFFF",
          borderRadius: "20px",
          maxWidth: "950px",
          width: "100%",
          maxHeight: "92vh",
          overflow: "hidden",
          boxShadow: "0 25px 50px -12px rgba(27, 77, 62, 0.25), 0 0 0 1px rgba(27, 77, 62, 0.05)",
          display: "flex",
          flexDirection: "column",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header with Gradient */}
        <div
          style={{
            background: "#FFFFFF",
            padding: "32px 36px",
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
              backgroundColor: "#F9FAFB",
              border: "1px solid #E5E7EB",
              borderRadius: "10px",
              width: "40px",
              height: "40px",
              fontSize: "20px",
              cursor: "pointer",
              color: "#6B7280",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "all 0.2s ease",
              zIndex: 1,
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
            ×
          </button>

          <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
            <div
              style={{
                width: "72px",
                height: "72px",
                borderRadius: "14px",
                background: "linear-gradient(135deg, #1B4D3E 0%, #2A6B4F 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "26px",
                fontWeight: "700",
                color: "#FFFFFF",
                flexShrink: 0,
                boxShadow: "0 4px 12px rgba(27, 77, 62, 0.15)",
              }}
            >
                    <Tractor style={{ width: "30px", height: "30px" }} />
            </div>
            <div style={{ flex: 1 }}>
              <h2
                style={{
                  fontSize: "24px",
                  fontWeight: "700",
                  margin: 0,
                  marginBottom: "8px",
                  color: "#1F2937",
                  letterSpacing: "-0.5px",
                }}
              >
                {maquina?.tipo || "Máquina"}
              </h2>
              <div style={{ display: "flex", gap: "16px", fontSize: "13px", color: "#6B7280", flexWrap: "wrap" }}>
                <span
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                    backgroundColor: "#F9FAFB",
                    padding: "4px 10px",
                    borderRadius: "6px",
                    fontWeight: "600",
                  }}
                >
                  <svg width="14" height="14" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z"
                      clipRule="evenodd"
                    />
                  </svg>
                  ID: {maquinaId || "-"}
                </span>
                <span
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                    backgroundColor: "#F0F9F6",
                    padding: "4px 10px",
                    borderRadius: "6px",
                    fontWeight: "600",
                    color: "#1B4D3E",
                  }}
                >
                  {maquina?.status}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div
          style={{
            padding: "36px",
            overflowY: "auto",
            flex: 1,
            backgroundColor: "#F9FAFB",
          }}
        >
          {!isEditing ? (
            <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
              {/* Info Card */}
              <div
                style={{
                  backgroundColor: "#FFFFFF",
                  borderRadius: "16px",
                  padding: "28px",
                  border: "1px solid #E5E7EB",
                  boxShadow: "0 1px 3px rgba(0, 0, 0, 0.05)",
                }}
              >
                <h3
                  style={{
                    fontSize: "11px",
                    fontWeight: "700",
                    color: "#1B4D3E",
                    textTransform: "uppercase",
                    letterSpacing: "0.5px",
                    marginBottom: "20px",
                  }}
                >
                  Informações da Máquina
                </h3>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(2, 1fr)",
                    gap: "20px",
                  }}
                >
                  <InfoItemCard label="Marca" value={maquina?.marca} />
                  <InfoItemCard label="Modelo" value={maquina?.modelo} />
                  <InfoItemCard label="Potência" value={maquina?.potencia} />
                  <InfoItemCard label="N° Série" value={maquina?.n_serie} />
                </div>
              </div>

              {maquina?.observacao && (
                <div
                  style={{
                    backgroundColor: "#FFFFFF",
                    borderRadius: "16px",
                    padding: "28px",
                    border: "1px solid #E5E7EB",
                    boxShadow: "0 1px 3px rgba(0, 0, 0, 0.05)",
                  }}
                >
                  <h3
                    style={{
                      fontSize: "11px",
                      fontWeight: "700",
                      color: "#1B4D3E",
                      textTransform: "uppercase",
                      letterSpacing: "0.5px",
                      marginBottom: "20px",
                    }}
                  >
                    Observações
                  </h3>
                  <div
                    style={{
                      padding: "20px",
                      backgroundColor: "#F9FAFB",
                      borderRadius: "10px",
                      border: "1px solid #E5E7EB",
                    }}
                  >
                    <div
                      style={{
                        fontSize: "14px",
                        color: "#1F2937",
                        lineHeight: "1.8",
                      }}
                    >
                      {maquina?.observacao}
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <form onSubmit={handleSave}>
              <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
                <div
                  style={{
                    backgroundColor: "#FFFFFF",
                    borderRadius: "16px",
                    padding: "28px",
                    border: "1px solid #E5E7EB",
                    boxShadow: "0 1px 3px rgba(0, 0, 0, 0.05)",
                  }}
                >
                  <h3
                    style={{
                      fontSize: "11px",
                      fontWeight: "700",
                      color: "#1B4D3E",
                      textTransform: "uppercase",
                      letterSpacing: "0.5px",
                      marginBottom: "20px",
                    }}
                  >
                    Dados da Máquina
                  </h3>
                  <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                    <div>
                      <label
                        style={{
                          display: "block",
                          fontSize: "11px",
                          fontWeight: "700",
                          color: "#6B7280",
                          textTransform: "uppercase",
                          letterSpacing: "0.5px",
                          marginBottom: "8px",
                        }}
                      >
                        Tipo de Máquina
                        <span style={{ color: "#DC2626" }}> *</span>
                      </label>
                      <select
                        value={form.tipo}
                        onChange={(e) => updateForm({ tipo: e.target.value })}
                        required
                        style={{
                          width: "100%",
                          padding: "12px 14px",
                          borderRadius: "10px",
                          border: "1px solid #E5E7EB",
                          fontSize: "14px",
                          color: "#1F2937",
                          outline: "none",
                          transition: "all 0.2s ease",
                          backgroundColor: "#FFFFFF",
                          cursor: "pointer",
                        }}
                        onFocus={(e) => {
                          e.target.style.borderColor = "#1B4D3E"
                          e.target.style.boxShadow = "0 0 0 4px rgba(27, 77, 62, 0.1)"
                        }}
                        onBlur={(e) => {
                          e.target.style.borderColor = "#E5E7EB"
                          e.target.style.boxShadow = "none"
                        }}
                      >
                        <option value="">Selecione...</option>
                        {tipos.map((tipo) => (
                          <option key={tipo._id} value={tipo.tipo}>
                            {tipo.tipo}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label
                        style={{
                          display: "block",
                          fontSize: "11px",
                          fontWeight: "700",
                          color: "#6B7280",
                          textTransform: "uppercase",
                          letterSpacing: "0.5px",
                          marginBottom: "8px",
                        }}
                      >
                        Marca
                        <span style={{ color: "#DC2626" }}> *</span>
                      </label>
                      <select
                        value={form.marca}
                        onChange={(e) => updateForm({ marca: e.target.value })}
                        required
                        style={{
                          width: "100%",
                          padding: "12px 14px",
                          borderRadius: "10px",
                          border: "1px solid #E5E7EB",
                          fontSize: "14px",
                          color: "#1F2937",
                          outline: "none",
                          transition: "all 0.2s ease",
                          backgroundColor: "#FFFFFF",
                          cursor: "pointer",
                        }}
                        onFocus={(e) => {
                          e.target.style.borderColor = "#1B4D3E"
                          e.target.style.boxShadow = "0 0 0 4px rgba(27, 77, 62, 0.1)"
                        }}
                        onBlur={(e) => {
                          e.target.style.borderColor = "#E5E7EB"
                          e.target.style.boxShadow = "none"
                        }}
                      >
                        <option value="">Selecione...</option>
                        {marcas.map((marca) => (
                          <option key={marca._id} value={marca.nome}>
                            {marca.nome}
                          </option>
                        ))}
                      </select>
                    </div>
                    <InputField
                      label="Modelo"
                      value={form.modelo}
                      onChange={(e) => updateForm({ modelo: e.target.value })}
                      required
                    />
                    <InputField
                      label="Potência"
                      value={form.potencia}
                      onChange={(e) => updateForm({ potencia: e.target.value })}
                    />
                    <InputField
                      label="Número de Série"
                      value={form.n_serie}
                      onChange={(e) => updateForm({ n_serie: e.target.value })}
                    />
                    <div>
                      <label
                        style={{
                          display: "block",
                          fontSize: "11px",
                          fontWeight: "700",
                          color: "#6B7280",
                          textTransform: "uppercase",
                          letterSpacing: "0.5px",
                          marginBottom: "8px",
                        }}
                      >
                        Observações
                      </label>
                      <textarea
                        value={form.observacao}
                        onChange={(e) => updateForm({ observacao: e.target.value })}
                        rows={3}
                        style={{
                          width: "100%",
                          padding: "12px 14px",
                          borderRadius: "10px",
                          border: "1px solid #E5E7EB",
                          fontSize: "14px",
                          color: "#1F2937",
                          outline: "none",
                          transition: "all 0.2s ease",
                          backgroundColor: "#FFFFFF",
                          fontFamily: "inherit",
                          resize: "vertical",
                        }}
                        onFocus={(e) => {
                          e.target.style.borderColor = "#1B4D3E"
                          e.target.style.boxShadow = "0 0 0 4px rgba(27, 77, 62, 0.1)"
                        }}
                        onBlur={(e) => {
                          e.target.style.borderColor = "#E5E7EB"
                          e.target.style.boxShadow = "none"
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </form>
          )}
        </div>

        {/* Footer Actions */}
        <div
          style={{
            padding: "24px 36px",
            borderTop: "1px solid #E5E7EB",
            backgroundColor: "#FFFFFF",
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
                  padding: "12px 28px",
                  borderRadius: "10px",
                  border: "none",
                  background: "linear-gradient(135deg, #1B4D3E 0%, #2A6B4F 100%)",
                  color: "#FFFFFF",
                  fontSize: "14px",
                  fontWeight: "600",
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                  boxShadow: "0 4px 12px rgba(27, 77, 62, 0.2)",
                }}
                onMouseEnter={(e) => {
                  e.target.style.transform = "translateY(-2px)"
                  e.target.style.boxShadow = "0 6px 16px rgba(27, 77, 62, 0.3)"
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = "translateY(0)"
                  e.target.style.boxShadow = "0 4px 12px rgba(27, 77, 62, 0.2)"
                }}
              >
                Editar
              </button>
              <button
                onClick={handleExcluir}
                style={{
                  padding: "12px 28px",
                  borderRadius: "10px",
                  border: "1px solid #FCA5A5",
                  backgroundColor: "#FEF2F2",
                  color: "#DC2626",
                  fontSize: "14px",
                  fontWeight: "600",
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = "#FEE2E2"
                  e.target.style.transform = "translateY(-2px)"
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = "#FEF2F2"
                  e.target.style.transform = "translateY(0)"
                }}
              >
                Excluir
              </button>
            </>
          ) : (
            <>
              <button
                type="button"
                onClick={handleCancelEdit}
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
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
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
                {loading && (
                  <Loader2
                    size={18}
                    style={{
                      animation: "spin 1s linear infinite",
                    }}
                  />
                )}
                Salvar Alterações
              </button>
            </>
          )}
        </div>
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

const DetalhesImplemento = ({ implemento, onClose, onDeleted, onUpdated }) => {
  const [isEditing, setIsEditing] = useState(false)
  const [loading, setLoading] = useState(false)
  const [marcas, setMarcas] = useState([])
  const [tipos, setTipos] = useState([])
  const implementoId = implemento?.id || implemento?._id

  const [form, setForm] = useState({
    tipo: implemento?.tipo || "",
    marca: implemento?.marca || "",
    modelo: implemento?.modelo || "",
    capacidade: implemento?.capacidade || "",
    n_serie: implemento?.n_serie || "",
    observacao: implemento?.observacao || "",
  })

  useEffect(() => {
    if (isEditing) {
      fetchMarcasETipos()
    }
  }, [isEditing])

  async function fetchMarcasETipos() {
    try {
      setLoading(true)
      const [marcasRes, tiposRes] = await Promise.all([
        fetch(`${API_URL}/marcas`),
        fetch(`${API_URL}/tipos?categoria=implemento`),
      ])

      const marcasData = await marcasRes.json()
      const tiposData = await tiposRes.json()

      setMarcas(marcasData)
      setTipos(tiposData.filter((t) => t.categoria === "implemento"))
    } catch (error) {
      console.error("Erro ao buscar marcas e tipos:", error)
    } finally {
      setLoading(false)
    }
  }

  function updateForm(value) {
    setForm((prev) => ({ ...prev, ...value }))
  }

  async function handleSave() {
    setLoading(true)
    try {
      const response = await fetch(`${API_URL}/implementos/update/${implementoId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      })

      if (!response.ok) {
        alert("Erro ao atualizar implemento.")
        return
      }

      alert("Implemento atualizado com sucesso!")
      setIsEditing(false)
      if (onUpdated) {
        onUpdated({ ...implemento, ...form, _id: implementoId })
      }
    } catch (error) {
      console.error("Erro ao atualizar:", error)
      alert("Erro ao atualizar implemento.")
    } finally {
      setLoading(false)
    }
  }

  function handleCancelEdit() {
    setForm({
      tipo: implemento?.tipo || "",
      marca: implemento?.marca || "",
      modelo: implemento?.modelo || "",
      capacidade: implemento?.capacidade || "",
      n_serie: implemento?.n_serie || "",
      observacao: implemento?.observacao || "",
    })
    setIsEditing(false)
  }

  async function handleExcluir() {
    if (!window.confirm("Tem certeza que deseja excluir este implemento?")) return
    try {
      const resp = await fetch(`${API_URL}/implementos/${implementoId}`, {
        method: "DELETE",
      })
      if (resp.ok) {
        alert("Implemento excluído com sucesso!")
        onDeleted && onDeleted(implementoId)
        onClose && onClose()
      } else {
        alert("Erro ao excluir implemento.")
      }
    } catch (err) {
      alert("Erro: " + err.message)
    }
  }

  if (!implemento) return null

  return (
    <div
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
      <div
        style={{
          backgroundColor: "#FFFFFF",
          borderRadius: "20px",
          maxWidth: "950px",
          width: "100%",
          maxHeight: "92vh",
          overflow: "hidden",
          boxShadow: "0 25px 50px -12px rgba(27, 77, 62, 0.25), 0 0 0 1px rgba(27, 77, 62, 0.05)",
          display: "flex",
          flexDirection: "column",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header with Gradient */}
        <div
          style={{
            background: "#FFFFFF",
            padding: "32px 36px",
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
              backgroundColor: "#F9FAFB",
              border: "1px solid #E5E7EB",
              borderRadius: "10px",
              width: "40px",
              height: "40px",
              fontSize: "20px",
              cursor: "pointer",
              color: "#6B7280",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "all 0.2s ease",
              zIndex: 1,
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
            ×
          </button>

          <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
            <div
              style={{
                width: "72px",
                height: "72px",
                borderRadius: "14px",
                background: "linear-gradient(135deg, #1B4D3E 0%, #2A6B4F 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "26px",
                fontWeight: "700",
                color: "#FFFFFF",
                flexShrink: 0,
                boxShadow: "0 4px 12px rgba(27, 77, 62, 0.15)",
              }}
            >
             <Settings size={28} color="#fff" />
            </div>
            <div style={{ flex: 1 }}>
              <h2
                style={{
                  fontSize: "24px",
                  fontWeight: "700",
                  margin: 0,
                  marginBottom: "8px",
                  color: "#1F2937",
                  letterSpacing: "-0.5px",
                }}
              >
                {implemento?.tipo || "Implemento"}
              </h2>
              <div style={{ display: "flex", gap: "16px", fontSize: "13px", color: "#6B7280", flexWrap: "wrap" }}>
                <span
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                    backgroundColor: "#F9FAFB",
                    padding: "4px 10px",
                    borderRadius: "6px",
                    fontWeight: "600",
                  }}
                >
                  <svg width="14" height="14" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z"
                      clipRule="evenodd"
                    />
                  </svg>
                  ID: {implementoId || "-"}
                </span>
                <span
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                    backgroundColor: "#F0F9F6",
                    padding: "4px 10px",
                    borderRadius: "6px",
                    fontWeight: "600",
                    color: "#1B4D3E",
                  }}
                >
                  {implemento?.status}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div
          style={{
            padding: "36px",
            overflowY: "auto",
            flex: 1,
            backgroundColor: "#F9FAFB",
          }}
        >
          {!isEditing ? (
            <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
              {/* Info Card */}
              <div
                style={{
                  backgroundColor: "#FFFFFF",
                  borderRadius: "16px",
                  padding: "28px",
                  border: "1px solid #E5E7EB",
                  boxShadow: "0 1px 3px rgba(0, 0, 0, 0.05)",
                }}
              >
                <h3
                  style={{
                    fontSize: "11px",
                    fontWeight: "700",
                    color: "#1B4D3E",
                    textTransform: "uppercase",
                    letterSpacing: "0.5px",
                    marginBottom: "20px",
                  }}
                >
                  Informações do Implemento
                </h3>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(2, 1fr)",
                    gap: "20px",
                  }}
                >
                  <InfoItemCard label="Marca" value={implemento?.marca} />
                  <InfoItemCard label="Modelo" value={implemento?.modelo} />
                  <InfoItemCard label="Capacidade" value={implemento?.capacidade} />
                  <InfoItemCard label="N° Série" value={implemento?.n_serie} />
                </div>
              </div>

              {implemento?.observacao && (
                <div
                  style={{
                    backgroundColor: "#FFFFFF",
                    borderRadius: "16px",
                    padding: "28px",
                    border: "1px solid #E5E7EB",
                    boxShadow: "0 1px 3px rgba(0, 0, 0, 0.05)",
                  }}
                >
                  <h3
                    style={{
                      fontSize: "11px",
                      fontWeight: "700",
                      color: "#1B4D3E",
                      textTransform: "uppercase",
                      letterSpacing: "0.5px",
                      marginBottom: "20px",
                    }}
                  >
                    Observações
                  </h3>
                  <div
                    style={{
                      padding: "20px",
                      backgroundColor: "#F9FAFB",
                      borderRadius: "10px",
                      border: "1px solid #E5E7EB",
                    }}
                  >
                    <div
                      style={{
                        fontSize: "14px",
                        color: "#1F2937",
                        lineHeight: "1.8",
                      }}
                    >
                      {implemento?.observacao}
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <form
              onSubmit={(e) => {
                e.preventDefault()
                handleSave()
              }}
            >
              <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
                <div
                  style={{
                    backgroundColor: "#FFFFFF",
                    borderRadius: "16px",
                    padding: "28px",
                    border: "1px solid #E5E7EB",
                    boxShadow: "0 1px 3px rgba(0, 0, 0, 0.05)",
                  }}
                >
                  <h3
                    style={{
                      fontSize: "11px",
                      fontWeight: "700",
                      color: "#1B4D3E",
                      textTransform: "uppercase",
                      letterSpacing: "0.5px",
                      marginBottom: "20px",
                    }}
                  >
                    Dados do Implemento
                  </h3>
                  <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                    <div>
                      <label
                        style={{
                          display: "block",
                          fontSize: "11px",
                          fontWeight: "700",
                          color: "#6B7280",
                          textTransform: "uppercase",
                          letterSpacing: "0.5px",
                          marginBottom: "8px",
                        }}
                      >
                        Tipo de Implemento
                        <span style={{ color: "#DC2626" }}> *</span>
                      </label>
                      <select
                        value={form.tipo}
                        onChange={(e) => updateForm({ tipo: e.target.value })}
                        required
                        style={{
                          width: "100%",
                          padding: "12px 14px",
                          borderRadius: "10px",
                          border: "1px solid #E5E7EB",
                          fontSize: "14px",
                          color: "#1F2937",
                          outline: "none",
                          transition: "all 0.2s ease",
                          backgroundColor: "#FFFFFF",
                          cursor: "pointer",
                        }}
                        onFocus={(e) => {
                          e.target.style.borderColor = "#1B4D3E"
                          e.target.style.boxShadow = "0 0 0 4px rgba(27, 77, 62, 0.1)"
                        }}
                        onBlur={(e) => {
                          e.target.style.borderColor = "#E5E7EB"
                          e.target.style.boxShadow = "none"
                        }}
                      >
                        <option value="">Selecione...</option>
                        {tipos.map((tipo) => (
                          <option key={tipo._id} value={tipo.tipo}>
                            {tipo.tipo}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label
                        style={{
                          display: "block",
                          fontSize: "11px",
                          fontWeight: "700",
                          color: "#6B7280",
                          textTransform: "uppercase",
                          letterSpacing: "0.5px",
                          marginBottom: "8px",
                        }}
                      >
                        Marca
                        <span style={{ color: "#DC2626" }}> *</span>
                      </label>
                      <select
                        value={form.marca}
                        onChange={(e) => updateForm({ marca: e.target.value })}
                        required
                        style={{
                          width: "100%",
                          padding: "12px 14px",
                          borderRadius: "10px",
                          border: "1px solid #E5E7EB",
                          fontSize: "14px",
                          color: "#1F2937",
                          outline: "none",
                          transition: "all 0.2s ease",
                          backgroundColor: "#FFFFFF",
                          cursor: "pointer",
                        }}
                        onFocus={(e) => {
                          e.target.style.borderColor = "#1B4D3E"
                          e.target.style.boxShadow = "0 0 0 4px rgba(27, 77, 62, 0.1)"
                        }}
                        onBlur={(e) => {
                          e.target.style.borderColor = "#E5E7EB"
                          e.target.style.boxShadow = "none"
                        }}
                      >
                        <option value="">Selecione...</option>
                        {marcas.map((marca) => (
                          <option key={marca._id} value={marca.nome}>
                            {marca.nome}
                          </option>
                        ))}
                      </select>
                    </div>
                    <InputField
                      label="Modelo"
                      value={form.modelo}
                      onChange={(e) => updateForm({ modelo: e.target.value })}
                      required
                    />
                    <InputField
                      label="Capacidade"
                      value={form.capacidade}
                      onChange={(e) => updateForm({ capacidade: e.target.value })}
                    />
                    <InputField
                      label="Número de Série"
                      value={form.n_serie}
                      onChange={(e) => updateForm({ n_serie: e.target.value })}
                    />
                    <div>
                      <label
                        style={{
                          display: "block",
                          fontSize: "11px",
                          fontWeight: "700",
                          color: "#6B7280",
                          textTransform: "uppercase",
                          letterSpacing: "0.5px",
                          marginBottom: "8px",
                        }}
                      >
                        Observações
                      </label>
                      <textarea
                        value={form.observacao}
                        onChange={(e) => updateForm({ observacao: e.target.value })}
                        rows={3}
                        style={{
                          width: "100%",
                          padding: "12px 14px",
                          borderRadius: "10px",
                          border: "1px solid #E5E7EB",
                          fontSize: "14px",
                          color: "#1F2937",
                          outline: "none",
                          transition: "all 0.2s ease",
                          backgroundColor: "#FFFFFF",
                          fontFamily: "inherit",
                          resize: "vertical",
                        }}
                        onFocus={(e) => {
                          e.target.style.borderColor = "#1B4D3E"
                          e.target.style.boxShadow = "0 0 0 4px rgba(27, 77, 62, 0.1)"
                        }}
                        onBlur={(e) => {
                          e.target.style.borderColor = "#E5E7EB"
                          e.target.style.boxShadow = "none"
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </form>
          )}
        </div>

        {/* Footer Actions */}
        <div
          style={{
            padding: "24px 36px",
            borderTop: "1px solid #E5E7EB",
            backgroundColor: "#FFFFFF",
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
                  padding: "12px 28px",
                  borderRadius: "10px",
                  border: "none",
                  background: "linear-gradient(135deg, #1B4D3E 0%, #2A6B4F 100%)",
                  color: "#FFFFFF",
                  fontSize: "14px",
                  fontWeight: "600",
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                  boxShadow: "0 4px 12px rgba(27, 77, 62, 0.2)",
                }}
                onMouseEnter={(e) => {
                  e.target.style.transform = "translateY(-2px)"
                  e.target.style.boxShadow = "0 6px 16px rgba(27, 77, 62, 0.3)"
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = "translateY(0)"
                  e.target.style.boxShadow = "0 4px 12px rgba(27, 77, 62, 0.2)"
                }}
              >
                Editar
              </button>
              <button
                onClick={handleExcluir}
                style={{
                  padding: "12px 28px",
                  borderRadius: "10px",
                  border: "1px solid #FCA5A5",
                  backgroundColor: "#FEF2F2",
                  color: "#DC2626",
                  fontSize: "14px",
                  fontWeight: "600",
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = "#FEE2E2"
                  e.target.style.transform = "translateY(-2px)"
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = "#FEF2F2"
                  e.target.style.transform = "translateY(0)"
                }}
              >
                Excluir
              </button>
            </>
          ) : (
            <>
              <button
                type="button"
                onClick={handleCancelEdit}
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
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
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
                {loading && (
                  <Loader2
                    size={18}
                    style={{
                      animation: "spin 1s linear infinite",
                    }}
                  />
                )}
                Salvar Alterações
              </button>
            </>
          )}
        </div>
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

export default function MaquinasImplementos() {
  const [activeView, setActiveView] = useState("maquinas")
  const [maquinas, setMaquinas] = useState([])
  const [implementos, setImplementos] = useState([])
  const [busca, setBusca] = useState("")
  const [itemSelecionado, setItemSelecionado] = useState(null)
  const [mostrarModal, setMostrarModal] = useState(false)
  const [mostrarModalCriacao, setMostrarModalCriacao] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function getData() {
      try {
        setLoading(true)
        const [maquinasRes, implementosRes] = await Promise.all([
          fetch(`${API_URL}/maquinas`),
          fetch(`${API_URL}/implementos`),
        ])

        const maquinasData = await maquinasRes.json()
        const implementosData = await implementosRes.json()

        setMaquinas(maquinasData)
        setImplementos(implementosData)
      } catch (error) {
        console.error("Erro ao buscar dados:", error)
      } finally {
        setLoading(false)
      }
    }
    getData()
  }, [])

  const getStatusStyle = (status) => {
    const baseStyle = {
      padding: "4px 12px",
      borderRadius: "20px",
      fontSize: "12px",
      fontWeight: "600",
      display: "inline-block",
      textTransform: "capitalize",
    }

    switch (status?.toLowerCase()) {
      case "disponível":
        return {
          ...baseStyle,
          backgroundColor: "#D1FAE5",
          color: "#065F46",
        }
      case "indisponível":
        return {
          ...baseStyle,
          backgroundColor: "#FEE2E2",
          color: "#991B1B",
        }
      case "manutenção":
        return {
          ...baseStyle,
          backgroundColor: "#FEF3C7",
          color: "#92400E",
        }
      default:
        return {
          ...baseStyle,
          backgroundColor: "#E5E7EB",
          color: "#374151",
        }
    }
  }

  const itensFiltrados =
    activeView === "maquinas"
      ? maquinas.filter(
          (item) =>
            item.tipo?.toLowerCase().includes(busca.toLowerCase()) ||
            item.marca?.toLowerCase().includes(busca.toLowerCase()) ||
            item.modelo?.toLowerCase().includes(busca.toLowerCase()) ||
            item.status?.toLowerCase().includes(busca.toLowerCase()),
        )
      : implementos.filter(
          (item) =>
            item.tipo?.toLowerCase().includes(busca.toLowerCase()) ||
            item.marca?.toLowerCase().includes(busca.toLowerCase()) ||
            item.modelo?.toLowerCase().includes(busca.toLowerCase()) ||
            item.status?.toLowerCase().includes(busca.toLowerCase()),
        )

  const abrirDetalhes = (item) => {
    setItemSelecionado(item)
    setMostrarModal(true)
  }

  const handleDelete = (idDeleted) => {
    if (activeView === "maquinas") {
      setMaquinas((old) => old.filter((m) => m._id !== idDeleted))
    } else {
      setImplementos((old) => old.filter((i) => i._id !== idDeleted))
    }
    setMostrarModal(false)
  }

  const handleUpdate = (itemAtualizado) => {
    if (activeView === "maquinas") {
      setMaquinas((old) => old.map((m) => (m._id === itemAtualizado._id ? itemAtualizado : m)))
    } else {
      setImplementos((old) => old.map((i) => (i._id === itemAtualizado._id ? itemAtualizado : i)))
    }
    setMostrarModal(false)
  }

  const handleAddClick = () => {
    setMostrarModalCriacao(true)
  }

  const handleCreated = (novoItem) => {
    if (activeView === "maquinas") {
      setMaquinas((old) => [...old, novoItem])
    } else {
      setImplementos((old) => [...old, novoItem])
    }
    setMostrarModalCriacao(false)
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
          <p style={{ color: "#1B4D3E", fontWeight: "600", fontSize: "15px" }}>Carregando equipamentos...</p>
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
      <div style={{ maxWidth: "1400px", margin: "0 auto" }}>
        {/* Header with Toggle and Add Button */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "24px",
            flexWrap: "wrap",
            gap: "16px",
          }}
        >
          {/* View Toggle */}
          <div
            style={{
              display: "flex",
              gap: "12px",
              backgroundColor: "#fff",
              padding: "6px",
              borderRadius: "12px",
              border: "1px solid #E5E7EB",
              boxShadow: "0 2px 4px rgba(0, 0, 0, 0.05)",
            }}
          >
            <button
              onClick={() => {
                setActiveView("maquinas")
                setBusca("")
              }}
              style={{
                padding: "10px 24px",
                borderRadius: "8px",
                border: "none",
                cursor: "pointer",
                fontSize: "14px",
                fontWeight: "600",
                transition: "all 0.2s ease",
                backgroundColor: activeView === "maquinas" ? "#1B4D3E" : "transparent",
                color: activeView === "maquinas" ? "#fff" : "#6B7280",
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              <Tractor style={{ width: "18px", height: "18px" }} />
              Máquinas
            </button>
            <button
              onClick={() => {
                setActiveView("implementos")
                setBusca("")
              }}
              style={{
                padding: "10px 24px",
                borderRadius: "8px",
                border: "none",
                cursor: "pointer",
                fontSize: "14px",
                fontWeight: "600",
                transition: "all 0.2s ease",
                backgroundColor: activeView === "implementos" ? "#1B4D3E" : "transparent",
                color: activeView === "implementos" ? "#fff" : "#6B7280",
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              <Settings style={{ width: "18px", height: "18px" }} />
              Implementos
            </button>
          </div>

          {/* Add Button */}
          <button
            onClick={handleAddClick}
            style={{
              backgroundColor: "#1B4D3E",
              color: "#FFFFFF",
              padding: "12px 20px",
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
              e.currentTarget.style.transform = "translateY(-2px)"
              e.currentTarget.style.boxShadow = "0 4px 12px rgba(27, 77, 62, 0.3)"
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)"
              e.currentTarget.style.boxShadow = "none"
            }}
          >
            <Plus style={{ width: "20px", height: "20px" }} />
            {activeView === "maquinas" ? "Nova Máquina" : "Novo Implemento"}
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
            placeholder={`Buscar ${activeView === "maquinas" ? "máquinas" : "implementos"} por tipo, marca, modelo...`}
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
        {itensFiltrados.length === 0 && (
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
              {activeView === "maquinas" ? (
                <Tractor style={{ width: "36px", height: "36px", color: "#9CA3AF" }} />
              ) : (
                <Settings style={{ width: "36px", height: "36px", color: "#9CA3AF" }} />
              )}
            </div>
            <h3
              style={{
                fontSize: "18px",
                fontWeight: "600",
                color: "#374151",
                marginBottom: "8px",
              }}
            >
              {activeView === "maquinas" ? "Nenhuma máquina encontrada" : "Nenhum implemento encontrado"}
            </h3>
            <p style={{ color: "#9CA3AF", fontSize: "14px" }}>
              {busca
                ? "Tente ajustar sua busca"
                : `Você ainda não possui ${activeView === "maquinas" ? "máquinas" : "implementos"} cadastrados`}
            </p>
          </div>
        )}

        {/* Cards Grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
            gap: "20px",
          }}
        >
          {itensFiltrados.map((item) => (
            <div
              key={item._id}
              onClick={() => abrirDetalhes(item)}
              style={{
                backgroundColor: "#fff",
                padding: "24px",
                borderRadius: "20px",
                border: "1px solid #E5E7EB",
                cursor: "pointer",
                transition: "all 0.3s ease",
                boxShadow: "0 2px 8px rgba(0, 0, 0, 0.06)",
                position: "relative",
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
              {/* Status Badge */}
              <div style={{ position: "absolute", top: "20px", right: "20px" }}>
                <span style={getStatusStyle(item.status)}>{item.status}</span>
              </div>

              {/* Icon */}
              <div
                style={{
                  width: "64px",
                  height: "64px",
                  borderRadius: "16px",
                  background: "linear-gradient(135deg, #1B4D3E 0%, #153D2F 100%)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: "20px",
                  boxShadow: "0 4px 12px rgba(27, 77, 62, 0.2)",
                }}
              >
                {activeView === "maquinas" ? (
                  <Tractor style={{ width: "32px", height: "32px", color: "#fff" }} />
                ) : (
                  <Settings style={{ width: "32px", height: "32px", color: "#fff" }} />
                )}
              </div>

              {/* Type */}
              <h3
                style={{
                  fontSize: "20px",
                  fontWeight: "700",
                  color: "#1B4D3E",
                  marginBottom: "16px",
                  textTransform: "uppercase",
                  letterSpacing: "0.5px",
                }}
              >
                {item.tipo}
              </h3>

              {/* Details */}
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <svg
                    style={{ width: "18px", height: "18px", color: "#6B7280", flexShrink: 0 }}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                    />
                  </svg>
                  <div style={{ fontSize: "14px", color: "#374151" }}>
                    <span style={{ fontWeight: "600", color: "#6B7280" }}>Marca: </span>
                    {item.marca}
                  </div>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <svg
                    style={{ width: "18px", height: "18px", color: "#6B7280", flexShrink: 0 }}
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
                  <div style={{ fontSize: "14px", color: "#374151" }}>
                    <span style={{ fontWeight: "600", color: "#6B7280" }}>Modelo: </span>
                    {item.modelo}
                  </div>
                </div>
              </div>

              {/* View Details Arrow */}
              <div
                style={{
                  marginTop: "20px",
                  paddingTop: "20px",
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
                    gap: "6px",
                    fontSize: "14px",
                    fontWeight: "600",
                    color: "#1B4D3E",
                  }}
                >
                  Ver detalhes
                  <svg style={{ width: "18px", height: "18px" }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Modal Detalhes */}
        {mostrarModal && itemSelecionado && (
          <>
            {activeView === "maquinas" ? (
              <DetalhesMaquina
                maquina={itemSelecionado}
                onClose={() => setMostrarModal(false)}
                onDeleted={handleDelete}
                onUpdated={handleUpdate}
              />
            ) : (
              <DetalhesImplemento
                implemento={itemSelecionado}
                onClose={() => setMostrarModal(false)}
                onDeleted={handleDelete}
                onUpdated={handleUpdate}
              />
            )}
          </>
        )}

        {/* Modal Criação */}
        {mostrarModalCriacao && (
          <>
            {activeView === "maquinas" ? (
              <CreateMaquina onClose={() => setMostrarModalCriacao(false)} onCreated={handleCreated} />
            ) : (
              <CreateImplemento onClose={() => setMostrarModalCriacao(false)} onCreated={handleCreated} />
            )}
          </>
        )}
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
