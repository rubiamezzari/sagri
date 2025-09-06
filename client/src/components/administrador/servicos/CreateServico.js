import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const API_URL = "http://localhost:5050";

// Estilos base para os botões (mantidos dos componentes anteriores)
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

const btnSalvar = {
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
  padding: "8px 10px",
  marginBottom: "10px",
  borderRadius: "5px",
  border: "1px solid #e8e8e8",
  fontSize: "1rem",
  boxSizing: "border-box",
  transition: "border-color 0.3s",
};

const inputFocus = {
  borderColor: "#1c3d21",
  outline: "none",
};

export default function CreateServico() {
  const [form, setForm] = useState({
    nome: "",
    maquina_tipo: "",
    implemento_tipo: "",
    observacao: "",
  });

  const [tiposMaquina, setTiposMaquina] = useState([]);
  const [tiposImplemento, setTiposImplemento] = useState([]);
  const [focusField, setFocusField] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`${API_URL}/maquinas`)
      .then((res) => res.json())
      .then((data) => {
        const tiposUnicos = [...new Set(data.map((m) => m.tipo))];
        setTiposMaquina(tiposUnicos);
      });

    fetch(`${API_URL}/implementos`)
      .then((res) => res.json())
      .then((data) => {
        const tiposUnicos = [...new Set(data.map((i) => i.tipo))];
        setTiposImplemento(tiposUnicos);
      });
  }, []);

  async function onSubmit(e) {
    e.preventDefault();

    try {
      const response = await fetch(`${API_URL}/servicos/create`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!response.ok) {
        const errorText = await response.text();
        alert("Erro ao cadastrar serviço: " + errorText);
        return;
      }

      alert("Serviço cadastrado com sucesso!");
      navigate("/servicos", { replace: true });
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
        <h5 style={sectionTitle}>DADOS DO SERVIÇO</h5>

        <label style={labelStyle} htmlFor="nome">Nome do Serviço</label>
        <input
          id="nome"
          type="text"
          style={getInputStyle("nome")}
          value={form.nome}
          onChange={(e) => setForm({ ...form, nome: e.target.value })}
          onFocus={() => setFocusField("nome")}
          onBlur={() => setFocusField(null)}
          required
        />

        <label style={labelStyle}>Tipo de Máquina</label>
        <select
          style={getInputStyle("maquina_tipo")}
          value={form.maquina_tipo}
          onChange={(e) => setForm({ ...form, maquina_tipo: e.target.value })}
          onFocus={() => setFocusField("maquina_tipo")}
          onBlur={() => setFocusField(null)}
          required
        >
          <option value="">Selecione...</option>
          {tiposMaquina.map((tipo, index) => (
            <option key={index} value={tipo}>{tipo}</option>
          ))}
        </select>

        <label style={labelStyle}>Tipo de Implemento</label>
        <select
          style={getInputStyle("implemento_tipo")}
          value={form.implemento_tipo}
          onChange={(e) => setForm({ ...form, implemento_tipo: e.target.value })}
          onFocus={() => setFocusField("implemento_tipo")}
          onBlur={() => setFocusField(null)}
          required
        >
          <option value="">Selecione...</option>
          {tiposImplemento.map((tipo, index) => (
            <option key={index} value={tipo}>{tipo}</option>
          ))}
        </select>

        <label style={labelStyle} htmlFor="observacao">Observação</label>
        <textarea
          id="observacao"
          style={{ ...getInputStyle("observacao"), height: "80px", resize: "none" }}
          value={form.observacao}
          onChange={(e) => setForm({ ...form, observacao: e.target.value })}
          onFocus={() => setFocusField("observacao")}
          onBlur={() => setFocusField(null)}
        />

        <div style={{ marginTop: "30px", textAlign: "right", display: "flex", justifyContent: "flex-end", gap: "10px" }}>
          <button
            type="button"
            style={btnExcluir}
            onClick={() => navigate("/servicos")}
          >
            Cancelar
          </button>
          <button
            type="submit"
            style={btnSalvar}
          >
            Enviar
          </button>
        </div>
      </form>
    </div>
  );
}