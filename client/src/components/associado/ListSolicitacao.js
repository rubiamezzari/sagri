import React, { useEffect, useState, useRef } from "react";

const API_URL = "http://localhost:5050";


const linhaBase = {
  padding: "6px 0",
  display: "flex",
  gap: "8px",
  Size: "0.95rem",
  borderBottom: "1px solid #d5ecd0",
};

const campoLabel = {
  minWidth: "140px", // um pouco menor para caber melhor
  Weight: "700",
  color: "#1a3c1a",
};

const styles = {
  container: {
    padding: 16,
    maxWidth: 1100,
    margin: "0 auto",
    borderRadius: "5px",
  },
  search: {
    width: "100%",
    padding: 12,
    marginBottom: 20,
    borderRadius: 8,
    border: "1px solid #ccc",
    Size: 16,
    boxSizing: "border-box",
  },
  item: {
    background: "#fff",
    borderRadius: 10,
    marginBottom: 14,
    boxShadow: "0 2px 6px rgba(0,0,0,0.08)",
    cursor: "pointer",
    overflow: "hidden",
    transition: "all 0.22s ease",
    position: "relative",
  },
  header: {
    padding: "10px 16px", // menos padding para ficar compacto
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "12px",
  },
  titleWrap: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    flex: 1,
    minWidth: 0, // evita overflow do texto
  },
  tituloNome: {
    Size: "1rem",
    Weight: 700,
    color: "#1a3c1a",
    textTransform: "uppercase",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
    margin: 0,
  },
  dataServico: {
    Style: "italic",
    Weight: 400,
    textTransform: "none",
    Size: "0.9rem",
    opacity: 0.9,
    whiteSpace: "nowrap",
  },
  rightControls: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    position: "relative",
    flexShrink: 0,
  },
  statusLabel: (bgColor, textColor) => ({
    padding: "6px 14px",
    borderRadius: 20,
    backgroundColor: bgColor,
    Weight: 700,
    Size: 13,
    color: textColor,
    textTransform: "capitalize",
    minWidth: 78,
    textAlign: "center",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
  }),
  dots: {
    cursor: "pointer",
    Size: "20px",
    Weight: 600,
    padding: "0 6px",
    userSelect: "none",
    lineHeight: 1,
  },
  menu: {
    position: "absolute",
    top: "34px",
    right: "0px",
    background: "#fff",
    border: "1px solid #e6e6e6",
    borderRadius: "6px",
    boxShadow: "0 8px 20px rgba(0,0,0,0.12)",
    zIndex: 200,
    width: "200px",
    overflow: "hidden",
  },
  menuItem: {
    padding: "10px 12px",
    cursor: "pointer",
    borderBottom: "1px solid #f2f2f2",
    Size: "0.95rem",
    color: "#1a3c1a",
    background: "white",
  },
  expanded: {
    backgroundColor: "#fff",
    padding: "12px 16px",
    maxHeight: 20,
    overflow: "hidden",
    transition: "max-height 0.28s ease, padding 0.22s ease",
  },
  linha: {
    ...linhaBase,
    padding: "4px 0", // ainda mais compacto
    gap: "6px",
    Size: "0.92rem",
  },
};

const SolicitacaoDetalhes = ({ solicitacao }) => {
  return (
    <div style={{ paddingTop: 6, paddingBottom: 6 }}>
      <div style={styles.linha}>
        <div style={campoLabel}>Data:</div>
        <div>{new Date(solicitacao.data_servico).toLocaleDateString()}</div>
      </div>
      <div style={styles.linha}>
        <div style={campoLabel}>Hora:</div>
        <div>{solicitacao.hora || "-"}</div>
      </div>
      <div style={styles.linha}>
        <div style={campoLabel}>Tempo estimado:</div>
        <div>{solicitacao.tempo_estimado || "-"}</div>
      </div>
      {solicitacao.observacao && (
        <div style={styles.linha}>
          <div style={campoLabel}>Observação:</div>
          <div style={{ wordBreak: "break-word" }}>{solicitacao.observacao}</div>
        </div>
      )}
    </div>
  );
};

