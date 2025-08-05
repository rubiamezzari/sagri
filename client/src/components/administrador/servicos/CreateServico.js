import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const API_URL = "http://localhost:5050";

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
  borderColor: "#1c3d21",
  outline: "none",
};

const getBtnCadastrarStyle = (hover) => ({
  backgroundColor: hover ? "#143018" : "#1c3d21",
  color: "#D2EFE6",
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
  backgroundColor: hover ? "#ccedbf" : "#D2EFE6",
  color: "#143018",
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

export default function CreateServico() {
  const [form, setForm] = useState({
    nome: "",
    maquina_tipo: "",
    implemento_tipo: "",
    observacao: "",
  });

  const [maquinas, setMaquinas] = useState([]);
  const [implementos, setImplementos] = useState([]);
  const [tiposMaquina, setTiposMaquina] = useState([]);
  const [tiposImplemento, setTiposImplemento] = useState([]);
  const [focusField, setFocusField] = useState(null);
  const [hoverCadastrar, setHoverCadastrar] = useState(false);
  const [hoverCancelar, setHoverCancelar] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`${API_URL}/maquinas`)
      .then((res) => res.json())
      .then((data) => {
        setMaquinas(data);
        const tiposUnicos = [...new Set(data.map((m) => m.tipo))];
        setTiposMaquina(tiposUnicos);
      });

    fetch(`${API_URL}/implementos`)
      .then((res) => res.json())
      .then((data) => {
        setImplementos(data);
        const tiposUnicos = [...new Set(data.map((i) => i.tipo))];
        setTiposImplemento(tiposUnicos);
      });
  }, []);

  function handleTipoMaquinaChange(e) {
    const tipo = e.target.value;
    setForm((prev) => ({ ...prev, maquina_tipo: tipo }));
  }

  function handleTipoImplementoChange(e) {
    const tipo = e.target.value;
    setForm((prev) => ({ ...prev, implemento_tipo: tipo }));
  }

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

        <div>
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
        </div>

        <div>
          <label style={labelStyle}>Tipo de Máquina</label>
          <select onChange={handleTipoMaquinaChange} required style={{ ...inputStyle }}>
            <option value="">Selecione...</option>
            {tiposMaquina.map((tipo, index) => (
              <option key={index} value={tipo}>{tipo}</option>
            ))}
          </select>
        </div>

        <div>
          <label style={labelStyle}>Tipo de Implemento</label>
          <select onChange={handleTipoImplementoChange} required style={{ ...inputStyle }}>
            <option value="">Selecione...</option>
            {tiposImplemento.map((tipo, index) => (
              <option key={index} value={tipo}>{tipo}</option>
            ))}
          </select>
        </div>

        <label style={labelStyle} htmlFor="observacao">Observação</label>
        <textarea
          id="observacao"
          style={{ ...getInputStyle("observacao"), height: "80px", resize: "none" }}
          value={form.observacao}
          onChange={(e) => setForm({ ...form, observacao: e.target.value })}
          onFocus={() => setFocusField("observacao")}
          onBlur={() => setFocusField(null)}
        />

        <div style={{ display: "flex", justifyContent: "center", marginTop: "20px" }}>
          <button
            type="submit"
            style={getBtnCadastrarStyle(hoverCadastrar)}
            onMouseEnter={() => setHoverCadastrar(true)}
            onMouseLeave={() => setHoverCadastrar(false)}
          >
            Cadastrar
          </button>
          <button
            type="button"
            onClick={() => navigate("/servicos")}
            style={getBtnCancelarStyle(hoverCancelar)}
            onMouseEnter={() => setHoverCancelar(true)}
            onMouseLeave={() => setHoverCancelar(false)}
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}
