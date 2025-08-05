import React from "react";

export default function DetalhesSolicitacao({ solicitacao, onClose, onAtualizarStatus }) {
  if (!solicitacao) return null;

  return (
    <div style={overlayStyle}>
      <div style={modalStyle}>
        <h3 style={titulo}>Detalhes da Solicitação</h3>

        <p><strong>Data:</strong> {new Date(solicitacao.data_servico).toLocaleDateString()}</p>
        <p><strong>Hora:</strong> {solicitacao.hora}</p>
        <p><strong>Tipo de Serviço:</strong> {solicitacao.tipoServico}</p>
        <p><strong>Tempo Estimado:</strong> {solicitacao.tempo_estimado}</p>
        <p><strong>Observação:</strong> {solicitacao.observacao || "Nenhuma"}</p>

        <div style={btnContainer}>
          <button style={btnAceitar} onClick={() => onAtualizarStatus(solicitacao._id, "Aceito")}>
            Aceitar
          </button>
          <button style={btnRecusar} onClick={() => onAtualizarStatus(solicitacao._id, "Recusado")}>
            Recusar
          </button>
          <button style={btnFechar} onClick={onClose}>
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
}

// --- Estilos
const overlayStyle = {
  position: "fixed",
  top: 0, left: 0, right: 0, bottom: 0,
  backgroundColor: "rgba(0,0,0,0.5)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  zIndex: 1000,
};

const modalStyle = {
  backgroundColor: "#fff",
  borderRadius: "10px",
  padding: "30px",
  maxWidth: "500px",
  width: "90%",
  boxShadow: "0 5px 15px rgba(0,0,0,0.2)",
};

const titulo = {
  marginBottom: "20px",
  color: "#1B4D3E",
  textAlign: "center",
};

const btnContainer = {
  display: "flex",
  justifyContent: "space-between",
  marginTop: "30px",
};

const btnAceitar = {
  backgroundColor: "#1B4D3E",
  color: "#fff",
  padding: "10px 20px",
  border: "none",
  borderRadius: "5px",
  cursor: "pointer",
};

const btnRecusar = {
  backgroundColor: "#b91c1c",
  color: "#fff",
  padding: "10px 20px",
  border: "none",
  borderRadius: "5px",
  cursor: "pointer",
};

const btnFechar = {
  backgroundColor: "#ccc",
  color: "#000",
  padding: "10px 20px",
  border: "none",
  borderRadius: "5px",
  cursor: "pointer",
};
