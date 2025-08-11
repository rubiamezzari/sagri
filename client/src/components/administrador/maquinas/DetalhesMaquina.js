import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";

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

    // Aqui você faria a chamada real à API para salvar
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
            : `${maquina.tipo} - ${maquina.marca} ${maquina.modelo}`}
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
                <h4 style={{ fontSize: "1.05rem", color: "#1a3c1a" }}>
                  Observações:
                </h4>
                <p>{maquina.observacao}</p>
              </div>
            )}
          </>
        )}

        <div style={{ marginTop: "30px", textAlign: "right" }}>
          {modoEdicao ? (
            <button style={btnSalvar} onClick={handleSalvar} type="button">
              Salvar
            </button>
          ) : (
            <button
              style={btnEditar}
              onClick={() => setModoEdicao(true)}
              type="button"
            >
              Editar
            </button>
          )}
          <button style={btnExcluir} onClick={handleExcluir} type="button">
            Excluir
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
