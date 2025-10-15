import React, { useState, useEffect } from "react";


const linha = {
  padding: "6px 0",
  display: "flex",
  gap: "8px",
  fontSize: "0.95rem",
  borderBottom: "1px solid #e0f2e0", 
};

const campo = {
  minWidth: "140px",
  fontWeight: "bold",
  color: "#386641", 
};

const tituloNome = {
  fontSize: "1.25rem",
  fontWeight: "bold",
  textTransform: "uppercase",
  paddingBottom: "10px",
  marginBottom: "16px",
  borderBottom: "2px solid #a8e0a8", 
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
  color: "#666", // Cor mais suave para o X
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

const btnBase = {
  padding: "8px 18px",
  borderRadius: "20px",
  fontWeight: 500,
  fontSize: "0.9rem",
  border: "1px solid #99c9a0",
  cursor: "pointer",
  transition: "all 0.2s ease",
  marginLeft: "10px",
  textDecoration: "none", 
};

const btnEditar = {
  ...btnBase,
  backgroundColor: "#e6f4ea",
  color: "#386641",
};

const btnExcluir = {
  ...btnBase,
  backgroundColor: "transparent",
  color: "#88a88c",
  border: "1px solid #d0e7d3",
};

const btnSalvar = {
  ...btnBase,
 backgroundColor: "#e6f4ea",
  color: "#386641",
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

    const dadosParaEnviar = { ...form };
    delete dadosParaEnviar._id;

    const formData = new FormData();
    formData.append("dados", JSON.stringify(dadosParaEnviar));

    try {
      const response = await fetch(
        `http://localhost:5050/implementos/update/${implemento._id}`,
        {
          method: "PATCH",
          body: formData,
        }
      );

      if (response.ok) {
        alert("Implemento atualizado com sucesso!");
        setModoEdicao(false);
        onClose();
      } else {
        const errorText = await response.text();
        alert(
          `Erro ao atualizar implemento. Status: ${response.status} - Mensagem: ${errorText}`
        );
      }
    } catch (error) {
      alert("Erro de rede ao atualizar implemento: " + error.message);
    }
  }

  async function handleExcluir() {
    if (!window.confirm("Tem certeza que deseja excluir este implemento?"))
      return;

    try {
      const response = await fetch(
        `http://localhost:5050/implementos/${implemento._id}`,
        {
          method: "DELETE",
        }
      );

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
            <div style={campo}>Número:</div>
            <div>{implemento.numero || "-"}</div>
          </div>
          <div style={linha}>
            <div style={campo}>Tipo:</div>
            <div>{implemento.tipo || "-"}</div>
          </div>
          <div style={linha}>
            <div style={campo}>Marca:</div>
            <div>{implemento.marca || "-"}</div>
          </div>
          <div style={linha}>
            <div style={campo}>Modelo:</div>
            <div>{implemento.modelo || "-"}</div>
          </div>
          <div style={linha}>
            <div style={campo}>Capacidade:</div>
            <div>{implemento.capacidade || "-"}</div>
          </div>
          <div style={linha}>
            <div style={campo}>Número de Série:</div>
            <div>{implemento.n_serie || "-"}</div>
          </div>
          <div style={linha}>
            <div style={campo}>Status:</div>
            <div>{implemento.status || "-"}</div>
          </div>
          {implemento.observacao && (
            <div style={{ marginTop: "25px" }}>
              <h4 style={{ fontSize: "1.05rem", color: "#386641" }}>Observações:</h4>
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
        <button
          style={closeBtnStyle}
          onClick={onClose}
          type="button"
          aria-label="Fechar"
        >
          &times;
        </button>
        <h3 style={tituloNome}>
          {modoEdicao ? "Editar Implemento" : `${implemento.tipo} - ${implemento.marca} ${implemento.modelo}`}
        </h3>

        {renderContent()}

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