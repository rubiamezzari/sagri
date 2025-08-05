import React, { useState, useEffect } from "react";

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
color: "#D2EFE6"
};

const btnSalvar = {
  ...btnBase,
  backgroundColor: "#1B4D3E",
  color: "#D2EFE6"
};

const btnExcluir = {
  ...btnBase,
  backgroundColor: "#F9DCDE",
  color: "#721C24"
};

const btnFechar = {
  ...btnBase,
  backgroundColor: "#D2EFE6",
  color:"#1B4D3E",
};

const boxStyle = {
  backgroundColor: "#fff",
  padding: "30px",
  borderRadius: "8px",
  width: "500px",
  maxWidth: "90%",
  boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
  fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
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
  borderRadius: "5px",
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

export default function DetalhesServicoModal({ servico, onClose, onEditar, onExcluir }) {
  const [modoEdicao, setModoEdicao] = useState(false);
  const [form, setForm] = useState({ ...servico });

  useEffect(() => {
    setForm({ ...servico });
  }, [servico]);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  function handleEditar() {
    onEditar(form);
    setModoEdicao(false);
  }

  function handleExcluir() {
    if (window.confirm("Tem certeza que deseja excluir este serviço?")) {
      onExcluir(servico._id);
    }
  }

  return (
    <div style={modalStyle}>
      <div style={boxStyle}>
        <h3 style={tituloNome}>
          {modoEdicao ? "Editar Serviço" : "Detalhes do Serviço"}
        </h3>

        {modoEdicao ? (
          <>
            <label style={labelStyle}>Nome do serviço</label>
            <input
              type="text"
              name="nome"
              value={form.nome}
              onChange={handleChange}
              style={inputStyle}
            />

            <label style={labelStyle}>Máquina</label>
            <input
              type="text"
              name="maquina_tipo"
              value={form.maquina_tipo}
              onChange={handleChange}
              style={inputStyle}
            />

            <label style={labelStyle}>Implemento</label>
            <input
              type="text"
              name="implemento_tipo"
              value={form.implemento_tipo}
              onChange={handleChange}
              style={inputStyle}
            />

            <label style={labelStyle}>Observação</label>
            <textarea
              name="observacao"
              value={form.observacao}
              onChange={handleChange}
              style={{ ...inputStyle, height: "80px", resize: "vertical" }}
            />
          </>
        ) : (
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
        )}

        <div style={{ marginTop: "30px", textAlign: "right" }}>
          <button
            style={btnFechar}
            onClick={onClose}
            type="button"
          >
            Fechar
          </button>

          {modoEdicao ? (
            <button
              style={btnSalvar}
              onClick={handleEditar}
              type="button"
            >
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

          <button
            style={btnExcluir}
            onClick={handleExcluir}
            type="button"
          >
            Excluir
          </button>
        </div>
      </div>
    </div>
  );
}
