import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

const API_URL = "http://localhost:5050";

export default function EditImplemento() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    tipo: "",
    marca: "",
    modelo: "",
    capacidade: "",
    status: "",
    foto: "",
    n_serie: "",
    observacao: ""
  });

  useEffect(() => {
    fetch(`${API_URL}/implementos/${id}`)
      .then((res) => res.json())
      .then((data) => setForm(data))
      .catch(() => alert("Erro ao carregar dados do implemento"));
  }, [id]);

  function updateForm(value) {
    setForm((prev) => ({ ...prev, ...value }));
  }

  async function onSubmit(e) {
    e.preventDefault();

    await fetch(`${API_URL}/implementos/update/${id}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    navigate("/implementos");
  }

  return (
    <div style={{ maxWidth: "800px", margin: "40px auto", padding: "30px", backgroundColor: "#fff", borderRadius: "5px" }}>
      <h3 style={{ textAlign: "center", marginBottom: "20px" }}>Editar Implemento</h3>
      <form onSubmit={onSubmit}>
        {Object.keys(form).map((field) => (
          <div key={field}>
            <label>{field.charAt(0).toUpperCase() + field.slice(1)}</label>
            <input
              type="text"
              value={form[field]}
              onChange={(e) => updateForm({ [field]: e.target.value })}
              style={{ width: "100%", padding: "8px", marginBottom: "10px" }}
            />
          </div>
        ))}
        <button type="submit" style={{ padding: "10px 15px", backgroundColor: "#1c3d21", color: "#fff", border: "none", borderRadius: "5px" }}>
          Salvar
        </button>
      </form>
    </div>
  );
}
