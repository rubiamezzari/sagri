import React, { useEffect, useState } from "react";
import { Search, Tractor, Settings, Plus } from "lucide-react";

const API_URL = "http://localhost:5050";

const DetalhesMaquina = ({ maquina, onClose, onDeleted, onUpdated }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [focusField, setFocusField] = useState(null);
  const maquinaId = maquina?.id || maquina?._id;

  const [form, setForm] = useState({
    tipo: maquina?.tipo || "",
    marca: maquina?.marca || "",
    modelo: maquina?.modelo || "",
    status: maquina?.status || "",
    potencia: maquina?.potencia || "",
    n_serie: maquina?.n_serie || "",
    observacao: maquina?.observacao || "",
  });

  function updateForm(value) {
    setForm((prev) => ({ ...prev, ...value }));
  }

  async function handleSave() {
    try {
      const response = await fetch(`${API_URL}/maquinas/update/${maquinaId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!response.ok) {
        alert("Erro ao atualizar máquina.");
        return;
      }

      alert("Máquina atualizada com sucesso!");
      setIsEditing(false);
      if (onUpdated) {
        onUpdated({ ...maquina, ...form, _id: maquinaId });
      }
    } catch (error) {
      console.error("Erro ao atualizar:", error);
      alert("Erro ao atualizar máquina.");
    }
  }

  function handleCancelEdit() {
    if (window.confirm("Deseja cancelar as alterações?")) {
      setForm({
        tipo: maquina?.tipo || "",
        marca: maquina?.marca || "",
        modelo: maquina?.modelo || "",
        status: maquina?.status || "",
        potencia: maquina?.potencia || "",
        n_serie: maquina?.n_serie || "",
        observacao: maquina?.observacao || "",
      });
      setIsEditing(false);
    }
  }

  async function handleExcluir() {
    if (!window.confirm("Tem certeza que deseja excluir esta máquina?")) return;
    try {
      const resp = await fetch(`${API_URL}/maquinas/${maquinaId}`, {
        method: "DELETE",
      });
      if (resp.ok) {
        alert("Máquina excluída com sucesso!");
        onDeleted && onDeleted(maquinaId);
        onClose && onClose();
      } else {
        alert("Erro ao excluir máquina.");
      }
    } catch (err) {
      alert("Erro: " + err.message);
    }
  }

  const getStatusStyle = (status) => {
    const baseStyle = {
      padding: "8px 16px",
      borderRadius: "20px",
      fontSize: "13px",
      fontWeight: "600",
      display: "inline-block",
      textTransform: "capitalize",
    };

    switch (status?.toLowerCase()) {
      case "disponível":
        return { ...baseStyle, backgroundColor: "#D1FAE5", color: "#065F46" };
      case "indisponível":
        return { ...baseStyle, backgroundColor: "#FEE2E2", color: "#991B1B" };
      case "manutenção":
        return { ...baseStyle, backgroundColor: "#FEF3C7", color: "#92400E" };
      default:
        return { ...baseStyle, backgroundColor: "#E5E7EB", color: "#374151" };
    }
  };

  if (!maquina) return null;

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
          maxWidth: "700px",
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
                  flexShrink: 0,
                }}
              >
                <Tractor style={{ width: "28px", height: "28px", color: "#fff" }} />
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
                  {isEditing ? "Editar Máquina" : maquina?.tipo || "Máquina"}
                </h2>
                <p
                  style={{
                    fontSize: "14px",
                    color: "#6B7280",
                    margin: "4px 0 0 0",
                  }}
                >
                  {isEditing ? "Atualize as informações abaixo" : `ID: ${maquinaId || "-"}`}
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

        {/* Content */}
        <div
          style={{
            padding: "32px",
            overflowY: "auto",
            flex: 1,
          }}
        >
          {/* VIEW MODE */}
          {!isEditing && (
            <div>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                  gap: "16px",
                  marginBottom: "24px",
                }}
              >
                <InfoItem label="Marca" value={maquina?.marca} />
                <InfoItem label="Modelo" value={maquina?.modelo} />
                <InfoItem label="Status" value={<span style={getStatusStyle(maquina?.status)}>{maquina?.status}</span>} />
                {maquina?.potencia && <InfoItem label="Potência" value={maquina?.potencia} />}
                {maquina?.n_serie && <InfoItem label="Nº Série" value={maquina?.n_serie} fullWidth />}
              </div>

              {maquina?.observacao && (
                <div
                  style={{
                    padding: "20px",
                    backgroundColor: "#F9FAFB",
                    borderRadius: "12px",
                    border: "1px solid #E5E7EB",
                  }}
                >
                  <div
                    style={{
                      fontSize: "12px",
                      fontWeight: "600",
                      color: "#6B7280",
                      marginBottom: "8px",
                      textTransform: "uppercase",
                      letterSpacing: "0.5px",
                    }}
                  >
                    Observações
                  </div>
                  <div
                    style={{
                      fontSize: "14px",
                      color: "#374151",
                      lineHeight: "1.6",
                    }}
                  >
                    {maquina?.observacao}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* EDIT MODE */}
          {isEditing && (
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <div>
                <label style={{ display: "block", marginBottom: "6px", color: "#1B4D3E", fontSize: "13px", fontWeight: "500" }}>
                  Tipo *
                </label>
                <input
                  type="text"
                  value={form.tipo}
                  onChange={(e) => updateForm({ tipo: e.target.value })}
                  onFocus={() => setFocusField("tipo")}
                  onBlur={() => setFocusField(null)}
                  required
                  style={{
                    width: "100%",
                    height: "40px",
                    padding: "0 12px",
                    border: "2px solid",
                    borderColor: focusField === "tipo" ? "#1B4D3E" : "#D4E7D7",
                    borderRadius: "8px",
                    backgroundColor: "#FEFDFB",
                    fontSize: "14px",
                    outline: "none",
                    transition: "all 0.3s",
                    boxSizing: "border-box",
                  }}
                />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                <div>
                  <label style={{ display: "block", marginBottom: "6px", color: "#1B4D3E", fontSize: "13px", fontWeight: "500" }}>
                    Marca *
                  </label>
                  <input
                    type="text"
                    value={form.marca}
                    onChange={(e) => updateForm({ marca: e.target.value })}
                    onFocus={() => setFocusField("marca")}
                    onBlur={() => setFocusField(null)}
                    required
                    style={{
                      width: "100%",
                      height: "40px",
                      padding: "0 12px",
                      border: "2px solid",
                      borderColor: focusField === "marca" ? "#1B4D3E" : "#D4E7D7",
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
                    Modelo *
                  </label>
                  <input
                    type="text"
                    value={form.modelo}
                    onChange={(e) => updateForm({ modelo: e.target.value })}
                    onFocus={() => setFocusField("modelo")}
                    onBlur={() => setFocusField(null)}
                    required
                    style={{
                      width: "100%",
                      height: "40px",
                      padding: "0 12px",
                      border: "2px solid",
                      borderColor: focusField === "modelo" ? "#1B4D3E" : "#D4E7D7",
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

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                <div>
                  <label style={{ display: "block", marginBottom: "6px", color: "#1B4D3E", fontSize: "13px", fontWeight: "500" }}>
                    Status *
                  </label>
                  <select
                    value={form.status}
                    onChange={(e) => updateForm({ status: e.target.value })}
                    onFocus={() => setFocusField("status")}
                    onBlur={() => setFocusField(null)}
                    required
                    style={{
                      width: "100%",
                      height: "40px",
                      padding: "0 12px",
                      border: "2px solid",
                      borderColor: focusField === "status" ? "#1B4D3E" : "#D4E7D7",
                      borderRadius: "8px",
                      backgroundColor: "#FEFDFB",
                      fontSize: "14px",
                      outline: "none",
                      transition: "all 0.3s",
                      boxSizing: "border-box",
                    }}
                  >
                    <option value="">Selecione...</option>
                    <option value="Disponível">Disponível</option>
                    <option value="Indisponível">Indisponível</option>
                    <option value="Manutenção">Manutenção</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: "block", marginBottom: "6px", color: "#1B4D3E", fontSize: "13px", fontWeight: "500" }}>
                    Potência
                  </label>
                  <input
                    type="text"
                    value={form.potencia}
                    onChange={(e) => updateForm({ potencia: e.target.value })}
                    onFocus={() => setFocusField("potencia")}
                    onBlur={() => setFocusField(null)}
                    style={{
                      width: "100%",
                      height: "40px",
                      padding: "0 12px",
                      border: "2px solid",
                      borderColor: focusField === "potencia" ? "#1B4D3E" : "#D4E7D7",
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

              <div>
                <label style={{ display: "block", marginBottom: "6px", color: "#1B4D3E", fontSize: "13px", fontWeight: "500" }}>
                  Número de Série
                </label>
                <input
                  type="text"
                  value={form.n_serie}
                  onChange={(e) => updateForm({ n_serie: e.target.value })}
                  onFocus={() => setFocusField("n_serie")}
                  onBlur={() => setFocusField(null)}
                  style={{
                    width: "100%",
                    height: "40px",
                    padding: "0 12px",
                    border: "2px solid",
                    borderColor: focusField === "n_serie" ? "#1B4D3E" : "#D4E7D7",
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
                  Observações
                </label>
                <textarea
                  value={form.observacao}
                  onChange={(e) => updateForm({ observacao: e.target.value })}
                  onFocus={() => setFocusField("observacao")}
                  onBlur={() => setFocusField(null)}
                  rows={3}
                  style={{
                    width: "100%",
                    padding: "12px",
                    border: "2px solid",
                    borderColor: focusField === "observacao" ? "#1B4D3E" : "#D4E7D7",
                    borderRadius: "8px",
                    backgroundColor: "#FEFDFB",
                    fontSize: "14px",
                    outline: "none",
                    transition: "all 0.3s",
                    boxSizing: "border-box",
                    fontFamily: "inherit",
                    resize: "vertical",
                  }}
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
};

const DetalhesImplemento = ({ implemento, onClose, onDeleted, onUpdated }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [focusField, setFocusField] = useState(null);
  const implementoId = implemento?.id || implemento?._id;

  const [form, setForm] = useState({
    tipo: implemento?.tipo || "",
    marca: implemento?.marca || "",
    modelo: implemento?.modelo || "",
    status: implemento?.status || "",
    capacidade: implemento?.capacidade || "",
    n_serie: implemento?.n_serie || "",
    observacao: implemento?.observacao || "",
  });

  function updateForm(value) {
    setForm((prev) => ({ ...prev, ...value }));
  }

  async function handleSave() {
    try {
      const response = await fetch(`${API_URL}/implementos/update/${implementoId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!response.ok) {
        alert("Erro ao atualizar implemento.");
        return;
      }

      alert("Implemento atualizado com sucesso!");
      setIsEditing(false);
      if (onUpdated) {
        onUpdated({ ...implemento, ...form, _id: implementoId });
      }
    } catch (error) {
      console.error("Erro ao atualizar:", error);
      alert("Erro ao atualizar implemento.");
    }
  }

  function handleCancelEdit() {
    if (window.confirm("Deseja cancelar as alterações?")) {
      setForm({
        tipo: implemento?.tipo || "",
        marca: implemento?.marca || "",
        modelo: implemento?.modelo || "",
        status: implemento?.status || "",
        capacidade: implemento?.capacidade || "",
        n_serie: implemento?.n_serie || "",
        observacao: implemento?.observacao || "",
      });
      setIsEditing(false);
    }
  }

  async function handleExcluir() {
    if (!window.confirm("Tem certeza que deseja excluir este implemento?")) return;
    try {
      const resp = await fetch(`${API_URL}/implementos/${implementoId}`, {
        method: "DELETE",
      });
      if (resp.ok) {
        alert("Implemento excluído com sucesso!");
        onDeleted && onDeleted(implementoId);
        onClose && onClose();
      } else {
        alert("Erro ao excluir implemento.");
      }
    } catch (err) {
      alert("Erro: " + err.message);
    }
  }

  const getStatusStyle = (status) => {
    const baseStyle = {
      padding: "8px 16px",
      borderRadius: "20px",
      fontSize: "13px",
      fontWeight: "600",
      display: "inline-block",
      textTransform: "capitalize",
    };

    switch (status?.toLowerCase()) {
      case "disponível":
        return { ...baseStyle, backgroundColor: "#D1FAE5", color: "#065F46" };
      case "indisponível":
        return { ...baseStyle, backgroundColor: "#FEE2E2", color: "#991B1B" };
      case "manutenção":
        return { ...baseStyle, backgroundColor: "#FEF3C7", color: "#92400E" };
      default:
        return { ...baseStyle, backgroundColor: "#E5E7EB", color: "#374151" };
    }
  };

  if (!implemento) return null;

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
          maxWidth: "700px",
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
                  flexShrink: 0,
                }}
              >
                <Settings style={{ width: "28px", height: "28px", color: "#fff" }} />
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
                  {isEditing ? "Editar Implemento" : implemento?.tipo || "Implemento"}
                </h2>
                <p
                  style={{
                    fontSize: "14px",
                    color: "#6B7280",
                    margin: "4px 0 0 0",
                  }}
                >
                  {isEditing ? "Atualize as informações abaixo" : `ID: ${implementoId || "-"}`}
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

        {/* Content */}
        <div
          style={{
            padding: "32px",
            overflowY: "auto",
            flex: 1,
          }}
        >
          {/* VIEW MODE */}
          {!isEditing && (
            <div>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                  gap: "16px",
                  marginBottom: "24px",
                }}
              >
                <InfoItem label="Marca" value={implemento?.marca} />
                <InfoItem label="Modelo" value={implemento?.modelo} />
                <InfoItem label="Status" value={<span style={getStatusStyle(implemento?.status)}>{implemento?.status}</span>} />
                {implemento?.capacidade && <InfoItem label="Capacidade" value={implemento?.capacidade} />}
                {implemento?.n_serie && <InfoItem label="Nº Série" value={implemento?.n_serie} fullWidth />}
              </div>

              {implemento?.observacao && (
                <div
                  style={{
                    padding: "20px",
                    backgroundColor: "#F9FAFB",
                    borderRadius: "12px",
                    border: "1px solid #E5E7EB",
                  }}
                >
                  <div
                    style={{
                      fontSize: "12px",
                      fontWeight: "600",
                      color: "#6B7280",
                      marginBottom: "8px",
                      textTransform: "uppercase",
                      letterSpacing: "0.5px",
                    }}
                  >
                    Observações
                  </div>
                  <div
                    style={{
                      fontSize: "14px",
                      color: "#374151",
                      lineHeight: "1.6",
                    }}
                  >
                    {implemento?.observacao}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* EDIT MODE */}
          {isEditing && (
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <div>
                <label style={{ display: "block", marginBottom: "6px", color: "#1B4D3E", fontSize: "13px", fontWeight: "500" }}>
                  Tipo *
                </label>
                <input
                  type="text"
                  value={form.tipo}
                  onChange={(e) => updateForm({ tipo: e.target.value })}
                  onFocus={() => setFocusField("tipo")}
                  onBlur={() => setFocusField(null)}
                  required
                  style={{
                    width: "100%",
                    height: "40px",
                    padding: "0 12px",
                    border: "2px solid",
                    borderColor: focusField === "tipo" ? "#1B4D3E" : "#D4E7D7",
                    borderRadius: "8px",
                    backgroundColor: "#FEFDFB",
                    fontSize: "14px",
                    outline: "none",
                    transition: "all 0.3s",
                    boxSizing: "border-box",
                  }}
                />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                <div>
                  <label style={{ display: "block", marginBottom: "6px", color: "#1B4D3E", fontSize: "13px", fontWeight: "500" }}>
                    Marca *
                  </label>
                  <input
                    type="text"
                    value={form.marca}
                    onChange={(e) => updateForm({ marca: e.target.value })}
                    onFocus={() => setFocusField("marca")}
                    onBlur={() => setFocusField(null)}
                    required
                    style={{
                      width: "100%",
                      height: "40px",
                      padding: "0 12px",
                      border: "2px solid",
                      borderColor: focusField === "marca" ? "#1B4D3E" : "#D4E7D7",
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
                    Modelo *
                  </label>
                  <input
                    type="text"
                    value={form.modelo}
                    onChange={(e) => updateForm({ modelo: e.target.value })}
                    onFocus={() => setFocusField("modelo")}
                    onBlur={() => setFocusField(null)}
                    required
                    style={{
                      width: "100%",
                      height: "40px",
                      padding: "0 12px",
                      border: "2px solid",
                      borderColor: focusField === "modelo" ? "#1B4D3E" : "#D4E7D7",
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

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                <div>
                  <label style={{ display: "block", marginBottom: "6px", color: "#1B4D3E", fontSize: "13px", fontWeight: "500" }}>
                    Status *
                  </label>
                  <select
                    value={form.status}
                    onChange={(e) => updateForm({ status: e.target.value })}
                    onFocus={() => setFocusField("status")}
                    onBlur={() => setFocusField(null)}
                    required
                    style={{
                      width: "100%",
                      height: "40px",
                      padding: "0 12px",
                      border: "2px solid",
                      borderColor: focusField === "status" ? "#1B4D3E" : "#D4E7D7",
                      borderRadius: "8px",
                      backgroundColor: "#FEFDFB",
                      fontSize: "14px",
                      outline: "none",
                      transition: "all 0.3s",
                      boxSizing: "border-box",
                    }}
                  >
                    <option value="">Selecione...</option>
                    <option value="Disponível">Disponível</option>
                    <option value="Indisponível">Indisponível</option>
                    <option value="Manutenção">Manutenção</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: "block", marginBottom: "6px", color: "#1B4D3E", fontSize: "13px", fontWeight: "500" }}>
                    Capacidade
                  </label>
                  <input
                    type="text"
                    value={form.capacidade}
                    onChange={(e) => updateForm({ capacidade: e.target.value })}
                    onFocus={() => setFocusField("capacidade")}
                    onBlur={() => setFocusField(null)}
                    style={{
                      width: "100%",
                      height: "40px",
                      padding: "0 12px",
                      border: "2px solid",
                      borderColor: focusField === "capacidade" ? "#1B4D3E" : "#D4E7D7",
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

              <div>
                <label style={{ display: "block", marginBottom: "6px", color: "#1B4D3E", fontSize: "13px", fontWeight: "500" }}>
                  Número de Série
                </label>
                <input
                  type="text"
                  value={form.n_serie}
                  onChange={(e) => updateForm({ n_serie: e.target.value })}
                  onFocus={() => setFocusField("n_serie")}
                  onBlur={() => setFocusField(null)}
                  style={{
                    width: "100%",
                    height: "40px",
                    padding: "0 12px",
                    border: "2px solid",
                    borderColor: focusField === "n_serie" ? "#1B4D3E" : "#D4E7D7",
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
                  Observações
                </label>
                <textarea
                  value={form.observacao}
                  onChange={(e) => updateForm({ observacao: e.target.value })}
                  onFocus={() => setFocusField("observacao")}
                  onBlur={() => setFocusField(null)}
                  rows={3}
                  style={{
                    width: "100%",
                    padding: "12px",
                    border: "2px solid",
                    borderColor: focusField === "observacao" ? "#1B4D3E" : "#D4E7D7",
                    borderRadius: "8px",
                    backgroundColor: "#FEFDFB",
                    fontSize: "14px",
                    outline: "none",
                    transition: "all 0.3s",
                    boxSizing: "border-box",
                    fontFamily: "inherit",
                    resize: "vertical",
                  }}
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
};

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

export default function MaquinasImplementos() {
  const [activeView, setActiveView] = useState("maquinas");
  const [maquinas, setMaquinas] = useState([]);
  const [implementos, setImplementos] = useState([]);
  const [busca, setBusca] = useState("");
  const [itemSelecionado, setItemSelecionado] = useState(null);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function getData() {
      try {
        setLoading(true);
        const [maquinasRes, implementosRes] = await Promise.all([
          fetch(`${API_URL}/maquinas`),
          fetch(`${API_URL}/implementos`),
        ]);

        const maquinasData = await maquinasRes.json();
        const implementosData = await implementosRes.json();

        setMaquinas(maquinasData);
        setImplementos(implementosData);
      } catch (error) {
        console.error("Erro ao buscar dados:", error);
      } finally {
        setLoading(false);
      }
    }
    getData();
  }, []);

  const getStatusStyle = (status) => {
    const baseStyle = {
      padding: "4px 12px",
      borderRadius: "20px",
      fontSize: "12px",
      fontWeight: "600",
      display: "inline-block",
      textTransform: "capitalize",
    };

    switch (status?.toLowerCase()) {
      case "disponível":
        return {
          ...baseStyle,
          backgroundColor: "#D1FAE5",
          color: "#065F46",
        };
      case "indisponível":
        return {
          ...baseStyle,
          backgroundColor: "#FEE2E2",
          color: "#991B1B",
        };
      case "manutenção":
        return {
          ...baseStyle,
          backgroundColor: "#FEF3C7",
          color: "#92400E",
        };
      default:
        return {
          ...baseStyle,
          backgroundColor: "#E5E7EB",
          color: "#374151",
        };
    }
  };

  const itensFiltrados =
    activeView === "maquinas"
      ? maquinas.filter(
          (item) =>
            item.tipo?.toLowerCase().includes(busca.toLowerCase()) ||
            item.marca?.toLowerCase().includes(busca.toLowerCase()) ||
            item.modelo?.toLowerCase().includes(busca.toLowerCase()) ||
            item.status?.toLowerCase().includes(busca.toLowerCase())
        )
      : implementos.filter(
          (item) =>
            item.tipo?.toLowerCase().includes(busca.toLowerCase()) ||
            item.marca?.toLowerCase().includes(busca.toLowerCase()) ||
            item.modelo?.toLowerCase().includes(busca.toLowerCase()) ||
            item.status?.toLowerCase().includes(busca.toLowerCase())
        );

  const abrirDetalhes = (item) => {
    setItemSelecionado(item);
    setMostrarModal(true);
  };

  const handleDelete = (idDeleted) => {
    if (activeView === "maquinas") {
      setMaquinas((old) => old.filter((m) => m._id !== idDeleted));
    } else {
      setImplementos((old) => old.filter((i) => i._id !== idDeleted));
    }
    setMostrarModal(false);
  };

  const handleUpdate = (itemAtualizado) => {
    if (activeView === "maquinas") {
      setMaquinas((old) =>
        old.map((m) => (m._id === itemAtualizado._id ? itemAtualizado : m))
      );
    } else {
      setImplementos((old) =>
        old.map((i) => (i._id === itemAtualizado._id ? itemAtualizado : i))
      );
    }
    setMostrarModal(false);
  };

  const handleAddClick = () => {
    if (activeView === "maquinas") {
      window.location.href = "/maquinas/create";
    } else {
      window.location.href = "/implementos/create";
    }
  };

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
          <p style={{ color: "#1B4D3E", fontWeight: "600", fontSize: "15px" }}>
            Carregando equipamentos...
          </p>
        </div>
      </div>
    );
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
                setActiveView("maquinas");
                setBusca("");
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
                setActiveView("implementos");
                setBusca("");
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
              backgroundColor: "#D2EFE6",
              color: "#000",
              padding: "10px 20px",
              borderRadius: "12px",
              border: "1px solid #1A381F",
              cursor: "pointer",
              fontWeight: "600",
              fontSize: "14px",
              display: "flex",
              alignItems: "center",
              gap: "6px",
              transition: "all 0.2s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "#B8E5D3";
              e.currentTarget.style.transform = "translateY(-2px)";
              e.currentTarget.style.boxShadow = "0 4px 8px rgba(0, 0, 0, 0.1)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "#D2EFE6";
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "none";
            }}
          >
            <Plus style={{ width: "18px", height: "18px" }} />
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
              e.target.style.borderColor = "#1B4D3E";
              e.target.style.boxShadow = "0 0 0 3px rgba(27, 77, 62, 0.1)";
            }}
            onBlur={(e) => {
              e.target.style.borderColor = "#E5E7EB";
              e.target.style.boxShadow = "0 1px 3px rgba(0, 0, 0, 0.08)";
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
                e.currentTarget.style.backgroundColor = "#FAFAF9";
                e.currentTarget.style.borderColor = "#1B4D3E";
                e.currentTarget.style.transform = "translateY(-4px)";
                e.currentTarget.style.boxShadow = "0 10px 25px rgba(0, 0, 0, 0.12)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "#fff";
                e.currentTarget.style.borderColor = "#E5E7EB";
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "0 2px 8px rgba(0, 0, 0, 0.06)";
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
                  <svg
                    style={{ width: "18px", height: "18px" }}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Modal */}
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
