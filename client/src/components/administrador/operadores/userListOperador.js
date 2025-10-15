import React, { useEffect, useState } from "react";
import { Search, User, Plus, Edit2, Trash2 } from "lucide-react";
import EditOperador from "./EditOperador";

const API_URL = "http://localhost:5050";

// ========================== FORMATADORES ==========================
function formatCPF(cpf) {
  if (!cpf) return "";
  const clean = cpf.replace(/\D/g, "");
  return clean.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
}

function formatTelefone(tel) {
  if (!tel) return "";
  const clean = tel.replace(/\D/g, "");
  if (clean.length === 11) {
    return clean.replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3");
  } else if (clean.length === 10) {
    return clean.replace(/(\d{2})(\d{4})(\d{4})/, "($1) $2-$3");
  }
  return tel;
}

// ========================== COMPONENTE PRINCIPAL ==========================
export default function ListOperadores() {
  const [operadores, setOperadores] = useState([]);
  const [busca, setBusca] = useState("");
  const [operadorSelecionado, setOperadorSelecionado] = useState(null);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    buscarOperadores();
  }, []);

  async function buscarOperadores() {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/operadores`);
      if (!response.ok) throw new Error("Erro ao buscar operadores");
      const data = await response.json();
      setOperadores(data);
    } catch (error) {
      alert("Erro ao buscar operadores: " + error.message);
    } finally {
      setLoading(false);
    }
  }

  const operadoresFiltrados = operadores.filter(
    (op) =>
      op.nome?.toLowerCase().includes(busca.toLowerCase()) ||
      op.telefone?.toLowerCase().includes(busca.toLowerCase()) ||
      op.cpf?.toLowerCase().includes(busca.toLowerCase()) ||
      op.email?.toLowerCase().includes(busca.toLowerCase())
  );

  const abrirEdit = (operador) => {
    setOperadorSelecionado(operador);
    setMostrarModal(true);
  };

  const handleDelete = async (operador, e) => {
    e.stopPropagation();
    
    if (!window.confirm(`Deseja realmente excluir o operador ${operador.nome}?`)) {
      return;
    }

    try {
      const response = await fetch(`${API_URL}/operadores/${operador._id}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Erro ao excluir operador");

      setOperadores((old) => old.filter((op) => op._id !== operador._id));
      alert("Operador excluído com sucesso!");
    } catch (error) {
      alert("Erro ao excluir operador: " + error.message);
    }
  };

  const handleUpdate = (operadorAtualizado) => {
    setOperadores((old) =>
      old.map((op) => (op._id === operadorAtualizado._id ? operadorAtualizado : op))
    );
    setOperadorSelecionado(operadorAtualizado);
  };

  const handleAddClick = () => {
    window.location.href = "/operadores/create";
  };

  const getInitials = (nome) => {
    if (!nome) return "?";
    const parts = nome.split(" ");
    if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
    return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
  };

  if (loading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#fff",
        }}
      >
        <div style={{ textAlign: "center" }}>
          <div
            style={{
              width: "48px",
              height: "48px",
              border: "3px solid #E5E7EB",
              borderTop: "3px solid #1B4D3E",
              borderRadius: "50%",
              animation: "spin 1s linear infinite",
              margin: "0 auto 16px",
            }}
          />
          <p style={{ color: "#6B7280", fontSize: "14px" }}>
            Carregando operadores...
          </p>
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

  return (
    <div
      style={{
        width: "100%",
        maxWidth: "1000px",
        margin: "0 auto",
        padding: "32px 20px",
      }}
    >
      {/* Header */}
      

      {/* Search Bar */}
      <div style={{ marginBottom: "24px", position: "relative" }}>
        <Search
          style={{
            position: "absolute",
            left: "14px",
            top: "50%",
            transform: "translateY(-50%)",
            width: "18px",
            height: "18px",
            color: "#9CA3AF",
          }}
        />
        <input
          type="text"
          placeholder="Pesquisar por nome, telefone, CPF ou e-mail..."
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
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

      {/* Operators List */}
      <div
        style={{
          display: "grid",
          gap: "16px",
        }}
      >
        {operadoresFiltrados.length === 0 ? (
          <div
            style={{
              padding: "64px 20px",
              textAlign: "center",
              backgroundColor: "#fff",
              borderRadius: "16px",
              border: "1px solid #E5E7EB",
            }}
          >
            <User style={{ width: "48px", height: "48px", color: "#D1D5DB", margin: "0 auto 16px" }} />
            <h3
              style={{
                fontSize: "16px",
                color: "#374151",
                marginBottom: "6px",
              }}
            >
              Nenhum operador encontrado
            </h3>
            <p style={{ color: "#9CA3AF", fontSize: "14px", margin: 0 }}>
              {busca ? "Tente ajustar sua busca" : "Comece adicionando um novo operador"}
            </p>
          </div>
        ) : (
          operadoresFiltrados.map((operador) => (
            <div
              key={operador._id}
              style={{
                backgroundColor: "#fff",
                padding: "20px 24px",
                borderRadius: "16px",
                border: "1px solid #E5E7EB",
                cursor: "pointer",
                transition: "all 0.2s ease",
                boxShadow: "0 1px 2px rgba(0, 0, 0, 0.05)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "#FAFAF9";
                e.currentTarget.style.borderColor = "#1B4D3E";
                e.currentTarget.style.transform = "translateY(-2px)";
                e.currentTarget.style.boxShadow = "0 4px 6px rgba(0, 0, 0, 0.07)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "#fff";
                e.currentTarget.style.borderColor = "#E5E7EB";
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "0 1px 2px rgba(0, 0, 0, 0.05)";
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: "16px",
                }}
              >
                {/* Left side - Avatar and info */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "16px",
                    flex: 1,
                    minWidth: 0,
                  }}
                >
                  {/* Avatar */}
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
                      flexShrink: 0,
                    }}
                  >
                    {getInitials(operador.nome)}
                  </div>

                  {/* Info Grid */}
                  <div
                    style={{
                      flex: 1,
                      minWidth: 0,
                      display: "grid",
                      gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                      gap: "12px 24px",
                    }}
                  >
                    {/* Name and CPF */}
                    <div>
                      <div
                        style={{
                          fontSize: "16px",
                          fontWeight: "500",
                          color: "#1F2937",
                          marginBottom: "4px",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {operador.nome}
                      </div>
                      {operador.cpf && (
                        <div
                          style={{
                            fontSize: "13px",
                            color: "#9CA3AF",
                            display: "flex",
                            alignItems: "center",
                            gap: "4px",
                          }}
                        >
                          <span style={{ fontWeight: "500" }}>CPF:</span>
                          <span>{formatCPF(operador.cpf)}</span>
                        </div>
                      )}
                    </div>

                    {/* Contact */}
                    <div>
                      {operador.telefone && (
                        <div
                          style={{
                            fontSize: "13px",
                            color: "#6B7280",
                            display: "flex",
                            alignItems: "center",
                            gap: "6px",
                            marginBottom: "4px",
                          }}
                        >
                          <svg
                            style={{ width: "14px", height: "14px", flexShrink: 0 }}
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                            />
                          </svg>
                          {formatTelefone(operador.telefone)}
                        </div>
                      )}
                      {operador.email && (
                        <div
                          style={{
                            fontSize: "13px",
                            color: "#6B7280",
                            display: "flex",
                            alignItems: "center",
                            gap: "6px",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                          }}
                        >
                          <svg
                            style={{ width: "14px", height: "14px", flexShrink: 0 }}
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                            />
                          </svg>
                          {operador.email}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Right side - Actions */}
                <div
                  style={{
                    display: "flex",
                    gap: "8px",
                    flexShrink: 0,
                  }}
                >
                  <div
                    onClick={() => abrirEdit(operador)}
                    style={{
                      width: "32px",
                      height: "32px",
                      borderRadius: "50%",
                      backgroundColor: "#F3F4F6",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      transition: "all 0.2s ease",
                      cursor: "pointer",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = "#1B4D3E";
                      e.currentTarget.style.color = "#fff";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = "#F3F4F6";
                      e.currentTarget.style.color = "#6B7280";
                    }}
                  >
                    <Edit2 style={{ width: "16px", height: "16px" }} />
                  </div>

                  <div
                    onClick={(e) => handleDelete(operador, e)}
                    style={{
                      width: "32px",
                      height: "32px",
                      borderRadius: "50%",
                      backgroundColor: "#F3F4F6",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      transition: "all 0.2s ease",
                      cursor: "pointer",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = "#DC2626";
                      e.currentTarget.style.color = "#fff";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = "#F3F4F6";
                      e.currentTarget.style.color = "#6B7280";
                    }}
                  >
                    <Trash2 style={{ width: "16px", height: "16px" }} />
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal */}
      {mostrarModal && operadorSelecionado && (
        <EditOperador
          operador={operadorSelecionado}
          onClose={() => setMostrarModal(false)}
          onDeleted={(id) => {
            setOperadores((old) => old.filter((op) => op._id !== id));
            setMostrarModal(false);
          }}
          onUpdated={handleUpdate}
        />
      )}
    </div>
  );
}
