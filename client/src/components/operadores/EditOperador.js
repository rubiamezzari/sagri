import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

const API_URL = "http://localhost:5050";

const containerStyle = {
  maxWidth: "700px",
  margin: "40px auto",
  padding: "30px",
  backgroundColor: "#ffffff",
  borderRadius: "5px",
};

const labelStyle = {
  fontWeight: "600",
  fontSize: "0.85rem",
  marginBottom: "6px",
  display: "block",
};

const inputStyle = {
  width: "100%",
  padding: "8px",
  borderRadius: "4px",
  border: "1px solid #ccc",
  fontSize: "0.95rem",
  boxSizing: "border-box",
};

const btnSalvarStyle = (hover) => ({
  backgroundColor: hover ? "#143018" : "#1c3d21",
  color: "#fff",
  padding: "8px 20px",
  borderRadius: "4px",
  border: "none",
  fontWeight: "500",
  cursor: "pointer",
  transition: "background-color 0.3s",
  flex: 1,
});

const btnCancelarStyle = (hover) => ({
  backgroundColor: hover ? "#d6d6d6" : "#eaeaea",
  color: "#444",
  padding: "8px 20px",
  borderRadius: "4px",
  border: "1px solid #ccc",
  fontWeight: "500",
  cursor: "pointer",
  transition: "background-color 0.3s",
  flex: 1,
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
        <h2 style={{ textAlign: "center", marginBottom: "20px" }}>
          Editar Operador
        </h2>

        {["nome", "email", "telefone", "cpf"].map((field) => (
          <div key={field} style={{ marginBottom: "16px" }}>
            <label style={labelStyle}>
              {field.charAt(0).toUpperCase() + field.slice(1)}:
            </label>
            <input
              type="text"
              value={form[field]}
              onChange={(e) => updateForm({ [field]: e.target.value })}
              required
              style={inputStyle}
            />
          </div>
        ))}

        <div
          style={{
            marginTop: "20px",
            display: "flex",
            gap: "10px",
          }}
        >
          <button
            type="submit"
            style={btnSalvarStyle(hoverSalvar)}
            onMouseEnter={() => setHoverSalvar(true)}
            onMouseLeave={() => setHoverSalvar(false)}
          >
            Salvar
          </button>

          <button
            type="button"
            onClick={() => navigate("/operadores")}
            style={btnCancelarStyle(hoverCancelar)}
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
