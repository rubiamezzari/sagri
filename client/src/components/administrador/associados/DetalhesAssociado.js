import React, { useState } from "react";

const API_URL = "http://localhost:5050";

export default function DetalhesAssociado({ associado, onClose, onDeleted, onUpdated }) {
  const [activeTab, setActiveTab] = useState("pessoal");
  const [isEditing, setIsEditing] = useState(false);
  const [focusField, setFocusField] = useState(null);
  const associadoId = associado?.id || associado?._id;

  const [form, setForm] = useState({
    nome: associado?.nome || "",
    email: associado?.email || "",
    telefone: associado?.telefone || "",
    cpf: associado?.cpf || "",
    senha: "",
    data_associacao: associado?.data_associacao || "",
    endereco: {
      rua: associado?.endereco?.rua || "",
      numero: associado?.endereco?.numero || "",
      complemento: associado?.endereco?.complemento || "",
      bairro: associado?.endereco?.bairro || "",
      cidade: associado?.endereco?.cidade || "",
      uf: associado?.endereco?.uf || "",
      cep: associado?.endereco?.cep || "",
    },
    documentos: {
      anuidade: associado?.documentos?.anuidade || "",
      caf: associado?.documentos?.caf || "",
    },
  });

  function updateForm(value) {
    setForm((prev) => ({ ...prev, ...value }));
  }

  function updateEndereco(value) {
    setForm((prev) => ({
      ...prev,
      endereco: { ...prev.endereco, ...value },
    }));
  }

  function updateDocumentos(value) {
    setForm((prev) => ({
      ...prev,
      documentos: { ...prev.documentos, ...value },
    }));
  }

  async function handleSave() {
    try {
      const response = await fetch(`${API_URL}/associados/update/${associadoId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!response.ok) {
        alert("Erro ao atualizar associado.");
        return;
      }

      alert("Associado atualizado com sucesso!");
      setIsEditing(false);
      if (onUpdated) {
        onUpdated({ ...associado, ...form, _id: associadoId });
      }
    } catch (error) {
      console.error("Erro ao atualizar:", error);
      alert("Erro ao atualizar associado.");
    }
  }

  function handleCancelEdit() {
    if (window.confirm("Deseja cancelar as alterações?")) {
      setForm({
        nome: associado?.nome || "",
        email: associado?.email || "",
        telefone: associado?.telefone || "",
        cpf: associado?.cpf || "",
        senha: "",
        data_associacao: associado?.data_associacao || "",
        endereco: {
          rua: associado?.endereco?.rua || "",
          numero: associado?.endereco?.numero || "",
          complemento: associado?.endereco?.complemento || "",
          bairro: associado?.endereco?.bairro || "",
          cidade: associado?.endereco?.cidade || "",
          uf: associado?.endereco?.uf || "",
          cep: associado?.endereco?.cep || "",
        },
        documentos: {
          anuidade: associado?.documentos?.anuidade || "",
          caf: associado?.documentos?.caf || "",
        },
      });
      setIsEditing(false);
    }
  }

  async function handleExcluir() {
    if (!window.confirm("Tem certeza que deseja excluir este associado?")) return;
    try {
      const resp = await fetch(`${API_URL}/associados/${associadoId}`, {
        method: "DELETE",
      });
      if (resp.ok) {
        alert("Associado excluído com sucesso!");
        onDeleted && onDeleted(associadoId);
        onClose && onClose();
      } else {
        alert("Erro ao excluir associado.");
      }
    } catch (err) {
      alert("Erro: " + err.message);
    }
  }

  const endereco = associado?.endereco || {};
  const docs = associado?.documentos || {};

  if (!associado) return null;

  // SVG Icons
  const UploadIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="17 8 12 3 7 8" />
      <line x1="12" y1="3" x2="12" y2="15" />
    </svg>
  );

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
          maxWidth: "800px",
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
                  color: "#fff",
                  fontSize: "22px",
                  fontWeight: "600",
                  flexShrink: 0,
                }}
              >
                {associado?.nome
                  ?.split(" ")
                  .map((n) => n[0])
                  .slice(0, 2)
                  .join("")
                  .toUpperCase() || "?"}
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
                  {isEditing ? "Editar Associado" : associado?.nome || "Associado"}
                </h2>
                <p
                  style={{
                    fontSize: "14px",
                    color: "#6B7280",
                    margin: "4px 0 0 0",
                  }}
                >
                  {isEditing ? "Atualize as informações abaixo" : `ID: ${associadoId || "-"}`}
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
              e.target.style.color = "#6B7280";
            }}
            onMouseLeave={(e) => {
              e.target.style.color = "#9CA3AF";
            }}
          >
            ×
          </button>
        </div>

        {/* Tabs */}
        {!isEditing && (
          <div
            style={{
              display: "flex",
              gap: "0",
              padding: "0 32px",
              borderBottom: "2px solid #E5E7EB",
            }}
          >
            <button
              onClick={() => setActiveTab("pessoal")}
              style={{
                padding: "16px 24px",
                border: "none",
                borderBottom: activeTab === "pessoal" ? "3px solid #1B4D3E" : "none",
                backgroundColor: "transparent",
                color: activeTab === "pessoal" ? "#1B4D3E" : "#6B7280",
                cursor: "pointer",
                fontWeight: activeTab === "pessoal" ? "600" : "500",
                fontSize: "15px",
                transition: "all 0.2s ease",
                marginBottom: "-2px",
              }}
            >
              Dados Pessoais
            </button>
            <button
              onClick={() => setActiveTab("endereco")}
              style={{
                padding: "16px 24px",
                border: "none",
                borderBottom: activeTab === "endereco" ? "3px solid #1B4D3E" : "none",
                backgroundColor: "transparent",
                color: activeTab === "endereco" ? "#1B4D3E" : "#6B7280",
                cursor: "pointer",
                fontWeight: activeTab === "endereco" ? "600" : "500",
                fontSize: "15px",
                transition: "all 0.2s ease",
                marginBottom: "-2px",
              }}
            >
              Endereço
            </button>
          </div>
        )}

        {/* Content */}
        <div
          style={{
            padding: "32px",
            overflowY: "auto",
            flex: 1,
          }}
        >
          {/* VIEW MODE */}
          {!isEditing && activeTab === "pessoal" && (
            <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
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
                  <svg
                    style={{ width: "20px", height: "20px" }}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                  Informações Pessoais
                </h3>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: "16px",
                  }}
                >
                  <InfoItem label="CPF" value={associado?.cpf} />
                  <InfoItem label="Data Associação" value={associado?.data_associacao} />
                  <InfoItem label="Telefone" value={associado?.telefone} />
                  <InfoItem label="E-mail" value={associado?.email} />
                </div>
              </div>

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
                  <svg
                    style={{ width: "20px", height: "20px" }}
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
                  Documentos
                </h3>
                <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                  {docs.anuidade ? (
                    <a
                      href={`${API_URL}/uploads/anuidade/${docs.anuidade}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "12px",
                        padding: "16px",
                        backgroundColor: "#F0FDF4",
                        border: "1px solid #BBF7D0",
                        borderRadius: "12px",
                        textDecoration: "none",
                        transition: "all 0.2s ease",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = "#DCFCE7";
                        e.currentTarget.style.transform = "translateX(4px)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = "#F0FDF4";
                        e.currentTarget.style.transform = "translateX(0)";
                      }}
                    >
                      <div
                        style={{
                          width: "40px",
                          height: "40px",
                          borderRadius: "8px",
                          backgroundColor: "#309274",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <svg
                          style={{ width: "20px", height: "20px", color: "#fff" }}
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
                      </div>
                      <div style={{ flex: 1 }}>
                        <div
                          style={{
                            fontSize: "14px",
                            fontWeight: "600",
                            color: "#1B4D3E",
                          }}
                        >
                          Comprovante de Anuidade
                        </div>
                        <div style={{ fontSize: "12px", color: "#309274" }}>
                          Clique para visualizar
                        </div>
                      </div>
                      <svg
                        style={{ width: "20px", height: "20px", color: "#309274" }}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                        />
                      </svg>
                    </a>
                  ) : (
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "12px",
                        padding: "16px",
                        backgroundColor: "#F9FAFB",
                        border: "1px solid #E5E7EB",
                        borderRadius: "12px",
                      }}
                    >
                      <div
                        style={{
                          width: "40px",
                          height: "40px",
                          borderRadius: "8px",
                          backgroundColor: "#E5E7EB",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <svg
                          style={{ width: "20px", height: "20px", color: "#9CA3AF" }}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                      </div>
                      <div style={{ flex: 1 }}>
                        <div
                          style={{
                            fontSize: "14px",
                            fontWeight: "600",
                            color: "#6B7280",
                          }}
                        >
                          Comprovante de Anuidade
                        </div>
                        <div style={{ fontSize: "12px", color: "#9CA3AF" }}>
                          Documento não disponível
                        </div>
                      </div>
                    </div>
                  )}

                  {docs.caf ? (
                    <a
                      href={`${API_URL}/uploads/caf/${docs.caf}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "12px",
                        padding: "16px",
                        backgroundColor: "#F0FDF4",
                        border: "1px solid #BBF7D0",
                        borderRadius: "12px",
                        textDecoration: "none",
                        transition: "all 0.2s ease",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = "#DCFCE7";
                        e.currentTarget.style.transform = "translateX(4px)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = "#F0FDF4";
                        e.currentTarget.style.transform = "translateX(0)";
                      }}
                    >
                      <div
                        style={{
                          width: "40px",
                          height: "40px",
                          borderRadius: "8px",
                          backgroundColor: "#309274",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <svg
                          style={{ width: "20px", height: "20px", color: "#fff" }}
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
                      </div>
                      <div style={{ flex: 1 }}>
                        <div
                          style={{
                            fontSize: "14px",
                            fontWeight: "600",
                            color: "#1B4D3E",
                          }}
                        >
                          CAF
                        </div>
                        <div style={{ fontSize: "12px", color: "#309274" }}>
                          Clique para visualizar
                        </div>
                      </div>
                      <svg
                        style={{ width: "20px", height: "20px", color: "#309274" }}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                        />
                      </svg>
                    </a>
                  ) : (
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "12px",
                        padding: "16px",
                        backgroundColor: "#F9FAFB",
                        border: "1px solid #E5E7EB",
                        borderRadius: "12px",
                      }}
                    >
                      <div
                        style={{
                          width: "40px",
                          height: "40px",
                          borderRadius: "8px",
                          backgroundColor: "#E5E7EB",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <svg
                          style={{ width: "20px", height: "20px", color: "#9CA3AF" }}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                      </div>
                      <div style={{ flex: 1 }}>
                        <div
                          style={{
                            fontSize: "14px",
                            fontWeight: "600",
                            color: "#6B7280",
                          }}
                        >
                          CAF
                        </div>
                        <div style={{ fontSize: "12px", color: "#9CA3AF" }}>
                          Documento não disponível
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {!isEditing && activeTab === "endereco" && (
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
                <svg
                  style={{ width: "20px", height: "20px" }}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                Endereço Completo
              </h3>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "16px",
                }}
              >
                <InfoItem label="Rua" value={endereco.rua} fullWidth />
                <InfoItem label="Número" value={endereco.numero} />
                <InfoItem label="Complemento" value={endereco.complemento} />
                <InfoItem label="Bairro" value={endereco.bairro} />
                <InfoItem label="Cidade" value={endereco.cidade} />
                <InfoItem label="UF" value={endereco.uf} />
                <InfoItem label="CEP" value={endereco.cep} />
              </div>
            </div>
          )}

          {/* EDIT MODE */}
          {isEditing && (
            <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
              {/* Dados Pessoais */}
              <div>
                <h3
                  style={{
                    fontSize: "16px",
                    fontWeight: "600",
                    color: "#1B4D3E",
                    marginBottom: "16px",
                    paddingBottom: "8px",
                    borderBottom: "2px solid #D4E7D7",
                  }}
                >
                  Dados Pessoais
                </h3>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "16px" }}>
                  <div>
                    <label style={{ display: "block", marginBottom: "6px", color: "#1B4D3E", fontSize: "13px", fontWeight: "500" }}>
                      Nome Completo *
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

                  <div>
                    <label style={{ display: "block", marginBottom: "6px", color: "#1B4D3E", fontSize: "13px", fontWeight: "500" }}>
                      Email
                    </label>
                    <input
                      type="email"
                      value={form.email}
                      onChange={(e) => updateForm({ email: e.target.value })}
                      onFocus={() => setFocusField("email")}
                      onBlur={() => setFocusField(null)}
                      style={{
                        width: "100%",
                        height: "40px",
                        padding: "0 12px",
                        border: "2px solid",
                        borderColor: focusField === "email" ? "#1B4D3E" : "#D4E7D7",
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
                    <label style={{ display: "block", marginBottom: "6px", color: "#1B4D3E", fontSize: "13px", fontWeight: "500" }}>
                      Telefone *
                    </label>
                    <input
                      type="text"
                      placeholder="(00) 00000-0000"
                      value={form.telefone}
                      onChange={(e) => updateForm({ telefone: e.target.value })}
                      onFocus={() => setFocusField("telefone")}
                      onBlur={() => setFocusField(null)}
                      required
                      style={{
                        width: "100%",
                        height: "40px",
                        padding: "0 12px",
                        border: "2px solid",
                        borderColor: focusField === "telefone" ? "#1B4D3E" : "#D4E7D7",
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
                    <label style={{ display: "block", marginBottom: "6px", color: "#1B4D3E", fontSize: "13px", fontWeight: "500" }}>
                      CPF *
                    </label>
                    <input
                      type="text"
                      placeholder="000.000.000-00"
                      value={form.cpf}
                      onChange={(e) => updateForm({ cpf: e.target.value })}
                      onFocus={() => setFocusField("cpf")}
                      onBlur={() => setFocusField(null)}
                      required
                      style={{
                        width: "100%",
                        height: "40px",
                        padding: "0 12px",
                        border: "2px solid",
                        borderColor: focusField === "cpf" ? "#1B4D3E" : "#D4E7D7",
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
                    <label style={{ display: "block", marginBottom: "6px", color: "#1B4D3E", fontSize: "13px", fontWeight: "500" }}>
                      Senha
                    </label>
                    <input
                      type="password"
                      value={form.senha}
                      onChange={(e) => updateForm({ senha: e.target.value })}
                      onFocus={() => setFocusField("senha")}
                      onBlur={() => setFocusField(null)}
                      placeholder="Deixe em branco para manter"
                      style={{
                        width: "100%",
                        height: "40px",
                        padding: "0 12px",
                        border: "2px solid",
                        borderColor: focusField === "senha" ? "#1B4D3E" : "#D4E7D7",
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
                    <label style={{ display: "block", marginBottom: "6px", color: "#1B4D3E", fontSize: "13px", fontWeight: "500" }}>
                      Data Associação *
                    </label>
                    <input
                      type="date"
                      value={form.data_associacao}
                      onChange={(e) => updateForm({ data_associacao: e.target.value })}
                      onFocus={() => setFocusField("data_associacao")}
                      onBlur={() => setFocusField(null)}
                      required
                      style={{
                        width: "100%",
                        height: "40px",
                        padding: "0 12px",
                        border: "2px solid",
                        borderColor: focusField === "data_associacao" ? "#1B4D3E" : "#D4E7D7",
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
              </div>

              {/* Endereço */}
              <div>
                <h3
                  style={{
                    fontSize: "16px",
                    fontWeight: "600",
                    color: "#1B4D3E",
                    marginBottom: "16px",
                    paddingBottom: "8px",
                    borderBottom: "2px solid #D4E7D7",
                  }}
                >
                  Endereço
                </h3>
                <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                  <div style={{ display: "grid", gridTemplateColumns: "3fr 1fr", gap: "16px" }}>
                    <div>
                      <label style={{ display: "block", marginBottom: "6px", color: "#1B4D3E", fontSize: "13px", fontWeight: "500" }}>
                        Rua *
                      </label>
                      <input
                        type="text"
                        value={form.endereco.rua}
                        onChange={(e) => updateEndereco({ rua: e.target.value })}
                        onFocus={() => setFocusField("rua")}
                        onBlur={() => setFocusField(null)}
                        required
                        style={{
                          width: "100%",
                          height: "40px",
                          padding: "0 12px",
                          border: "2px solid",
                          borderColor: focusField === "rua" ? "#1B4D3E" : "#D4E7D7",
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
                      <label style={{ display: "block", marginBottom: "6px", color: "#1B4D3E", fontSize: "13px", fontWeight: "500" }}>
                        Número *
                      </label>
                      <input
                        type="text"
                        value={form.endereco.numero}
                        onChange={(e) => updateEndereco({ numero: e.target.value })}
                        onFocus={() => setFocusField("numero")}
                        onBlur={() => setFocusField(null)}
                        required
                        style={{
                          width: "100%",
                          height: "40px",
                          padding: "0 12px",
                          border: "2px solid",
                          borderColor: focusField === "numero" ? "#1B4D3E" : "#D4E7D7",
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

                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "16px" }}>
                    <div>
                      <label style={{ display: "block", marginBottom: "6px", color: "#1B4D3E", fontSize: "13px", fontWeight: "500" }}>
                        Complemento
                      </label>
                      <input
                        type="text"
                        value={form.endereco.complemento}
                        onChange={(e) => updateEndereco({ complemento: e.target.value })}
                        onFocus={() => setFocusField("complemento")}
                        onBlur={() => setFocusField(null)}
                        style={{
                          width: "100%",
                          height: "40px",
                          padding: "0 12px",
                          border: "2px solid",
                          borderColor: focusField === "complemento" ? "#1B4D3E" : "#D4E7D7",
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
                      <label style={{ display: "block", marginBottom: "6px", color: "#1B4D3E", fontSize: "13px", fontWeight: "500" }}>
                        Bairro *
                      </label>
                      <input
                        type="text"
                        value={form.endereco.bairro}
                        onChange={(e) => updateEndereco({ bairro: e.target.value })}
                        onFocus={() => setFocusField("bairro")}
                        onBlur={() => setFocusField(null)}
                        required
                        style={{
                          width: "100%",
                          height: "40px",
                          padding: "0 12px",
                          border: "2px solid",
                          borderColor: focusField === "bairro" ? "#1B4D3E" : "#D4E7D7",
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

                  <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr", gap: "16px" }}>
                    <div>
                      <label style={{ display: "block", marginBottom: "6px", color: "#1B4D3E", fontSize: "13px", fontWeight: "500" }}>
                        Cidade *
                      </label>
                      <input
                        type="text"
                        value={form.endereco.cidade}
                        onChange={(e) => updateEndereco({ cidade: e.target.value })}
                        onFocus={() => setFocusField("cidade")}
                        onBlur={() => setFocusField(null)}
                        required
                        style={{
                          width: "100%",
                          height: "40px",
                          padding: "0 12px",
                          border: "2px solid",
                          borderColor: focusField === "cidade" ? "#1B4D3E" : "#D4E7D7",
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
                      <label style={{ display: "block", marginBottom: "6px", color: "#1B4D3E", fontSize: "13px", fontWeight: "500" }}>
                        UF *
                      </label>
                      <select
                        value={form.endereco.uf}
                        onChange={(e) => updateEndereco({ uf: e.target.value })}
                        onFocus={() => setFocusField("uf")}
                        onBlur={() => setFocusField(null)}
                        required
                        style={{
                          width: "100%",
                          height: "40px",
                          padding: "0 12px",
                          border: "2px solid",
                          borderColor: focusField === "uf" ? "#1B4D3E" : "#D4E7D7",
                          borderRadius: "8px",
                          backgroundColor: "#FEFDFB",
                          fontSize: "14px",
                          outline: "none",
                          transition: "all 0.3s",
                          boxSizing: "border-box",
                        }}
                      >
                        <option value=""></option>
                        <option value="AC">AC</option>
                        <option value="AL">AL</option>
                        <option value="AP">AP</option>
                        <option value="AM">AM</option>
                        <option value="BA">BA</option>
                        <option value="CE">CE</option>
                        <option value="DF">DF</option>
                        <option value="ES">ES</option>
                        <option value="GO">GO</option>
                        <option value="MA">MA</option>
                        <option value="MT">MT</option>
                        <option value="MS">MS</option>
                        <option value="MG">MG</option>
                        <option value="PA">PA</option>
                        <option value="PB">PB</option>
                        <option value="PR">PR</option>
                        <option value="PE">PE</option>
                        <option value="PI">PI</option>
                        <option value="RJ">RJ</option>
                        <option value="RN">RN</option>
                        <option value="RS">RS</option>
                        <option value="RO">RO</option>
                        <option value="RR">RR</option>
                        <option value="SC">SC</option>
                        <option value="SP">SP</option>
                        <option value="SE">SE</option>
                        <option value="TO">TO</option>
                      </select>
                    </div>

                    <div>
                      <label style={{ display: "block", marginBottom: "6px", color: "#1B4D3E", fontSize: "13px", fontWeight: "500" }}>
                        CEP *
                      </label>
                      <input
                        type="text"
                        placeholder="00000-000"
                        value={form.endereco.cep}
                        onChange={(e) => updateEndereco({ cep: e.target.value })}
                        onFocus={() => setFocusField("cep")}
                        onBlur={() => setFocusField(null)}
                        required
                        style={{
                          width: "100%",
                          height: "40px",
                          padding: "0 12px",
                          border: "2px solid",
                          borderColor: focusField === "cep" ? "#1B4D3E" : "#D4E7D7",
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
                </div>
              </div>

              {/* Documentos */}
              <div>
                <h3
                  style={{
                    fontSize: "16px",
                    fontWeight: "600",
                    color: "#1B4D3E",
                    marginBottom: "16px",
                    paddingBottom: "8px",
                    borderBottom: "2px solid #D4E7D7",
                  }}
                >
                  Documentos
                </h3>
                <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                  {/* Anuidade */}
                  <div
                    style={{
                      border: "2px solid #D4E7D7",
                      borderRadius: "12px",
                      padding: "16px",
                      backgroundColor: "#F5F1E8",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                      <div
                        style={{
                          width: "40px",
                          height: "40px",
                          borderRadius: "50%",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          backgroundColor: "#1B4D3E",
                          color: "#F5F1E8",
                          flexShrink: 0,
                        }}
                      >
                        <UploadIcon />
                      </div>
                      <div style={{ flex: 1 }}>
                        <h4 style={{ marginBottom: "2px", color: "#1B4D3E", fontSize: "14px", fontWeight: "600" }}>
                          Anuidade
                        </h4>
                        <p style={{ fontSize: "11px", color: "#6B7280" }}>
                          {form.documentos.anuidade || "Nenhum arquivo selecionado"}
                        </p>
                      </div>
                      <label
                        htmlFor="anuidade"
                        style={{
                          padding: "6px 16px",
                          borderRadius: "6px",
                          cursor: "pointer",
                          backgroundColor: "#1B4D3E",
                          color: "#F5F1E8",
                          fontWeight: "500",
                          transition: "all 0.3s",
                          display: "inline-block",
                          fontSize: "12px",
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.boxShadow = "0 2px 8px rgba(0, 0, 0, 0.12)";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.boxShadow = "none";
                        }}
                      >
                        Escolher
                      </label>
                      <input
                        type="file"
                        id="anuidade"
                        accept="image/*,.pdf"
                        style={{ display: "none" }}
                        onChange={(e) => updateDocumentos({ anuidade: e.target.files?.[0]?.name || "" })}
                      />
                    </div>
                  </div>

                  {/* CAF */}
                  <div
                    style={{
                      border: "2px solid #D4E7D7",
                      borderRadius: "12px",
                      padding: "16px",
                      backgroundColor: "#F5F1E8",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                      <div
                        style={{
                          width: "40px",
                          height: "40px",
                          borderRadius: "50%",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          backgroundColor: "#1B4D3E",
                          color: "#F5F1E8",
                          flexShrink: 0,
                        }}
                      >
                        <UploadIcon />
                      </div>
                      <div style={{ flex: 1 }}>
                        <h4 style={{ marginBottom: "2px", color: "#1B4D3E", fontSize: "14px", fontWeight: "600" }}>
                          CAF
                        </h4>
                        <p style={{ fontSize: "11px", color: "#6B7280" }}>
                          {form.documentos.caf || "Nenhum arquivo selecionado"}
                        </p>
                      </div>
                      <label
                        htmlFor="caf"
                        style={{
                          padding: "6px 16px",
                          borderRadius: "6px",
                          cursor: "pointer",
                          backgroundColor: "#1B4D3E",
                          color: "#F5F1E8",
                          fontWeight: "500",
                          transition: "all 0.3s",
                          display: "inline-block",
                          fontSize: "12px",
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.boxShadow = "0 2px 8px rgba(0, 0, 0, 0.12)";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.boxShadow = "none";
                        }}
                      >
                        Escolher
                      </label>
                      <input
                        type="file"
                        id="caf"
                        accept="image/*,.pdf"
                        style={{ display: "none" }}
                        onChange={(e) => updateDocumentos({ caf: e.target.files?.[0]?.name || "" })}
                      />
                    </div>
                  </div>
                </div>
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
                  e.currentTarget.style.boxShadow = "0 4px 12px rgba(27, 77, 62, 0.3)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = "none";
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
                  e.target.style.backgroundColor = "#FEE2E2";
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = "transparent";
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
                  e.target.style.backgroundColor = "#FEE2E2";
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = "transparent";
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
                  e.currentTarget.style.boxShadow = "0 4px 12px rgba(27, 77, 62, 0.3)";
                  e.currentTarget.style.transform = "translateY(-2px)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = "none";
                  e.currentTarget.style.transform = "translateY(0)";
                }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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
  );
}

// Helper component for displaying info items
function InfoItem({ label, value, fullWidth }) {
  return (
    <div
      style={{
        gridColumn: fullWidth ? "1 / -1" : "auto",
      }}
    >
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
  );
}
