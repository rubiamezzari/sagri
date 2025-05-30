import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const API_URL = "http://localhost:5050";

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

      const data = await response.json();
      alert(data.message || "Máquina cadastrada com sucesso!");

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

  const getInputStyle = (name) => ({
    width: "100%",
    padding: "5px 6px",
    marginBottom: "10px",
    borderRadius: "5px",
    border: "0.1px solid #e8e8e8",
    fontSize: "1rem",
    boxSizing: "border-box",
    outline: focusField === name ? "none" : undefined,
    borderColor: focusField === name ? "#e8e8e8" : undefined,
  });

  return (
    <div style={{
      maxWidth: "800px",
      margin: "40px auto",
      padding: "30px 40px",
      backgroundColor: "#ffffff",
      borderRadius: "5px",
      textAlign: "center"
    }}>
      <form onSubmit={onSubmit}>
        <h5 style={{
          color: "#100f0d",
          marginBottom: "16px",
          fontWeight: "500",
          fontSize: "1rem",
          borderBottom: "0.5px solid rgb(131, 148, 131)",
          paddingBottom: "6px"
        }}>DADOS DA MÁQUINA</h5>

        {[
          ["tipo", "Tipo"],
          ["marca", "Marca"],
          ["modelo", "Modelo"],
          ["potencia", "Potência"],
          ["status", "Status"],
          ["n_serie", "Número de Série"]
        ].map(([name, label]) => (
          <div key={name}>
            <label style={{
              display: "block",
              marginBottom: "6px",
              fontWeight: "600",
              color: "#100f0d",
              fontSize: "0.8rem",
              textAlign: "left"
            }}>{label}</label>
            <input
              type="text"
              style={getInputStyle(name)}
              value={form[name]}
              onChange={(e) => updateForm({ [name]: e.target.value })}
              onFocus={() => setFocusField(name)}
              onBlur={() => setFocusField(null)}
              required={["tipo", "marca", "status"].includes(name)}
            />
          </div>
        ))}

        <label style={{
          display: "block",
          marginBottom: "6px",
          fontWeight: "600",
          color: "#100f0d",
          fontSize: "0.8rem",
          textAlign: "left"
        }}>Observação</label>
        <textarea
          style={{ ...getInputStyle("observacao"), height: "80px" }}
          value={form.observacao}
          onChange={(e) => updateForm({ observacao: e.target.value })}
          onFocus={() => setFocusField("observacao")}
          onBlur={() => setFocusField(null)}
        />

        <label style={{
          display: "block",
          marginBottom: "6px",
          fontWeight: "600",
          color: "#100f0d",
          fontSize: "0.8rem",
          textAlign: "left"
        }}>Foto da Máquina</label>
        <div style={{
          backgroundColor: "#eeffe7",
          borderRadius: "8px",
          padding: "8px 10px",
          marginBottom: "10px",
          display: "flex",
          alignItems: "center",
          gap: "12px",
        }}>
          <label htmlFor="foto" style={{
            backgroundColor: "#ccedbf",
            padding: "6px 12px",
            borderRadius: "6px",
            cursor: "pointer",
            fontSize: "0.85rem",
            fontWeight: "500",
            color: "#1c3d21",
            whiteSpace: "nowrap",
          }}>
            Selecionar imagem
          </label>
          <input
            id="foto"
            type="file"
            accept=".jpg,.jpeg,.png"
            style={{ display: "none" }}
            onChange={(e) => updateForm({ foto: e.target.files[0] || null })}
          />
          <span style={{
            fontSize: "0.85rem",
            color: "#000",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}>
            {form.foto ? form.foto.name : "Nenhum arquivo selecionado"}
          </span>
        </div>

        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <button type="submit" style={{
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
          }}>
            Cadastrar
          </button>
          <button
            type="button"
            onClick={() => navigate("/maquinas")}
            style={{
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
            }}>
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}
