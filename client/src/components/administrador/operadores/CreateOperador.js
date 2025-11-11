"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { UserPlus, X, AlertCircle } from "lucide-react"

const API_URL = "http://localhost:5050"

export default function CreateOperador({ onClose, onCreated }) {
  const [form, setForm] = useState({
    nome: "",
    email: "",
    telefone: "",
    cpf: "",
    senha: "",
  })
  const [focusField, setFocusField] = useState(null)
  const [errors, setErrors] = useState({})

  function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  function validateTelefone(telefone) {
    const cleaned = telefone.replace(/\D/g, "")
    return cleaned.length === 10 || cleaned.length === 11
  }

  function validateCPF(cpf) {
    const cleaned = cpf.replace(/\D/g, "")
    return cleaned.length === 11
  }

  function validateForm() {
    const newErrors = {}

    if (!form.nome.trim()) {
      newErrors.nome = "Nome completo é obrigatório"
    } else if (form.nome.trim().length < 3) {
      newErrors.nome = "Nome deve ter pelo menos 3 caracteres"
    }

    if (!form.email) {
      newErrors.email = "Email é obrigatório"
    } else if (!validateEmail(form.email)) {
      newErrors.email = "Email inválido"
    }

    if (!form.telefone) {
      newErrors.telefone = "Telefone é obrigatório"
    } else if (!validateTelefone(form.telefone)) {
      newErrors.telefone = "Telefone deve ter 10 ou 11 dígitos"
    }

    if (!form.cpf) {
      newErrors.cpf = "CPF é obrigatório"
    } else if (!validateCPF(form.cpf)) {
      newErrors.cpf = "CPF deve ter 11 dígitos"
    }

    if (!form.senha) {
      newErrors.senha = "Senha é obrigatória"
    } else if (form.senha.length < 6) {
      newErrors.senha = "Senha deve ter no mínimo 6 caracteres"
    }

    return newErrors
  }

  function updateForm(value) {
    setForm((prev) => ({ ...prev, ...value }))
    Object.keys(value).forEach((key) => {
      if (errors[key]) {
        setErrors((prev) => ({ ...prev, [key]: undefined }))
      }
    })
  }

  async function onSubmit(e) {
    e.preventDefault()

    const formErrors = validateForm()
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors)
      return
    }

    const cleanData = {
      ...form,
      cpf: form.cpf.replace(/\D/g, ""),
      telefone: form.telefone.replace(/\D/g, ""),
    }

    try {
      const response = await fetch(`${API_URL}/operadores/create`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(cleanData),
      })

      if (!response.ok) {
        const errorText = await response.text()
        alert("Erro ao cadastrar operador: " + errorText)
        return
      }

      alert("Operador cadastrado com sucesso!")
      if (onCreated) {
        onCreated()
      }
      setForm({
        nome: "",
        email: "",
        telefone: "",
        cpf: "",
        senha: "",
      })
      setErrors({})
      onClose()
    } catch (error) {
      alert("Erro na comunicação com o servidor.")
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
              <UserPlus size={28} color="#fff" />
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
                Novo Operador
              </h2>
              <p
                style={{
                  fontSize: "14px",
                  color: "#6B7280",
                  margin: "4px 0 0 0",
                }}
              >
                Cadastre um novo operador no sistema
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
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                  gap: "20px",
                }}
              >
                <div style={{ gridColumn: "1 / -1" }}>
                  <InputField
                    label="Nome Completo"
                    name="nome"
                    type="text"
                    value={form.nome}
                    onChange={(e) => updateForm({ nome: e.target.value })}
                    placeholder="Digite o nome completo"
                    required
                    error={errors.nome}
                  />
                </div>

                <InputField
                  label="Email"
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={(e) => updateForm({ email: e.target.value })}
                  placeholder="email@exemplo.com"
                  required
                  error={errors.email}
                />

                <InputField
                  label="Telefone"
                  name="telefone"
                  type="text"
                  value={form.telefone}
                  onChange={(e) => updateForm({ telefone: maskTelefone(e.target.value) })}
                  placeholder="(00) 00000-0000"
                  required
                  error={errors.telefone}
                />

                <InputField
                  label="CPF"
                  name="cpf"
                  type="text"
                  value={form.cpf}
                  onChange={(e) => updateForm({ cpf: maskCPF(e.target.value) })}
                  placeholder="000.000.000-00"
                  required
                  error={errors.cpf}
                />

                <div style={{ gridColumn: "1 / -1" }}>
                  <InputField
                    label="Senha"
                    name="senha"
                    type="password"
                    value={form.senha}
                    onChange={(e) => updateForm({ senha: e.target.value })}
                    placeholder="Mínimo 6 caracteres"
                    required
                    error={errors.senha}
                  />
                </div>
              </div>
            </form>
          </div>
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
            onClick={onSubmit}
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
            Cadastrar
          </button>
        </div>
      </motion.div>

      <style>{`
        @keyframes modalSlideIn {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
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

function maskTelefone(value) {
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
  return value
    .replace(/\D/g, "")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d{1,2})$/, "$1-$2")
    .slice(0, 14)
}
