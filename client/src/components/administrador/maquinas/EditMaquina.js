import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

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
};

const inputFocus = { borderColor: "#e8e8e8", outline: "none" };

const getBtnSalvarStyle = (hover) => ({
  padding: "8px 18px",
  borderRadius: "20px",
  fontWeight: 500,
  fontSize: "0.9rem",
  border: "1px solid #99c9a0",
  cursor: "pointer",
  transition: "all 0.2s ease",
  marginLeft: "10px",
  textDecoration: "none", 
  backgroundColor: "#e6f4ea",
  color: "#386641",
});



const getBtnCancelarStyle = (hover) => ({
  padding: "8px 18px",
  borderRadius: "20px",
  fontWeight: 500,
  fontSize: "0.9rem",
  border: "1px solid #99c9a0",
  cursor: "pointer",
  transition: "all 0.2s ease",
  marginLeft: "10px",
  textDecoration: "none", 
   backgroundColor: "#e6f4ea",
  color: "#386641",
});

export default function EditMaquina() {
  const [form, setForm] = useState(null);
  const [tipos, setTipos] = useState([]);
  const [marcas, setMarcas] = useState([]);
  const [focusField, setFocusField] = useState(null);
  const [hoverSalvar, setHoverSalvar] = useState(false);
  const [hoverCancelar, setHoverCancelar] = useState(false);

  const params = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchDados() {
      try {
        // 1️⃣ Busca tipos e marcas primeiro
        const [tiposRes, marcasRes] = await Promise.all([
          fetch(`${API_URL}/tipos?categoria=maquina`),
          fetch(`${API_URL}/marcas`),
        ]);
        const tiposData = await tiposRes.json();
        const marcasData = await marcasRes.json();
        setTipos(tiposData);
        setMarcas(marcasData);

        // 2️⃣ Busca a máquina
        const maquinaRes = await fetch(`${API_URL}/maquinas/${params.id}`);
        if (!maquinaRes.ok) throw new Error("Erro ao buscar máquina.");
        const maquinaData = await maquinaRes.json();

        // 3️⃣ Ajusta o form
        setForm({
          tipo: maquinaData.tipo || "",
          marca: maquinaData.marca || "",
          modelo: maquinaData.modelo || "",
          potencia: maquinaData.potencia || "",
          n_serie: maquinaData.n_serie || "",
          observacao: maquinaData.observacao || "",
        });

        // Debug: veja os valores
        console.log("Tipos:", tiposData);
        console.log("Marcas:", marcasData);
        console.log("Máquina:", maquinaData);

      } catch (err) {
        alert(err.message);
        navigate("/maquinas");
      }
    }

    fetchDados();
  }, [params.id, navigate]);

  // ⚠️ Aguarda carregamento de tudo
  if (!form || tipos.length === 0 || marcas.length === 0) {
    return <p>Carregando...</p>;
  }

  function updateForm(value) {
    setForm((prev) => ({ ...prev, ...value }));
  }

  function getInputStyle(name) {
    return focusField === name ? { ...inputStyle, ...inputFocus } : inputStyle;
  }

  async function onSubmit(e) {
    e.preventDefault();
    try {
      const response = await fetch(`${API_URL}/maquinas/update/${params.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!response.ok) throw new Error("Erro ao atualizar máquina.");

      alert("Máquina atualizada com sucesso!");
      navigate("/maquinas");
    } catch (err) {
      alert(err.message);
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
            <option key={t._id} value={t.tipo}>
              {t.tipo}
            </option>
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
            <option key={m._id} value={m.nome}>
              {m.nome}
            </option>
          ))}
        </select>

        {/* Modelo */}
        <label style={labelStyle}>Modelo</label>
        <input
          type="text"
          style={getInputStyle("modelo")}
          value={form.modelo}
          onChange={(e) => updateForm({ modelo: e.target.value })}
          onFocus={() => setFocusField("modelo")}
          onBlur={() => setFocusField(null)}
        />

        {/* Potência */}
        <label style={labelStyle}>Potência</label>
        <input
          type="text"
          style={getInputStyle("potencia")}
          value={form.potencia}
          onChange={(e) => updateForm({ potencia: e.target.value })}
          onFocus={() => setFocusField("potencia")}
          onBlur={() => setFocusField(null)}
        />

        {/* Número de Série */}
        <label style={labelStyle}>Número de Série</label>
        <input
          type="text"
          style={getInputStyle("n_serie")}
          value={form.n_serie}
          onChange={(e) => updateForm({ n_serie: e.target.value })}
          onFocus={() => setFocusField("n_serie")}
          onBlur={() => setFocusField(null)}
        />

        {/* Observação */}
        <label style={labelStyle}>Observação</label>
        <textarea
          style={{ ...getInputStyle("observacao"), height: "80px", resize: "vertical" }}
          value={form.observacao}
          onChange={(e) => updateForm({ observacao: e.target.value })}
          onFocus={() => setFocusField("observacao")}
          onBlur={() => setFocusField(null)}
        />

        {/* Botões */}
        <div style={{ display: "flex", justifyContent: "center", gap: "12px" }}>
          <button
            type="submit"
            style={getBtnSalvarStyle(hoverSalvar)}
            onMouseEnter={() => setHoverSalvar(true)}
            onMouseLeave={() => setHoverSalvar(false)}
          >
            Salvar
          </button>
          <button
            type="button"
            style={getBtnCancelarStyle(hoverCancelar)}
            onMouseEnter={() => setHoverCancelar(true)}
            onMouseLeave={() => setHoverCancelar(false)}
            onClick={() => navigate("/maquinas")}
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}
