import React, { useState, useEffect } from "react";

const API_URL = "http://localhost:5050";

export default function ListAgendamentos() {
  const [solicitacoes, setSolicitacoes] = useState([]);
  const [busca, setBusca] = useState("");
  const [paginaAtual, setPaginaAtual] = useState(1);
  const [agendamentoSelecionado, setAgendamentoSelecionado] = useState(null);
  const [loading, setLoading] = useState(false);

  // Carregar solicitações
  useEffect(() => {
    async function carregarSolicitacoes() {
      try {
        setLoading(true);
        const res = await fetch(`${API_URL}/solicitacoes`);
        const data = await res.json();
        // Buscar nome do usuário
        const dataComNomes = await Promise.all(
          data.map(async (sol) => {
            if (sol.usuario_id) {
              try {
                const userRes = await fetch(
                  `${API_URL}/associados/${sol.usuario_id}`
                );
                const userData = await userRes.json();
                return { ...sol, nomeUsuario: userData.nome || "Associado" };
              } catch {
                return { ...sol, nomeUsuario: "Desconhecido" };
              }
            }
            return { ...sol, nomeUsuario: "Desconhecido" };
          })
        );
        setSolicitacoes(dataComNomes.reverse());
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    carregarSolicitacoes();
  }, []);

  const itensPorPagina = 6;

  const filtradas = solicitacoes.filter(
    (s) =>
      s.tipoServico?.toLowerCase().includes(busca.toLowerCase()) ||
      s.nomeUsuario?.toLowerCase().includes(busca.toLowerCase()) ||
      s.status?.toLowerCase().includes(busca.toLowerCase())
  );

  const totalPaginas = Math.ceil(filtradas.length / itensPorPagina);
  const paginadas = filtradas.slice(
    (paginaAtual - 1) * itensPorPagina,
    paginaAtual * itensPorPagina
  );

  const mudarPagina = (novaPagina) => {
    if (novaPagina >= 1 && novaPagina <= totalPaginas) setPaginaAtual(novaPagina);
  };

  const abrirModal = (agendamento) => setAgendamentoSelecionado(agendamento);
  const fecharModal = () => setAgendamentoSelecionado(null);

  const atualizarStatus = async (id, status) => {
    try {
      await fetch(`${API_URL}/solicitacoes/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      setSolicitacoes((old) =>
        old.map((s) => (s._id === id ? { ...s, status } : s))
      );
      if (agendamentoSelecionado?._id === id) {
        setAgendamentoSelecionado({ ...agendamentoSelecionado, status });
      }
    } catch {
      alert("Erro ao atualizar status");
    }
  };

  const deletarAgendamento = async (id) => {
    if (!window.confirm("Deseja realmente excluir este agendamento?")) return;
    try {
      await fetch(`${API_URL}/solicitacoes/${id}`, { method: "DELETE" });
      setSolicitacoes((old) => old.filter((s) => s._id !== id));
      fecharModal();
    } catch {
      alert("Erro ao excluir");
    }
  };

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
        {status}
      </div>
    );
  };

  // Count by status
  const countByStatus = {
    pendente: solicitacoes.filter((s) => s.status?.toLowerCase() === "pendente")
      .length,
    aprovado: solicitacoes.filter((s) => s.status?.toLowerCase() === "aprovado")
      .length,
    recusado: solicitacoes.filter((s) => s.status?.toLowerCase() === "recusado")
      .length,
  };

  return (
    <div
      style={{
        width: "100%",
        maxWidth: "1400px",
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
        
        </h2>
       

        {/* Status Summary */}
        <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              padding: "10px 16px",
              backgroundColor: "#F9FAFB",
              borderRadius: "8px",
              border: "1px solid #E5E7EB",
              fontSize: "14px",
              color: "#6B7280",
              fontWeight: "500",
            }}
          >
            <div
              style={{
                width: "8px",
                height: "8px",
                borderRadius: "50%",
                backgroundColor: "#9CA3AF",
              }}
            />
            <span style={{ fontWeight: "600", fontSize: "15px", color: "#374151" }}>
              {countByStatus.pendente}
            </span>
            Pendente{countByStatus.pendente !== 1 ? "s" : ""}
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              padding: "10px 16px",
              backgroundColor: "#F9FAFB",
              borderRadius: "8px",
              border: "1px solid #E5E7EB",
              fontSize: "14px",
              color: "#6B7280",
              fontWeight: "500",
            }}
          >
            <div
              style={{
                width: "8px",
                height: "8px",
                borderRadius: "50%",
                backgroundColor: "#10B981",
              }}
            />
            <span style={{ fontWeight: "600", fontSize: "15px", color: "#374151" }}>
              {countByStatus.aprovado}
            </span>
            Aprovado{countByStatus.aprovado !== 1 ? "s" : ""}
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              padding: "10px 16px",
              backgroundColor: "#F9FAFB",
              borderRadius: "8px",
              border: "1px solid #E5E7EB",
              fontSize: "14px",
              color: "#6B7280",
              fontWeight: "500",
            }}
          >
            <div
              style={{
                width: "8px",
                height: "8px",
                borderRadius: "50%",
                backgroundColor: "#EF4444",
              }}
            />
            <span style={{ fontWeight: "600", fontSize: "15px", color: "#374151" }}>
              {countByStatus.recusado}
            </span>
            Recusado{countByStatus.recusado !== 1 ? "s" : ""}
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div style={{ marginBottom: "32px", position: "relative" }}>
        <div
          style={{
            position: "absolute",
            left: "18px",
            top: "50%",
            transform: "translateY(-50%)",
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}
        >
          <svg
            style={{
              width: "20px",
              height: "20px",
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
        </div>
        <input
          type="text"
          placeholder="Pesquisar por serviço, associado ou status..."
          value={busca}
          onChange={(e) => {
            setBusca(e.target.value);
            setPaginaAtual(1);
          }}
          style={{
            width: "100%",
            padding: "16px 18px 16px 54px",
            borderRadius: "16px",
            border: "2px solid #E5E7EB",
            backgroundColor: "#fff",
            fontSize: "15px",
            outline: "none",
            transition: "all 0.3s ease",
            boxShadow: "0 2px 8px rgba(0, 0, 0, 0.04)",
          }}
          onFocus={(e) => {
            e.target.style.borderColor = "#1B4D3E";
            e.target.style.boxShadow = "0 0 0 4px rgba(27, 77, 62, 0.1)";
          }}
          onBlur={(e) => {
            e.target.style.borderColor = "#E5E7EB";
            e.target.style.boxShadow = "0 2px 8px rgba(0, 0, 0, 0.04)";
          }}
        />
        {busca && (
          <button
            onClick={() => {
              setBusca("");
              setPaginaAtual(1);
            }}
            style={{
              position: "absolute",
              right: "18px",
              top: "50%",
              transform: "translateY(-50%)",
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: "4px",
              color: "#9CA3AF",
              transition: "color 0.2s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = "#EF4444";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = "#9CA3AF";
            }}
          >
            <svg style={{ width: "20px", height: "20px" }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      {/* Cards Grid */}
      {loading ? (
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
          
        </div>
      ) : paginadas.length === 0 ? (
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
            Nenhum agendamento encontrado
          </p>
        </div>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(380px, 1fr))",
            gap: "20px",
            marginBottom: "32px",
          }}
        >
          {paginadas.map((s) => (
            <div
              key={s._id}
              onClick={() => abrirModal(s)}
              style={{
                backgroundColor: "#fff",
                padding: "24px",
                borderRadius: "16px",
                border: "1px solid #E5E7EB",
                cursor: "pointer",
                transition: "all 0.2s ease",
                boxShadow: "0 1px 2px rgba(0, 0, 0, 0.05)",
                position: "relative",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "#FAFAF9";
                e.currentTarget.style.borderColor = "#1B4D3E";
                e.currentTarget.style.transform = "translateY(-4px)";
                e.currentTarget.style.boxShadow = "0 8px 16px rgba(0, 0, 0, 0.1)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "#fff";
                e.currentTarget.style.borderColor = "#E5E7EB";
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "0 1px 2px rgba(0, 0, 0, 0.05)";
              }}
            >
              {/* Status Badge - Top Right */}
              <div style={{ position: "absolute", top: "16px", right: "16px" }}>
                {getStatusBadge(s.status)}
              </div>

              {/* Header with Avatar */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "16px",
                  marginBottom: "20px",
                  paddingBottom: "20px",
                  borderBottom: "1px solid #F3F4F6",
                }}
              >
                <div
                  style={{
                    width: "56px",
                    height: "56px",
                    borderRadius: "50%",
                    backgroundColor: "#1B4D3E",
                    color: "#fff",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "20px",
                    fontWeight: "600",
                    flexShrink: 0,
                  }}
                >
                  {s.nomeUsuario
                    ?.split(" ")
                    .map((n) => n[0])
                    .join("")
                    .substring(0, 2)
                    .toUpperCase()}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <h3
                    style={{
                      fontSize: "18px",
                      fontWeight: "600",
                      color: "#1F2937",
                      marginBottom: "4px",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {s.tipoServico}
                  </h3>
                  <p
                    style={{
                      fontSize: "13px",
                      color: "#6B7280",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {s.nomeUsuario}
                  </p>
                </div>
              </div>

              {/* Details */}
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <svg
                    style={{
                      width: "16px",
                      height: "16px",
                      color: "#6B7280",
                      flexShrink: 0,
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
                  <div style={{ fontSize: "14px", color: "#374151" }}>
                    <span style={{ fontWeight: "500" }}>
                      {new Date(s.data_servico).toLocaleDateString("pt-BR", {
                        day: "2-digit",
                        month: "long",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <svg
                    style={{
                      width: "16px",
                      height: "16px",
                      color: "#6B7280",
                      flexShrink: 0,
                    }}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <div style={{ fontSize: "14px", color: "#374151" }}>
                    <span style={{ fontWeight: "500" }}>{s.hora}</span>
                  </div>
                </div>

                {s.tempo_estimado && (
                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <svg
                      style={{
                        width: "16px",
                        height: "16px",
                        color: "#6B7280",
                        flexShrink: 0,
                      }}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 10V3L4 14h7v7l9-11h-7z"
                      />
                    </svg>
                    <div style={{ fontSize: "14px", color: "#374151" }}>
                      <span style={{ color: "#6B7280" }}>Tempo estimado: </span>
                      <span style={{ fontWeight: "500" }}>{s.tempo_estimado}</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Footer */}
              <div
                style={{
                  marginTop: "20px",
                  paddingTop: "16px",
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
                    gap: "4px",
                    fontSize: "13px",
                    fontWeight: "500",
                    color: "#1B4D3E",
                  }}
                >
                  Ver detalhes
                  <svg
                    style={{ width: "16px", height: "16px" }}
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
      )}

      {/* Pagination */}
      {totalPaginas > 1 && (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: "16px",
          }}
        >
          <button
            onClick={() => mudarPagina(paginaAtual - 1)}
            disabled={paginaAtual === 1}
            style={{
              padding: "8px 16px",
              borderRadius: "8px",
              border: "1px solid #E5E7EB",
              backgroundColor: paginaAtual === 1 ? "#F9FAFB" : "#fff",
              color: paginaAtual === 1 ? "#D1D5DB" : "#1B4D3E",
              fontSize: "14px",
              fontWeight: "500",
              cursor: paginaAtual === 1 ? "not-allowed" : "pointer",
              transition: "all 0.2s ease",
            }}
            onMouseEnter={(e) => {
              if (paginaAtual !== 1) {
                e.target.style.backgroundColor = "#F9FAFB";
              }
            }}
            onMouseLeave={(e) => {
              if (paginaAtual !== 1) {
                e.target.style.backgroundColor = "#fff";
              }
            }}
          >
            ← Anterior
          </button>

          <span
            style={{
              fontSize: "14px",
              color: "#6B7280",
              fontWeight: "500",
            }}
          >
            Página {paginaAtual} de {totalPaginas}
          </span>

          <button
            onClick={() => mudarPagina(paginaAtual + 1)}
            disabled={paginaAtual === totalPaginas}
            style={{
              padding: "8px 16px",
              borderRadius: "8px",
              border: "1px solid #E5E7EB",
              backgroundColor: paginaAtual === totalPaginas ? "#F9FAFB" : "#fff",
              color: paginaAtual === totalPaginas ? "#D1D5DB" : "#1B4D3E",
              fontSize: "14px",
              fontWeight: "500",
              cursor: paginaAtual === totalPaginas ? "not-allowed" : "pointer",
              transition: "all 0.2s ease",
            }}
            onMouseEnter={(e) => {
              if (paginaAtual !== totalPaginas) {
                e.target.style.backgroundColor = "#F9FAFB";
              }
            }}
            onMouseLeave={(e) => {
              if (paginaAtual !== totalPaginas) {
                e.target.style.backgroundColor = "#fff";
              }
            }}
          >
            Próxima →
          </button>
        </div>
      )}

      {/* Modal */}
      {agendamentoSelecionado && (
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
          onClick={fecharModal}
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
            {/* Modal Header */}
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
                <h2
                  style={{
                    fontSize: "24px",
                    fontWeight: "600",
                    color: "#1F2937",
                    margin: 0,
                    marginBottom: "8px",
                  }}
                >
                  {agendamentoSelecionado.tipoServico}
                </h2>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  {getStatusBadge(agendamentoSelecionado.status)}
                </div>
              </div>
              <button
                onClick={fecharModal}
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

            {/* Modal Content */}
            <div
              style={{
                padding: "32px",
                overflowY: "auto",
                flex: 1,
              }}
            >
              <div
                style={{ display: "flex", flexDirection: "column", gap: "24px" }}
              >
                {/* Associado Info */}
                <div>
                  <h3
                    style={{
                      fontSize: "14px",
                      fontWeight: "600",
                      color: "#6B7280",
                      textTransform: "uppercase",
                      letterSpacing: "0.5px",
                      marginBottom: "12px",
                    }}
                  >
                    Solicitante
                  </h3>
                  <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                    <div
                      style={{
                        width: "48px",
                        height: "48px",
                        borderRadius: "50%",
                        backgroundColor: "#1B4D3E",
                        color: "#fff",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "18px",
                        fontWeight: "600",
                      }}
                    >
                      {agendamentoSelecionado.nomeUsuario
                        ?.split(" ")
                        .map((n) => n[0])
                        .join("")
                        .substring(0, 2)
                        .toUpperCase()}
                    </div>
                    <div>
                      <div
                        style={{
                          fontSize: "16px",
                          fontWeight: "600",
                          color: "#1F2937",
                        }}
                      >
                        {agendamentoSelecionado.nomeUsuario}
                      </div>
                      <div style={{ fontSize: "13px", color: "#6B7280" }}>
                        Associado
                      </div>
                    </div>
                  </div>
                </div>

                {/* Schedule Details */}
                <div>
                  <h3
                    style={{
                      fontSize: "14px",
                      fontWeight: "600",
                      color: "#6B7280",
                      textTransform: "uppercase",
                      letterSpacing: "0.5px",
                      marginBottom: "12px",
                    }}
                  >
                    Detalhes do Agendamento
                  </h3>
                  <div
                    style={{
                      backgroundColor: "#F9FAFB",
                      padding: "16px",
                      borderRadius: "12px",
                      display: "flex",
                      flexDirection: "column",
                      gap: "12px",
                    }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                      <span style={{ color: "#6B7280", fontSize: "14px" }}>Data:</span>
                      <span
                        style={{
                          color: "#1F2937",
                          fontSize: "14px",
                          fontWeight: "600",
                        }}
                      >
                        {new Date(
                          agendamentoSelecionado.data_servico
                        ).toLocaleDateString("pt-BR", {
                          day: "2-digit",
                          month: "long",
                          year: "numeric",
                        })}
                      </span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                      <span style={{ color: "#6B7280", fontSize: "14px" }}>Hora:</span>
                      <span
                        style={{
                          color: "#1F2937",
                          fontSize: "14px",
                          fontWeight: "600",
                        }}
                      >
                        {agendamentoSelecionado.hora}
                      </span>
                    </div>
                    {agendamentoSelecionado.tempo_estimado && (
                      <div
                        style={{ display: "flex", justifyContent: "space-between" }}
                      >
                        <span style={{ color: "#6B7280", fontSize: "14px" }}>
                          Tempo Estimado:
                        </span>
                        <span
                          style={{
                            color: "#1F2937",
                            fontSize: "14px",
                            fontWeight: "600",
                          }}
                        >
                          {agendamentoSelecionado.tempo_estimado}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Observations */}
                {agendamentoSelecionado.observacao && (
                  <div>
                    <h3
                      style={{
                        fontSize: "14px",
                        fontWeight: "600",
                        color: "#6B7280",
                        textTransform: "uppercase",
                        letterSpacing: "0.5px",
                        marginBottom: "12px",
                      }}
                    >
                      Observações
                    </h3>
                    <div
                      style={{
                        backgroundColor: "#F9FAFB",
                        padding: "16px",
                        borderRadius: "12px",
                        fontSize: "14px",
                        color: "#374151",
                        lineHeight: "1.6",
                      }}
                    >
                      {agendamentoSelecionado.observacao}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Modal Footer */}
            <div
              style={{
                padding: "24px 32px",
                borderTop: "1px solid #E5E7EB",
                display: "flex",
                gap: "12px",
                backgroundColor: "#FAFAF9",
              }}
            >
              <button
                onClick={() => {
                  atualizarStatus(agendamentoSelecionado._id, "aprovado");
                }}
                disabled={agendamentoSelecionado.status === "aprovado"}
                style={{
                  flex: 1,
                  padding: "12px 24px",
                  borderRadius: "8px",
                  border: agendamentoSelecionado.status === "aprovado" ? "1px solid #D1D5DB" : "1px solid #059669",
                  backgroundColor:
                    agendamentoSelecionado.status === "aprovado"
                      ? "#F3F4F6"
                      : "#ECFDF5",
                  color: agendamentoSelecionado.status === "aprovado" ? "#9CA3AF" : "#059669",
                  fontSize: "14px",
                  fontWeight: "600",
                  cursor:
                    agendamentoSelecionado.status === "aprovado"
                      ? "not-allowed"
                      : "pointer",
                  transition: "all 0.2s ease",
                }}
                onMouseEnter={(e) => {
                  if (agendamentoSelecionado.status !== "aprovado") {
                    e.target.style.backgroundColor = "#D1FAE5";
                  }
                }}
                onMouseLeave={(e) => {
                  if (agendamentoSelecionado.status !== "aprovado") {
                    e.target.style.backgroundColor = "#ECFDF5";
                  }
                }}
              >
                ✓ Aprovar
              </button>
              <button
                onClick={() => {
                  atualizarStatus(agendamentoSelecionado._id, "recusado");
                }}
                disabled={agendamentoSelecionado.status === "recusado"}
                style={{
                  flex: 1,
                  padding: "12px 24px",
                  borderRadius: "8px",
                  border: agendamentoSelecionado.status === "recusado" ? "1px solid #D1D5DB" : "1px solid #DC2626",
                  backgroundColor:
                    agendamentoSelecionado.status === "recusado"
                      ? "#F3F4F6"
                      : "#FEF2F2",
                  color: agendamentoSelecionado.status === "recusado" ? "#9CA3AF" : "#DC2626",
                  fontSize: "14px",
                  fontWeight: "600",
                  cursor:
                    agendamentoSelecionado.status === "recusado"
                      ? "not-allowed"
                      : "pointer",
                  transition: "all 0.2s ease",
                }}
                onMouseEnter={(e) => {
                  if (agendamentoSelecionado.status !== "recusado") {
                    e.target.style.backgroundColor = "#FEE2E2";
                  }
                }}
                onMouseLeave={(e) => {
                  if (agendamentoSelecionado.status !== "recusado") {
                    e.target.style.backgroundColor = "#FEF2F2";
                  }
                }}
              >
                × Recusar
              </button>
              <button
                onClick={() => deletarAgendamento(agendamentoSelecionado._id)}
                style={{
                  padding: "12px 24px",
                  borderRadius: "8px",
                  border: "1px solid #E5E7EB",
                  backgroundColor: "#fff",
                  color: "#6B7280",
                  fontSize: "14px",
                  fontWeight: "600",
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = "#FEE2E2";
                  e.target.style.borderColor = "#DC2626";
                  e.target.style.color = "#DC2626";
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = "#fff";
                  e.target.style.borderColor = "#E5E7EB";
                  e.target.style.color = "#6B7280";
                }}
              >
                Excluir
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