export default function ListSolicitacao() {
  const [solicitacoes, setSolicitacoes] = useState([]);
  const [expandedId, setExpandedId] = useState(null);
  const [heights, setHeights] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [menuOpenId, setMenuOpenId] = useState(null);
  const menuContainerRef = useRef(null);

  useEffect(() => {
    const usuarioLogado = JSON.parse(localStorage.getItem("usuarioLogado"));
    if (!usuarioLogado?._id) return;
    fetch(`${API_URL}/solicitacoes/usuario/${usuarioLogado._id}`)
      .then((res) => res.json())
      .then(setSolicitacoes)
      .catch((err) => console.error(err));
  }, []);

  useEffect(() => {
    solicitacoes.forEach((s) => {
      const el = document.getElementById(`expanded-${s._id}`);
      if (el) {
        setHeights((prev) => ({ ...prev, [s._id]: el.scrollHeight }));
      }
    });
  }, [solicitacoes]);

  useEffect(() => {
    function onDocClick(e) {
      if (!menuContainerRef.current) {
        setMenuOpenId(null);
        return;
      }
      const openMenu = document.querySelector(`[data-menu-id="${menuOpenId}"]`);
      if (openMenu && openMenu.contains(e.target)) return;
      setMenuOpenId(null);
    }
    document.addEventListener("click", onDocClick);
    return () => document.removeEventListener("click", onDocClick);
  }, [menuOpenId]);

  const getStatusColors = (status) => {
    switch (status) {
      case "Pendente":
        return { bg: "#FFF3CD", text: "#856404" };
      case "Aceito":
        return { bg: "#C7E5CD", text: "#1B4D3E" };
      case "Recusado":
        return { bg: "#F8D7DA", text: "#721C24" };
      case "Cancelado":
        return { bg: "#F0F0F0", text: "#6C757D" };
      default:
        return { bg: "#E2E3E5", text: "#6C757D" };
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Deseja realmente excluir esta solicitação?")) return;
    try {
      await fetch(`${API_URL}/solicitacoes/${id}`, { method: "DELETE" });
      setSolicitacoes((old) => old.filter((s) => s._id !== id));
      setExpandedId((cur) => (cur === id ? null : cur));
      setMenuOpenId(null);
    } catch (err) {
      console.error(err);
      alert("Erro ao excluir.");
    }
  };

  const handleCancel = async (id) => {
    if (!window.confirm("Cancelar esta solicitação?")) return;
    setSolicitacoes((old) => old.map((s) => (s._id === id ? { ...s, status: "Cancelado" } : s)));
    setMenuOpenId(null);
    try {
      await fetch(`${API_URL}/solicitacoes/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "Cancelado" }),
      });
    } catch (err) {
      console.warn("Falha ao notificar servidor sobre cancelamento:", err);
    }
  };

  const filtered = solicitacoes.filter((s) =>
    s.tipoServico?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div style={styles.container}>
      <input
        type="text"
        placeholder="Buscar solicitação..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        style={styles.search}
      />

      {filtered.length === 0 && <p>Nenhuma solicitação encontrada.</p>}

      {filtered.map((s) => {
        const isExpanded = expandedId === s._id;
        const { bg, text } = getStatusColors(s.status);

        return (
          <div
            key={s._id}
            style={{
              ...styles.item,
              transform: isExpanded ? "scale(1.02)" : "scale(1)",
              boxShadow: isExpanded ? "0 8px 25px rgba(0,0,0,0.15)" : "0 6px 20px rgba(0,0,0,0.08)",
            }}
            onClick={() => {
              if (menuOpenId !== s._id) { // Evita fechar o card se o menu estiver aberto
                setExpandedId(isExpanded ? null : s._id);
              }
            }}
          >
            <div style={styles.header}>
              <div style={styles.titleWrap}>
                <span style={styles.tituloNome}>{s.tipoServico?.toUpperCase() || "—"}</span>
                <span style={styles.dataServico}>
                  {new Date(s.data_servico).toLocaleDateString()}
                </span>
              </div>

              <div style={styles.rightControls}>
                <span style={styles.statusLabel(bg, text)}>{s.status}</span>

                {s.status === "Pendente" && (
                  <div
                    ref={menuOpenId === s._id ? menuContainerRef : null}
                    style={{ position: "relative" }}
                  >
                    <span
                      style={styles.dots}
                      onClick={(e) => {
                        e.stopPropagation();
                        setMenuOpenId((cur) => (cur === s._id ? null : s._id));
                      }}
                      aria-label="Abrir menu"
                      role="button"
                    >
                      ⋮
                    </span>

                    {menuOpenId === s._id && (
                      <div
                        style={styles.menu}
                        onClick={(e) => e.stopPropagation()}
                      >
                        <div
                          style={styles.menuItem}
                          onClick={() => handleDelete(s._id)}
                        >
                          Excluir
                        </div>
                        <div
                          style={{ ...styles.menuItem, borderBottom: "none" }}
                          onClick={() => handleCancel(s._id)}
                        >
                          Cancelar Solicitação
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            <div
              id={`expanded-${s._id}`}
              style={{
                ...styles.expanded,
                maxHeight: isExpanded ? (heights[s._id] || 380) : 0,
                padding: isExpanded ? "12px 16px" : "0 16px",
              }}
            >
              <SolicitacaoDetalhes solicitacao={s} />
            </div>
          </div>
        );
      })}
    </div>
  );
}