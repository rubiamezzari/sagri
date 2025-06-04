import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const REACT_APP_YOUR_HOSTNAME = "http://localhost:5050";

const containerStyle = {
  maxWidth: "800px",
  margin: "40px auto",
  padding: "30px 40px",
  backgroundColor: "#ffffff",
  borderRadius: "5px",
  textAlign: "center",
};

const sectionTitle = {
  color: "#100f0d",
  marginBottom: "16px",
  fontWeight: "500",
  fontSize: "1rem",
  borderBottom: "0.5px solid rgb(131, 148, 131)",
  paddingBottom: "6px",
};

const labelStyle = {
  display: "block",
  marginBottom: "6px",
  fontWeight: "600",
  color: "#100f0d",
  fontSize: "0.8rem",
  textAlign: "left",
};

const inputStyle = {
  width: "100%",
  padding: "5px 6px",
  marginBottom: "10px",
  borderRadius: "5px",
  border: "0.1px solid #e8e8e8",
  fontSize: "1rem",
  boxSizing: "border-box",
  transition: "border-color 0.3s",
  maxWidth: "100%",
};

const inputFocus = {
  borderColor: "#e8e8e8",
  outline: "none",
};

const getBtnCadastrarStyle = (hover) => ({
  backgroundColor: hover ? "#143018" : "#1c3d21",
  color: "#daf4d0",
  padding: "8px 10px",
  borderRadius: "5px",
  border: "none",
  cursor: "pointer",
  fontWeight: "500",
  fontSize: "1.1rem",
  width: "30%",
  transition: "background-color 0.3s",
});

const getBtnCancelarStyle = (hover) => ({
  backgroundColor: hover ? "#ccedbf" : "#daf4d0",
  color: "#86a479",
  padding: "8px 10px",
  borderRadius: "5px",
  border: "none",
  cursor: "pointer",
  fontWeight: "500",
  fontSize: "1.1rem",
  width: "30%",
  marginLeft: "20px",
  transition: "background-color 0.3s",
});

export default function CreateImplemento() {
  const [form, setForm] = useState({
    tipo: "",
    marca: "",
    modelo: "",
    capacidade: "",
    n_serie: "",
    observacao: "",
  });

  const [hoverCadastrar, setHoverCadastrar] = useState(false);
  const [hoverCancelar, setHoverCancelar] = useState(false);
  const [focusField, setFocusField] = useState(null);
  const navigate = useNavigate();

  function updateForm(value) {
    setForm((prev) => ({ ...prev, ...value }));
  }

  async function onSubmit(e) {
    e.preventDefault();

    const formData = new FormData()

    try {
      const response = await fetch(`${REACT_APP_YOUR_HOSTNAME}/implementos/create`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorText = await response.text();
        alert("Erro ao cadastrar implemento: " + errorText);
        return;
      }

      const data = await response.json();
      alert(data.message || "Implemento cadastrado com sucesso!");

      setForm({
        tipo: "",
        marca: "",
        modelo: "",
        capacidade: "",
        n_serie: "",
        observacao: "",
      });

      navigate("/implementos", { replace: true });

    } catch (error) {
      alert("Erro na comunicação com o servidor.");
    }
  }

  function getInputStyle(name) {
    return focusField === name ? { ...inputStyle, ...inputFocus } : inputStyle;
  }

  return (
    <div style={containerStyle}>
      <form onSubmit={onSubmit}>
        <h5 style={sectionTitle}>DADOS DO IMPLEMENTO</h5>

        <label style={labelStyle}>Tipo</label>
        <input
          type="text"
          style={getInputStyle("tipo")}
          value={form.tipo}
          onChange={(e) => updateForm({ tipo: e.target.value })}
          onFocus={() => setFocusField("tipo")}
          onBlur={() => setFocusField(null)}
          required
        />

        <label style={labelStyle}>Marca</label>
        <input
          type="text"
          style={getInputStyle("marca")}
          value={form.marca}
          onChange={(e) => updateForm({ marca: e.target.value })}
          onFocus={() => setFocusField("marca")}
          onBlur={() => setFocusField(null)}
          required
        />

        <label style={labelStyle}>Modelo</label>
        <input
          type="text"
          style={getInputStyle("modelo")}
          value={form.modelo}
          onChange={(e) => updateForm({ modelo: e.target.value })}
          onFocus={() => setFocusField("modelo")}
          onBlur={() => setFocusField(null)}
        />

        <label style={labelStyle}>Capacidade</label>
        <input
          type="text"
          style={getInputStyle("capacidade")}
          value={form.capacidade}
          onChange={(e) => updateForm({ capacidade: e.target.value })}
          onFocus={() => setFocusField("capacidade")}
          onBlur={() => setFocusField(null)}
        />


        <label style={labelStyle}>Número de Série</label>
        <input
          type="text"
          style={getInputStyle("n_serie")}
          value={form.n_serie}
          onChange={(e) => updateForm({ n_serie: e.target.value })}
          onFocus={() => setFocusField("n_serie")}
          onBlur={() => setFocusField(null)}
        />

        <label style={labelStyle}>Observação</label>
        <textarea
          style={{ ...getInputStyle("observacao"), height: "80px" }}
          value={form.observacao}
          onChange={(e) => updateForm({ observacao: e.target.value })}
          onFocus={() => setFocusField("observacao")}
          onBlur={() => setFocusField(null)}
        />

        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <button type="submit" style={getBtnCadastrarStyle(hoverCadastrar)}
            onMouseEnter={() => setHoverCadastrar(true)}
            onMouseLeave={() => setHoverCadastrar(false)}>
            Cadastrar
          </button>
          <button
            type="button"
            style={getBtnCancelarStyle(hoverCancelar)}
            onMouseEnter={() => setHoverCancelar(true)}
            onMouseLeave={() => setHoverCancelar(false)}
            onClick={() => navigate("/associados")}
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}
