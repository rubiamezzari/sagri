"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, User, Mail, Phone, CreditCard, AlertCircle, Loader2 } from "lucide-react"

const API_URL = "http://localhost:5050"

export default function EditOperador({ id, onClose }) {
  const [form, setForm] = useState({
    nome: "",
    email: "",
    telefone: "",
    cpf: "",
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Funções de máscara
  function maskTelefone(value) {
    if (!value) return ""
    const cleaned = value.replace(/\D/g, "")
    if (cleaned.length <= 10) {
      return cleaned.replace(/^(\d{2})(\d)/, "($1) $2").replace(/(\d{4})(\d)/, "$1-$2")
    }
    return cleaned
      .replace(/^(\d{2})(\d)/, "($1) $2")
      .replace(/(\d{5})(\d)/, "$1-$2")
      .slice(0, 15)
  }

  function maskCPF(value) {
    if (!value) return ""
    return value
      .replace(/\D/g, "")
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d{1,2})$/, "$1-$2")
      .slice(0, 14)
  }

  // Validação do formato do ID do MongoDB (24 caracteres hexadecimais)
  function isValidObjectId(id) {
    if (!id) return false
    return /^[a-f\d]{24}$/i.test(id)
  }

  useEffect(() => {
    if (!id) {
      console.error("❌ ID não fornecido para EditOperador")
      setError("ID do operador não fornecido")
      setLoading(false)
      return
    }

    console.log("🔍 ID recebido:", id)
    console.log("📏 Tipo do ID:", typeof id)
    console.log("📏 Comprimento do ID:", id.length)

    // Validar formato do ID
    if (!isValidObjectId(id)) {
      console.error("❌ ID inválido! Formato esperado: 24 caracteres hexadecimais")
      console.error("   ID recebido:", id)
      setError(`ID inválido: "${id}". O ID deve ter 24 caracteres hexadecimais.`)
      setLoading(false)
      return
    }

    async function fetchData() {
      try {
        setLoading(true)
        setError(null)

        const url = `${API_URL}/operadores/${id}`
        console.log("🌐 Fazendo requisição para:", url)

        const response = await fetch(url)
        console.log("📡 Status da resposta:", response.status)
        console.log("📡 Status text:", response.statusText)

        if (!response.ok) {
          let errorMessage = `Erro ${response.status}: ${response.statusText}`

          // Tenta ler a resposta de erro
          const clonedResponse = response.clone()
          try {
            const errorData = await response.json()
            console.error("❌ Erro JSON do servidor:", errorData)
            errorMessage = errorData.error || errorData.message || errorMessage
          } catch {
            try {
              const errorText = await clonedResponse.text()
              console.error("❌ Erro texto do servidor:", errorText)
              if (errorText) errorMessage = errorText
            } catch (e) {
              console.error("❌ Erro ao ler resposta:", e)
            }
          }

          if (response.status === 404) {
            errorMessage = "Operador não encontrado no banco de dados"
          } else if (response.status === 500) {
            errorMessage = "Erro no servidor ao buscar operador"
          }

          throw new Error(errorMessage)
        }

        const operador = await response.json()
        console.log("✅ Dados recebidos do servidor:", operador)

        if (!operador) {
          throw new Error("Nenhum dado retornado do servidor")
        }

        setForm({
          nome: operador.nome || "",
          email: operador.email || "",
          telefone: maskTelefone(operador.telefone || ""),
          cpf: maskCPF(operador.cpf || ""),
        })

        setLoading(false)
      } catch (error) {
        console.error("💥 Erro completo ao buscar operador:", error)
        setError(error.message)
        setLoading(false)
      }
    }

    fetchData()
  }, [id])

  function handleChange(e) {
    const { name, value } = e.target

    let formattedValue = value

    // Aplica máscara conforme o campo
    if (name === "telefone") {
      formattedValue = maskTelefone(value)
    } else if (name === "cpf") {
      formattedValue = maskCPF(value)
    }

    setForm((prev) => ({ ...prev, [name]: formattedValue }))
  }

  async function handleSalvar() {
    try {
      // Validação básica
      if (!form.nome.trim()) {
        alert("Nome é obrigatório")
        return
      }
      if (!form.email.trim()) {
        alert("E-mail é obrigatório")
        return
      }
      if (!form.telefone) {
        alert("Telefone é obrigatório")
        return
      }
      if (!form.cpf) {
        alert("CPF é obrigatório")
        return
      }

      // Remove máscaras antes de enviar
      const cleanData = {
        nome: form.nome.trim(),
        email: form.email.trim(),
        telefone: form.telefone.replace(/\D/g, ""),
        cpf: form.cpf.replace(/\D/g, ""),
      }

      console.log("💾 Salvando dados:", cleanData)
      console.log("📍 URL da requisição:", `${API_URL}/operadores/update/${id}`)
      console.log("🔑 ID usado:", id)

      const response = await fetch(`${API_URL}/operadores/update/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(cleanData),
      })

      console.log("📡 Status da atualização:", response.status)
      console.log("📡 Headers da resposta:", response.headers.get("content-type"))

      if (!response.ok) {
        let errorMessage = "Erro ao atualizar"
        try {
          const errorData = await response.json()
          console.error("❌ Erro JSON do servidor:", errorData)
          errorMessage = errorData.error || errorData.message || errorMessage
        } catch (e) {
          // Se não for JSON, tenta ler como texto usando um clone
          try {
            const clonedResponse = response.clone()
            const errorText = await clonedResponse.text()
            console.error("❌ Erro texto do servidor:", errorText)
            if (errorText) errorMessage = errorText
          } catch (cloneError) {
            console.error("❌ Erro ao ler resposta:", cloneError)
          }
        }
        throw new Error(errorMessage)
      }

      const resultado = await response.json()
      console.log("✅ Operador atualizado:", resultado)

      alert("Operador atualizado com sucesso!")
      onClose()
    } catch (error) {
      console.error("💥 Erro ao atualizar:", error)
      alert("Erro ao atualizar operador: " + error.message)
    }
  }

  // Se houver erro de ID inválido ou não encontrado
  if (error && !loading) {
    return (
      <AnimatePresence>
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
          }}
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ duration: 0.2 }}
            style={{
              backgroundColor: "#fff",
              borderRadius: "20px",
              maxWidth: "480px",
              width: "100%",
              padding: "40px",
              textAlign: "center",
              boxShadow: "0 25px 50px -12px rgba(27, 77, 62, 0.25), 0 0 0 1px rgba(27, 77, 62, 0.05)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              style={{
                width: "72px",
                height: "72px",
                borderRadius: "50%",
                background: "linear-gradient(135deg, #FEE2E2 0%, #FECACA 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 20px",
              }}
            >
              <AlertCircle size={36} color="#DC2626" />
            </div>

            <h2
              style={{
                fontSize: "22px",
                fontWeight: "600",
                color: "#1F2937",
                margin: "0 0 12px 0",
              }}
            >
              Erro ao Carregar Operador
            </h2>

            <p
              style={{
                fontSize: "14px",
                color: "#6B7280",
                margin: "0 0 32px 0",
                lineHeight: "1.6",
              }}
            >
              {error}
            </p>

            <button
              onClick={onClose}
              style={{
                padding: "12px 32px",
                borderRadius: "10px",
                border: "none",
                background: "linear-gradient(135deg, #1B4D3E 0%, #2A6B4F 100%)",
                color: "#fff",
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
              Fechar
            </button>
          </motion.div>
        </motion.div>
      </AnimatePresence>
    )
  }

  return (
    <AnimatePresence>
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
          {/* Header */}
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
                <User size={28} color="#fff" />
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
                  Editar Operador
                </h2>
                <p
                  style={{
                    fontSize: "14px",
                    color: "#6B7280",
                    margin: "4px 0 0 0",
                  }}
                >
                  Atualize as informações do operador
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
                <div
                  style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "20px" }}
                >
                  <InputField
                    label="Nome Completo"
                    name="nome"
                    type="text"
                    value={form.nome}
                    onChange={handleChange}
                    placeholder="Digite o nome completo"
                    required
                    icon={<User size={18} />}
                    style={{ gridColumn: "span 2" }}
                  />

                  <InputField
                    label="E-mail"
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="email@exemplo.com"
                    required
                    icon={<Mail size={18} />}
                    style={{ gridColumn: "span 2" }}
                  />

                  <InputField
                    label="Telefone"
                    name="telefone"
                    type="text"
                    value={form.telefone}
                    onChange={handleChange}
                    placeholder="(00) 00000-0000"
                    required
                    icon={<Phone size={18} />}
                  />

                  <InputField
                    label="CPF"
                    name="cpf"
                    type="text"
                    value={form.cpf}
                    onChange={handleChange}
                    placeholder="000.000.000-00"
                    required
                    icon={<CreditCard size={18} />}
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
              onClick={handleSalvar}
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
        </motion.div>

        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </motion.div>
    </AnimatePresence>
  )
}

// Helper Component
function InputField({ label, name, type, value, onChange, placeholder, required = false, icon, style }) {
  return (
    <div style={style}>
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
      <div style={{ position: "relative" }}>
        {icon && (
          <div
            style={{
              position: "absolute",
              left: "14px",
              top: "50%",
              transform: "translateY(-50%)",
              color: "#9CA3AF",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              pointerEvents: "none",
            }}
          >
            {icon}
          </div>
        )}
        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          style={{
            width: "100%",
            padding: icon ? "12px 14px 12px 44px" : "12px 14px",
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
  )
}
