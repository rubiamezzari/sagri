import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

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
  borderColor: "#1c3d21",
  outline: "none",
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

const getBtnCadastrarStyle = (hover) => ({
  backgroundColor: hover ? "#143018" : "#1c3d21",
  color: "#daf4d0",
  padding: "8px 10px",
  borderRadius: "5px",
  border: "none",
  cursor: "pointer",
  fontWeight: "500",
  fontSize: "1.1rem",
  width: "30%",
  transition: "background-color 0.3s",
});

const getBtnCancelarStyle = (hover) => ({
  backgroundColor: hover ? "#ccedbf" : "#daf4d0",
  color: "#86a479",
  padding: "8px 10px",
  borderRadius: "5px",
  border: "none",
  cursor: "pointer",
  fontWeight: "500",
  fontSize: "1.1rem",
  width: "30%",
  marginLeft: "20px",
  transition: "background-color 0.3s",
});

export default function CreateMaquina() {
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
  const [hoverCadastrar, setHoverCadastrar] = useState(false);
  const [hoverCancelar, setHoverCancelar] = useState(false);
  const navigate = useNavigate();

  function updateForm(value) {
    setForm((prev) => ({ ...prev, ...value }));
  }

  async function onSubmit(e) {
    e.preventDefault();

    const formData = new FormData();
    const formCopy = { ...form, foto: null };
    formData.append("dados", JSON.stringify(formCopy));
    if (form.foto) {
      formData.append("foto", form.foto);
    }

    try {
      const response = await fetch(`${API_URL}/maquinas/create`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorText = await response.text();
        alert("Erro ao cadastrar máquina: " + errorText);
        return;
      }

      alert("Máquina cadastrada com sucesso!");

      setForm({
        tipo: "",
        marca: "",
        modelo: "",
        potencia: "",
        status: "",
        n_serie: "",
        observacao: "",
        foto: null,
      });

      navigate("/maquinas", { replace: true });
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
        <h5 style={sectionTitle}>DADOS DA MÁQUINA</h5>

        {["tipo", "marca", "modelo", "potencia", "status", "n_serie"].map((name) => (
          <div key={name}>
            <label style={labelStyle} htmlFor={name}>
              {name.charAt(0).toUpperCase() + name.slice(1).replace("_", " ")}
            </label>
            <input
              id={name}
              type="text"
              style={getInputStyle(name)}
              value={form[name]}
              onChange={(e) => updateForm({ [name]: e.target.value })}
              onFocus={() => setFocusField(name)}
              onBlur={() => setFocusField(null)}
              required={name === "tipo" || name === "marca" || name === "status"}
            />
          </div>
        ))}

        <label style={labelStyle} htmlFor="observacao">
          Observação
        </label>
        <textarea
          id="observacao"
          style={{ ...getInputStyle("observacao"), height: "80px" }}
          value={form.observacao}
          onChange={(e) => updateForm({ observacao: e.target.value })}
          onFocus={() => setFocusField("observacao")}
          onBlur={() => setFocusField(null)}
        />

        <label style={labelStyle} htmlFor="foto">
          Foto da Máquina
        </label>
        <div style={uploadContainerStyle}>
          <label htmlFor="foto" style={uploadLabelStyle}>
            Selecionar imagem
          </label>
          <input
            id="foto"
            type="file"
            accept=".jpg,.jpeg,.png"
            style={{ display: "none" }}
            onChange={(e) => updateForm({ foto: e.target.files[0] || null })}
          />
          <span style={{ fontSize: "0.85rem", color: "#000" }}>
            {form.foto ? form.foto.name : "Nenhum arquivo selecionado"}
          </span>
        </div>

        <div style={{ display: "flex", justifyContent: "center", marginTop: "20px" }}>
          <button
            type="submit"
            style={getBtnCadastrarStyle(hoverCadastrar)}
            onMouseEnter={() => setHoverCadastrar(true)}
            onMouseLeave={() => setHoverCadastrar(false)}
          >
            Cadastrar
          </button>
          <button
            type="button"
            onClick={() => navigate("/maquinas")}
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