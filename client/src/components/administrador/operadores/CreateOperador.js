import React, { useState } from "react";

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
  const [errors, setErrors] = useState({});

  // Funções de máscara
  function maskTelefone(value) {
    const cleaned = value.replace(/\D/g, "");
    if (cleaned.length <= 10) {
      return cleaned
        .replace(/^(\d{2})(\d)/, "($1) $2")
        .replace(/(\d{4})(\d)/, "$1-$2");
    }
    return cleaned
      .replace(/^(\d{2})(\d)/, "($1) $2")
      .replace(/(\d{5})(\d)/, "$1-$2")
      .slice(0, 15);
  }

  function maskCPF(value) {
    return value
      .replace(/\D/g, "")
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d{1,2})$/, "$1-$2")
      .slice(0, 14);
  }

  // Funções de validação
  function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  function validateTelefone(telefone) {
    const cleaned = telefone.replace(/\D/g, "");
    return cleaned.length === 10 || cleaned.length === 11;
  }

  function validateCPF(cpf) {
    const cleaned = cpf.replace(/\D/g, "");
    return cleaned.length === 11;
  }

  function validateForm() {
    const newErrors = {};

    if (!form.nome.trim()) {
      newErrors.nome = "Nome completo é obrigatório";
    } else if (form.nome.trim().length < 3) {
      newErrors.nome = "Nome deve ter pelo menos 3 caracteres";
    }

    if (!form.email) {
      newErrors.email = "Email é obrigatório";
    } else if (!validateEmail(form.email)) {
      newErrors.email = "Email inválido";
    }

    if (!form.telefone) {
      newErrors.telefone = "Telefone é obrigatório";
    } else if (!validateTelefone(form.telefone)) {
      newErrors.telefone = "Telefone deve ter 10 ou 11 dígitos";
    }

    if (!form.cpf) {
      newErrors.cpf = "CPF é obrigatório";
    } else if (!validateCPF(form.cpf)) {
      newErrors.cpf = "CPF deve ter 11 dígitos";
    }

    if (!form.senha) {
      newErrors.senha = "Senha é obrigatória";
    } else if (form.senha.length < 6) {
      newErrors.senha = "Senha deve ter no mínimo 6 caracteres";
    }

    return newErrors;
  }

  function updateForm(value) {
    setForm((prev) => ({ ...prev, ...value }));
    // Limpar erro do campo quando ele for modificado
    if (value.nome !== undefined) setErrors((prev) => ({ ...prev, nome: undefined }));
    if (value.email !== undefined) setErrors((prev) => ({ ...prev, email: undefined }));
    if (value.telefone !== undefined) setErrors((prev) => ({ ...prev, telefone: undefined }));
    if (value.cpf !== undefined) setErrors((prev) => ({ ...prev, cpf: undefined }));
    if (value.senha !== undefined) setErrors((prev) => ({ ...prev, senha: undefined }));
  }

  async function onSubmit(e) {
    e.preventDefault();

    const formErrors = validateForm();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }

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

  // --- ESTILOS ---
  const modalStyle = {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100vw",
    height: "100vh",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
    backdropFilter: "blur(3px)",
  };

  const boxStyle = {
    backgroundColor: "#fff",
    padding: "0",
    borderRadius: "16px",
    width: "520px",
    maxWidth: "95%",
    boxShadow: "0 12px 40px rgba(0, 0, 0, 0.2)",
    maxHeight: "85vh",
    overflowY: "auto",
    position: "relative",
    animation: "modalSlideIn 0.3s ease-out",
  };

  const headerStyle = {
    padding: "24px 24px 20px",
    borderBottom: "1px solid #F3F4F6",
    position: "relative",
  };

  const closeBtnStyle = {
    position: "absolute",
    top: "18px",
    right: "18px",
    width: "32px",
    height: "32px",
    borderRadius: "50%",
    backgroundColor: "#F3F4F6",
    border: "none",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "all 0.2s",
  };

  const iconWrapperStyle = {
    width: "52px",
    height: "52px",
    borderRadius: "12px",
    background: "linear-gradient(135deg, #1B4D3E 0%, #2a6b54 100%)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: "14px",
  };

  const titulo = {
    color: "#1B4D3E",
    fontSize: "22px",
    fontWeight: "700",
    margin: "0",
    textTransform: "uppercase",
    letterSpacing: "0.3px",
  };

  const contentStyle = {
    padding: "24px",
  };

  const labelStyle = {
    display: "block",
    marginBottom: "6px",
    color: "#1B4D3E",
    fontSize: "13px",
    fontWeight: "500",
  };

  const inputStyle = (fieldName) => ({
    width: "100%",
    padding: "11px 14px",
    marginBottom: errors[fieldName] ? "6px" : "16px",
    borderRadius: "8px",
    border: "2px solid",
    borderColor: errors[fieldName] ? "#dc2626" : (focusField === fieldName ? "#1B4D3E" : "#D4E7D7"),
    fontSize: "14px",
    outline: "none",
    transition: "all 0.3s",
    backgroundColor: "#FEFDFB",
    boxSizing: "border-box",
  });

  const errorStyle = {
    color: "#dc2626",
    fontSize: "12px",
    marginBottom: "16px",
    display: "flex",
    alignItems: "center",
    gap: "4px",
  };

  const buttonContainerStyle = {
    display: "flex",
    gap: "10px",
    paddingTop: "20px",
    borderTop: "1px solid #F3F4F6",
  };

  const btnCancelar = {
    flex: 1,
    padding: "11px 20px",
    borderRadius: "8px",
    border: "1.5px solid #D1D5DB",
    backgroundColor: "#fff",
    color: "#4B5563",
    fontWeight: "600",
    fontSize: "14px",
    cursor: "pointer",
    transition: "all 0.2s",
  };

  const btnSalvar = {
    flex: 1,
    padding: "11px 20px",
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
    justifyContent: "center",
    gap: "6px",
  };

  // SVG Icons
  const UserPlusIcon = () => (
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
      <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="8.5" cy="7" r="4" />
      <line x1="20" y1="8" x2="20" y2="14" />
      <line x1="23" y1="11" x2="17" y2="11" />
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

  const AlertCircleIcon = () => (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="8" x2="12" y2="12" />
      <line x1="12" y1="16" x2="12.01" y2="16" />
    </svg>
  );

  // --- JSX ---
  return (
    <div style={modalStyle} onClick={onClose}>
      <div style={boxStyle} onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div style={headerStyle}>
          <button
            style={closeBtnStyle}
            onClick={onClose}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "#E5E7EB";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "#F3F4F6";
            }}
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#6B7280"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>

          <div style={iconWrapperStyle}>
            <UserPlusIcon />
          </div>
          <h3 style={titulo}>Novo Operador</h3>
        </div>

        {/* Content */}
        <div style={contentStyle}>
          <form onSubmit={onSubmit}>
            <label style={labelStyle}>Nome Completo *</label>
            <input
              type="text"
              value={form.nome}
              onChange={(e) => updateForm({ nome: e.target.value })}
              onFocus={() => setFocusField("nome")}
              onBlur={() => setFocusField(null)}
              style={inputStyle("nome")}
              placeholder="Digite o nome completo"
              required
            />
            {errors.nome && (
              <div style={errorStyle}>
                <AlertCircleIcon />
                <span>{errors.nome}</span>
              </div>
            )}

            <label style={labelStyle}>Email *</label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => updateForm({ email: e.target.value })}
              onFocus={() => setFocusField("email")}
              onBlur={() => setFocusField(null)}
              style={inputStyle("email")}
              placeholder="email@exemplo.com"
              required
            />
            {errors.email && (
              <div style={errorStyle}>
                <AlertCircleIcon />
                <span>{errors.email}</span>
              </div>
            )}

            <label style={labelStyle}>Telefone *</label>
            <input
              type="text"
              value={form.telefone}
              onChange={(e) => updateForm({ telefone: maskTelefone(e.target.value) })}
              onFocus={() => setFocusField("telefone")}
              onBlur={() => setFocusField(null)}
              style={inputStyle("telefone")}
              placeholder="(00) 00000-0000"
              required
            />
            {errors.telefone && (
              <div style={errorStyle}>
                <AlertCircleIcon />
                <span>{errors.telefone}</span>
              </div>
            )}

            <label style={labelStyle}>CPF *</label>
            <input
              type="text"
              value={form.cpf}
              onChange={(e) => updateForm({ cpf: maskCPF(e.target.value) })}
              onFocus={() => setFocusField("cpf")}
              onBlur={() => setFocusField(null)}
              style={inputStyle("cpf")}
              placeholder="000.000.000-00"
              required
            />
            {errors.cpf && (
              <div style={errorStyle}>
                <AlertCircleIcon />
                <span>{errors.cpf}</span>
              </div>
            )}

            <label style={labelStyle}>Senha *</label>
            <input
              type="password"
              value={form.senha}
              onChange={(e) => updateForm({ senha: e.target.value })}
              onFocus={() => setFocusField("senha")}
              onBlur={() => setFocusField(null)}
              style={inputStyle("senha")}
              placeholder="Mínimo 6 caracteres"
              required
            />
            {errors.senha && (
              <div style={errorStyle}>
                <AlertCircleIcon />
                <span>{errors.senha}</span>
              </div>
            )}

            {/* Buttons */}
            <div style={buttonContainerStyle}>
              <button
                style={btnCancelar}
                onClick={onClose}
                type="button"
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
                style={btnSalvar}
                type="submit"
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = "#153D2F";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "#1B4D3E";
                }}
              >
                <CheckIcon />
                Cadastrar
              </button>
            </div>
          </form>
        </div>
      </div>

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
    </div>
  );
}
