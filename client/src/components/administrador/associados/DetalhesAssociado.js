import React, { useState } from "react";

const API_URL = "http://localhost:5050";

const ESTADOS_BRASILEIROS = [
  "AC", "AL", "AP", "AM", "BA", "CE", "DF", "ES", "GO", "MA", "MT", "MS", 
  "MG", "PA", "PB", "PR", "PE", "PI", "RJ", "RN", "RS", "RO", "RR", "SC", 
  "SP", "SE", "TO"
];

export default function DetalhesAssociadoAlt({ associado, onClose, onDeleted, onUpdated }) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    nome: associado?.nome || "",
    cpf: associado?.cpf || "",
    telefone: associado?.telefone || "",
    email: associado?.email || "",
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
  });
  const [loading, setLoading] = useState(false);

  const associadoId = associado?.id || associado?._id;

  async function handleExcluir() {
    if (!window.confirm("Tem certeza que deseja excluir este associado?"))
      return;
    try {
      const id = associadoId;
      const resp = await fetch(`${API_URL}/associados/${id}`, {
        method: "DELETE",
      });
      if (resp.ok) {
        alert("Associado excluído com sucesso!");
        onDeleted && onDeleted(id);
        onClose && onClose();
      } else {
        alert("Erro ao excluir associado.");
      }
    } catch (err) {
      alert("Erro: " + err.message);
    }
  }

  async function handleSalvar(e) {
    e.preventDefault();
    setLoading(true);
    try {
      const resp = await fetch(`${API_URL}/associados/${associadoId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (resp.ok) {
        const updated = await resp.json();
        onUpdated && onUpdated(updated);
        setIsEditing(false);
      } else {
        alert("Erro ao atualizar associado.");
      }
    } catch (err) {
      alert("Erro: " + err.message);
    } finally {
      setLoading(false);
    }
  }

  const handleChange = (field, value) => {
    if (field.includes(".")) {
      const [parent, child] = field.split(".");
      setFormData((prev) => ({
        ...prev,
        [parent]: { ...prev[parent], [child]: value },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [field]: value }));
    }
  };

  const endereco = associado?.endereco || {};
  const docs = associado?.documentos || {};

  if (!associado) return null;

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
              e.target.style.backgroundColor = "#F3F4F6";
              e.target.style.borderColor = "#D1D5DB";
              e.target.style.color = "#1F2937";
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = "#F9FAFB";
              e.target.style.borderColor = "#E5E7EB";
              e.target.style.color = "#6B7280";
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
              {associado?.nome
                ?.split(" ")
                .map((n) => n[0])
                .slice(0, 2)
                .join("")
                .toUpperCase() || "?"}
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
                {associado?.nome || "Associado"}
              </h2>
              <div style={{ display: "flex", gap: "16px", fontSize: "13px", color: "#6B7280", flexWrap: "wrap" }}>
                <span style={{ 
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  backgroundColor: "#F9FAFB",
                  padding: "4px 10px",
                  borderRadius: "6px",
                  fontWeight: "600",
                }}>
                  <svg width="14" height="14" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
                  </svg>
                  ID: {associadoId || "-"}
                </span>
                {associado?.data_associacao && (
                  <span style={{ 
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                    backgroundColor: "#F0F9F6",
                    padding: "4px 10px",
                    borderRadius: "6px",
                    fontWeight: "600",
                    color: "#1B4D3E",
                  }}>
                    <svg width="14" height="14" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                    </svg>
                    Associado desde {associado.data_associacao}
                  </span>
                )}
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
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "24px",
              }}
            >
              {/* Left Column - Contact & Personal */}
              <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
                {/* Contact Card */}
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
                    Informações de Contato
                  </h3>
                  <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                    <InfoItem label="Telefone" value={associado?.telefone} />
                    <InfoItem label="E-mail" value={associado?.email} />
                    <InfoItem label="CPF" value={associado?.cpf} />
                  </div>
                </div>

                {/* Documents Card */}
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
                    Documentos
                  </h3>
                  <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                   
                    <DocumentItem
                      label="CAF"
                      available={!!docs.caf}
                      url={docs.caf ? `${API_URL}/uploads/caf/${docs.caf}` : null}
                    />
                  </div>
                </div>
              </div>

              {/* Right Column - Address */}
              <div>
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
                    Endereço
                  </h3>

                  <div
                    style={{
                      padding: "20px",
                      backgroundColor: "#F9FAFB",
                      borderRadius: "10px",
                      border: "1px solid #E5E7EB",
                      marginBottom: "20px",
                    }}
                  >
                    <div
                      style={{
                        fontSize: "14px",
                        lineHeight: "1.8",
                        color: "#1F2937",
                      }}
                    >
                      {endereco.rua && (
                        <div style={{ fontWeight: "600" }}>
                          {endereco.rua}
                          {endereco.numero && `, ${endereco.numero}`}
                        </div>
                      )}
                      {endereco.complemento && (
                        <div style={{ color: "#6B7280", fontSize: "13px", marginTop: "2px" }}>
                          {endereco.complemento}
                        </div>
                      )}
                      {endereco.bairro && (
                        <div style={{ marginTop: "8px" }}>{endereco.bairro}</div>
                      )}
                      {endereco.cidade && endereco.uf && (
                        <div style={{ fontWeight: "600" }}>
                          {endereco.cidade} - {endereco.uf}
                        </div>
                      )}
                      {endereco.cep && (
                        <div style={{ marginTop: "8px", color: "#6B7280", fontSize: "13px" }}>
                          CEP: {endereco.cep}
                        </div>
                      )}
                    </div>
                  </div>

                 
                    
                </div>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSalvar}>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "24px",
                }}
              >
                {/* Left Column - Personal & Contact */}
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
                      Dados Pessoais
                    </h3>
                    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                      <InputField
                        label="Nome Completo"
                        value={formData.nome}
                        onChange={(e) => handleChange("nome", e.target.value)}
                        required
                      />
                      <InputField
                        label="CPF"
                        value={formData.cpf}
                        onChange={(e) => handleChange("cpf", e.target.value)}
                        required
                      />
                      <InputField
                        label="Telefone"
                        value={formData.telefone}
                        onChange={(e) => handleChange("telefone", e.target.value)}
                        required
                      />
                      <InputField
                        label="E-mail"
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleChange("email", e.target.value)}
                        required
                      />
                      <InputField
                        label="Data de Associação"
                        type="date"
                        value={formData.data_associacao}
                        onChange={(e) => handleChange("data_associacao", e.target.value)}
                      />
                    </div>
                  </div>
                </div>

                {/* Right Column - Address */}
                <div>
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
                      Endereço
                    </h3>
                    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                      <InputField
                        label="CEP"
                        value={formData.endereco.cep}
                        onChange={(e) => handleChange("endereco.cep", e.target.value)}
                      />
                      <InputField
                        label="Rua"
                        value={formData.endereco.rua}
                        onChange={(e) => handleChange("endereco.rua", e.target.value)}
                      />
                      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "16px" }}>
                        <InputField
                          label="Número"
                          value={formData.endereco.numero}
                          onChange={(e) => handleChange("endereco.numero", e.target.value)}
                        />
                        <SelectField
                          label="UF"
                          value={formData.endereco.uf}
                          onChange={(e) => handleChange("endereco.uf", e.target.value)}
                          options={ESTADOS_BRASILEIROS}
                        />
                      </div>
                      <InputField
                        label="Complemento"
                        value={formData.endereco.complemento}
                        onChange={(e) => handleChange("endereco.complemento", e.target.value)}
                      />
                      <InputField
                        label="Bairro"
                        value={formData.endereco.bairro}
                        onChange={(e) => handleChange("endereco.bairro", e.target.value)}
                      />
                      <InputField
                        label="Cidade"
                        value={formData.endereco.cidade}
                        onChange={(e) => handleChange("endereco.cidade", e.target.value)}
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
                  e.target.style.transform = "translateY(-2px)";
                  e.target.style.boxShadow = "0 6px 16px rgba(27, 77, 62, 0.3)";
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = "translateY(0)";
                  e.target.style.boxShadow = "0 4px 12px rgba(27, 77, 62, 0.2)";
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
                  e.target.style.backgroundColor = "#FEE2E2";
                  e.target.style.transform = "translateY(-2px)";
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = "#FEF2F2";
                  e.target.style.transform = "translateY(0)";
                }}
              >
                Excluir
              </button>
            </>
          ) : (
            <>
              <button
                type="button"
                onClick={() => setIsEditing(false)}
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
                  e.target.style.backgroundColor = "#F9FAFB";
                  e.target.style.transform = "translateY(-2px)";
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = "#FFFFFF";
                  e.target.style.transform = "translateY(0)";
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
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  boxShadow: loading ? "none" : "0 4px 12px rgba(27, 77, 62, 0.2)",
                }}
                onMouseEnter={(e) => {
                  if (!loading) {
                    e.target.style.transform = "translateY(-2px)";
                    e.target.style.boxShadow = "0 6px 16px rgba(27, 77, 62, 0.3)";
                  }
                }}
                onMouseLeave={(e) => {
                  if (!loading) {
                    e.target.style.transform = "translateY(0)";
                    e.target.style.boxShadow = "0 4px 12px rgba(27, 77, 62, 0.2)";
                  }
                }}
              >
                {loading && (
                  <div
                    style={{
                      width: "18px",
                      height: "18px",
                      border: "2px solid #FFFFFF",
                      borderTop: "2px solid transparent",
                      borderRadius: "50%",
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
  );
}

// Helper Components
function InfoItem({ label, value }) {
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
  );
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
          e.target.style.borderColor = "#1B4D3E";
          e.target.style.boxShadow = "0 0 0 4px rgba(27, 77, 62, 0.1)";
        }}
        onBlur={(e) => {
          e.target.style.borderColor = "#E5E7EB";
          e.target.style.boxShadow = "none";
        }}
      />
    </div>
  );
}

function SelectField({ label, value, onChange, options }) {
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
      </label>
      <select
        value={value}
        onChange={onChange}
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
          e.target.style.borderColor = "#1B4D3E";
          e.target.style.boxShadow = "0 0 0 4px rgba(27, 77, 62, 0.1)";
        }}
        onBlur={(e) => {
          e.target.style.borderColor = "#E5E7EB";
          e.target.style.boxShadow = "none";
        }}
      >
        <option value="">Selecione...</option>
        {options.map((uf) => (
          <option key={uf} value={uf}>
            {uf}
          </option>
        ))}
      </select>
    </div>
  );
}

function DocumentItem({ label, available, url }) {
  if (available && url) {
    return (
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "12px 16px",
          backgroundColor: "#F0F9F6",
          border: "1px solid #D1FAE5",
          borderRadius: "10px",
          textDecoration: "none",
          transition: "all 0.2s ease",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = "#E6F5EF";
          e.currentTarget.style.borderColor = "#1B4D3E";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = "#F0F9F6";
          e.currentTarget.style.borderColor = "#D1FAE5";
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <div
            style={{
              width: "32px",
              height: "32px",
              borderRadius: "8px",
              backgroundColor: "#1B4D3E",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <svg
              style={{ width: "16px", height: "16px", color: "#FFFFFF" }}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <div>
            <div
              style={{
                fontSize: "13px",
                fontWeight: "600",
                color: "#1B4D3E",
              }}
            >
              {label}
            </div>
            <div style={{ fontSize: "11px", color: "#6B7280" }}>
              Disponível
            </div>
          </div>
        </div>
        <svg
          style={{ width: "16px", height: "16px", color: "#1B4D3E" }}
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
    );
  }

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "12px 16px",
        backgroundColor: "#F9FAFB",
        border: "1px solid #E5E7EB",
        borderRadius: "10px",
        opacity: 0.6,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
        <div
          style={{
            width: "32px",
            height: "32px",
            borderRadius: "8px",
            backgroundColor: "#E5E7EB",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <svg
            style={{ width: "16px", height: "16px", color: "#9CA3AF" }}
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
        <div>
          <div
            style={{
              fontSize: "13px",
              fontWeight: "600",
              color: "#9CA3AF",
            }}
          >
            {label}
          </div>
          <div style={{ fontSize: "11px", color: "#D1D5DB" }}>
            Não disponível
          </div>
        </div>
      </div>
    </div>
  );
}