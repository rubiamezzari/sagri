import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const REACT_APP_YOUR_HOSTNAME = "http://localhost:5050";

// Estilos mantidos do componente DetalhesMaquina
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


// Estilos originais do componente CreateMaquina
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
};

const inputFocus = {
  borderColor: "#e8e8e8",
  outline: "none",
};

export default function CreateMaquina() {
  const [form, setForm] = useState({
    tipo: "",
    marca: "",
    modelo: "",
    potencia: "",
    n_serie: "",
    observacao: "",
  });

  const [tipos, setTipos] = useState([]);
  const [marcas, setMarcas] = useState([]);
  const [focusField, setFocusField] = useState(null);
  const navigate = useNavigate();

  // Carrega tipos e marcas do backend
  useEffect(() => {
    fetch(`${REACT_APP_YOUR_HOSTNAME}/tipos?categoria=maquina`)
      .then((res) => res.json())
      .then((data) => setTipos(data))
      .catch(console.error);

    fetch(`${REACT_APP_YOUR_HOSTNAME}/marcas`)
      .then((res) => res.json())
      .then((data) => setMarcas(data))
      .catch(console.error);
  }, []);

  function updateForm(value) {
    setForm((prev) => ({ ...prev, ...value }));
  }

  function getInputStyle(name) {
    return focusField === name ? { ...inputStyle, ...inputFocus } : inputStyle;
  }

  async function onSubmit(e) {
    e.preventDefault();
    try {
      const response = await fetch(`${REACT_APP_YOUR_HOSTNAME}/maquinas/create`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!response.ok) {
        const errorText = await response.text();
        alert("Erro ao cadastrar máquina: " + errorText);
        return;
      }

      const data = await response.json();
      alert(data.message || "Máquina cadastrada com sucesso!");
      setForm({ tipo: "", marca: "", modelo: "", potencia: "", n_serie: "", observacao: "" });
      navigate("/maquinas"); // Alterado para navegação padrão
    } catch (error) {
      alert("Erro na comunicação com o servidor.");
      console.error(error);
    }
  }

  return (
    <div style={containerStyle}>
      <form onSubmit={onSubmit}>
        <h5 style={sectionTitle}>DADOS DA MÁQUINA</h5>

        {/* Tipo */}
        <label style={labelStyle}>Tipo</label>
        <select
          style={getInputStyle("tipo")}
          value={form.tipo}
          onChange={(e) => updateForm({ tipo: e.target.value })}
          onFocus={() => setFocusField("tipo")}
          onBlur={() => setFocusField(null)}
          required
        >
          <option value="">Selecione um tipo</option>
          {tipos.map((t) => (
            <option key={t._id} value={t.tipo}>{t.tipo}</option>
          ))}
        </select>

        {/* Marca */}
        <label style={labelStyle}>Marca</label>
        <select
          style={getInputStyle("marca")}
          value={form.marca}
          onChange={(e) => updateForm({ marca: e.target.value })}
          onFocus={() => setFocusField("marca")}
          onBlur={() => setFocusField(null)}
          required
        >
          <option value="">Selecione uma marca</option>
          {marcas.map((m) => (
            <option key={m._id} value={m.nome}>{m.nome}</option>
          ))}
        </select>

        {/* Outros campos */}
        <label style={labelStyle}>Modelo</label>
        <input
          type="text"
          style={getInputStyle("modelo")}
          value={form.modelo}
          onChange={(e) => updateForm({ modelo: e.target.value })}
          onFocus={() => setFocusField("modelo")}
          onBlur={() => setFocusField(null)}
        />

        <label style={labelStyle}>Potência</label>
        <input
          type="text"
          style={getInputStyle("potencia")}
          value={form.potencia}
          onChange={(e) => updateForm({ potencia: e.target.value })}
          onFocus={() => setFocusField("potencia")}
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

        <div style={{ marginTop: "30px", textAlign: "right" }}>
          <button
            type="button"
            style={{ ...btnExcluir, marginRight: "10px" }} // Reutilizando o estilo btnExcluir para o botão Cancelar
            onClick={() => navigate("/maquinas")}
          >
            Cancelar
          </button>
          <button
            type="submit"
            style={btnSalvar} // Reutilizando o estilo btnSalvar para o botão Cadastrar
          >
            Cadastrar
          </button>
        </div>
      </form>
    </div>
  );
}