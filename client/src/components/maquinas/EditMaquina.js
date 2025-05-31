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

const uploadContainerStyle = {
  backgroundColor: "#eeffe7",
  borderRadius: "8px",
  padding: "8px 10px",
  marginBottom: "10px",
  display: "flex",
  alignItems: "center",
  gap: "12px",
};

const uploadLabelStyle = {
  backgroundColor: "#ccedbf",
  padding: "6px 12px",
  borderRadius: "6px",
  cursor: "pointer",
  fontSize: "0.85rem",
  fontWeight: "500",
  color: "#1c3d21",
  whiteSpace: "nowrap",
};

export default function EditMaquina() {
  const [form, setForm] = useState({
    tipo: "",
    marca: "",
    modelo: "",
    potencia: "",
    status: "",
    n_serie: "",
    observacao: "",
    foto: null,
  });

  const [focusField, setFocusField] = useState(null);
  const params = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchData() {
      const response = await fetch(`${API_URL}/maquinas/${params.id}`);
      if (!response.ok) {
        alert("Erro ao buscar máquina.");
        navigate("/maquinas");
        return;
      }

      const maquina = await response.json();
      setForm(maquina);
    }

    fetchData();
  }, [params.id, navigate]);

  function updateForm(value) {
    setForm((prev) => ({ ...prev, ...value }));
  }

  function getInputStyle(name) {
    return focusField === name ? { ...inputStyle, ...inputFocus } : inputStyle;
  }

  async function onSubmit(e) {
    e.preventDefault();

    const formData = new FormData();
    const formCopy = { ...form, foto: null };
    formData.append("dados", JSON.stringify(formCopy));

    if (form.foto instanceof File) {
      formData.append("foto", form.foto);
    }

    try {
      const response = await fetch(`${API_URL}/maquinas/update/${params.id}`, {
        method: "PATCH",
        body: formData,
      });

      if (!response.ok) {
        alert("Erro ao atualizar máquina.");
        return;
      }

      alert("Máquina atualizada com sucesso!");
      navigate("/maquinas");
    } catch (err) {
      alert("Erro ao se comunicar com o servidor.");
    }
  }

  return (
    <div style={containerStyle}>
      <form onSubmit={onSubmit}>
        <h5 style={sectionTitle}>DADOS DA MÁQUINA</h5>

        {[
          ["tipo", "Tipo"],
          ["marca", "Marca"],
          ["modelo", "Modelo"],
          ["potencia", "Potência"],
          ["status", "Status"],
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
            />
          </div>
        ))}

        <label style={labelStyle}>Observações</label>
        <textarea
          style={{ ...getInputStyle("observacao"), height: "80px", resize: "vertical" }}
          value={form.observacao}
          onChange={(e) => updateForm({ observacao: e.target.value })}
          onFocus={() => setFocusField("observacao")}
          onBlur={() => setFocusField(null)}
        />

        <div style={uploadContainerStyle}>
          <label htmlFor="foto" style={uploadLabelStyle}>
            {form.foto instanceof File
              ? "Foto: " + form.foto.name
              : form.foto
              ? "Foto selecionada"
              : "Selecionar Foto"}
          </label>
          <input
            id="foto"
            type="file"
            accept="image/*"
            style={{ display: "none" }}
            onChange={(e) => updateForm({ foto: e.target.files[0] || null })}
          />
        </div>

        <button type="submit" style={btnStyle}>
          Salvar
        </button>
        <button
          type="button"
          onClick={() => navigate("/maquinas")}
          style={{ ...btnStyle, backgroundColor: "#daf4d0", marginLeft: "10px", color: "#86a479" }}
        >
          Cancelar
        </button>
      </form>
    </div>
  );
}
