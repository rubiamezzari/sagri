import React, { useState, useEffect } from "react";

const API_URL = "http://localhost:5050";

const linha = {
  padding: "6px 0",
  display: "flex",
  gap: "8px",
  fontSize: "0.95rem",
  borderBottom: "1px solid #d5ecd0",
};

const campoLabel = {
  minWidth: "140px",
  fontWeight: "bold",
  color: "#1a3c1a",
};

const tituloNome = {
  fontSize: "1.25rem",
  fontWeight: "bold",
  textTransform: "uppercase",
  paddingBottom: "10px",
  marginBottom: "20px",
  borderBottom: "2px solid #a5d6a7",
  color: "#1a3c1a",
};

const btnBase = {
  padding: "4px 22px",
  borderRadius: "5px",
  fontWeight: "600",
  fontSize: "1rem",
  border: "none",
  cursor: "pointer",
  transition: "all 0.3s ease",
  marginRight: "15px",
  color: "#fff",
};

const btnEditar = {
  ...btnBase,
  backgroundColor: "#1B4D3E",
  color: "#D2EFE6",
};

const btnSalvar = {
  ...btnBase,
  backgroundColor: "#1B4D3E",
  color: "#D2EFE6",
};

const btnExcluir = {
  ...btnBase,
  backgroundColor: "#D2EFE6",
  color: "#1B4D3E",
};

const closeBtnStyle = {
  position: "absolute",
  top: "15px",
  right: "15px",
  background: "none",
  border: "none",
  fontSize: "1.5rem",
  cursor: "pointer",
  color: "#555",
};

const boxStyle = {
  backgroundColor: "#fff",
  padding: "30px",
  borderRadius: "8px",
  width: "500px",
  maxWidth: "90%",
  boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
  fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  maxHeight: "80vh",
  overflowY: "auto",
  position: "relative",
};

const modalStyle = {
  position: "fixed",
  top: 0,
  left: 0,
  width: "100vw",
  height: "100vh",
  backgroundColor: "rgba(0, 0, 0, 0.4)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  zIndex: 1000,
};

const inputStyle = {
  width: "100%",
  padding: "8px 10px",
  marginBottom: "12px",
  borderRadius: "3px",
  border: "1px solid #ccc",
  fontSize: "1rem",
};

const labelStyle = {
  fontWeight: "600",
  fontSize: "0.9rem",
  marginBottom: "6px",
  color: "#1a3c1a",
  display: "block",
};

export default function DetalhesServicoModal({ servico, onClose, onDeleted }) {
  const [modoEdicao, setModoEdicao] = useState(false);
  const [form, setForm] = useState({ ...servico });

  useEffect(() => {
    setForm({ ...servico });
    setModoEdicao(false);
  }, [servico]);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSalvar() {
    if (!servico || !servico._id) {
      alert("Erro: ID do serviço não encontrado.");
      return;
    }

    const dadosParaAtualizar = { ...form };
    delete dadosParaAtualizar._id;

    try {
      const response = await fetch(`${API_URL}/servicos/update/${servico._id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dadosParaAtualizar),
      });

      if (response.ok) {
        alert("Serviço atualizado com sucesso!");
        setModoEdicao(false);
        onClose();
      } else {
        const erroTexto = await response.text();
        alert(`Erro ao atualizar serviço. Status: ${response.status} - ${erroTexto}`);
      }
    } catch (error) {
      alert("Erro ao atualizar serviço: " + error.message);
    }
  }

  async function handleExcluir() {
    if (!window.confirm("Tem certeza que deseja excluir este serviço?")) return;

    try {
      const response = await fetch(`${API_URL}/servicos/${servico._id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        alert("Serviço excluído com sucesso!");
        onDeleted && onDeleted(servico._id);
        onClose();
      } else {
        alert("Erro ao excluir serviço.");
      }
    } catch (error) {
      alert("Erro ao excluir serviço: " + error.message);
    }
  }

  const renderContent = () => {
    if (modoEdicao) {
      return (
        <>
          <label style={labelStyle}>Nome do Serviço</label>
          <input
            style={inputStyle}
            name="nome"
            value={form.nome || ""}
            onChange={handleChange}
            type="text"
          />
          <label style={labelStyle}>Máquina</label>
          <input
            style={inputStyle}
            name="maquina_tipo"
            value={form.maquina_tipo || ""}
            onChange={handleChange}
            type="text"
          />
          <label style={labelStyle}>Implemento</label>
          <input
            style={inputStyle}
            name="implemento_tipo"
            value={form.implemento_tipo || ""}
            onChange={handleChange}
            type="text"
          />
          <label style={labelStyle}>Observação</label>
          <textarea
            style={{ ...inputStyle, height: "80px", resize: "vertical" }}
            name="observacao"
            value={form.observacao || ""}
            onChange={handleChange}
          />
        </>
      );
    } else {
      return (
        <>
          <div style={linha}>
            <div style={campoLabel}>Nome:</div>
            <div>{servico.nome || "-"}</div>
          </div>
          <div style={linha}>
            <div style={campoLabel}>Máquina:</div>
            <div>{servico.maquina_tipo || "-"}</div>
          </div>
          <div style={linha}>
            <div style={campoLabel}>Implemento:</div>
            <div>{servico.implemento_tipo || "-"}</div>
          </div>
          <div style={linha}>
            <div style={campoLabel}>Observação:</div>
            <div>{servico.observacao || "-"}</div>
          </div>
        </>
      );
    }
  };

  return (
    <div style={modalStyle} onClick={onClose}>
      <div style={boxStyle} onClick={(e) => e.stopPropagation()}>
        <button style={closeBtnStyle} onClick={onClose}>
          &times;
        </button>
        <h3 style={tituloNome}>
          {modoEdicao ? "Editar Serviço" : "Detalhes do Serviço"}
        </h3>

        {renderContent()}

        <div style={{ marginTop: "30px", textAlign: "right" }}>
          {modoEdicao ? (
            <button style={btnSalvar} onClick={handleSalvar} type="button">
              Salvar
            </button>
          ) : (
            <button style={btnEditar} onClick={() => setModoEdicao(true)} type="button">
              Editar
            </button>
          )}
          <button style={btnExcluir} onClick={handleExcluir} type="button">
            Excluir
          </button>
        </div>
      </div>
    </div>
  );
}
