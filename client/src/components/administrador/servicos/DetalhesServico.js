import React, { useState, useEffect } from "react";
// Removendo o createPortal daqui se não for mais usado,
// ou garantindo que o target 'document.body' exista e esteja funcionando corretamente.
// Para manter a consistência com os outros modais que não usaram createPortal no exemplo anterior,
// vou remover por enquanto. Se precisar dele, me avise!

const API_URL = "http://localhost:5050";

// Estilos base para a nova abordagem (delicada)
const linha = {
  padding: "6px 0",
  display: "flex",
  gap: "8px",
  fontSize: "0.95rem",
  borderBottom: "1px solid #e0f2e0", // Cor mais suave
};

const campoLabel = {
  minWidth: "140px",
  fontWeight: "bold",
  color: "#386641", // Tonalidade mais suave de verde escuro
};

const tituloNome = {
  fontSize: "1.25rem",
  fontWeight: "bold",
  textTransform: "uppercase",
  paddingBottom: "10px",
  marginBottom: "16px", // Espaçamento mais coeso
  borderBottom: "2px solid #a8e0a8", // Borda mais suave
  color: "#386641",
};

const closeBtnStyle = {
  position: "absolute",
  top: "12px",
  right: "12px",
  background: "none",
  border: "none",
  fontSize: "1.4rem",
  cursor: "pointer",
  color: "#666", // Cor mais suave
};

const boxStyle = {
  backgroundColor: "#fff",
  padding: "28px", // Um pouco mais de padding
  borderRadius: "16px", // Cantos mais arredondados
  width: "580px", // Um pouco mais largo
  maxWidth: "95%",
  boxShadow: "0 10px 30px rgba(0,0,0,0.1)", // Sombra mais sutil
  fontFamily: "'Segoe UI', sans-serif",
  maxHeight: "85vh",
  overflowY: "auto",
  position: "relative",
};

const modalStyle = {
  position: "fixed",
  top: 0,
  left: 0,
  width: "100vw",
  height: "100vh",
  backgroundColor: "rgba(0, 0, 0, 0.3)", // Fundo do modal mais transparente
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  zIndex: 1000,
};

// Estilos de botões arredondados e delicados
const btnBase = {
  padding: "8px 18px",
  borderRadius: "20px", // Cantos bem arredondados para um visual suave
  fontWeight: 500, // Menos bold
  fontSize: "0.9rem",
  border: "1px solid #99c9a0", // Borda sutil
  cursor: "pointer",
  transition: "all 0.2s ease",
  marginLeft: "10px", // Espaçamento entre botões
};

const btnEditar = {
  ...btnBase,
  backgroundColor: "#e6f4ea", // Fundo mais claro
  color: "#386641", // Texto verde escuro
  "&:hover": {
    backgroundColor: "#d9eadd", // Um pouco mais escuro no hover
  },
};

const btnSalvar = {
  ...btnBase,
  backgroundColor: "#5cb85c", // Verde vibrante para salvar
  color: "#fff", // Texto branco
  border: "none",
  "&:hover": {
    backgroundColor: "#4CAF50", // Um pouco mais escuro no hover
  },
};

const btnExcluir = {
  ...btnBase,
  backgroundColor: "transparent", // Fundo transparente para Excluir
  color: "#88a88c", // Texto cinza esverdeado
  border: "1px solid #d0e7d3", // Borda mais clara
  "&:hover": {
    backgroundColor: "#f2fcf3", // Um leve fundo no hover
    color: "#c24747", // Uma cor de alerta suave no hover
  },
};

const inputStyle = {
  width: "100%",
  padding: "10px 12px", // Mais padding
  marginBottom: "15px", // Mais espaço abaixo
  borderRadius: "8px", // Cantos mais arredondados
  border: "1px solid #d4e3d6", // Borda mais clara
  fontSize: "0.95rem",
  outline: "none", // Remove o contorno padrão
  transition: "border-color 0.2s",
  "&:focus": {
    borderColor: "#5cb85c", // Borda verde no foco
  },
};

const labelStyle = {
  fontWeight: "600",
  fontSize: "0.9rem",
  marginBottom: "6px",
  color: "#386641", // Tonalidade mais suave
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
            <>
              <button
                style={{ ...btnExcluir, marginRight: "10px" }} // Adicionando "Cancelar"
                onClick={() => setModoEdicao(false)}
                type="button"
              >
                Cancelar
              </button>
              <button style={btnSalvar} onClick={handleSalvar} type="button">
                Salvar
              </button>
            </>
          ) : (
            <>
              <button style={btnEditar} onClick={() => setModoEdicao(true)} type="button">
                Editar
              </button>
              <button style={btnExcluir} onClick={handleExcluir} type="button">
                Excluir
              </button>
            </>
          )}
        </div>
      </div>
    </div>
 
  );
}