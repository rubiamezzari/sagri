import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";

// Estilos base para a nova abordagem
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

const btnBase = {
  padding: "8px 18px",
  borderRadius: "20px", // Cantos bem arredondados
  fontWeight: 500,
  fontSize: "0.9rem",
  border: "1px solid #99c9a0", // Borda sutil
  cursor: "pointer",
  transition: "all 0.2s ease",
  marginLeft: "10px", // Ajuste o espaçamento para a esquerda
};

const btnEditar = {
  ...btnBase,
  backgroundColor: "#e6f4ea", // Fundo claro
  color: "#386641", // Texto verde escuro
};

const btnSalvar = {
  ...btnBase,
  backgroundColor: "#5cb85c", // Verde vibrante para salvar
  color: "#fff", // Texto branco
  border: "none",
};

const btnExcluir = {
  ...btnBase,
  backgroundColor: "transparent", // Fundo transparente para Excluir
  color: "#88a88c", // Texto cinza esverdeado
  border: "1px solid #d0e7d3", // Borda mais clara
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
  fontFamily: "'segoe ui', sans-serif",
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

export default function DetalhesMaquina({ maquina, onClose, onDeleted, onUpdated }) {
  const [modoEdicao, setModoEdicao] = useState(false);
  const [form, setForm] = useState({ ...maquina });

  useEffect(() => {
    setForm({ ...maquina });
    setModoEdicao(false);
  }, [maquina]);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSalvar() {
    if (!maquina || !maquina._id) {
      alert("Erro: ID da máquina não encontrado.");
      return;
    }

    try {
      console.log("Salvar máquina (simulado):", form);
      alert("Máquina atualizada com sucesso!");

      onUpdated(form);
      setModoEdicao(false);
      onClose();
    } catch (error) {
      alert("Erro ao atualizar máquina: " + error.message);
    }
  }

  async function handleExcluir() {
    if (!window.confirm("Tem certeza que deseja excluir esta máquina?")) return;

    try {
      console.log("Excluir máquina (simulado) id:", maquina._id);
      alert("Máquina excluída com sucesso!");

      onDeleted(maquina._id);
      onClose();
    } catch (error) {
      alert("Erro ao excluir máquina: " + error.message);
    }
  }

  return createPortal(
    <div style={modalStyle} onClick={onClose}>
      <div style={boxStyle} onClick={(e) => e.stopPropagation()}>
        <button style={closeBtnStyle} onClick={onClose}>
          &times;
        </button>
        <h3 style={tituloNome}>
          {modoEdicao
            ? "Editar Máquina"
            : `${maquina.tipo || ""} - ${maquina.marca || ""} ${maquina.modelo || ""}`}
        </h3>

        {modoEdicao ? (
          <>
            <label style={labelStyle}>Tipo</label>
            <input
              style={inputStyle}
              name="tipo"
              value={form.tipo || ""}
              onChange={handleChange}
              type="text"
            />
            <label style={labelStyle}>Marca</label>
            <input
              style={inputStyle}
              name="marca"
              value={form.marca || ""}
              onChange={handleChange}
              type="text"
            />
            <label style={labelStyle}>Modelo</label>
            <input
              style={inputStyle}
              name="modelo"
              value={form.modelo || ""}
              onChange={handleChange}
              type="text"
            />
            <label style={labelStyle}>Potência</label>
            <input
              style={inputStyle}
              name="potencia"
              value={form.potencia || ""}
              onChange={handleChange}
              type="text"
            />
            <label style={labelStyle}>Número de Série</label>
            <input
              style={inputStyle}
              name="n_serie"
              value={form.n_serie || ""}
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
        ) : (
          <>
            <div style={linha}>
              <div style={campoLabel}>Tipo:</div>
              <div>{maquina.tipo || "-"}</div>
            </div>
            <div style={linha}>
              <div style={campoLabel}>Marca:</div>
              <div>{maquina.marca || "-"}</div>
            </div>
            <div style={linha}>
              <div style={campoLabel}>Modelo:</div>
              <div>{maquina.modelo || "-"}</div>
            </div>
            <div style={linha}>
              <div style={campoLabel}>Potência:</div>
              <div>{maquina.potencia || "-"}</div>
            </div>
            <div style={linha}>
              <div style={campoLabel}>Número de Série:</div>
              <div>{maquina.n_serie || "-"}</div>
            </div>
            {maquina.observacao?.trim() && (
              <div style={{ marginTop: "25px" }}>
                <h4 style={{ fontSize: "1.05rem", color: "#386641" }}>Observações:</h4>
                <p>{maquina.observacao}</p>
              </div>
            )}
          </>
        )}

        <div style={{ marginTop: "30px", textAlign: "right" }}>
          {modoEdicao ? (
            <>
              <button
                style={{ ...btnExcluir, marginRight: "10px" }}
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
              <button
                style={btnEditar}
                onClick={() => setModoEdicao(true)}
                type="button"
              >
                Editar
              </button>
              <button style={btnExcluir} onClick={handleExcluir} type="button">
                Excluir
              </button>
            </>
          )}
        </div>
      </div>
    </div>,
    document.body
  );
}