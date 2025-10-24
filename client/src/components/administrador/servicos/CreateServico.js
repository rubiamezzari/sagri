"use client"

import { useState } from "react"
import { X } from "lucide-react"

const API_URL = "http://localhost:5050"

export default function CreateServico({ onClose, onCreated }) {
  const [form, setForm] = useState({
    nome: "",
    maquina_tipo: "",
    implemento_tipo: "",
    observacao: "",
  })
  const [focusField, setFocusField] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  function updateForm(value) {
    setForm((prev) => ({ ...prev, ...value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()

    if (!form.nome || !form.maquina_tipo || !form.implemento_tipo) {
      alert("Por favor, preencha todos os campos obrigatórios.")
      return
    }

    setIsSubmitting(true)

    try {
      const response = await fetch(`${API_URL}/servicos`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      })

      if (!response.ok) {
        throw new Error("Erro ao criar serviço")
      }

      const novoServico = await response.json()
      alert("Serviço criado com sucesso!")

      if (onCreated) {
        onCreated(novoServico)
      }

      onClose()
    } catch (error) {
      console.error("Erro ao criar serviço:", error)
      alert("Erro ao criar serviço: " + error.message)
    } finally {
      setIsSubmitting(false)
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
          maxWidth: "600px",
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
          <h2
            style={{
              fontSize: "24px",
              fontWeight: "600",
              color: "#1F2937",
              margin: 0,
            }}
          >
            Criar Novo Serviço
          </h2>
          <button
            onClick={onClose}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              color: "#9CA3AF",
              padding: "4px",
              transition: "color 0.2s ease",
            }}
            onMouseEnter={(e) => {
              e.target.style.color = "#6B7280"
            }}
            onMouseLeave={(e) => {
              e.target.style.color = "#9CA3AF"
            }}
          >
            <X style={{ width: "24px", height: "24px" }} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ flex: 1, overflowY: "auto", padding: "32px" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            <div>
              <label
                style={{
                  display: "block",
                  marginBottom: "8px",
                  color: "#1B4D3E",
                  fontSize: "14px",
                  fontWeight: "600",
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
                placeholder="Ex: Plantio de Soja"
                style={{
                  width: "100%",
                  height: "44px",
                  padding: "0 14px",
                  border: "2px solid",
                  borderColor: focusField === "nome" ? "#1B4D3E" : "#D4E7D7",
                  borderRadius: "8px",
                  backgroundColor: "#FEFDFB",
                  fontSize: "15px",
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
                    marginBottom: "8px",
                    color: "#1B4D3E",
                    fontSize: "14px",
                    fontWeight: "600",
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
                  placeholder="Ex: Trator"
                  style={{
                    width: "100%",
                    height: "44px",
                    padding: "0 14px",
                    border: "2px solid",
                    borderColor: focusField === "maquina_tipo" ? "#1B4D3E" : "#D4E7D7",
                    borderRadius: "8px",
                    backgroundColor: "#FEFDFB",
                    fontSize: "15px",
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
                    marginBottom: "8px",
                    color: "#1B4D3E",
                    fontSize: "14px",
                    fontWeight: "600",
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
                  placeholder="Ex: Plantadeira"
                  style={{
                    width: "100%",
                    height: "44px",
                    padding: "0 14px",
                    border: "2px solid",
                    borderColor: focusField === "implemento_tipo" ? "#1B4D3E" : "#D4E7D7",
                    borderRadius: "8px",
                    backgroundColor: "#FEFDFB",
                    fontSize: "15px",
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
                  marginBottom: "8px",
                  color: "#1B4D3E",
                  fontSize: "14px",
                  fontWeight: "600",
                }}
              >
                Observações
              </label>
              <textarea
                value={form.observacao}
                onChange={(e) => updateForm({ observacao: e.target.value })}
                onFocus={() => setFocusField("observacao")}
                onBlur={() => setFocusField(null)}
                rows={4}
                placeholder="Adicione observações sobre o serviço..."
                style={{
                  width: "100%",
                  padding: "12px 14px",
                  border: "2px solid",
                  borderColor: focusField === "observacao" ? "#1B4D3E" : "#D4E7D7",
                  borderRadius: "8px",
                  backgroundColor: "#FEFDFB",
                  fontSize: "15px",
                  outline: "none",
                  transition: "all 0.3s",
                  boxSizing: "border-box",
                  fontFamily: "inherit",
                  resize: "vertical",
                }}
              />
            </div>
          </div>
        </form>

        {/* Footer */}
        <div
          style={{
            padding: "24px 32px",
            borderTop: "1px solid #E5E7EB",
            display: "flex",
            gap: "12px",
            justifyContent: "flex-end",
          }}
        >
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            style={{
              padding: "12px 24px",
              borderRadius: "8px",
              border: "2px solid #E5E7EB",
              backgroundColor: "transparent",
              color: "#6B7280",
              fontSize: "14px",
              fontWeight: "600",
              cursor: isSubmitting ? "not-allowed" : "pointer",
              transition: "all 0.2s ease",
              opacity: isSubmitting ? 0.5 : 1,
            }}
            onMouseEnter={(e) => {
              if (!isSubmitting) {
                e.target.style.backgroundColor = "#F9FAFB"
              }
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = "transparent"
            }}
          >
            Cancelar
          </button>

          <button
            type="submit"
            onClick={handleSubmit}
            disabled={isSubmitting}
            style={{
              padding: "12px 24px",
              borderRadius: "8px",
              border: "none",
              backgroundColor: "#1B4D3E",
              color: "#fff",
              fontSize: "14px",
              fontWeight: "600",
              cursor: isSubmitting ? "not-allowed" : "pointer",
              transition: "all 0.3s ease",
              opacity: isSubmitting ? 0.7 : 1,
            }}
            onMouseEnter={(e) => {
              if (!isSubmitting) {
                e.currentTarget.style.boxShadow = "0 4px 12px rgba(27, 77, 62, 0.3)"
                e.currentTarget.style.transform = "translateY(-2px)"
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow = "none"
              e.currentTarget.style.transform = "translateY(0)"
            }}
          >
            {isSubmitting ? "Criando..." : "Criar Serviço"}
          </button>
        </div>
      </div>
    </div>
  )
}
