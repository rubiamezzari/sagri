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

export default function CreateOperador() {
  const [form, setForm] = useState({
    usuario: "",
    nome: "",
    email: "",
    telefone: "",
    cpf: "",
    senha: "",
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

    try {
      const response = await fetch(`${API_URL}/operadores/create`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!response.ok) {
        const errorText = await response.text();
        alert("Erro ao cadastrar operador: " + errorText);
        return;
      }

      alert("Operador cadastrado com sucesso!");

      setForm({
        usuario: "",
        nome: "",
        email: "",
        telefone: "",
        cpf: "",
        senha: "",
      });
      navigate("/operadores", { replace: true });
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
        <h5 style={sectionTitle}>DADOS DO OPERADOR</h5>

   {[  
  { name: "usuario", label: "Usuário" },  
  { name: "nome", label: "Nome" },  
  { name: "email", label: "Email", required: false },  
  { name: "telefone", label: "Telefone" },  
  { name: "cpf", label: "CPF" },  
  { name: "senha", label: "Senha", type: "password" },  
].map(({ name, label, type = "text", required = true }) => (
  <div key={name}>
    <label style={labelStyle} htmlFor={name}>{label}</label>
    <input
      id={name}
      type={type}
      style={getInputStyle(name)}
      value={form[name]}
      onChange={(e) => updateForm({ [name]: e.target.value })}
      onFocus={() => setFocusField(name)}
      onBlur={() => setFocusField(null)}
      {...(required ? { required: true } : {})}
    />
  </div>
))}

        
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
