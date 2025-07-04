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

const getBtnSalvarStyle = (hover) => ({
  backgroundColor: hover ? "#143018" : "#1A381F",
  color: "#daf4d0",
  padding: "8px 10px",
  borderRadius: "5px",
  border: "none",
  cursor: "pointer",
  fontWeight: "500",
  fontSize: "1.1rem",
  width: "30%",
  marginTop: "10px",
  transition: "background-color 0.3s",
});

const getBtnCancelarStyle = (hover) => ({
  backgroundColor: hover ? "#c2dbac" : "#daf4d0",
  color: "#86a479",
  padding: "8px 10px",
  borderRadius: "5px",
  border: "none",
  cursor: "pointer",
  fontWeight: "500",
  fontSize: "1.1rem",
  width: "30%",
  marginTop: "10px",
  marginLeft: "10px",
  transition: "background-color 0.3s",
});

export default function EditOperador() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    nome: "",
    email: "",
    telefone: "",
    cpf: "",
  });

  const [focusField, setFocusField] = useState(null);
  const [hoverSalvar, setHoverSalvar] = useState(false);
  const [hoverCancelar, setHoverCancelar] = useState(false);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch(`${API_URL}/operadores/${id}`);
        if (!response.ok) throw new Error();
        const operador = await response.json();
        const { usuario, ...resto } = operador;
        setForm(resto);
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
          ["email", "Email"],
          ["telefone", "Telefone"],
          ["cpf", "CPF"],
        ].map(([name, label]) => (
          <div key={name}>
            <label style={labelStyle}>{label}</label>
            <input
              type="text"
              style={getInputStyle(name)}
              value={form[name]}
              onChange={(e) => updateForm({ [name]: e.target.value })}
              onFocus={() => setFocusField(name)}
              onBlur={() => setFocusField(null)}
              required
            />
          </div>
        ))}

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
            onClick={() => navigate("/operadores")}
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
