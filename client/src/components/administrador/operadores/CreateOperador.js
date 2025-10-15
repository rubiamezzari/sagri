import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const API_URL = "http://localhost:5050";

export default function CreateOperador({ onClose }) {
  const [form, setForm] = useState({
    nome: "",
    email: "",
    telefone: "",
    cpf: "",
    senha: "",
  });
  const [focusField, setFocusField] = useState(null);
  const navigate = useNavigate();

  function updateForm(value) {
    setForm((prev) => ({ ...prev, ...value }));
  }

  async function onSubmit(e) {
    e.preventDefault();

    const cleanData = {
      ...form,
      cpf: form.cpf.replace(/\D/g, ""),
      telefone: form.telefone.replace(/\D/g, ""),
    };

    try {
      const response = await fetch(`${API_URL}/operadores/create`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(cleanData),
      });

      if (!response.ok) {
        const errorText = await response.text();
        alert("Erro ao cadastrar operador: " + errorText);
        return;
      }

      alert("Operador cadastrado com sucesso!");
      onClose();
    } catch (error) {
      alert("Erro na comunicação com o servidor.");
    }
  }

  const inputStyle = (fieldName) => ({
    width: "100%",
    height: "40px",
    padding: "0 12px",
    border: "2px solid",
    borderColor: focusField === fieldName ? "#1B4D3E" : "#D4E7D7",
    borderRadius: "8px",
    backgroundColor: "#FEFDFB",
    fontSize: "14px",
    outline: "none",
    transition: "all 0.3s",
    boxSizing: "border-box",
  });

  const labelStyle = {
    display: "block",
    marginBottom: "6px",
    color: "#1B4D3E",
    fontSize: "13px",
    fontWeight: "500",
  };

  // SVG Icon
  const UserIcon = () => (
    <svg
      width="28"
      height="28"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#fff"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );

  const CheckIcon = () => (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px",
      }}
    >
      <div style={{ width: "100%", maxWidth: "520px" }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          style={{
            backgroundColor: "#FFFFFF",
            borderRadius: "16px",
            boxShadow: "0 12px 40px rgba(0, 0, 0, 0.2)",
            overflow: "hidden",
          }}
        >
          {/* Header */}
          <div
            style={{
              background: " #1B4D3E",
              padding: "32px 28px",
              display: "flex",
              alignItems: "center",
              gap: "16px",
            }}
          >
            <div
              style={{
                width: "56px",
                height: "56px",
                borderRadius: "12px",
                backgroundColor: "rgba(255, 255, 255, 0.15)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#FFFFFF",
              }}
            >
              <UserIcon />
            </div>
            <div>
              <h1 style={{ color: "#FFFFFF", fontSize: "24px", fontWeight: "600", margin: "0 0 4px 0" }}>
                Novo Operador
              </h1>
              <p style={{ color: "rgba(255, 255, 255, 0.85)", fontSize: "14px", margin: 0 }}>
                Cadastre um novo operador no sistema
              </p>
            </div>
          </div>

          <div style={{ padding: "28px" }}>
            <form onSubmit={onSubmit}>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "16px" }}>
                {/* Nome */}
                <div>
                  <label htmlFor="nome" style={labelStyle}>
                    Nome Completo *
                  </label>
                  <input
                    id="nome"
                    type="text"
                    value={form.nome}
                    onChange={(e) => updateForm({ nome: e.target.value })}
                    onFocus={() => setFocusField("nome")}
                    onBlur={() => setFocusField(null)}
                    required
                    placeholder="Digite o nome completo"
                    style={inputStyle("nome")}
                  />
                </div>

                {/* Email */}
                <div>
                  <label htmlFor="email" style={labelStyle}>
                    Email *
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={form.email}
                    onChange={(e) => updateForm({ email: e.target.value })}
                    onFocus={() => setFocusField("email")}
                    onBlur={() => setFocusField(null)}
                    required
                    placeholder="email@exemplo.com"
                    style={inputStyle("email")}
                  />
                </div>

                {/* Telefone */}
                <div>
                  <label htmlFor="telefone" style={labelStyle}>
                    Telefone *
                  </label>
                  <input
                    id="telefone"
                    type="text"
                    value={form.telefone}
                    onChange={(e) => updateForm({ telefone: e.target.value })}
                    onFocus={() => setFocusField("telefone")}
                    onBlur={() => setFocusField(null)}
                    required
                    placeholder="(00) 00000-0000"
                    style={inputStyle("telefone")}
                  />
                </div>

                {/* CPF */}
                <div>
                  <label htmlFor="cpf" style={labelStyle}>
                    CPF *
                  </label>
                  <input
                    id="cpf"
                    type="text"
                    value={form.cpf}
                    onChange={(e) => updateForm({ cpf: e.target.value })}
                    onFocus={() => setFocusField("cpf")}
                    onBlur={() => setFocusField(null)}
                    required
                    placeholder="000.000.000-00"
                    style={inputStyle("cpf")}
                  />
                </div>

                {/* Senha */}
                <div>
                  <label htmlFor="senha" style={labelStyle}>
                    Senha *
                  </label>
                  <input
                    id="senha"
                    type="password"
                    value={form.senha}
                    onChange={(e) => updateForm({ senha: e.target.value })}
                    onFocus={() => setFocusField("senha")}
                    onBlur={() => setFocusField(null)}
                    required
                    placeholder="••••••••"
                    style={inputStyle("senha")}
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                  gap: "10px",
                  marginTop: "28px",
                  paddingTop: "20px",
                  borderTop: "1px solid #E5E7EB",
                }}
              >
                <button
                  type="button"
                  onClick={onClose}
                  style={{
                    padding: "11px 20px",
                    borderRadius: "8px",
                    border: "1.5px solid #D1D5DB",
                    backgroundColor: "#fff",
                    color: "#4B5563",
                    fontWeight: "600",
                    fontSize: "14px",
                    cursor: "pointer",
                    transition: "all 0.2s",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = "#F9FAFB";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = "#fff";
                  }}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  style={{
                    padding: "11px 28px",
                    borderRadius: "8px",
                    border: "none",
                    backgroundColor: "#1B4D3E",
                    color: "#fff",
                    fontWeight: "600",
                    fontSize: "14px",
                    cursor: "pointer",
                    transition: "all 0.2s",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = "#153D2F";
                    e.currentTarget.style.transform = "translateY(-2px)";
                    e.currentTarget.style.boxShadow = "0 6px 20px rgba(27, 77, 62, 0.3)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = "#1B4D3E";
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow = "none";
                  }}
                >
                  <CheckIcon />
                  Cadastrar
                </button>
              </div>
            </form>
          </div>
        </motion.div>

       
      </div>
    </div>
  );
}
