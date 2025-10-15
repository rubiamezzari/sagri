import React, { useEffect, useState } from "react";

const API_URL = "http://localhost:5050";

export default function MinhasSolicitacoes() {
  const [solicitacoes, setSolicitacoes] = useState([]);
  const [expandedId, setExpandedId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const usuarioLogado = JSON.parse(localStorage.getItem("usuarioLogado"));
    if (!usuarioLogado?._id) return;
    
    setLoading(true);
    fetch(`${API_URL}/solicitacoes/usuario/${usuarioLogado._id}`)
      .then((res) => res.json())
      .then((data) => {
        setSolicitacoes(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const getStatusBadge = (status) => {
    const styles = {
      pendente: {
        backgroundColor: "#F3F4F6",
        color: "#6B7280",
        dotColor: "#9CA3AF",
      },
      aprovado: {
        backgroundColor: "#F0FDF4",
        color: "#166534",
        dotColor: "#10B981",
      },
      recusado: {
        backgroundColor: "#FEF2F2",
        color: "#991B1B",
        dotColor: "#EF4444",
      },
      cancelado: {
        backgroundColor: "#F9FAFB",
        color: "#6B7280",
        dotColor: "#9CA3AF",
      },
    };

    const style = styles[status?.toLowerCase()] || {
      backgroundColor: "#F3F4F6",
      color: "#6B7280",
      dotColor: "#9CA3AF",
    };

    return (
      <div
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "8px",
          padding: "6px 12px",
          borderRadius: "12px",
          fontSize: "13px",
          fontWeight: "500",
          textTransform: "capitalize",
          backgroundColor: style.backgroundColor,
          color: style.color,
        }}
      >
        <div
          style={{
            width: "8px",
            height: "8px",
            borderRadius: "50%",
            backgroundColor: style.dotColor,
          }}
        />
        {status || "Pendente"}
      </div>
    );
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Deseja realmente excluir esta solicitação?")) return;
    try {
      await fetch(`${API_URL}/solicitacoes/${id}`, { method: "DELETE" });
      setSolicitacoes((old) => old.filter((s) => s._id !== id));
      setExpandedId(null);
    } catch (err) {
      console.error(err);
      alert("Erro ao excluir.");
    }
  };

  const handleCancel = async (id) => {
    if (!window.confirm("Cancelar esta solicitação?")) return;
    try {
      await fetch(`${API_URL}/solicitacoes/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "Cancelado" }),
      });
      setSolicitacoes((old) =>
        old.map((s) => (s._id === id ? { ...s, status: "Cancelado" } : s))
      );
    } catch (err) {
      console.warn("Falha ao notificar servidor sobre cancelamento:", err);
      alert("Erro ao cancelar.");
    }
  };

  const filtered = solicitacoes.filter((s) =>
    s.tipoServico?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div
        style={{
          padding: "64px 20px",
          textAlign: "center",
          backgroundColor: "#fff",
          borderRadius: "16px",
          border: "1px solid #E5E7EB",
        }}
      >
        <div
          style={{
            width: "40px",
            height: "40px",
            border: "3px solid #E5E7EB",
            borderTop: "3px solid #1B4D3E",
            borderRadius: "50%",
            animation: "spin 1s linear infinite",
            margin: "0 auto 16px",
          }}
        />
        <p style={{ color: "#6B7280", fontSize: "14px" }}>
          Carregando solicitações...
        </p>
        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  return (
    <div
      style={{
        width: "100%",
        maxWidth: "1000px",
        margin: "0 auto",
        padding: "32px 20px",
      }}
    >
      {/* Header Section */}
      <div style={{ marginBottom: "32px" }}>
        <h2
          style={{
            fontSize: "28px",
            fontWeight: "600",
            color: "#1B4D3E",
            marginBottom: "8px",
          }}
        >
          Minhas Solicitações
        </h2>
        <p style={{ color: "#6B7280", fontSize: "14px" }}>
          {filtered.length} solicitaç{filtered.length !== 1 ? "ões" : "ão"}{" "}
          encontrada{filtered.length !== 1 ? "s" : ""}
        </p>
      </div>

      {/* Search Bar */}
      <div style={{ marginBottom: "32px", position: "relative" }}>
        <svg
          style={{
            position: "absolute",
            left: "14px",
            top: "50%",
            transform: "translateY(-50%)",
            width: "18px",
            height: "18px",
            color: "#9CA3AF",
          }}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
        <input
          type="text"
          placeholder="Buscar por tipo de serviço..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            width: "100%",
            padding: "12px 14px 12px 44px",
            borderRadius: "12px",
            border: "1px solid #E5E7EB",
            backgroundColor: "#fff",
            fontSize: "14px",
            outline: "none",
            transition: "all 0.2s ease",
            boxShadow: "0 1px 2px rgba(0, 0, 0, 0.05)",
          }}
          onFocus={(e) => {
            e.target.style.borderColor = "#1B4D3E";
            e.target.style.boxShadow = "0 0 0 3px rgba(27, 77, 62, 0.1)";
          }}
          onBlur={(e) => {
            e.target.style.borderColor = "#E5E7EB";
            e.target.style.boxShadow = "0 1px 2px rgba(0, 0, 0, 0.05)";
          }}
        />
      </div>

      {/* Empty State */}
      {filtered.length === 0 && (
        <div
          style={{
            padding: "64px 20px",
            textAlign: "center",
            backgroundColor: "#fff",
            borderRadius: "16px",
            border: "1px solid #E5E7EB",
          }}
        >
          <svg
            style={{
              width: "48px",
              height: "48px",
              color: "#D1D5DB",
              margin: "0 auto 16px",
            }}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
          <p style={{ color: "#6B7280", fontSize: "14px" }}>
            Nenhuma solicitação encontrada
          </p>
        </div>
      )}

      {/* Lista de Solicitações */}
      <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        {filtered.map((s) => {
          const isExpanded = expandedId === s._id;

          return (
            <div
              key={s._id}
              style={{
                backgroundColor: "#fff",
                borderRadius: "16px",
                overflow: "hidden",
                border: "1px solid #E5E7EB",
                transition: "all 0.2s ease",
                boxShadow: "0 1px 2px rgba(0, 0, 0, 0.05)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = "0 4px 8px rgba(0, 0, 0, 0.08)";
                e.currentTarget.style.borderColor = "#D1D5DB";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = "0 1px 2px rgba(0, 0, 0, 0.05)";
                e.currentTarget.style.borderColor = "#E5E7EB";
              }}
            >
              {/* Card Header */}
              <div
                onClick={() => setExpandedId(isExpanded ? null : s._id)}
                style={{
                  padding: "20px 24px",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  cursor: "pointer",
                  backgroundColor: isExpanded ? "#FAFAF9" : "#fff",
                  transition: "background-color 0.2s ease",
                }}
              >
                <div style={{ flex: 1 }}>
                  <h3
                    style={{
                      fontSize: "16px",
                      fontWeight: "600",
                      color: "#1F2937",
                      margin: 0,
                      marginBottom: "6px",
                    }}
                  >
                    {s.tipoServico}
                  </h3>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      fontSize: "13px",
                      color: "#6B7280",
                    }}
                  >
                    <svg
                      style={{ width: "14px", height: "14px" }}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                    {new Date(s.data_servico).toLocaleDateString("pt-BR")}
                  </div>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                  {getStatusBadge(s.status)}
                  <div
                    style={{
                      width: "32px",
                      height: "32px",
                      borderRadius: "8px",
                      backgroundColor: "#F3F4F6",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      transition: "transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                      transform: isExpanded ? "rotate(180deg)" : "rotate(0deg)",
                    }}
                  >
                    <svg
                      style={{ width: "16px", height: "16px", color: "#6B7280" }}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Expanded Content */}
              {isExpanded && (
                <div
                  style={{
                    borderTop: "1px solid #F3F4F6",
                    animation: "slideDown 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                  }}
                >
                  <div style={{ padding: "24px" }}>
                    {/* Details Grid */}
                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                        gap: "12px",
                        marginBottom: "16px",
                      }}
                    >
                      {/* Data */}
                      <div
                        style={{
                          padding: "12px",
                          backgroundColor: "#F9FAFB",
                          borderRadius: "8px",
                          border: "1px solid #E5E7EB",
                        }}
                      >
                        <div
                          style={{
                            fontSize: "11px",
                            color: "#6B7280",
                            fontWeight: "600",
                            marginBottom: "4px",
                            textTransform: "uppercase",
                            letterSpacing: "0.5px",
                          }}
                        >
                          Data
                        </div>
                        <div
                          style={{
                            fontSize: "14px",
                            color: "#374151",
                            fontWeight: "500",
                          }}
                        >
                          {new Date(s.data_servico).toLocaleDateString("pt-BR", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          })}
                        </div>
                      </div>

                      {/* Hora */}
                      {s.hora && (
                        <div
                          style={{
                            padding: "12px",
                            backgroundColor: "#F9FAFB",
                            borderRadius: "8px",
                            border: "1px solid #E5E7EB",
                          }}
                        >
                          <div
                            style={{
                              fontSize: "11px",
                              color: "#6B7280",
                              fontWeight: "600",
                              marginBottom: "4px",
                              textTransform: "uppercase",
                              letterSpacing: "0.5px",
                            }}
                          >
                            Horário
                          </div>
                          <div
                            style={{
                              fontSize: "14px",
                              color: "#374151",
                              fontWeight: "500",
                            }}
                          >
                            {s.hora}
                          </div>
                        </div>
                      )}

                      {/* Tempo Estimado */}
                      {s.tempo_estimado && (
                        <div
                          style={{
                            padding: "12px",
                            backgroundColor: "#F9FAFB",
                            borderRadius: "8px",
                            border: "1px solid #E5E7EB",
                          }}
                        >
                          <div
                            style={{
                              fontSize: "11px",
                              color: "#6B7280",
                              fontWeight: "600",
                              marginBottom: "4px",
                              textTransform: "uppercase",
                              letterSpacing: "0.5px",
                            }}
                          >
                            Tempo Estimado
                          </div>
                          <div
                            style={{
                              fontSize: "14px",
                              color: "#374151",
                              fontWeight: "500",
                            }}
                          >
                            {s.tempo_estimado}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Observação */}
                    {s.observacao && (
                      <div
                        style={{
                          padding: "12px",
                          backgroundColor: "#F9FAFB",
                          borderRadius: "8px",
                          border: "1px solid #E5E7EB",
                          marginBottom: "16px",
                        }}
                      >
                        <div
                          style={{
                            fontSize: "11px",
                            color: "#6B7280",
                            fontWeight: "600",
                            marginBottom: "4px",
                            textTransform: "uppercase",
                            letterSpacing: "0.5px",
                          }}
                        >
                          Observação
                        </div>
                        <div
                          style={{
                            fontSize: "14px",
                            color: "#374151",
                            lineHeight: "1.6",
                          }}
                        >
                          {s.observacao}
                        </div>
                      </div>
                    )}

                    {/* Action Buttons */}
                    {s.status === "Pendente" && (
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "flex-end",
                          gap: "8px",
                          paddingTop: "12px",
                          borderTop: "1px solid #F3F4F6",
                        }}
                      >
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleCancel(s._id);
                          }}
                          style={{
                            padding: "8px 16px",
                            backgroundColor: "#fff",
                            color: "#6B7280",
                            borderRadius: "8px",
                            border: "1px solid #E5E7EB",
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            gap: "6px",
                            transition: "all 0.2s ease",
                            fontSize: "13px",
                            fontWeight: "500",
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = "#F9FAFB";
                            e.currentTarget.style.borderColor = "#D1D5DB";
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = "#fff";
                            e.currentTarget.style.borderColor = "#E5E7EB";
                          }}
                        >
                          <svg
                            style={{ width: "14px", height: "14px" }}
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
                          Cancelar
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(s._id);
                          }}
                          style={{
                            padding: "8px 16px",
                            backgroundColor: "#FEF2F2",
                            color: "#991B1B",
                            borderRadius: "8px",
                            border: "1px solid #FEE2E2",
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            gap: "6px",
                            transition: "all 0.2s ease",
                            fontSize: "13px",
                            fontWeight: "500",
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = "#FEE2E2";
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = "#FEF2F2";
                          }}
                        >
                          <svg
                            style={{ width: "14px", height: "14px" }}
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                            />
                          </svg>
                          Excluir
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
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
