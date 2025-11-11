import React, { useState, useEffect } from "react";

const API_URL = "http://localhost:5050";

const CadastroMarcasNomes = () => {
  const [abaPrincipal, setAbaPrincipal] = useState("marcas");
  const [abaTipo, setAbaTipo] = useState("maquina");
  const [marca, setMarca] = useState("");
  const [marcas, setMarcas] = useState([]);
  const [tipo, setTipo] = useState("");
  const [tipos, setTipos] = useState([]);
  const [editMarcaId, setEditMarcaId] = useState(null);
  const [editTipoId, setEditTipoId] = useState(null);
  const [modalItem, setModalItem] = useState(null);
  const [modalTipo, setModalTipo] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchMarcas = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_URL}/marcas`);
      const data = await res.json();
      setMarcas(data);
    } catch (e) {
      console.error("Erro ao buscar marcas", e);
    } finally {
      setLoading(false);
    }
  };

  const fetchTipos = async (categoria) => {
    try {
      setLoading(true);
      const res = await fetch(`${API_URL}/tipos?categoria=${categoria}`);
      const data = await res.json();
      setTipos(data.filter((t) => t.categoria === categoria));
    } catch (e) {
      console.error("Erro ao buscar tipos", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMarcas();
  }, []);
  
  useEffect(() => {
    if (abaPrincipal === "tipos") fetchTipos(abaTipo);
  }, [abaTipo, abaPrincipal]);

  const salvarMarca = async (e) => {
    e.preventDefault();
    if (!marca.trim()) return;
    setLoading(true);
    try {
      const method = editMarcaId ? "PATCH" : "POST";
      const url = editMarcaId ? `${API_URL}/marcas/${editMarcaId}` : `${API_URL}/marcas`;
      
      await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nome: marca }),
      });
      
      await fetchMarcas();
      setMarca("");
      setEditMarcaId(null);
    } catch (error) {
      console.error("Erro ao salvar marca", error);
    } finally {
      setLoading(false);
    }
  };

  const salvarTipo = async (e) => {
    e.preventDefault();
    if (!tipo.trim()) return;
    setLoading(true);
    try {
      const method = editTipoId ? "PATCH" : "POST";
      const url = editTipoId ? `${API_URL}/tipos/${editTipoId}` : `${API_URL}/tipos`;
      
      await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tipo, categoria: abaTipo }),
      });
      
      await fetchTipos(abaTipo);
      setTipo("");
      setEditTipoId(null);
    } catch (error) {
      console.error("Erro ao salvar tipo", error);
    } finally {
      setLoading(false);
    }
  };

  const handleExcluir = async () => {
    if (!modalItem) return;
    const id = modalItem._id || modalItem.id;
    setLoading(true);
    try {
      await fetch(
        `${API_URL}/${modalTipo === "marca" ? "marcas" : "tipos"}/${id}`,
        { method: "DELETE" }
      );
      if (modalTipo === "marca") {
        await fetchMarcas();
      } else {
        await fetchTipos(abaTipo);
      }
    } catch (error) {
      console.error("Erro ao excluir", error);
    } finally {
      setLoading(false);
      setModalItem(null);
    }
  };

  const renderList = (items, tipo) => {
    if (loading && items.length === 0) {
      return (
        <div
          style={{
            padding: "64px 20px",
            textAlign: "center",
            backgroundColor: "#fff",
            borderRadius: "12px",
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
          <p style={{ color: "#6B7280", fontSize: "14px" }}>Carregando...</p>
        </div>
      );
    }

    if (!items.length) {
      return (
        <div
          style={{
            padding: "64px 20px",
            textAlign: "center",
            backgroundColor: "#fff",
            borderRadius: "12px",
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
              d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
            />
          </svg>
          <p style={{ color: "#6B7280", fontSize: "14px" }}>
            Nenhum {tipo} cadastrado ainda
          </p>
        </div>
      );
    }

    return (
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
          gap: "16px",
        }}
      >
        {items.map((item) => (
          <div
            key={item._id || item.id}
            onClick={() => {
              setModalItem(item);
              setModalTipo(tipo);
            }}
            style={{
              backgroundColor: "#fff",
              padding: "20px",
              borderRadius: "12px",
              border: "1px solid #E5E7EB",
              cursor: "pointer",
              transition: "all 0.2s ease",
              boxShadow: "0 1px 2px rgba(0, 0, 0, 0.05)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "#FAFAF9";
              e.currentTarget.style.borderColor = "#1B4D3E";
              e.currentTarget.style.transform = "translateY(-2px)";
              e.currentTarget.style.boxShadow = "0 4px 8px rgba(0, 0, 0, 0.1)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "#fff";
              e.currentTarget.style.borderColor = "#E5E7EB";
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "0 1px 2px rgba(0, 0, 0, 0.05)";
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <div
                style={{
                  width: "40px",
                  height: "40px",
                  borderRadius: "8px",
                  backgroundColor: "#1B4D3E",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                <svg
                  style={{ width: "20px", height: "20px", color: "#fff" }}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  {tipo === "marca" ? (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                    />
                  ) : (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  )}
                </svg>
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p
                  style={{
                    fontSize: "15px",
                    fontWeight: "600",
                    color: "#1F2937",
                    margin: 0,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {tipo === "marca" ? item.nome : item.tipo}
                </p>
                <p
                  style={{
                    fontSize: "12px",
                    color: "#6B7280",
                    margin: "4px 0 0 0",
                  }}
                >
                  Clique para editar
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
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
      {/* Main Tabs */}
      <div
        style={{
          display: "flex",
          gap: "8px",
          marginBottom: "32px",
          borderBottom: "2px solid #E5E7EB",
          paddingBottom: "0",
        }}
      >
        <button
          onClick={() => setAbaPrincipal("marcas")}
          style={{
            padding: "12px 24px",
            border: "none",
            borderBottom:
              abaPrincipal === "marcas" ? "3px solid #1B4D3E" : "none",
            backgroundColor: "transparent",
            color: abaPrincipal === "marcas" ? "#1B4D3E" : "#6B7280",
            cursor: "pointer",
            fontWeight: abaPrincipal === "marcas" ? "600" : "500",
            fontSize: "15px",
            transition: "all 0.2s ease",
            marginBottom: "-2px",
          }}
        >
          Marcas
        </button>
        <button
          onClick={() => setAbaPrincipal("tipos")}
          style={{
            padding: "12px 24px",
            border: "none",
            borderBottom:
              abaPrincipal === "tipos" ? "3px solid #1B4D3E" : "none",
            backgroundColor: "transparent",
            color: abaPrincipal === "tipos" ? "#1B4D3E" : "#6B7280",
            cursor: "pointer",
            fontWeight: abaPrincipal === "tipos" ? "600" : "500",
            fontSize: "15px",
            transition: "all 0.2s ease",
            marginBottom: "-2px",
          }}
        >
          Tipos
        </button>
      </div>

      {/* Marcas Content */}
      {abaPrincipal === "marcas" && (
        <div>
          {/* Form */}
          <form
            onSubmit={salvarMarca}
            style={{
              backgroundColor: "#fff",
              padding: "24px",
              borderRadius: "12px",
              border: "1px solid #E5E7EB",
              marginBottom: "32px",
              boxShadow: "0 1px 2px rgba(0, 0, 0, 0.05)",
            }}
          >
            <label
              style={{
                display: "block",
                fontSize: "14px",
                fontWeight: "600",
                color: "#374151",
                marginBottom: "8px",
              }}
            >
              {editMarcaId ? "Editar Marca" : "Nova Marca"}
            </label>
            <div style={{ display: "flex", gap: "12px" }}>
              <input
                type="text"
                placeholder="Digite o nome da marca"
                value={marca}
                onChange={(e) => setMarca(e.target.value)}
                style={{
                  flex: 1,
                  padding: "12px 16px",
                  borderRadius: "8px",
                  border: "1px solid #E5E7EB",
                  fontSize: "14px",
                  outline: "none",
                  transition: "all 0.2s ease",
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = "#1B4D3E";
                  e.target.style.boxShadow = "0 0 0 3px rgba(27, 77, 62, 0.1)";
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = "#E5E7EB";
                  e.target.style.boxShadow = "none";
                }}
              />
              {editMarcaId && (
                <button
                  type="button"
                  onClick={() => {
                    setMarca("");
                    setEditMarcaId(null);
                  }}
                  style={{
                    padding: "12px 20px",
                    borderRadius: "8px",
                    border: "1px solid #E5E7EB",
                    backgroundColor: "#fff",
                    color: "#6B7280",
                    fontSize: "14px",
                    fontWeight: "500",
                    cursor: "pointer",
                    transition: "all 0.2s ease",
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.backgroundColor = "#F9FAFB";
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.backgroundColor = "#fff";
                  }}
                >
                  Cancelar
                </button>
              )}
              <button
                type="submit"
                disabled={loading || !marca.trim()}
                style={{
                  padding: "12px 24px",
                  borderRadius: "8px",
                  border: "none",
                  backgroundColor: loading || !marca.trim() ? "#D1D5DB" : "#1B4D3E",
                  color: "#fff",
                  fontSize: "14px",
                  fontWeight: "600",
                  cursor: loading || !marca.trim() ? "not-allowed" : "pointer",
                  transition: "all 0.2s ease",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                }}
                onMouseEnter={(e) => {
                  if (!loading && marca.trim()) {
                    e.target.style.backgroundColor = "#163E32";
                  }
                }}
                onMouseLeave={(e) => {
                  if (!loading && marca.trim()) {
                    e.target.style.backgroundColor = "#1B4D3E";
                  }
                }}
              >
                {loading && (
                  <div
                    style={{
                      width: "16px",
                      height: "16px",
                      border: "2px solid #fff",
                      borderTop: "2px solid transparent",
                      borderRadius: "50%",
                      animation: "spin 1s linear infinite",
                    }}
                  />
                )}
                {editMarcaId ? "Atualizar" : "Adicionar"}
              </button>
            </div>
          </form>

          {/* List */}
          {renderList(marcas, "marca")}
        </div>
      )}

      {/* Tipos Content */}
      {abaPrincipal === "tipos" && (
        <div>
          {/* Sub Tabs */}
          <div
            style={{
              display: "inline-flex",
              gap: "0",
              marginBottom: "24px",
              backgroundColor: "#F3F4F6",
              padding: "4px",
              borderRadius: "10px",
            }}
          >
            <button
              onClick={() => setAbaTipo("maquina")}
              style={{
                padding: "8px 20px",
                border: "none",
                borderRadius: "8px",
                backgroundColor:
                  abaTipo === "maquina" ? "#1B4D3E" : "transparent",
                color: abaTipo === "maquina" ? "#fff" : "#6B7280",
                cursor: "pointer",
                fontWeight: "500",
                fontSize: "14px",
                transition: "all 0.2s ease",
              }}
            >
              Máquinas
            </button>
            <button
              onClick={() => setAbaTipo("implemento")}
              style={{
                padding: "8px 20px",
                border: "none",
                borderRadius: "8px",
                backgroundColor:
                  abaTipo === "implemento" ? "#1B4D3E" : "transparent",
                color: abaTipo === "implemento" ? "#fff" : "#6B7280",
                cursor: "pointer",
                fontWeight: "500",
                fontSize: "14px",
                transition: "all 0.2s ease",
              }}
            >
              Implementos
            </button>
          </div>

          {/* Form */}
          <form
            onSubmit={salvarTipo}
            style={{
              backgroundColor: "#fff",
              padding: "24px",
              borderRadius: "12px",
              border: "1px solid #E5E7EB",
              marginBottom: "32px",
              boxShadow: "0 1px 2px rgba(0, 0, 0, 0.05)",
            }}
          >
            <label
              style={{
                display: "block",
                fontSize: "14px",
                fontWeight: "600",
                color: "#374151",
                marginBottom: "8px",
              }}
            >
              {editTipoId ? "Editar Tipo" : "Novo Tipo"} de{" "}
              {abaTipo === "maquina" ? "Máquina" : "Implemento"}
            </label>
            <div style={{ display: "flex", gap: "12px" }}>
              <input
                type="text"
                placeholder={`Digite o tipo de ${
                  abaTipo === "maquina" ? "máquina" : "implemento"
                }`}
                value={tipo}
                onChange={(e) => setTipo(e.target.value)}
                style={{
                  flex: 1,
                  padding: "12px 16px",
                  borderRadius: "8px",
                  border: "1px solid #E5E7EB",
                  fontSize: "14px",
                  outline: "none",
                  transition: "all 0.2s ease",
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = "#1B4D3E";
                  e.target.style.boxShadow = "0 0 0 3px rgba(27, 77, 62, 0.1)";
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = "#E5E7EB";
                  e.target.style.boxShadow = "none";
                }}
              />
              {editTipoId && (
                <button
                  type="button"
                  onClick={() => {
                    setTipo("");
                    setEditTipoId(null);
                  }}
                  style={{
                    padding: "12px 20px",
                    borderRadius: "8px",
                    border: "1px solid #E5E7EB",
                    backgroundColor: "#fff",
                    color: "#6B7280",
                    fontSize: "14px",
                    fontWeight: "500",
                    cursor: "pointer",
                    transition: "all 0.2s ease",
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.backgroundColor = "#F9FAFB";
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.backgroundColor = "#fff";
                  }}
                >
                  Cancelar
                </button>
              )}
              <button
                type="submit"
                disabled={loading || !tipo.trim()}
                style={{
                  padding: "12px 24px",
                  borderRadius: "8px",
                  border: "none",
                  backgroundColor: loading || !tipo.trim() ? "#D1D5DB" : "#1B4D3E",
                  color: "#fff",
                  fontSize: "14px",
                  fontWeight: "600",
                  cursor: loading || !tipo.trim() ? "not-allowed" : "pointer",
                  transition: "all 0.2s ease",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                }}
                onMouseEnter={(e) => {
                  if (!loading && tipo.trim()) {
                    e.target.style.backgroundColor = "#163E32";
                  }
                }}
                onMouseLeave={(e) => {
                  if (!loading && tipo.trim()) {
                    e.target.style.backgroundColor = "#1B4D3E";
                  }
                }}
              >
                {loading && (
                  <div
                    style={{
                      width: "16px",
                      height: "16px",
                      border: "2px solid #fff",
                      borderTop: "2px solid transparent",
                      borderRadius: "50%",
                      animation: "spin 1s linear infinite",
                    }}
                  />
                )}
                {editTipoId ? "Atualizar" : "Adicionar"}
              </button>
            </div>
          </form>

          {/* List */}
          {renderList(tipos, "tipo")}
        </div>
      )}

      {/* Modal */}
      {modalItem && (
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
            zIndex: 1001,
            padding: "20px",
          }}
          onClick={() => setModalItem(null)}
        >
          <div
            style={{
              backgroundColor: "#fff",
              borderRadius: "16px",
              padding: "32px",
              maxWidth: "500px",
              width: "100%",
              boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3
              style={{
                fontSize: "20px",
                fontWeight: "600",
                color: "#1F2937",
                marginBottom: "8px",
              }}
            >
              Gerenciar {modalTipo === "marca" ? "Marca" : "Tipo"}
            </h3>
            <p
              style={{
                fontSize: "14px",
                color: "#6B7280",
                marginBottom: "24px",
              }}
            >
              "{modalItem.nome || modalItem.tipo}"
            </p>

            <div style={{ display: "flex", gap: "12px" }}>
              <button
                onClick={() => {
                  if (modalTipo === "marca") {
                    setMarca(modalItem.nome);
                    setEditMarcaId(modalItem._id || modalItem.id);
                    setAbaPrincipal("marcas");
                  } else {
                    setTipo(modalItem.tipo);
                    setEditTipoId(modalItem._id || modalItem.id);
                    setAbaPrincipal("tipos");
                    setAbaTipo(modalItem.categoria);
                  }
                  setModalItem(null);
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                style={{
                  flex: 1,
                  padding: "12px 24px",
                  borderRadius: "8px",
                  border: "1px solid #1B4D3E",
                  backgroundColor: "#1B4D3E",
                  color: "#fff",
                  fontSize: "14px",
                  fontWeight: "600",
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = "#163E32";
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = "#1B4D3E";
                }}
              >
                Editar
              </button>
              <button
                onClick={handleExcluir}
                disabled={loading}
                style={{
                  flex: 1,
                  padding: "12px 24px",
                  borderRadius: "8px",
                  border: "1px solid #DC2626",
                  backgroundColor: loading ? "#F3F4F6" : "transparent",
                  color: loading ? "#9CA3AF" : "#DC2626",
                  fontSize: "14px",
                  fontWeight: "600",
                  cursor: loading ? "not-allowed" : "pointer",
                  transition: "all 0.2s ease",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "8px",
                }}
                onMouseEnter={(e) => {
                  if (!loading) {
                    e.target.style.backgroundColor = "#FEE2E2";
                  }
                }}
                onMouseLeave={(e) => {
                  if (!loading) {
                    e.target.style.backgroundColor = "transparent";
                  }
                }}
              >
                {loading && (
                  <div
                    style={{
                      width: "16px",
                      height: "16px",
                      border: "2px solid #DC2626",
                      borderTop: "2px solid transparent",
                      borderRadius: "50%",
                      animation: "spin 1s linear infinite",
                    }}
                  />
                )}
                Excluir
              </button>
            </div>

            <button
              onClick={() => setModalItem(null)}
              style={{
                marginTop: "16px",
                width: "100%",
                padding: "12px",
                borderRadius: "8px",
                border: "1px solid #E5E7EB",
                backgroundColor: "#fff",
                color: "#6B7280",
                fontSize: "14px",
                fontWeight: "500",
                cursor: "pointer",
                transition: "all 0.2s ease",
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = "#F9FAFB";
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = "#fff";
              }}
            >
              Cancelar
            </button>
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
};

export default CadastroMarcasNomes;
