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

const inputFocus = {
  borderColor: "#e8e8e8",
  outline: "none",
};

const btnStyle = {
  backgroundColor: "#1c3d21",
  color: "#daf4d0",
  padding: "8px 10px",
  borderRadius: "5px",
  border: "none",
  cursor: "pointer",
  fontWeight: "500",
  fontSize: "1.1rem",
  width: "30%",
  marginTop: "10px",
};

export default function EditOperador() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    nome: "",
    cpf: "",
    telefone: "",
    categoria_cnh: "",
    status: "",
    observacao: "",
  });

  const [focusField, setFocusField] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch(`${API_URL}/operadores/${id}`);
        if (!response.ok) throw new Error();
        const operador = await response.json();
        setForm(operador);
      } catch {
        alert("Erro ao buscar operador.");
        navigate("/operadores");
      }
    }

    fetchData();
  }, [id, navigate]);

  function updateForm(value) {
    setForm((prev) => ({ ...prev, ...value }));
  }

  function getInputStyle(name) {
    return focusField === name ? { ...inputStyle, ...inputFocus } : inputStyle;
  }

  async function onSubmit(e) {
    e.preventDefault();
    try {
      const response = await fetch(`${API_URL}/operadores/update/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!response.ok) throw new Error();

      alert("Operador atualizado com sucesso!");
      navigate("/operadores");
    } catch {
      alert("Erro ao atualizar operador.");
    }
  }

  return (
    <div style={containerStyle}>
      <form onSubmit={onSubmit}>
        <h5 style={sectionTitle}>DADOS DO OPERADOR</h5>

        {[
          ["nome", "Nome"],
          ["cpf", "CPF"],
          ["telefone", "Telefone"],
          ["categoria_cnh", "Categoria CNH"],
        ].map(([name, label]) => (
          <div key={name}>
            <label style={labelStyle}>{label}</label>
            <input
              type="text"
              name={name}
              style={getInputStyle(name)}
              value={form[name]}
              onChange={(e) => updateForm({ [name]: e.target.value })}
              onFocus={() => setFocusField(name)}
              onBlur={() => setFocusField(null)}
              required
            />
          </div>
        ))}

        <div>
          <label style={labelStyle}>Status</label>
          <select
            name="status"
            style={getInputStyle("status")}
            value={form.status}
            onChange={(e) => updateForm({ status: e.target.value })}
            onFocus={() => setFocusField("status")}
            onBlur={() => setFocusField(null)}
            required
          >
            <option value="">Selecione o status</option>
            <option value="ativo">Ativo</option>
            <option value="inativo">Inativo</option>
          </select>
        </div>

        <div>
          <label style={labelStyle}>Observações</label>
          <textarea
            name="observacao"
            style={{ ...getInputStyle("observacao"), height: "80px", resize: "vertical" }}
            value={form.observacao}
            onChange={(e) => updateForm({ observacao: e.target.value })}
            onFocus={() => setFocusField("observacao")}
            onBlur={() => setFocusField(null)}
          />
        </div>

        <button type="submit" style={btnStyle}>Salvar</button>
        <button
          type="button"
          onClick={() => navigate("/operadores")}
          style={{ ...btnStyle, backgroundColor: "#daf4d0", marginLeft: "10px", color: "#86a479" }}
        >
          Cancelar
        </button>
      </form>
    </div>
  );
}
