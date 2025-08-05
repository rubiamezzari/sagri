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
  maxWidth: "100%",
};

const inputFocus = {
  borderColor: "#e8e8e8",
  outline: "none",
};

const getBtnSalvarStyle = (hover) => ({
  backgroundColor: hover ? "#143018" : "#1A381F",
  color: "#D2EFE6",
  padding: "8px 10px",
  borderRadius: "5px",
  border: "none",
  cursor: "pointer",
  fontWeight: "500",
  fontSize: "1.1rem",
  width: "48%",
  marginTop: "10px",
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
  width: "48%",
  marginTop: "10px",
  marginLeft: "4%",
  transition: "background-color 0.3s",
});

export default function EditImplemento() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    tipo: "",
    marca: "",
    modelo: "",
    capacidade: "",
    n_serie: "",
    observacao: "",
  });

  const [focusField, setFocusField] = useState(null);
  const [hoverSalvar, setHoverSalvar] = useState(false);
  const [hoverCancelar, setHoverCancelar] = useState(false);

  useEffect(() => {
    fetch(`${API_URL}/implementos/${id}`)
      .then((res) => res.json())
      .then((data) => {
        const { status, ...semStatus } = data;
        setForm({
          tipo: semStatus.tipo || "",
          marca: semStatus.marca || "",
          modelo: semStatus.modelo || "",
          capacidade: semStatus.capacidade || "",
          n_serie: semStatus.n_serie || "",
          observacao: semStatus.observacao || "",
        });
      })
      .catch(() => alert("Erro ao carregar dados do implemento"));
  }, [id]);

  function updateForm(value) {
    setForm((prev) => ({ ...prev, ...value }));
  }

  async function onSubmit(e) {
    e.preventDefault();

    try {
      const response = await fetch(`${API_URL}/implementos/update/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      if (!response.ok) {
        const errorText = await response.text();
        alert("Erro ao atualizar implemento: " + errorText);
        return;
      }

      const data = await response.json();
      alert(data.message || "Implemento atualizado com sucesso!");
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

        {[
          ["tipo", "Tipo"],
          ["marca", "Marca"],
          ["modelo", "Modelo"],
          ["capacidade", "Capacidade"],
          ["n_serie", "Número de Série"],
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
              required={name === "tipo" || name === "marca"} 
            />
          </div>
        ))}

        <label style={labelStyle}>Observação</label>
        <textarea
          style={{ ...getInputStyle("observacao"), height: "80px" }}
          value={form.observacao}
          onChange={(e) => updateForm({ observacao: e.target.value })}
          onFocus={() => setFocusField("observacao")}
          onBlur={() => setFocusField(null)}
        />

        <div style={{ display: "flex", justifyContent: "space-between" }}>
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
            onClick={() => navigate("/implementos")}
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
