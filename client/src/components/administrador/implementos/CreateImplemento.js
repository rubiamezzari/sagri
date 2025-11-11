"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Combine, X, AlertCircle, Loader2 } from "lucide-react"

const API_URL = "http://localhost:5050"

export default function CreateImplemento({ onClose, onCreated }) {
  const [focusField, setFocusField] = useState(null)
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(true)
  const [marcas, setMarcas] = useState([])
  const [tipos, setTipos] = useState([])

  const [form, setForm] = useState({
    tipo: "",
    marca: "",
    modelo: "",
    n_serie: "",
    observacao: "",
  })

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
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
      console.error("Erro ao buscar dados:", error)
    } finally {
      setLoading(false)
    }
  }

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

    if (!form.tipo.trim()) {
      newErrors.tipo = "Tipo de implemento é obrigatório"
    }

    if (!form.marca.trim()) {
      newErrors.marca = "Marca é obrigatória"
    }

    if (!form.modelo.trim()) {
      newErrors.modelo = "Modelo é obrigatório"
    }

    return newErrors
  }

  async function onSubmit(e) {
    e.preventDefault()

    const newErrors = validateForm()

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      alert("Por favor, corrija os erros no formulário antes de cadastrar.")
      return
    }

    try {
      const response = await fetch(`${API_URL}/implementos`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      })

      if (!response.ok) {
        throw new Error("Erro ao criar implemento")
      }

      const novoImplemento = await response.json()
      alert("Implemento criado com sucesso!")

      if (onCreated) {
        onCreated(novoImplemento)
      }

      setForm({
        tipo: "",
        marca: "",
        modelo: "",
        n_serie: "",
        observacao: "",
      })
      setErrors({})
      onClose()
    } catch (error) {
      console.error("Erro ao criar implemento:", error)
      alert("Erro ao criar implemento: " + error.message)
    }
  }

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
        {/* Header with Icon */}
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
              <Combine size={28} color="#fff" />
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
              <form onSubmit={onSubmit}>
                <div
                  style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "20px" }}
                >
                  <SelectField
                    label="Tipo de Implemento"
                    name="tipo"
                    value={form.tipo}
                    onChange={(e) => updateForm({ tipo: e.target.value })}
                    options={tipos}
                    placeholder="Selecione o tipo"
                    required
                    error={errors.tipo}
                  />

                  <SelectField
                    label="Marca"
                    name="marca"
                    value={form.marca}
                    onChange={(e) => updateForm({ marca: e.target.value })}
                    options={marcas}
                    placeholder="Selecione a marca"
                    required
                    error={errors.marca}
                  />

                  <div style={{ gridColumn: "1 / -1" }}>
                    <InputField
                      label="Modelo"
                      name="modelo"
                      type="text"
                      value={form.modelo}
                      onChange={(e) => updateForm({ modelo: e.target.value })}
                      placeholder="Digite o modelo"
                      required
                      error={errors.modelo}
                    />
                  </div>

                  <div style={{ gridColumn: "1 / -1" }}>
                    <InputField
                      label="Número de Série"
                      name="n_serie"
                      type="text"
                      value={form.n_serie}
                      onChange={(e) => updateForm({ n_serie: e.target.value })}
                      placeholder="Digite o número de série"
                    />
                  </div>

                  <div style={{ gridColumn: "1 / -1" }}>
                    <TextAreaField
                      label="Observações"
                      name="observacao"
                      value={form.observacao}
                      onChange={(e) => updateForm({ observacao: e.target.value })}
                      placeholder="Informações adicionais sobre o implemento..."
                      rows={4}
                    />
                  </div>
                </div>
              </form>
            </div>
          )}
        </div>

        {/* Footer */}
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
            onClick={onSubmit}
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

// Helper Components
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
          const displayValue = option.tipo || option.nome || option._id
          const optionValue = option.tipo || option.nome || option._id

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
