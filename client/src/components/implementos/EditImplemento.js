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

const btnSalvar = {
  backgroundColor: "#1c3d21",
  color: "#daf4d0",
  padding: "8px 10px",
  borderRadius: "5px",
  border: "none",
  cursor: "pointer",
  fontWeight: "500",
  fontSize: "1.1rem",
  width: "48%",
  marginTop: "10px",
  transition: "background-color 0.3s",
};

const btnCancelar = {
  backgroundColor: "#daf4d0",
  color: "#86a479",
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
};

export default function EditImplemento() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    tipo: "",
    marca: "",
    modelo: "",
    capacidade: "",
    status: "",
    n_serie: "",
    observacao: "",
  });

  const [focusField, setFocusField] = useState(null);

  useEffect(() => {
    fetch(`${API_URL}/implementos/${id}`)
      .then((res) => res.json())
      .then((data) => {
        // Ajusta o estado para carregar os dados, incluindo a foto_url
        setForm({
          tipo: data.tipo || "",
          marca: data.marca || "",
          modelo: data.modelo || "",
          capacidade: data.capacidade || "",
          status: data.status || "",
          n_serie: data.n_serie || "",
          observacao: data.observacao || "",
        });
      })
      .catch(() => alert("Erro ao carregar dados do implemento"));
  }, [id]);

  function updateForm(value) {
    setForm((prev) => ({ ...prev, ...value }));
  }

  async function onSubmit(e) {
    e.preventDefault();

    const formData = new FormData();
    formData.append("dados", JSON.stringify);

    try {
      const response = await fetch(`${API_URL}/implementos/update/${id}`, {
        method: "PATCH",  // método corrigido para PATCH
        body: formData,
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

        <label style={labelStyle}>Tipo</label>
        <input
          type="text"
          style={getInputStyle("tipo")}
          value={form.tipo}
          onChange={(e) => updateForm({ tipo: e.target.value })}
          onFocus={() => setFocusField("tipo")}
          onBlur={() => setFocusField(null)}
          required
        />

        <label style={labelStyle}>Marca</label>
        <input
          type="text"
          style={getInputStyle("marca")}
          value={form.marca}
          onChange={(e) => updateForm({ marca: e.target.value })}
          onFocus={() => setFocusField("marca")}
          onBlur={() => setFocusField(null)}
          required
        />

        <label style={labelStyle}>Modelo</label>
        <input
          type="text"
          style={getInputStyle("modelo")}
          value={form.modelo}
          onChange={(e) => updateForm({ modelo: e.target.value })}
          onFocus={() => setFocusField("modelo")}
          onBlur={() => setFocusField(null)}
        />

        <label style={labelStyle}>Capacidade</label>
        <input
          type="text"
          style={getInputStyle("capacidade")}
          value={form.capacidade}
          onChange={(e) => updateForm({ capacidade: e.target.value })}
          onFocus={() => setFocusField("capacidade")}
          onBlur={() => setFocusField(null)}
        />

        <label style={labelStyle}>Status</label>
        <input
          type="text"
          style={getInputStyle("status")}
          value={form.status}
          onChange={(e) => updateForm({ status: e.target.value })}
          onFocus={() => setFocusField("status")}
          onBlur={() => setFocusField(null)}
          required
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

      
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <button type="submit" style={btnSalvar}>
            Salvar
          </button>
          <button
            type="button"
            style={btnCancelar}
            onClick={() => navigate("/implementos")}
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}
