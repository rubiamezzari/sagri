import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

const API_URL = "http://localhost:5050";

export default function EditOperador() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    nome: "",
    usuario: "",
    email: "",
    telefone: "",
    cpf: "",
  });

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
    <div style={{
      maxWidth: "700px",
      margin: "40px auto",
      padding: "30px",
      backgroundColor: "#ffffff",
      borderRadius: "5px"
    }}>
      <form onSubmit={onSubmit}>
        <h2 style={{ textAlign: "center", marginBottom: "20px" }}>Editar Operador</h2>

        {["nome", "usuario", "email", "telefone", "cpf"].map((field) => (
          <div key={field} style={{ marginBottom: "16px" }}>
            <label style={{ fontWeight: "600", fontSize: "0.85rem" }}>
              {field.charAt(0).toUpperCase() + field.slice(1)}:
            </label>
            <input
              type="text"
              value={form[field]}
              onChange={(e) => updateForm({ [field]: e.target.value })}
              required
              style={{
                width: "100%",
                padding: "8px",
                borderRadius: "4px",
                border: "1px solid #ccc",
                fontSize: "0.95rem",
              }}
            />
          </div>
        ))}

        <div style={{ marginTop: "20px", display: "flex", gap: "10px" }}>
          <button type="submit" style={{
            backgroundColor: "#1c3d21",
            color: "#fff",
            padding: "8px 20px",
            borderRadius: "4px",
            border: "none",
            fontWeight: "500",
            cursor: "pointer",
          }}>
            Salvar
          </button>

          <button type="button" onClick={() => navigate("/operadores")} style={{
            backgroundColor: "#eaeaea",
            color: "#444",
            padding: "8px 20px",
            borderRadius: "4px",
            border: "1px solid #ccc",
            fontWeight: "500",
            cursor: "pointer",
          }}>
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}
