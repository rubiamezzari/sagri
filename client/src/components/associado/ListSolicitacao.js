import React, { useEffect, useState } from "react";
import DetalhesSolicitacao from "./DetalhesSolicitacao"; 

const containerStyle = {
  padding: "20px",
  backgroundColor: "#F0FAF7",
  minHeight: "100vh",
  maxWidth: "1800px",
  width: "100%",
  marginLeft: "auto",
  marginRight: "auto",
};

const searchStyle = {
  width: "100%",
  padding: "10px",
  borderRadius: "5px",
  border: "1px solid #ccc",
  outlineColor: "#1A381F",
  fontSize: "0.85rem",
  marginBottom: "15px",
};

const gridStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
  gap: "20px",
};

const cardStyle = {
  backgroundColor: "#fff",
  borderRadius: "8px",
  padding: "20px",
  boxShadow: "0 1px 3px rgba(25, 58, 30, 0.1)",
  transition: "transform 0.1s",
  cursor: "pointer",
};

const cardHoverStyle = {
  transform: "scale(1.03)",
  boxShadow: "0 2px 5px rgba(49, 71, 48, 0.19)",
};

const titleStyle = {
  marginBottom: "10px",
  fontWeight: "bold",
  fontSize: "1.3rem",
  color: "#1A381F",
};

const textStyle = {
  marginBottom: "6px",
  color: "#335533",
  fontSize: "1rem",
};

const API_URL = "http://localhost:5050";

export default function ListSolicitacao() {
  const [solicitacoes, setSolicitacoes] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [hoveredId, setHoveredId] = useState(null);
  const [solicitacaoSelecionada, setSolicitacaoSelecionada] = useState(null);
  const [mostrarModal, setMostrarModal] = useState(false);

  useEffect(() => {
    fetch(`${API_URL}/solicitacoes`)
      .then((res) => res.json())
      .then((data) => {
        setSolicitacoes(data);
      })
      .catch((err) => console.error("Erro ao buscar solicitações:", err));
  }, []);

  const filteredSolicitacoes = solicitacoes.filter((s) =>
    s.titulo?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const abrirDetalhes = (solicitacao) => {
    setSolicitacaoSelecionada(solicitacao);
    setMostrarModal(true);
  };

  function handleDelete(idDeleted) {
    setSolicitacoes((old) => old.filter((s) => s._id !== idDeleted));
    setMostrarModal(false);
  }

  function handleUpdate(solicitacaoAtualizada) {
    setSolicitacoes((old) =>
      old.map((s) => (s._id === solicitacaoAtualizada._id ? solicitacaoAtualizada : s))
    );
    setMostrarModal(false);
  }

  return (
    <div style={containerStyle}>
      <input
        type="text"
        placeholder="Buscar solicitação..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        style={searchStyle}
      />

      <div style={gridStyle}>
        {filteredSolicitacoes.length === 0 && <p>Nenhuma solicitação encontrada.</p>}

        {filteredSolicitacoes.map((solicitacao) => (
          <div
            key={solicitacao._id}
            style={{
              ...cardStyle,
              ...(hoveredId === solicitacao._id ? cardHoverStyle : {}),
            }}
            onMouseEnter={() => setHoveredId(solicitacao._id)}
            onMouseLeave={() => setHoveredId(null)}
            onClick={() => abrirDetalhes(solicitacao)}
          >
            <h3 style={titleStyle}>{solicitacao.titulo || "Sem título"}</h3>

            <p style={textStyle}>
              <strong>Serviço:</strong> {solicitacao.servico_nome || "Não informado"}
            </p>

            <p style={textStyle}>
              <strong>Status:</strong> {solicitacao.status || "Pendente"}
            </p>

            {solicitacao.observacao && (
              <p style={textStyle}>
                <em>{solicitacao.observacao}</em>
              </p>
            )}
          </div>
        ))}
      </div>

      {mostrarModal && solicitacaoSelecionada && (
        <DetalhesSolicitacao
          solicitacao={solicitacaoSelecionada}
          onClose={() => setMostrarModal(false)}
          onDeleted={handleDelete}
          onUpdated={handleUpdate}
        />
      )}
    </div>
  );
}
