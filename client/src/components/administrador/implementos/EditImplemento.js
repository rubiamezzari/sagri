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
  color: "#D2EFE6",
};

const btnSalvar = {
  ...btnBase,
  backgroundColor: "#1B4D3E",
  color: "#D2EFE6",
};

const btnExcluir = {
  ...btnBase,
  backgroundColor: "#F9DCDE",
  color: "#721C24",
};

const btnFechar = {
  ...btnBase,
  backgroundColor: "#D2EFE6",
  color: "#1B4D3E",
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

export default function DetalhesImplemento({ implemento, onClose, onDeleted }) {
  const [modoEdicao, setModoEdicao] = useState(false);
  const [form, setForm] = useState({ ...implemento });

  useEffect(() => {
    setForm({ ...implemento });
    setModoEdicao(false);
  }, [implemento]);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSalvar() {
    if (!implemento || !implemento._id) {
        alert("Erro: ID do implemento não encontrado.");
        return;
    }

    const dadosParaAtualizar = { ...form };
    delete dadosParaAtualizar._id;

    const formData = new FormData();
    formData.append("dados", JSON.stringify(dadosParaAtualizar));

    try {
      const response = await fetch(`http://localhost:5050/implementos/update/${implemento._id}`, {
        method: "PATCH",
        body: formData,
      });

      if (response.ok) {
        alert("Implemento atualizado com sucesso!");
        setModoEdicao(false);
        onClose();
      } else {
        const errorText = await response.text();
        alert(`Erro ao atualizar implemento. Status: ${response.status} - Mensagem: ${errorText}`);
      }
    } catch (error) {
      alert("Erro de rede ao atualizar implemento: " + error.message);
    }
  }

  async function handleExcluir() {
    if (!window.confirm("Tem certeza que deseja excluir este implemento?")) return;

    try {
      const response = await fetch(`http://localhost:5050/implementos/${implemento._id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        alert("Implemento excluído com sucesso!");
        onDeleted && onDeleted(implemento._id);
        onClose();
      } else {
        alert("Erro ao excluir implemento.");
      }
    } catch (error) {
      alert("Erro ao excluir implemento: " + error.message);
    }
  }

  const renderContent = () => {
    if (modoEdicao) {
      return (
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
          <label style={labelStyle}>Capacidade</label>
          <input
            style={inputStyle}
            name="capacidade"
            value={form.capacidade || ""}
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
          <label style={labelStyle}>Status</label>
          <input
            style={inputStyle}
            name="status"
            value={form.status || ""}
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
            <div style={campoLabel}>Número:</div>
            <div>{implemento.numero || "-"}</div>
          </div>
          <div style={linha}>
            <div style={campoLabel}>Tipo:</div>
            <div>{implemento.tipo || "-"}</div>
          </div>
          <div style={linha}>
            <div style={campoLabel}>Marca:</div>
            <div>{implemento.marca || "-"}</div>
          </div>
          <div style={linha}>
            <div style={campoLabel}>Modelo:</div>
            <div>{implemento.modelo || "-"}</div>
          </div>
          <div style={linha}>
            <div style={campoLabel}>Capacidade:</div>
            <div>{implemento.capacidade || "-"}</div>
          </div>
          <div style={linha}>
            <div style={campoLabel}>Número de Série:</div>
            <div>{implemento.n_serie || "-"}</div>
          </div>
          <div style={linha}>
            <div style={campoLabel}>Status:</div>
            <div>{implemento.status || "-"}</div>
          </div>
          {implemento.observacao && (
            <div style={{ marginTop: "25px" }}>
              <h4 style={{ fontSize: "1.05rem", color: "#1a3c1a" }}>Observações:</h4>
              <p>{implemento.observacao}</p>
            </div>
          )}
        </>
      );
    }
  };

  return (
    <div style={modalStyle} onClick={onClose}>
      <div style={boxStyle} onClick={(e) => e.stopPropagation()}>
        <h3 style={tituloNome}>
          {modoEdicao ? "Editar Implemento" : `${implemento.tipo} - ${implemento.marca} ${implemento.modelo}`}
        </h3>
        
        {renderContent()}

        <div style={{ marginTop: "30px", textAlign: "right" }}>
          <button style={btnFechar} onClick={onClose} type="button">
            Fechar
          </button>

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