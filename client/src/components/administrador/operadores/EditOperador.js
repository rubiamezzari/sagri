import React, { useState, useEffect } from "react";

const API_URL = "http://localhost:5050";

export default function EditOperador({ id, onClose }) {
  const [form, setForm] = useState({
    nome: "",
    email: "",
    telefone: "",
    cpf: "",
  });
  const [focusField, setFocusField] = useState(null);

  useEffect(() => {
    if (!id) return;
    async function fetchData() {
      try {
        const response = await fetch(`${API_URL}/operadores/${id}`);
        if (!response.ok) throw new Error();
        const operador = await response.json();
        const { usuario, ...resto } = operador;
        setForm(resto);
      } catch {
        alert("Erro ao buscar operador.");
        onClose();
      }
    }
    fetchData();
  }, [id, onClose]);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSalvar() {
    try {
      const response = await fetch(`${API_URL}/operadores/update/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!response.ok) throw new Error();
      alert("Operador atualizado com sucesso!");
      onClose();
    } catch {
      alert("Erro ao atualizar operador.");
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
    marginBottom: "16px",
    borderRadius: "8px",
    border: "2px solid",
    borderColor: focusField === fieldName ? "#1B4D3E" : "#D4E7D7",
    fontSize: "14px",
    outline: "none",
    transition: "all 0.3s",
    backgroundColor: "#FEFDFB",
    boxSizing: "border-box",
  });

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
            <UserIcon />
          </div>
          <h3 style={titulo}>Editar Operador</h3>
        </div>

        {/* Content */}
        <div style={contentStyle}>
          <label style={labelStyle}>Nome *</label>
          <input
            type="text"
            name="nome"
            value={form.nome}
            onChange={handleChange}
            onFocus={() => setFocusField("nome")}
            onBlur={() => setFocusField(null)}
            style={inputStyle("nome")}
            placeholder="Digite o nome completo"
            required
          />

          <label style={labelStyle}>Email</label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            onFocus={() => setFocusField("email")}
            onBlur={() => setFocusField(null)}
            style={inputStyle("email")}
            placeholder="email@exemplo.com"
            required
          />

          <label style={labelStyle}>Telefone *</label>
          <input
            type="text"
            name="telefone"
            value={form.telefone}
            onChange={handleChange}
            onFocus={() => setFocusField("telefone")}
            onBlur={() => setFocusField(null)}
            style={inputStyle("telefone")}
            placeholder="(00) 00000-0000"
            required
          />

          <label style={labelStyle}>CPF *</label>
          <input
            type="text"
            name="cpf"
            value={form.cpf}
            onChange={handleChange}
            onFocus={() => setFocusField("cpf")}
            onBlur={() => setFocusField(null)}
            style={inputStyle("cpf")}
            placeholder="000.000.000-00"
            required
          />

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
              onClick={handleSalvar}
              type="button"
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "#153D2F";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "#1B4D3E";
              }}
            >
              <CheckIcon />
              Salvar
            </button>
          </div>
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
