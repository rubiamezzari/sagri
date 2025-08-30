import React, { useEffect, useState } from "react";

const API_URL = "http://localhost:5050";

const styles = {
  container: {
    padding: 20,
    maxWidth: 1100,
    margin: "0 auto",
    fontFamily: "Inter, sans-serif",
    borderRadius: "5px",
  },
  search: {
    width: "100%",
    padding: 12,
    marginBottom: 20,
    borderRadius: 5,
    border: "1px solid #ccc",
    fontSize: 16,
    boxSizing: "border-box",
  },
  item: {
    background: "#fff",
    borderRadius: 10,
    marginBottom: 15,
    boxShadow: "0 2px 6px rgba(0,0,0,0.08)",
    cursor: "pointer",
    overflow: "hidden",
    transition: "all 0.3s ease",
  },
  header: {
    padding: 18,
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    fontWeight: 600,
    fontSize: 16,
    color: "#1B4D3E",
  },
  tipoData: {
    fontStyle: "italic",
    color: "#1B4D3E",
  },
  statusLabel: (bgColor, textColor) => ({
    padding: "6px 18px",
    borderRadius: 20,
    backgroundColor: bgColor,
    fontWeight: 600,
    fontSize: 14,
    color: textColor,
    textTransform: "capitalize",
    minWidth: 80,
    textAlign: "center",
  }),
  expanded: {
    backgroundColor: "#f9f9f9",
    padding: "0 18px",
    maxHeight: 0,
    overflow: "hidden",
    transition: "max-height 0.3s ease, padding 0.3s ease",
  },
};

const SolicitacaoDetalhes = ({ solicitacao, handleDelete }) => {
  const detalhesStyles = {
    linha: {
      padding: "8px 0",
      display: "flex",
      gap: "8px",
      fontSize: "0.95rem",
      borderBottom: "1px solid #e0e0e0",
      alignItems: "center",
    },
    campoLabel: {
      minWidth: "160px",
      fontWeight: "bold",
      color: "#1B4D3E",
    },
    btn: {
      padding: "8px 16px",
      borderRadius: 5,
      border: "none",
      cursor: "pointer",
      marginRight: 10,
      fontWeight: 600,
      backgroundColor: "#96c7b8ff", // fundo pastel
      color: "#174137ff", // texto escuro
      fontSize: 14,
      transition: "all 0.3s ease",
    },
  };

  return (
    <div style={{ paddingTop: 10, paddingBottom: 10 }}>
      <div style={detalhesStyles.linha}>
        <div style={detalhesStyles.campoLabel}>Data:</div>
        <div>{new Date(solicitacao.data_servico).toLocaleDateString()}</div>
      </div>
      <div style={detalhesStyles.linha}>
        <div style={detalhesStyles.campoLabel}>Hora:</div>
        <div>{solicitacao.hora}</div>
      </div>
      <div style={detalhesStyles.linha}>
        <div style={detalhesStyles.campoLabel}>Tempo estimado:</div>
        <div>{solicitacao.tempo_estimado || "-"}</div>
      </div>
      {solicitacao.observacao && (
        <div style={detalhesStyles.linha}>
          <div style={detalhesStyles.campoLabel}>Observação:</div>
          <div>{solicitacao.observacao}</div>
        </div>
      )}
      <div style={{ marginTop: 15 }}>
        <button
          style={detalhesStyles.btn}
          onClick={(e) => {
            e.stopPropagation();
            handleDelete(solicitacao._id);
          }}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#b8ecdcff")}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#c7f4e7ff")}
        >
          Excluir
        </button>
      </div>
    </div>
  );
};

export default function ListSolicitacao() {
  const [solicitacoes, setSolicitacoes] = useState([]);
  const [expandedId, setExpandedId] = useState(null);
  const [heights, setHeights] = useState({});
  const [searchTerm, setSearchTerm] = useState("");

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
      if (el) setHeights((prev) => ({ ...prev, [s._id]: el.scrollHeight }));
    });
  }, [solicitacoes]);

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

  const filtered = solicitacoes.filter((s) =>
    s.tipoServico?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColors = (status) => {
    switch (status) {
      case "Pendente":
        return { bg: "#FFF3CD", text: "#856404" }; // amarelo pastel + texto escuro
      case "Aceito":
        return { bg: "#C7E5CD", text: "#1B4D3E" }; // verde pastel + texto escuro
      case "Recusado":
        return { bg: "#F8D7DA", text: "#721C24" }; // vermelho pastel + texto escuro
      default:
        return { bg: "#E2E3E5", text: "#6C757D" }; // cinza pastel + texto escuro
    }
  };

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
              boxShadow: isExpanded
                ? "0 8px 25px rgba(0,0,0,0.15)"
                : "0 6px 20px rgba(0,0,0,0.08)",
            }}
            onClick={() => setExpandedId(isExpanded ? null : s._id)}
          >
            <div style={styles.header}>
              <span>
                {s.tipoServico} - <span style={{ fontStyle: "italic", fontWeight: "normal" }}>
                  {new Date(s.data_servico).toLocaleDateString()}
                </span>
              </span>
              <span style={styles.statusLabel(bg, text)}>{s.status}</span>
            </div>


            <div
              id={`expanded-${s._id}`}
              style={{
                ...styles.expanded,
                maxHeight: isExpanded ? heights[s._id] : 0,
                padding: isExpanded ? "16px 18px" : "0 18px",
              }}
            >
              <SolicitacaoDetalhes solicitacao={s} handleDelete={handleDelete} />
            </div>
          </div>
        );
      })}
    </div>
  );
}
